# Story 05: Listagem Paginada com Busca (US05)

**Responsável:** Josiane  
**Status:** review  
**Épico Relacionado:** Épico 02 - Gestão de Clientes  

## 1. Contexto e Objetivo
Desenvolver a interface para a visualização dos clientes cadastrados em formato de tabela/lista, com suporte a busca rápida por Nome ou CPF, além de paginação para evitar sobrecarga no carregamento dos dados do Firestore.

## 2. Contratos Rigorosos (Spec-Driven Development)
- **Schema de Validação:** A query de busca e os parâmetros de paginação devem obedecer ao schema `ListClientesQuerySchema` em `src/specs/schemas/cliente.schema.ts`.
- **ViewModel:** A View deve se conectar apenas com a ViewModel correspondente (ex: `useListClientes`) que expõe os dados paginados e estados (`isLoading`, `errorMessage`, `dados`, `paginacao`).
- **Banco de Dados (Firestore):** As queries compostas com busca devem ser intermediadas pelo Adapter correspondente.

## 3. Requisitos Técnicos e Visuais
1. **Listagem e Componentes Visuais:**
   - Apresentar os clientes em uma tabela responsiva com colunas: Nome, CPF (formatado com máscara), Telefone, E-mail e Ações (Editar/Excluir).
   - Indicar visualmente o estado da paginação (página atual, total de páginas, botões Próximo e Anterior).
2. **Barra de Busca:**
   - Disponibilizar um input de busca acessível para filtrar clientes por Nome ou CPF.
   - Implementar debounce ou busca ativa para evitar requisições desnecessárias.
3. **Feedback:**
   - Exibir loader durante a busca de dados.
   - Exibir mensagem amigável e acessível caso nenhum cliente seja encontrado.

## 4. Harness Engineering (Regras de Entrega)
- [x] O código não pode acusar erros no TypeScript (`npm run typecheck`).
- [x] O código não pode acusar avisos no Linter (`npm run lint`).
- [ ] Nenhum Pull Request pode ser criado sem uma Issue associada.
