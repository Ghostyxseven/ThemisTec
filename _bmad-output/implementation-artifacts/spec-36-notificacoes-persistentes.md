# Spec 36: Notificações persistentes

**Story:** `story-36-notificacoes-persistentes.md`
**Status:** active

## Harness

- `supabase/migrations/*notificacoes*.sql`
- `src/specs/schemas/notificacao.schema.ts`
- `src/shared/interfaces/INotificacaoRepository.ts`
- `src/features/notificacoes/**`
- `src/components/layout/NotificationBell.tsx`
- `src/services/index.ts`
- `src/tests/**/notificacao*.test.ts`

## Implementação

- Persistir notificações com prioridade, origem, destino, leitura e chave idempotente.
- Gerar alertas locais a partir de prazos/eventos e manter histórico paginado.
- Preferências de e-mail e resumo diário serão persistidas; envio server-side fica isolado para implantação posterior.
