# Story 08: Consulta de Processos com Filtros (US08)

**Responsável:** Josiane  
**Status:** review  
**Épico Relacionado:** Épico 03 - Gestão de Processos  

## 1. Contexto e Objetivo
Implementar a tela de listagem de processos do advogado ativo, permitindo filtros rápidos por Cliente e por Status, além de controle de paginação.

## 2. Contratos Rigorosos (Spec-Driven Development)
- **Schema de Validação:** A consulta de processos deve obedecer ao schema de filtragem `ListProcessosQuerySchema` definido em `src/specs/schemas/processo.schema.ts`.
- **ViewModel:** A View deve consumir a ViewModel `useListProcessos.ts` para carregar dados, paginar e lidar com a reatividade dos filtros.
- **Banco de Dados (Firestore):** A listagem e filtros devem ser obtidos do Firestore a partir do Adapter.

## 3. Requisitos Técnicos e Visuais
1. **Interface de Listagem:**
   - Exibir uma tabela responsiva com as colunas: Número do processo, Cliente Vinculado, Tipo, Status (com badges de cores dinâmicas) e Data de Abertura.
   - Um botão ou ícone de atalho para "Registrar Processo" levando a `/processos/cadastro`.
2. **Filtros Dinâmicos:**
   - Dropdown para selecionar um Cliente (filtrando somente os processos daquele cliente).
   - Dropdown para selecionar um Status (Filtrando por `em_andamento`, `concluido` ou `arquivado`).
   - A listagem deve recarregar automaticamente e resetar para a primeira página sempre que um filtro for alterado.
3. **Paginação e Feedback:**
   - Loader indicando o carregamento dos processos.
   - Rodapé com controle de paginação ("Anterior" e "Próximo") e indicativo da página atual.
   - Caso não existam processos para os filtros aplicados, exibir uma imagem ou mensagem vazia explicativa.

## 4. Harness Engineering (Regras de Entrega)
- [x] O código não pode acusar erros no TypeScript (`npm run typecheck`).
- [x] O código não pode acusar avisos no Linter (`npm run lint`).
- [ ] Nenhum Pull Request pode ser criado sem uma Issue associada.
