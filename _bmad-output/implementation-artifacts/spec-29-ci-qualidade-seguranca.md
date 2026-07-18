# Spec 29: CI de qualidade e segurança

**Story:** `story-29-ci-qualidade-seguranca.md`
**Status:** completed

## Harness

- `.github/workflows/ci.yml`
- `package.json`
- `package-lock.json`
- `playwright.config.ts`
- `e2e/auth.teardown.ts`
- `_bmad-output/stories/story-29-ci-qualidade-seguranca.md`
- `_bmad-output/implementation-artifacts/spec-29-ci-qualidade-seguranca.md`
- `README.md`

## Implementação

- Criar workflow para pushes e pull requests destinados a `develop` e `main`.
- Usar Node.js 20, `npm ci`, cache do npm e permissões `contents: read`.
- Executar `validate`, lint dos arquivos E2E/configuração, build e Playwright público.
- Instalar somente Chromium e dependências necessárias no job E2E.
- Fornecer apenas valores públicos descartáveis para o build; nunca usar `service_role` no workflow público.
- Desabilitar explicitamente o projeto autenticado com `E2E_AUTH_ENABLED=false` no CI público.
- Executar `npm audit --audit-level=critical` em job independente.
- Documentar quais verificações são automáticas e quais dependem de segredos locais.
