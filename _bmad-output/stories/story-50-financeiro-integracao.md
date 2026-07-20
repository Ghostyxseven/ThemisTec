# Story 50: Integração de Dados do Dashboard Financeiro

**Épico:** 11 - Financeiro
**Estimativa:** Baixa (Schemas já existiam)
**Responsável:** Micael

## Descrição
Como desenvolvedor,
Eu quero conectar a tela de Financeiro recém criada aos Repositórios e Schemas Zod,
Para que as informações lidas venham direto do Supabase.

## Critérios de Aceite
- **Dado** o componente `FinanceiroPage`
- **Quando** ele for montado em tela
- **Então** ele deve disparar `financeiroRepository.listar(...)`
- **E** popular os Cards de Receita/Despesa somando os valores recebidos dinamicamente.
