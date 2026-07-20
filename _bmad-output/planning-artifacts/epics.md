---
stepsCompleted: ["Step 1", "Step 2"]
inputDocuments: ["docs/PRD.md", "docs/architecture/decisions/"]
---

# ThemisTec - Divisão de Épicos

## Visão Geral

Este documento fornece a estrutura completa de épicos e histórias para o ThemisTec, decompondo os requisitos do PRD, Design UX (se existir) e requisitos de Arquitetura em histórias implementáveis.

## Inventário de Requisitos

### Requisitos Funcionais

FR1: O sistema deve exibir um Dashboard gerencial com o totalizador de processos e clientes ativos.
FR2: O sistema deve permitir o registro e atualização de dados financeiros no Processo (valor de honorários e status de pagamento: PAGO, PENDENTE, ATRASADO).
FR3: O sistema deve possuir uma interface (UI) no formulário do Processo para editar as informações financeiras (FR2).
FR4: O sistema deve permitir a exportação da lista de processos para o formato CSV.
FR5: O sistema deve possuir um botão na interface do Dashboard para disparar a ação de exportação de processos.
FR6: O aplicativo deve ser configurável como um PWA (Progressive Web App) através de um Service Worker, para funcionar off-line no dispositivo do usuário.
FR7: O sistema deve garantir persistência local de dados (cache offline) para que seja possível ler e modificar informações enquanto não há conexão.

### Requisitos Não-Funcionais

NFR1: As funções de exportação devem rodar 100% no Client-Side (Client SDK), devido à arquitetura de autenticação.
NFR2: O formato CSV exportado deve ser compatível nativamente com o Microsoft Excel versão PT-BR (uso de ponto e vírgula como separador).
NFR3: A persistência offline deve utilizar IndexedDB (via idb-keyval) com sincronização automática ao reconectar com o Supabase.
NFR4: Todo o código do projeto deve seguir rigorosamente a arquitetura MVVM, utilizando Adapters.

### Requisitos Adicionais

- O backend de exportação e a injeção do persistência offline são responsabilidades do Micael.
- As interfaces de Dashboard, Botão de Exportação e configuração do manifest/PWA são responsabilidades da Josiane.

### Requisitos de Design UX

N/A

### Mapa de Cobertura de Requisitos

FR1: Épico 1 - Dashboard gerencial
FR2: Épico 2 - Campos financeiros no backend do Processo
FR3: Épico 2 - UI financeira na edição do Processo
FR4: Épico 3 - Backend exportação CSV
FR5: Épico 3 - Botão de exportação no Frontend
FR6: Épico 4 - Service Worker (PWA)
FR7: Épico 4 - Persistência Offline (IndexedDB + sync)

## Lista de Épicos

### Épico 1: Acompanhamento Gerencial
O advogado ganha uma visão macro do seu escritório através de um Dashboard, não precisando mais contar os registros manualmente para saber o volume de trabalho.
**FRs cobertos:** FR1

### Épico 2: Gestão Financeira de Honorários
O advogado pode acompanhar o valor recebido por processo e saber rapidamente quem está devendo ou está com o pagamento em dia.
**FRs cobertos:** FR2, FR3

### Épico 3: Exportação e Backup Local
O usuário consegue gerar planilhas (CSV compatível com Excel PT-BR) de todos os seus processos para fazer cruzamento de dados externo ou enviar para a contabilidade.
**FRs cobertos:** FR4, FR5

### Épico 4: Mobilidade e Acesso Offline
O advogado pode instalar o sistema como um aplicativo (PWA) e consultá-lo/editá-lo em fóruns sem depender de sinal 4G. Quando a internet voltar, tudo sincroniza automaticamente.
**FRs cobertos:** FR6, FR7

## Épico 1: Acompanhamento Gerencial

O advogado ganha uma visão macro do seu escritório através de um Dashboard, não precisando mais contar os registros manualmente para saber o volume de trabalho.

### História 1.1: Consultar Estatísticas Gerais (Backend)

**Como** Desenvolvedor Backend (Micael),
**Eu quero** recuperar o total de processos e clientes diretamente pelo Supabase,
**Para que** o Frontend possa construir os cards gerenciais de forma instantânea sem precisar baixar todos os registros.

**Critérios de Aceite:**

- **Dado** um usuário logado
- **Quando** a camada de repositório (SupabaseAdapter) for acionada
- **Então** deve utilizar queries com `count` do Supabase (head: true, count: 'exact')
- **E** retornar inteiros precisos e otimizados sobre os quantitativos

### História 1.2: Construir Interface do Dashboard (Frontend)

**Como** Desenvolvedor Frontend (Josiane),
**Eu quero** criar cards visuais modernos de Dashboard,
**Para que** o usuário ao entrar no sistema tenha o resumo das métricas na tela inicial.

**Critérios de Aceite:**

- **Dado** a tela inicial (`/dashboard`)
- **Quando** o componente carregar
- **Então** os repositórios injetados do ViewModel devem ser chamados
- **E** os totais devem ser exibidos em caixas com ícones e labels legíveis

## Épico 2: Gestão Financeira de Honorários

O advogado pode acompanhar o valor recebido por processo e saber rapidamente quem está devendo ou está com o pagamento em dia.

### História 2.1: Estrutura Financeira no Banco de Dados (Backend)

**Como** Desenvolvedor Backend (Micael),
**Eu quero** atualizar os esquemas de validação (Zod) e as rotinas de persistência do Supabase,
**Para que** seja possível gravar atributos monetários de cada processo.

**Critérios de Aceite:**

- **Dado** o Schema de Processos
- **Quando** um novo processo é salvo ou atualizado
- **Então** os campos numéricos de honorários e enum de status devem ser aceitos e tipados
- **E** o SupabaseAdapter deve persistí-los corretamente via PostgreSQL

### História 2.2: UI de Edição e Visualização Financeira (Frontend)

**Como** Desenvolvedor Frontend (Josiane),
**Eu quero** incluir campos na interface de formulário e detalhes de Processos,
**Para que** o advogado possa imputar o valor financeiro do contrato visualmente.

**Critérios de Aceite:**

- **Dado** o painel de criação/edição de um processo
- **Quando** a usuária interagir com as informações financeiras
- **Então** o frontend deve disponibilizar um campo de input monetário e um select de status de pagamento
- **E** os dados preenchidos devem compor o payload a ser enviado para o ViewModel

## Épico 3: Exportação e Backup Local

O usuário consegue gerar planilhas (CSV compatível com Excel PT-BR) de todos os seus processos para fazer cruzamento de dados externo ou enviar para a contabilidade.

### História 3.1: Serviço de Exportação CSV/PDF (Backend)

**Como** Desenvolvedor Backend (Micael),
**Eu quero** implementar um parser em typescript rodando no browser (ExportService),
**Para que** ele leia os objetos recebidos do repositório e devolva um arquivo bruto pronto para download.

**Critérios de Aceite:**

- **Dado** a lista de processos na memória do client
- **Quando** a exportação for acionada
- **Então** o formato de saída deve usar ponto-e-vírgula (;)
- **E** os dados monetários devem estar formatados em decimal brasileiro (,)

### História 3.2: Botão e Fluxo de Exportação (Frontend)

**Como** Desenvolvedor Frontend (Josiane),
**Eu quero** dispor botões interativos na tela e lidar com Blob downloads,
**Para que** o navegador instancie o arquivo CSV fisicamente para a pasta de downloads do usuário.

**Critérios de Aceite:**

- **Dado** o Dashboard ou a lista de Processos
- **Quando** o usuário clicar no botão "Exportar para CSV"
- **Então** a UI deve chamar o ExportService injetado do MVVM
- **E** fornecer feedback visual (loading/toast) enquanto o download processa

## Épico 4: Mobilidade e Acesso Offline

O advogado pode instalar o sistema como um aplicativo (PWA) e consultá-lo/editá-lo em fóruns sem depender de sinal 4G. Quando a internet voltar, tudo sincroniza automaticamente.

### História 4.1: Persistência Offline (Backend/Config)

**Como** Desenvolvedor Backend (Micael),
**Eu quero** configurar o cache local via IndexedDB (idb-keyval) no Next.js,
**Para que** as gravações e leituras possam ser enfileiradas de forma offline-first e sincronizadas com o Supabase ao reconectar.

**Critérios de Aceite:**

- **Dado** o bootstrapping da aplicação cliente
- **Quando** o módulo de persistência offline é inicializado
- **Então** deve armazenar dados críticos no IndexedDB local com suporte a múltiplas abas
- **E** tratar os fallbacks e falhas silenciosamente caso o navegador não dê suporte

### História 4.2: Configuração do Service Worker e Cache (Frontend)

**Como** Desenvolvedor Frontend (Josiane),
**Eu quero** instalar os manifestos web e os scripts de Service Worker via Vite PWA (ou next-pwa),
**Para que** os recursos estáticos (CSS, JS) sejam cacheados pelo browser e o ícone fique instalável no celular.

**Critérios de Aceite:**

- **Dado** um acesso no celular sem acesso 4G (modo avião)
- **Quando** a página do ThemisTec for acessada após a primeira vez
- **Então** os assets devem carregar diretamente pelo ServiceWorker (rede local)
- **E** apresentar um modal padrão de instalação (Add to Home Screen) quando aplicável

## Épico 5: Revitalização de UI/UX

Como a base de dados e regras de negócio foram estruturadas, o advogado precisa que o sistema pareça profissional, com um layout de navegação claro e componentes estilizados para que a usabilidade seja agradável e não aparente estar incompleto ("tela branca").

### História 5.1: Layout Principal e Navegação (Sidebar e Header)

**Como** Desenvolvedor Frontend (Josiane),
**Eu quero** criar uma estrutura de Shell (Sidebar e Header),
**Para que** o usuário consiga navegar facilmente entre Dashboard, Clientes e Processos sem perder o contexto.

**Critérios de Aceite:**

- **Dado** que o usuário está autenticado
- **Quando** acessar qualquer página interna
- **Então** um menu lateral esquerdo escuro (Sidebar) e um header com seus dados devem estar visíveis
- **E** o layout deve ser responsivo (Sidebar recolhe ou vira menu hambúrguer no celular)

### História 5.2: Identidade Visual da Autenticação (Login/Cadastro)

**Como** Desenvolvedor Frontend (Josiane),
**Eu quero** estilizar a página de login e cadastro com Tailwind,
**Para que** a primeira impressão do usuário ao abrir o sistema seja de um software seguro e premium.

**Critérios de Aceite:**

- **Dado** um usuário deslogado
- **Quando** acessar a página inicial
- **Então** deve ver um formulário centralizado com estilo de "card", sombras suaves e background
- **E** deve receber feedbacks de erro claros (toasts ou texto vermelho) caso erre a senha

### História 5.3: Estilização de Tabelas, Cards e Empty States

**Como** Desenvolvedor Frontend (Josiane),
**Eu quero** refatorar as listas de dados cruas para componentes visuais avançados,
**Para que** seja fácil visualizar o status financeiro de um processo ou identificar quando não há registros cadastrados.

**Critérios de Aceite:**

- **Dado** as páginas de listar Clientes, Processos ou Dashboard
- **Quando** existirem dados
- **Então** eles devem ser exibidos em tabelas formatadas com "Badges" coloridas para os status
- **E Quando** a lista for vazia, deve-se mostrar uma ilustração amigável de "Nenhum registro encontrado" em vez de uma tela vazia
