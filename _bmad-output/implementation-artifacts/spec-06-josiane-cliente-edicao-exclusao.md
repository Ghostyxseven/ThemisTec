# SPEC: Edição e Exclusão de Cliente (Front-end)

**Referência:** Story 06 (Josiane)  
**Status:** Ready for Dev  

## 1. Arquivos-Alvo (Target Files)
Esta especificação dita as mudanças exatas que deverão ser feitas para concluir a Story 06 (US06).

- **Página de Edição:** `src/app/clientes/edicao/[id]/page.tsx` [NEW]
- **ViewModel de Edição:** `src/app/clientes/edicao/[id]/useUpdateCliente.ts` [NEW]
- **Interface do Repositório (Modificar):** `src/shared/interfaces/IClienteRepository.ts`
- **Adaptador Firestore (Modificar):** `src/services/firebase/FirestoreClienteAdapter.ts`
- **Schema de Validação (Não alterar):** `src/specs/schemas/cliente.schema.ts`

## 2. Instruções de Implementação

### 2.1. Alterações em `IClienteRepository`
Adicionar assinaturas de métodos para detalhe, atualização e exclusão de clientes:
```typescript
import { UpdateClienteInput } from "@/specs/schemas/cliente.schema";

// Adicionar à interface:
buscarPorId(id: string, userId: string): Promise<Cliente | null>;
atualizar(id: string, dados: UpdateClienteInput, userId: string): Promise<Cliente>;
excluir(id: string, userId: string): Promise<void>;
```

### 2.2. Alterações em `FirestoreClienteAdapter`
Implementar os novos métodos:
- `buscarPorId(id, userId)`: Buscar e retornar o cliente correspondente do Firestore, garantindo que pertença ao `userId`.
- `atualizar(id, dados, userId)`: Atualizar as informações do cliente no Firestore e registrar o carimbo `atualizadoEm` correspondente.
- `excluir(id, userId)`: Excluir o registro de cliente do Firestore, garantindo validação de propriedade (`userId`).

### 2.3. ViewModel de Edição (`useUpdateCliente.ts`)
Criar o hook ViewModel (MVVM):
- **Campos de Estado:** `isLoading` (boolean), `isSaving` (boolean), `errorMessage` (string | null), `cliente` (Cliente | null).
- **Método de carga:** `loadCliente(id: string): Promise<void>`.
- **Método de salvamento:** `updateCliente(id: string, dados: UpdateClienteInput): Promise<void>`.

### 2.4. View de Edição (`page.tsx`)
Criar a interface visual em `/clientes/edicao/[id]`:
- Carregar os dados originais do cliente a partir do ID da rota (usando `useParams`).
- Renderizar formulário preenchido e validado via Zod (`UpdateClienteSchema`).
- Redirecionar para `/clientes` após a atualização de dados.

### 2.5. Integração do Fluxo de Exclusão (Listagem)
Atualizar a listagem de clientes (`src/app/clientes/page.tsx`):
- Ao clicar no botão "Excluir", exibir um diálogo de confirmação visual nativo (`window.confirm`) ou modal personalizado.
- Se confirmado pelo usuário, chamar o método `excluir(id)` do repositório/viewModel e recarregar a listagem de clientes.

## 3. Limites Estritos (Harness)
- 🛑 **PROIBIDO:** A View acessar diretamente o Firestore ou instanciar SDKs externos do Firebase.
- ✅ **OBRIGATÓRIO:** Executar `npm run typecheck` e `npm run lint` antes do commit final.
