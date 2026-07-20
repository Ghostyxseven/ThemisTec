# Story 26: Estabilização funcional após migração Supabase

**Status:** done

## Story

**Como** usuário do ThemisTec,
**quero** autenticação, documentos e ambiente local confiáveis,
**para que** os fluxos essenciais continuem funcionando após a migração para Supabase.

## Critérios de aceitação

- [x] `npm run dev` deve responder às rotas públicas localmente.
- [x] Documentos privados devem continuar acessíveis após a expiração de URLs assinadas.
- [x] O usuário deve conseguir definir uma nova senha ao retornar do e-mail de recuperação.
- [x] Adapters Supabase críticos devem possuir testes unitários.
- [x] Dependências críticas devem ser auditadas e corrigidas sem atualização destrutiva.
- [x] Typecheck, lint, testes e build devem passar.

## Evidência de auditoria

- Vitest atualizado de `3.2.4` para `3.2.7`, eliminando a vulnerabilidade crítica.
- Permanecem alertas transitivos moderados/altos em Next/PWA/Workbox; o npm oferece apenas `--force` com downgrade destrutivo, portanto não foi aplicado.
