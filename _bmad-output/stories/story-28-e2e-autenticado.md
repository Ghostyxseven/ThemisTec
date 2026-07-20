# Story 28: Jornada E2E autenticada descartável

**Status:** done

## Story

**Como** responsável técnico do ThemisTec,
**quero** validar a aplicação com um usuário Supabase descartável,
**para que** regressões de sessão e navegação autenticada sejam detectadas antes da entrega.

## Critérios de aceitação

- [x] O Playwright deve criar um usuário confirmado exclusivo da execução.
- [x] A autenticação deve ocorrer pela interface pública de login.
- [x] A sessão autenticada deve ser reutilizada sem credenciais persistidas no repositório.
- [x] Dashboard, perfil e logout devem ser validados no navegador.
- [x] O usuário descartável deve ser removido ao final da suíte.
- [x] A suíte deve ignorar os testes autenticados quando as credenciais administrativas não estiverem configuradas.
- [x] Harness, build e testes E2E devem passar.
