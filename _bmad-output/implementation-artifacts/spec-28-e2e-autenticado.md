# Spec 28: Jornada E2E autenticada descartável

**Story:** `story-28-e2e-autenticado.md`
**Status:** completed

## Harness

- `_bmad-output/stories/story-28-e2e-autenticado.md`
- `_bmad-output/implementation-artifacts/spec-28-e2e-autenticado.md`
- `playwright.config.ts`
- `e2e/auth.setup.ts`
- `e2e/authenticated.spec.ts`
- `e2e/auth.teardown.ts`
- `.env.example`
- `.gitignore`

## Implementação

- Usar `SUPABASE_SERVICE_ROLE_KEY` somente no processo Node do Playwright.
- Criar usuário com e-mail aleatório e senha forte em arquivo temporário ignorado pelo Git.
- Fazer login pela tela `/login` e salvar `storageState` do navegador.
- Executar testes autenticados em projeto separado, dependente do setup.
- Validar dashboard, perfil e logout sem depender de dados permanentes.
- Excluir o usuário via Admin API em teardown executado mesmo após falhas do projeto autenticado.
- Quando URL, anon key ou service role não existirem, pular setup, testes e teardown de forma explícita.
