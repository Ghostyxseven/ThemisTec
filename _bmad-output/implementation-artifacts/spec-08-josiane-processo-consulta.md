# SPEC: Consulta de Processos com Filtros (Front-end)

**Referência:** Story 08 (Josiane)  
**Status:** Ready for Dev  

## 1. Arquivos-Alvo (Target Files)
Esta especificação detalha as mudanças necessárias para a consulta de processos (US08).

- **Tela de Listagem:** `src/app/processos/page.tsx` [NEW]
- **ViewModel da Listagem:** `src/app/processos/useListProcessos.ts` [NEW]
- **Interface do Repositório:** `src/shared/interfaces/IProcessoRepository.ts` [MODIFY]
- **Adaptador Firestore:** `src/services/firebase/FirestoreProcessoAdapter.ts` [MODIFY]
- **Schema de Validação (Não alterar):** `src/specs/schemas/processo.schema.ts`

## 2. Instruções de Implementação

### 2.1. Modificar `IProcessoRepository`
Adicionar assinatura do método `listar`:
```typescript
import { CreateProcessoInput, Processo, ListProcessosQuery, ProcessoListResponse } from "@/specs/schemas/processo.schema";

export interface IProcessoRepository {
  criar(dados: CreateProcessoInput, clienteNome: string, userId: string): Promise<Processo>;
  listar(params: ListProcessosQuery, userId: string): Promise<ProcessoListResponse>;
}
```

### 2.2. Modificar `FirestoreProcessoAdapter`
Implementar o método `listar(params, userId)`:
- Obter todos os documentos da coleção `processos` onde `userId === userId`.
- Filtrar em memória por `clienteId` (se fornecido) e `status` (se fornecido).
- Ordenar por `criadoEm` de forma decrescente (mais recentes primeiro).
- Aplicar paginação baseada em `params.page` e `params.limit`.
- Retornar o formato estruturado do type `ProcessoListResponse`.

### 2.3. ViewModel (`useListProcessos.ts`)
Criar o hook ViewModel de listagem:
- **Campos de Estado:** `isLoading` (boolean), `errorMessage` (string | null), `dados` (Processo[]), `paginacao`, `filtroClienteId` (string), `filtroStatus` (string).
- **Métodos:**
  - `setFiltroClienteId(id: string)`
  - `setFiltroStatus(status: string)`
  - `setPage(pagina: number)`
  - `fetchProcessos()`: Busca processos aplicando filtros.

### 2.4. View (`src/app/processos/page.tsx`)
Criar a interface visual de listagem:
- Utilizar `"use client"`.
- Barra superior contendo: Título "Processos", botão "Registrar Processo" e dropdowns para Filtro por Cliente e Filtro por Status.
- Tabela exibindo os processos listados e seus status correspondentes com badges coloridos.
- Rodapé com controle de paginação.

## 3. Limites Estritos (Harness)
- 🛑 **PROIBIDO:** A View acessar diretamente o Firestore ou instanciar SDKs externos do Firebase.
- ✅ **OBRIGATÓRIO:** Executar `npm run typecheck` e `npm run lint` antes do commit final.
