# Spec 27: Hardening de autenticação, RLS e testes E2E

**Story:** `story-27-hardening-seguranca-e2e.md`
**Status:** completed

## Implementação

- Usar `@supabase/ssr` para clientes browser/server e renovação de cookies.
- Criar `src/proxy.ts` para proteger o grupo de rotas autenticadas no Next.js 16.
- Remover o guard visual redundante do `AppShell`.
- Configurar Playwright e testes E2E sem credenciais persistidas.
- Criar teste RLS opt-in, executado somente quando credenciais descartáveis forem fornecidas por ambiente.
- Limpar avisos de lint nas funções de aplicação sem relaxar as regras do Harness.
