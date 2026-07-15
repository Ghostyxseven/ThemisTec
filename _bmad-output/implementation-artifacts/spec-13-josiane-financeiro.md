# IMPLEMENTATION SPEC: UI de Edição e Visualização Financeira (US13)

## 1. Arquivos Modificados/Criados

### 1.1 `src/app/processos/cadastro/page.tsx`
- **[MODIFICAR]**
- Incluir no formulário os inputs relativos a:
  - **Valor de Honorários** (`valorHonorarios`), mapeado para input type number com passo e placeholder monetário.
  - **Status de Pagamento** (`statusPagamento`), mapeado para `<select>` com as options: "PENDENTE", "PARCIAL", "PAGO".
- Atualizar os `defaultValues` do react-hook-form para conter `valorHonorarios: 0` e `statusPagamento: "PENDENTE"`.

### 1.2 `src/app/processos/page.tsx`
- **[MODIFICAR]**
- Na tabela de processos (na View da página principal de listagem):
  - Adicionar nova coluna no header `<th>Pagamento</th>`.
  - Adicionar nova célula no corpo da tabela `<td>` exibindo uma badge.
  - Criar um map de cores para o status de pagamento (ex: PENDENTE = amarelo, PARCIAL = azul, PAGO = verde).

## 2. Validação
- O componente `useCreateProcesso` submeterá esses valores corretamente porque eles já existem na interface `CreateProcessoInput` exportada do schema Zod.
- Executar `npm run typecheck` e `npm run lint`.
