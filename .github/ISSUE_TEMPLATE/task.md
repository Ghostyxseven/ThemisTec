---
name: "Tarefa Técnica"
about: "Configuração, CI/CD, harness, documentação ou refatoração"
title: "[TASK] "
labels: ["task"]
assignees: ""
---

## Objetivo

<!-- Descreva o que esta tarefa precisa entregar e por quê é necessária -->

---

## Tipo de Tarefa

- [ ] `config` — Configuração de ferramentas (ESLint, tsconfig, Vitest)
- [ ] `ci` — Pipeline de CI/CD (GitHub Actions)
- [ ] `docs` — Documentação (PRD, ADRs, guias)
- [ ] `refactor` — Refatoração sem mudança de comportamento
- [ ] `harness` — Melhoria nos sensores (lint, typecheck, testes)
- [ ] `infra` — Firebase rules, Vercel config, Cloudflare

---

## Critérios de Conclusão

<!-- O que precisa ser verdade para esta tarefa ser considerada concluída? -->
- [ ] 
- [ ] 

---

## Arquivos Esperados / Afetados

<!-- Liste os arquivos que serão criados ou modificados -->
- 

---

## Responsável Esperado

<!-- Com base no GIT_WORKFLOW.md -->
- [ ] Marcos — Configs, CI/CD, Harness, Deploy
- [ ] Gisele — Documentação, Specs, Testes de contrato
- [ ] Micael — Services Firebase, Backend, Upload
- [ ] Josiane — Frontend, Componentes, Estilos

---

## Dependências

<!-- Esta tarefa depende de outra issue ou precisa ser feita antes de outra? -->
- Depende de: #
- Bloqueia: #

---

## Checklist de Conclusão (para a IA e o dev)

- [ ] Branch criada com prefixo correto (`config/`, `ci/`, `docs/`, `refactor/`)
- [ ] Commits seguem Conventional Commits
- [ ] `npm run harness` — todos os sensores passando (se aplicável)
- [ ] PR criado com `Closes #<número-desta-issue>`
