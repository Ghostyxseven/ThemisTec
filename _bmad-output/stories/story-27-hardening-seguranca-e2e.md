# Story 27: Hardening de autenticação, RLS e testes E2E

**Status:** done

## Critérios de aceitação

- [x] Rotas privadas devem ser protegidas antes da renderização pelo servidor.
- [x] Sessões Supabase devem ser renovadas por cookies seguros.
- [x] Rotas públicas de autenticação devem permanecer acessíveis.
- [x] Playwright deve validar landing, autenticação pública e bloqueio das rotas privadas.
- [x] Deve existir teste automatizado do isolamento RLS entre dois usuários.
- [x] O Harness não deve emitir avisos de retorno explícito no código principal.
