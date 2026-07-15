---
title: "Story 09: Storage Backend Adapter para PDFs (Issue 19)"
status: ready-for-dev
type: story
issue: 19
---

# Story 09: Storage Backend Adapter para PDFs

## Story
**Como** sistema,
**quero** possuir um serviço de armazenamento no Firebase Storage e atualizar o repositório de processos,
**para que** a Josiane (Frontend) possa posteriormente plugar o botão de upload de arquivos (máx. 10MB).

## Acceptance Criteria
- [ ] Criar a interface `IStorageService` no domínio compartilhado.
- [ ] Implementar `FirebaseStorageAdapter` para conectar com o Firebase Storage.
- [ ] Atualizar `IProcessoRepository` e `FirestoreProcessoAdapter` com um método para adicionar um documento (URL) ao array de documentos de um processo existente.
- [ ] O código deve passar em todas as regras de lint e typecheck do projeto.

## Status
ready-for-dev
