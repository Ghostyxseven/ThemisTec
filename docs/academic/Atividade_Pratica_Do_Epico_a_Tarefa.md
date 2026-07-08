# Engenharia de Software 2
## Atividade Prática – Modelagem: Do Épico à Tarefa

**Professor:** Mayllon
**Integrantes:** Gisele Dias Plácido, Josiane Amorim Mendes, Marcos Vinícius Oliveira Teixeira, Micael Cardoso Reis
**Projeto:** Themis (Themis Tech)

## 1. Épicos Principais do MVP

O MVP do Themis organiza-se em três épicos que cobrem o ciclo completo de uso da plataforma por advogados autônomos e pequenos escritórios.

| Épico | Descrição | Objetivo de negócio |
|---|---|---|
| EP01 – Autenticação | Controle de acesso seguro à plataforma via e-mail e senha, com suporte a recuperação de credenciais. | Garantir que somente usuários autorizados acessem dados jurídicos sensíveis. |
| EP02 – Gestão de clientes | Cadastro, consulta, edição e exclusão de clientes vinculados ao escritório. | Centralizar informações dos clientes, eliminando planilhas paralelas. |
| EP03 – Gestão de processos | Registro, consulta e documentação de processos jurídicos, com anexação de arquivos PDF. | Dar ao advogado visibilidade completa do andamento de cada processo. |

## 2. Histórias de Usuário

Cada épico foi fatiado em pelo menos três histórias seguindo o critério INVEST, com critérios de aceite mensuráveis.

### EP01 – Autenticação

| ID | História | Critérios de aceite | Prioridade |
|---|---|---|---|
| US01 | Como advogado, quero fazer login com e-mail e senha para acessar minha conta. | • Validar e-mail e senha no Firebase Auth<br>• Redirecionar para dashboard após login<br>• Bloquear após 3 tentativas erradas | Alta |
| US02 | Como advogado, quero criar minha conta para usar a plataforma. | • E-mail único obrigatório<br>• Senha mínima de 8 caracteres<br>• Confirmação por e-mail enviada | Alta |
| US03 | Como advogado, quero recuperar minha senha para não perder acesso ao sistema. | • Link de reset enviado para e-mail cadastrado<br>• Link expira em 24h<br>• Senha redefinida sem perda de dados | Média |

### EP02 – Gestão de clientes

| ID | História | Critérios de aceite | Prioridade |
|---|---|---|---|
| US04 | Como advogado, quero cadastrar um cliente para registrar seus dados no sistema. | • Nome e CPF obrigatórios<br>• CPF único e validado<br>• Dados salvos no Firestore | Alta |
| US05 | Como advogado, quero consultar meus clientes para encontrar informações rapidamente. | • Listagem paginada<br>• Busca por nome ou CPF<br>• Resultado em menos de 2s | Alta |
| US06 | Como advogado, quero editar ou excluir um cliente para manter os dados atualizados. | • Confirmação antes de excluir<br>• Excluir cliente não apaga processos vinculados<br>• Alterações refletidas imediatamente | Média |

### EP03 – Gestão de processos

| ID | História | Critérios de aceite | Prioridade |
|---|---|---|---|
| US07 | Como advogado, quero registrar um processo para vinculá-lo a um cliente. | • Número do processo único<br>• Cliente vinculado obrigatório<br>• Tipo e data de abertura obrigatórios | Alta |
| US08 | Como advogado, quero consultar meus processos para acompanhar o andamento. | • Filtro por status e cliente<br>• Listagem paginada<br>• Resultado em menos de 2s | Alta |
| US09 | Como advogado, quero anexar um PDF ao processo para guardar documentos importantes. | • Apenas PDF aceito<br>• Limite de 10 MB por arquivo<br>• URL do arquivo salva no Firestore | Média |

## 3. Diagrama e Fluxos do Caso de Uso – US07: Registrar Processo

A US07 é a história mais complexa: requer autenticação ativa, vínculo obrigatório com cliente existente e suporte a upload de documentos, gerando múltiplos pontos de falha distintos.

### 3.1 Elementos do diagrama

| Elemento | Tipo | Descrição |
|---|---|---|
| Advogado | Ator primário | Usuário que inicia e opera todas as ações do caso de uso |
| Firebase Storage | Ator secundário | Sistema externo responsável pelo armazenamento de arquivos PDF |
| Autenticar usuário | «include» | Obrigatório: valida token JWT antes de qualquer operação |
| Vincular cliente | «include» | Obrigatório: processo não pode existir sem cliente associado |
| Anexar documento | «extends» | Opcional: ocorre apenas se o advogado escolher anexar um PDF |
| Notificar erro de upload | «extends» | Opcional: ocorre apenas quando o upload falha (formato ou tamanho) |

### 3.2 Fluxo principal

| Passo | Ação do ator | Resposta do sistema |
|---|---|---|
| 1 | O advogado acessa a tela de processos e clica em "Novo processo". | O sistema exibe o formulário de cadastro. |
| 2 | — | O sistema valida o token JWT do advogado (autenticação ativa). |
| 3 | O advogado preenche número do processo, tipo e seleciona um cliente da lista. | O sistema exibe lista de clientes cadastrados para seleção. |
| 4 | — | O sistema verifica se o número do processo já existe no Firestore. |
| 5 | O advogado clica em "Salvar". | — |
| 6 | — | O sistema grava o documento no Firestore e exibe confirmação de sucesso. |

### 3.3 Fluxo alternativo – Anexar documento PDF

Este fluxo ocorre quando o advogado decide anexar um documento ao processo durante o cadastro.

1. Após preencher os dados do formulário (passo 3 do fluxo principal), o advogado clica em "Anexar documento".
2. O sistema exibe o seletor de arquivo com restrição de formato (somente PDF, máx. 10 MB).
3. O advogado seleciona o arquivo e confirma.
4. O sistema realiza o upload para o Firebase Storage e vincula a URL gerada ao registro do processo.
5. O fluxo retorna ao passo 5 do fluxo principal.

### 3.4 Fluxo de exceção

**E1 – Número de processo duplicado**

6. No passo 4 do fluxo principal, o sistema identifica que o número já existe no Firestore.
7. O sistema exibe a mensagem: "Número de processo já cadastrado. Verifique e tente novamente."
8. O formulário permanece aberto com os dados preenchidos. O advogado corrige o número e o fluxo retorna ao passo 4.

**E2 – Falha no upload do documento**

9. No passo 4 do fluxo alternativo, o Firebase Storage retorna erro (arquivo inválido ou limite de tamanho excedido).
10. O sistema exibe: "Falha no upload. Verifique o formato (PDF) e o tamanho (máx. 10 MB)."
11. O advogado pode tentar selecionar outro arquivo ou prosseguir o cadastro do processo sem anexo.

**E3 – Sessão expirada**

12. No passo 2, o sistema identifica que o token JWT expirou.
13. O sistema redireciona o advogado para a tela de login com a mensagem: "Sessão encerrada. Faça login novamente."
14. Após autenticação bem-sucedida, o sistema retorna ao formulário de cadastro de processo.
