# SPEC: Registro de Processo Vinculado a Cliente (Front-end)

**Referência:** Story 07 (Josiane)  
**Status:** Ready for Dev  

## 1. Arquivos-Alvo (Target Files)
Esta especificação dita as mudanças exatas que deverão ser feitas para concluir a Story 07 (US07).

- **Página de Cadastro:** `src/app/processos/cadastro/page.tsx` [NEW]
- **ViewModel de Cadastro:** `src/app/processos/cadastro/useCreateProcesso.ts` [NEW]
- **Interface do Repositório (Novo):** `src/shared/interfaces/IProcessoRepository.ts` [NEW]
- **Adaptador Firestore (Novo):** `src/services/firebase/FirestoreProcessoAdapter.ts` [NEW]
- **Schema de Validação (Não alterar):** `src/specs/schemas/processo.schema.ts`

## 2. Instruções de Implementação

### 2.1. Criar `IProcessoRepository`
Definir o contrato do repositório para processos:
```typescript
import { CreateProcessoInput, Processo } from "@/specs/schemas/processo.schema";

export interface IProcessoRepository {
  criar(dados: CreateProcessoInput, clienteNome: string, userId: string): Promise<Processo>;
}
```

### 2.2. Criar `FirestoreProcessoAdapter`
Implementar a classe que atende a `IProcessoRepository` usando Firestore:
- O método `criar(dados, clienteNome, userId)` deve persistir na coleção `processos` com carimbos `criadoEm` e `atualizadoEm`, além do `userId` e do `clienteNome`.

### 2.3. ViewModel (`useCreateProcesso.ts`)
Criar o hook ViewModel (MVVM):
- **Campos de Estado:** `isLoading` (boolean), `errorMessage` (string | null), `clientes` (Cliente[] - relação de clientes carregados para vinculação).
- **Métodos:**
  - `loadClientes(): Promise<void>`: Carrega os clientes cadastrados para alimentar o select.
  - `createProcesso(dados: CreateProcessoInput): Promise<void>`.

### 2.4. View (`src/app/processos/cadastro/page.tsx`)
Criar a tela visual em `/processos/cadastro`:
- Utilizar `"use client"`.
- Form com `react-hook-form` acoplado ao `zodResolver(CreateProcessoSchema)`.
- Campo de seleção (Select) alimentado reativamente pelos clientes do advogado (`userId`), contendo a chave `clienteId`.
- Inputs correspondentes aos campos de Zod (`numero`, `tipo`, `dataAbertura`, `descricao`).
- Redirecionar para `/processos` após o cadastro com sucesso.

## 3. Limites Estritos (Harness)
- 🛑 **PROIBIDO:** A View acessar diretamente o Firestore ou instanciar SDKs externos do Firebase.
- ✅ **OBRIGATÓRIO:** Executar `npm run typecheck` e `npm run lint` antes do commit final.
