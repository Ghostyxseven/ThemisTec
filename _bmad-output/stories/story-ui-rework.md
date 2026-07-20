# Story: Rework global de UI/UX

**Status:** ready-for-dev

## Story

**Como** usuario da ThemisTec,
**quero** uma interface mais consistente, moderna e responsiva,
**para que** as telas principais fiquem mais legiveis, confiaveis e agradaveis de usar.

## Criterios de aceitacao

- [ ] Tokens visuais globais devem refletir o design system em `_bmad-output/ux/DESIGN.md`.
- [ ] Componentes base `Button`, `Input` e `Card` devem padronizar estados de hover, foco, disabled e loading.
- [ ] A rota `/portal` deve usar uma experiencia visual premium com boa hierarquia, contraste e foco acessivel.
- [ ] A rota `/portal/dashboard` deve apresentar processos e faturas em cards limpos, responsivos e com status legiveis.
- [ ] A implementacao nao deve alterar regras de negocio, adapters Supabase ou contratos em `src/specs/`.

## Notas tecnicas

- Spec tecnica correspondente: `_bmad-output/implementation-artifacts/spec-ui-rework.md`.
- Escopo permitido: `tailwind.config.ts`, `src/app/globals.css`, `src/components/ui/`, `src/app/portal/page.tsx` e `src/app/portal/dashboard/page.tsx`.
- Validacao esperada: `npm run lint` e `npm run typecheck`.
