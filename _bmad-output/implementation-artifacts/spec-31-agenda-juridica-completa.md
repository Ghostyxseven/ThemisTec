# Spec 31: Agenda jurídica completa

**Story:** `story-31-agenda-juridica-completa.md`
**Status:** active

## Harness

- `supabase/migrations/*agenda*.sql`
- `src/specs/schemas/evento.schema.ts`
- `src/shared/interfaces/IEventoRepository.ts`
- `src/features/agenda/**`
- `src/app/(authenticated)/agenda/**`
- `src/components/layout/Sidebar.tsx`
- `src/services/index.ts`
- `src/tests/**/agenda*.test.ts`

## Implementação

- Criar tabela `eventos_agenda` com RLS, tipo, início/fim, processo, cliente, lembrete e status.
- Exibir mês, semana e dia sem dependência de calendário externo.
- Unificar eventos com prazos por projeção no ViewModel.
- Gerar `.ics` no cliente com conteúdo compatível com Google Calendar e Outlook.
