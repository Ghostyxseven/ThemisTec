# Spec de Implementação: US17 - Persistência Offline

## 1. O que Fazer
Exportar uma função `initFirestore()` centralizada em `firebase.client.ts` que retorna a instância do `Firestore` e tenta habilitar a persistência local assincronamente apenas no ambiente de Client (navegador). Atualizar os Adapters do Firestore para utilizarem esse inicializador em vez de chamarem `getFirestore()` diretamente toda vez.

## 2. Onde Fazer
- `src/services/firebase/firebase.client.ts`
- `src/services/firebase/FirestoreClienteAdapter.ts`
- `src/services/firebase/FirestoreProcessoAdapter.ts`

## 3. Como Fazer (Passo a Passo)

### Passo 1: Modificar `firebase.client.ts`
1. Importar `initializeFirestore`, `persistentLocalCache`, e `persistentMultipleTabManager` do `firebase/firestore`.
2. Adicionar uma variável global de cache `let firestoreInstance: Firestore | null = null;`.
3. Criar e exportar a função `getFirestoreDb(): Firestore`:
   - Se `firestoreInstance` existir, retornar.
   - Chamar `getFirebaseApp()`.
   - Inicializar o Firestore com persistência usando a nova API V9:
     ```typescript
     firestoreInstance = initializeFirestore(app, {
       localCache: persistentLocalCache({
         tabManager: persistentMultipleTabManager()
       })
     });
     ```
   - Retornar `firestoreInstance`.

### Passo 2: Atualizar os Adapters
No `FirestoreClienteAdapter` e no `FirestoreProcessoAdapter`:
- No construtor, remover a importação de `getFirestore` do Firebase.
- Substituir por `this.db = getFirestoreDb()`.

## 4. O que NÃO Fazer
- Não utilize `enableIndexedDbPersistence`, ela está descontinuada nas versões mais recentes (Firebase > 9.x) em favor do `localCache`.
- Não chame essa inicialização sem garantir que o Next.js não execute isso no servidor (se bem que o Firebase V9 lida com SSR graciosamente usando `initializeFirestore`).
