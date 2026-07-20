---
epic: Epic 07
status: todo
---
# Story 37: PWA e Offline Sync

**Como** um advogado em campo sem internet
**Quero** que o aplicativo carregue offline e salve alterações localmente
**Para** sincronizá-las depois com o Supabase quando a rede voltar.

## Critérios de Aceite
1. next-pwa configurado gerando manifest e service worker.
2. Inclusão de IndexedDB para fila de requisições offline.
3. Tratamento de erro de rede no Repository com fallback para cache.
