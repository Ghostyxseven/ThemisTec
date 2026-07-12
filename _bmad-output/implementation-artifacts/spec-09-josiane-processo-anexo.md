# SPEC: Anexar PDF ao Processo (Front-end)

**Referência:** Story 09 (Josiane)  
**Status:** Ready for Dev  

## 1. Arquivos-Alvo (Target Files)
Esta especificação dita as mudanças exatas que deverão ser feitas para concluir a Story 09 (US09).

- **Interface do Repositório (Modificar):** `src/shared/interfaces/IProcessoRepository.ts` [MODIFY]
- **Adaptador Firestore (Modificar):** `src/services/firebase/FirestoreProcessoAdapter.ts` [MODIFY]
- **Interface do Storage (Novo):** `src/shared/interfaces/IStorageService.ts` [NEW]
- **Adaptador Storage (Novo):** `src/services/firebase/FirebaseStorageAdapter.ts` [NEW]
- **Página de Documentos do Processo:** `src/app/processos/documentos/[id]/page.tsx` [NEW]
- **ViewModel de Documentos do Processo:** `src/app/processos/documentos/[id]/useDocumentosProcesso.ts` [NEW]

## 2. Instruções de Implementação

### 2.1. Modificar `IProcessoRepository`
Adicionar os métodos para buscar processo por ID e adicionar um documento a ele:
```typescript
import { CreateProcessoInput, Processo, ListProcessosQuery, ProcessoListResponse, Documento } from "@/specs/schemas/processo.schema";

export interface IProcessoRepository {
  criar(dados: CreateProcessoInput, clienteNome: string, userId: string): Promise<Processo>;
  listar(params: ListProcessosQuery, userId: string): Promise<ProcessoListResponse>;
  buscarPorId(id: string, userId: string): Promise<Processo>;
  adicionarDocumento(processoId: string, documento: Documento, userId: string): Promise<void>;
}
```

### 2.2. Modificar `FirestoreProcessoAdapter`
Implementar os métodos `buscarPorId` e `adicionarDocumento`:
- `buscarPorId(id, userId)`: Buscar o documento na coleção `processos` e validar se pertence ao `userId`. Se não existir ou não pertencer, lançar erro.
- `adicionarDocumento(processoId, documento, userId)`: Utilizar `updateDoc` do Firestore para adicionar o `documento` ao array `documentos` e atualizar o campo `atualizadoEm` do processo.

### 2.3. Criar `IStorageService`
Interface simples para lidar com uploads de arquivo no Storage:
```typescript
export interface IStorageService {
  uploadFile(path: string, file: File): Promise<string>;
}
```

### 2.4. Criar `FirebaseStorageAdapter`
Implementar a interface `IStorageService` utilizando a biblioteca `firebase/storage`:
- Inicializar com a instância de `getFirebaseApp()`.
- O método `uploadFile(path, file)` deve fazer o upload e retornar a URL de download via `getDownloadURL`.

### 2.5. ViewModel (`useDocumentosProcesso.ts`)
Criar o hook ViewModel (MVVM):
- **Campos de Estado:** `processo` (Processo | null), `isLoading` (boolean), `isUploading` (boolean), `errorMessage` (string | null), `successMessage` (string | null).
- **Métodos:**
  - `carregarProcesso(id: string): Promise<void>`
  - `anexarDocumento(id: string, file: File, descricao?: string): Promise<void>` (valida o arquivo antes de iniciar o upload, faz o upload no Firebase Storage sob a pasta `processos/{processoId}/{uuid}.pdf`, e adiciona os metadados do documento no array `documentos` do Firestore).

### 2.6. View (`src/app/processos/documentos/[id]/page.tsx`)
Criar a tela de anexos em `/processos/documentos/[id]`:
- Exibir nome do cliente e número do processo.
- Listagem elegante de todos os documentos anexados com botão de download/abrir em nova aba.
- Formulário de upload com input file + input de descrição + validações estritas (PDF apenas, limite de 10MB).
- Exibição de loader de upload e mensagens de erro/sucesso.

## 3. Limites Estritos (Harness)
- 🛑 **PROIBIDO:** A View acessar diretamente o Firestore/Storage ou instanciar SDKs externos do Firebase.
- ✅ **OBRIGATÓRIO:** Executar `npm run typecheck` e `npm run lint` antes do commit final.
