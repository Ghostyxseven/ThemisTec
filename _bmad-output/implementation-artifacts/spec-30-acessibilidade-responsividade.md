# Spec 30: Acessibilidade e consistência responsiva

**Story:** `story-30-acessibilidade-responsividade.md`
**Status:** completed

## Harness

- `src/app/globals.css`
- `src/components/layout/AppShell.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/NotificationBell.tsx`
- `src/features/auth/view/LoginView.tsx`
- `src/features/auth/view/RegisterView.tsx`
- `src/features/clientes/view/ClientesListView.tsx`
- `src/features/processos/view/ProcessosListView.tsx`
- `src/features/prazos/view/PrazosListView.tsx`
- `e2e/auth.setup.ts`
- `_bmad-output/stories/story-30-acessibilidade-responsividade.md`
- `_bmad-output/implementation-artifacts/spec-30-acessibilidade-responsividade.md`

## Implementação

- Adicionar skip link e destino semântico no conteúdo principal.
- Padronizar `focus-visible` global sem remover indicadores nativos úteis.
- Desabilitar animações e transições não essenciais sob `prefers-reduced-motion`.
- Converter elementos clicáveis não semânticos em botões.
- Adicionar `aria-label`, `aria-expanded`, `aria-controls` e regiões de status onde necessário.
- Nomear ações de editar, excluir, concluir, reabrir e fechar para leitores de tela.
