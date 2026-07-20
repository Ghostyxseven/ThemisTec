# Story 29: CI de qualidade e segurança

**Status:** done

## Story

**Como** equipe responsável pelo ThemisTec,
**quero** validar automaticamente cada branch e pull request,
**para que** regressões de tipos, lint, testes, build e segurança sejam bloqueadas antes do merge.

## Critérios de aceitação

- [x] Pull requests e pushes para `develop` e `main` devem executar a pipeline.
- [x] Typecheck, lint completo, testes unitários e build devem passar.
- [x] O Playwright deve validar as jornadas públicas sem exigir segredos.
- [x] Vulnerabilidades críticas devem bloquear a pipeline.
- [x] O workflow deve usar permissões mínimas e cancelar execuções obsoletas.
- [x] Testes autenticados e RLS devem permanecer opt-in quando os segredos não estiverem disponíveis.
