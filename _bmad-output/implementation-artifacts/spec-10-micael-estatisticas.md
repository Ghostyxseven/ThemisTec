# IMPLEMENTATION SPEC: Consultar Estatísticas Gerais (US10)

## 1. Arquivos Modificados

### 1.1 `src/shared/interfaces/IClienteRepository.ts`
- **[MODIFICAR]**
- Adicionar o método `contarClientes(userId: string): Promise<number>;`

### 1.2 `src/services/firebase/FirestoreClienteAdapter.ts`
- **[MODIFICAR]**
- Importar `getCountFromServer` e `query` e `where` do `firebase/firestore`.
- Implementar o método `contarClientes(userId: string): Promise<number>`:
  - Criar query `where("userId", "==", userId)`
  - Utilizar `getCountFromServer(q)`
  - Retornar `snapshot.data().count`

### 1.3 `src/shared/interfaces/IProcessoRepository.ts`
- **[MODIFICAR]**
- Adicionar os métodos:
  - `contarProcessos(userId: string): Promise<number>;`
  - `contarProcessosAtivos(userId: string): Promise<number>;`

### 1.4 `src/services/firebase/FirestoreProcessoAdapter.ts`
- **[MODIFICAR]**
- Importar `getCountFromServer`.
- Implementar `contarProcessos(userId: string): Promise<number>`:
  - Criar query `where("userId", "==", userId)`
  - Utilizar `getCountFromServer(q)`
  - Retornar a contagem.
- Implementar `contarProcessosAtivos(userId: string): Promise<number>`:
  - Criar query `where("userId", "==", userId)` e `where("status", "==", "ATIVO")`
  - Utilizar `getCountFromServer(q)`
  - Retornar a contagem.

## 2. Validação
- Executar `npm run typecheck`
- Executar `npm run test`
- Garantir que não existam erros de TypeScript nos Adapters atualizados.
