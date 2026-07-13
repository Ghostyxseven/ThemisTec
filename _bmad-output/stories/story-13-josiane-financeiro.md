# [STORY] UI de Edição e Visualização Financeira (US13)

**Issue:** #34
**Responsável:** Josiane (Frontend)
**Épico:** 05 (Módulo Financeiro)

## Descrição
Como advogado autônomo, quero poder informar os honorários e o status de pagamento ao criar ou editar um processo, além de visualizar o status de pagamento na tabela geral de processos. 

## Critérios de Aceite
1. O formulário de criação/edição de processo (`/processos/cadastro` e afins) deve conter um campo numérico para "Valor de Honorários" (R$).
2. O formulário de criação/edição de processo deve conter um campo select para "Status de Pagamento" (PENDENTE, PARCIAL, PAGO).
3. A listagem geral de processos (`/processos`) deve ter uma coluna a mais chamada "Pagamento" com um componente visual (badge ou tag) contendo cores distintas para cada status de pagamento.

## Dependências Técnicas
- A modelagem do backend (FirestoreAdapter) e do Schema Zod (`ProcessoSchema`) já contemplam os campos `valorHonorarios` (number) e `statusPagamento` (enum). O frontend deve simplesmente acoplar essas propriedades aos formulários e listagens.
