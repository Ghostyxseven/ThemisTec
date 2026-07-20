# Spec 26: Estabilização funcional após migração Supabase

**Story:** `story-26-estabilizacao-supabase.md`
**Status:** completed

## Abordagem

1. Diagnosticar o servidor Next.js local e eliminar processos/configurações conflitantes.
2. Persistir o caminho privado do documento, não uma URL assinada efêmera; gerar URL sob demanda pelo adapter.
3. Adicionar rota `/reset-password` e capacidade `updatePassword` ao contrato de autenticação.
4. Testar Auth, Storage e mapeamentos dos repositórios Supabase com SDK mockado.
5. Executar `npm audit` e aplicar somente correções compatíveis, validando novamente o Harness.

## Arquivos permitidos

- `src/features/auth/**`
- `src/features/documentos/**`
- `src/shared/interfaces/**`
- `src/specs/schemas/**`
- `src/app/reset-password/**`
- `src/tests/**`
- `package.json`, `package-lock.json`, `next.config.mjs`
- documentação BMad relacionada
