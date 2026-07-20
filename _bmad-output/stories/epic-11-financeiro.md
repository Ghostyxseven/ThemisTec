# Épico 11: Módulo Financeiro

**Status:** em_andamento

## Objetivo

Trazer a gestão de faturamento do advogado (Honorários e Custas) para dentro do ThemisTec. Advogados perdem muito dinheiro esquecendo de cobrar despesas de diligências ou honorários sucumbenciais. A ideia é vincular o dinheiro diretamente ao Cliente e ao Processo.

## Ordem de entrega

1. Story 48 — Estruturação do Banco de Dados Financeiro e Isolamento (RLS).
2. Story 49 — UI do Dashboard Financeiro (Tabela de contas a pagar/receber e gráficos de fluxo de caixa).
3. Story 50 — Zod Schemas e Serviços TS de conexão.

## Restrições

- Todo registro financeiro deve ser armazenado usando o tipo `numeric` para evitar erros de precisão do JS com pontos flutuantes.
- O campo `escritorio_id` é rigorosamente mandatório para preservar o sistema Multi-tenant.
