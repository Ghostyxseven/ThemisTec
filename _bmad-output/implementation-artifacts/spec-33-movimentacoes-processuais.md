# Spec 33: Movimentações processuais

**Story:** `story-33-movimentacoes-processuais.md`
**Status:** active

## Harness

- `supabase/migrations/*movimentacoes*.sql`
- `src/specs/schemas/movimentacao.schema.ts`
- `src/shared/interfaces/IMovimentacaoRepository.ts`
- `src/features/movimentacoes/**`
- `src/app/(authenticated)/processos/movimentacoes/**`
- `src/services/index.ts`
- `src/tests/**/movimentacao*.test.ts`

## Implementação

- Criar tabela de movimentações tipadas, ligada a processo e usuário.
- Persistir metadados de anexos privados sem duplicar o serviço de Storage.
- Exibir linha do tempo e CRUD com confirmação de exclusão.
