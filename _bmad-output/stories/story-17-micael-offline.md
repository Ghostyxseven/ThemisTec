---
epic: Epic 02 - Dashboard e Exportação
story_id: US17
title: Persistência Offline do Firestore (Backend/Config)
assignee: Micael (Backend)
status: IN_PROGRESS
---

# US17 - Persistência Offline do Firestore

## Contexto
Para garantir que o aplicativo PWA continue funcionando quando houver instabilidades de rede (muito comuns em fóruns e tribunais), precisamos habilitar o cache local no banco de dados.

O Firestore possui suporte nativo à persistência via IndexedDB no navegador. Se ativada, todas as leituras e escritas são armazenadas localmente primeiro, permitindo que a aplicação seja utilizada off-line. Quando a conexão retorna, os dados são sincronizados automaticamente.

## Requisitos
1. Modificar o módulo de inicialização do Firebase (`src/services/firebase/firebase.client.ts`).
2. Adicionar uma rotina que chame `enableMultiTabIndexedDbPersistence` ou `enableIndexedDbPersistence` na instância do Firestore, logo após a inicialização do app.
3. Tratamento de erros: lidar com `failed-precondition` (múltiplas abas) ou `unimplemented` (navegador sem suporte) silenciosamente, para não quebrar a aplicação caso o cache não possa ser ligado.

## Critérios de Aceite
- [ ] A persistência do Firestore está ativada.
- [ ] O código lida adequadamente com ambientes onde a janela (`window`) não está presente (como SSR/Testes).
- [ ] A ativação prevê erros comuns do IndexedDB.
