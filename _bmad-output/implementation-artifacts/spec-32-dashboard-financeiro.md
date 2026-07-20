# Spec 32: Dashboard financeiro

**Story:** `story-32-dashboard-financeiro.md`
**Status:** active

## Harness

- `supabase/migrations/*financeiro*.sql`
- `src/specs/schemas/financeiro.schema.ts`
- `src/shared/interfaces/IFinanceiroRepository.ts`
- `src/features/financeiro/**`
- `src/app/(authenticated)/financeiro/**`
- `src/services/index.ts`
- `src/tests/**/financeiro*.test.ts`

## Implementação

- Criar lançamentos financeiros com tipo, categoria, competência, vencimento, pagamento e vínculo opcional.
- Calcular receitas, despesas, saldo e situação por período no adapter.
- Permitir cadastro, filtros e exportação CSV; PDF usa impressão otimizada do navegador.
