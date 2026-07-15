---
title: "Spec 09: Storage Backend Adapter para PDFs"
status: active
type: specification
story: story-09-micael-storage.md
---

# Spec 09: Storage Backend Adapter para PDFs

## Visão Geral
Este artefato descreve a implementação técnica da infraestrutura de backend para suportar upload de PDFs. A View (Frontend) será implementada separadamente em outra issue/story.

## Arquitetura (MVVM & Adapter)
- **Interface**: `IStorageService` define contratos agnósticos como `uploadFile` e `deleteFile`.
- **Adapter**: `FirebaseStorageAdapter` assina a interface acima e interage com o SDK do Firebase Storage (`ref`, `uploadBytes`, `getDownloadURL`).
- **Repositório**: `IProcessoRepository` ganha um novo método `adicionarDocumento(processoId, documento)` para utilizar `arrayUnion` no Firestore, vinculando o upload recém feito ao processo correto.

## Arquivos Modificados/Criados

- `src/shared/interfaces/IStorageService.ts` [NOVO]
- `src/services/firebase/FirebaseStorageAdapter.ts` [NOVO]
- `src/shared/interfaces/IProcessoRepository.ts` [MODIFICADO]
- `src/services/firebase/FirestoreProcessoAdapter.ts` [MODIFICADO]

## Verificação
- Garantir a compilação limpa do TypeScript e aprovação do ESLint.
