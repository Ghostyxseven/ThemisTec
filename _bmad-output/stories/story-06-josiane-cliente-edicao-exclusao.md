# Story 06: Edição e Exclusão de Cliente (US06)

**Responsável:** Josiane  
**Status:** done
**Épico Relacionado:** Épico 02 - Gestão de Clientes  

## 1. Contexto e Objetivo
Implementar a capacidade de atualizar as informações cadastrais de clientes previamente criados e a exclusão definitiva de registros, garantindo o devido alerta de segurança para evitar exclusões acidentais.

## 2. Contratos Rigorosos (Spec-Driven Development)
- **Schema de Validação:** A edição deve obedecer às validações de `UpdateClienteSchema` contidas em `src/specs/schemas/cliente.schema.ts`.
- **ViewModel:** A View deve consumir as ViewModels correspondentes (ex: `useUpdateCliente` para carregar/salvar os dados e `useDeleteCliente` para a remoção).
- **Banco de Dados (Firestore):** As alterações e remoções devem ser propagadas ao Firestore por intermédio do respectivo Adapter.

## 3. Requisitos Técnicos e Visuais
1. **Fluxo de Edição:**
   - Tela de edição acessível em `/clientes/edicao/[id]` com os dados atuais do cliente pré-carregados nos respectivos inputs do formulário.
   - Validação em tempo real dos campos alterados usando o Zod resolver.
   - Retorno automático para a listagem após a submissão com sucesso.
2. **Fluxo de Exclusão:**
   - Botão de exclusão disponível na tabela de listagem de clientes.
   - Exibição de um alerta visual ou modal de confirmação (ex: "Tem certeza que deseja excluir o cliente X? Esta ação não pode ser desfeita").
   - Atualização reativa da lista após a remoção.
3. **Feedback:**
   - Loader indicando o preenchimento inicial dos dados e processamento de gravação/exclusão.
   - Exibição de mensagens de erro amigáveis em português na tela.

## 4. Harness Engineering (Regras de Entrega)
- [x] O código não pode acusar erros no TypeScript (`npm run typecheck`).
- [x] O código não pode acusar avisos no Linter (`npm run lint`).
- [ ] Nenhum Pull Request pode ser criado sem uma Issue associada.
