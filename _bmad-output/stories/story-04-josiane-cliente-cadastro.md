# Story 04: Cadastro de Cliente (CPF Único) (US04)

**Responsável:** Josiane  
**Status:** review  
**Épico Relacionado:** Épico 02 - Gestão de Clientes  

## 1. Contexto e Objetivo
Implementar a funcionalidade de cadastro de novos clientes. A interface de cadastro deve coletar informações essenciais do cliente e realizar validações de entrada rigorosas, além de garantir que o CPF fornecido seja único no sistema.

## 2. Contratos Rigorosos (Spec-Driven Development)
- **Schema de Validação:** Utilizar o schema de validação `CreateClienteSchema` localizado em `src/specs/schemas/cliente.schema.ts`.
- **ViewModel:** A View (tela) deve se comunicar apenas com a respectiva ViewModel (ex: `useCreateCliente`) para submeter os dados e receber os estados de processamento (`isLoading`, `errorMessage`).
- **Banco de Dados (Firestore):** A verificação de unicidade do CPF deve ocorrer no Adapter, impedindo que múltiplos registros com o mesmo CPF coexistam para o mesmo usuário advogado (`userId`).

## 3. Requisitos Técnicos e Visuais
1. **Formulário com React Hook Form:**
   - Acoplar o formulário visual com o resolver do Zod (`CreateClienteSchema`).
   - Campos obrigatórios: Nome (comprimento entre 2 e 100 caracteres) e CPF (exatamente 11 dígitos numéricos).
   - Campos opcionais: E-mail (se fornecido, deve ser válido), Telefone, Endereço e Observações (máximo de 500 caracteres).
2. **UX do CPF:**
   - Aplicar máscara de CPF visualmente no campo `999.999.999-99` para facilidade de digitação, mas enviar apenas os dígitos numéricos limpos (11 dígitos) ao salvar.
3. **Feedback:**
   - Exibir erros de validação do Zod logo abaixo dos respectivos inputs.
   - Desabilitar botão de cadastro e inputs enquanto a operação de gravação estiver em andamento.
   - Redirecionar para a listagem de clientes ou exibir sucesso/mensagem de erro na tela de forma amigável.

## 4. Harness Engineering (Regras de Entrega)
- [x] O código não pode acusar erros no TypeScript (`npm run typecheck`).
- [x] O código não pode acusar avisos no Linter (`npm run lint`).
- [ ] Nenhum Pull Request pode ser criado sem uma Issue associada.
