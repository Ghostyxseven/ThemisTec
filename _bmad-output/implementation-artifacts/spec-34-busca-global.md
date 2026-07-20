# Spec 34: Busca global

**Story:** `story-34-busca-global.md`
**Status:** active

## Harness

- `supabase/migrations/*busca*.sql`
- `src/specs/schemas/busca.schema.ts`
- `src/shared/interfaces/IBuscaRepository.ts`
- `src/features/busca/**`
- `src/components/layout/Header.tsx`
- `src/services/index.ts`
- `src/tests/**/busca*.test.ts`

## Implementação

- Criar função SQL `buscar_global` com `security invoker` e resultados normalizados.
- Consultar somente registros visíveis por RLS.
- Adicionar comando global acessível por `Ctrl/Cmd+K`, agrupado por domínio.
