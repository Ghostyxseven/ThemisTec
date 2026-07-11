# SPEC: Listagem Paginada com Busca (Front-end)

**Referência:** Story 05 (Josiane)  
**Status:** Ready for Dev  

## 1. Arquivos-Alvo (Target Files)
Esta especificação dita as mudanças exatas que deverão ser feitas para concluir a Story 05 (US05).

- **Página Visual:** `src/app/clientes/page.tsx` [NEW]
- **Hook de Lógica (ViewModel):** `src/app/clientes/useListClientes.ts` [NEW]
- **Interface do Repositório (Modificar):** `src/shared/interfaces/IClienteRepository.ts`
- **Adaptador Firestore (Modificar):** `src/services/firebase/FirestoreClienteAdapter.ts`
- **Schema de Validação (Não alterar):** `src/specs/schemas/cliente.schema.ts`

## 2. Instruções de Implementação

### 2.1. Alterações em `IClienteRepository`
Adicionar a assinatura do método de busca/listagem:
```typescript
import { ListClientesQuery, ClienteListResponse } from "@/specs/schemas/cliente.schema";

// Adicionar a assinatura abaixo na interface:
listar(params: ListClientesQuery, userId: string): Promise<ClienteListResponse>;
```

### 2.2. Alterações em `FirestoreClienteAdapter`
Implementar o método `listar(params, userId)`:
- Fazer a busca de clientes no Firestore associados ao `userId`.
- Aplicar o filtro de busca (`params.search`) em Nome ou CPF de forma case-insensitive.
- Aplicar paginação baseada nos parâmetros `page` e `limit`.
- Retornar no formato `ClienteListResponse` contendo os clientes filtrados/paginados e os metadados de paginação.

### 2.3. ViewModel (`useListClientes.ts`)
Criar o hook ViewModel (MVVM):
- **Campos de Estado:** `isLoading` (boolean), `errorMessage` (string | null), `dados` (Cliente[]), `paginacao` (metadados).
- **Parâmetro reativo:** O hook deve escutar mudanças em `search` (com debounce no input visual) e na página atual para disparar buscas automáticas.
- **Assinatura do método:** `fetchClientes(query: ListClientesQuery): Promise<void>`.

### 2.4. View (`src/app/clientes/page.tsx`)
Criar a tela de listagem de clientes:
- Utilizar `"use client"`.
- Barra de busca com input textual para filtrar por Nome ou CPF.
- Tabela moderna responsiva apresentando a relação de clientes.
- Controles de paginação (botões "Anterior" e "Próximo", indicação de página atual e total).
- Mensagens amigáveis para estados de carregamento ou lista vazia.

## 3. Limites Estritos (Harness)
- 🛑 **PROIBIDO:** A View acessar diretamente o Firestore ou instanciar SDKs externos.
- ✅ **OBRIGATÓRIO:** Executar `npm run typecheck` e `npm run lint` antes do commit final.
