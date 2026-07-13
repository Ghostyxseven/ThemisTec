# [STORY] Configuração do Service Worker e Cache (US16)

**Issue:** #37
**Responsável:** Josiane (Frontend)
**Épico:** 07 (Modo Offline PWA)

## Descrição
Como usuário em deslocamento (advogado), quero que o sistema faça cache automático dos recursos estáticos e das páginas de listagem para que, mesmo com internet instável ou offline, a tela carregue rapidamente e eu não fique bloqueado (App Shell).

## Critérios de Aceite
1. Arquivo de manifesto (`manifest.json`) deve estar presente e lincado no `layout.tsx`.
2. Uma solução de PWA (`@ducanh2912/next-pwa`) configurada no `next.config.mjs`.
3. Service Worker gerado, com cache para rotas estáticas e imagens do sistema.
4. O app deve ser instalável no navegador (Aparecer ícone de instalação).
