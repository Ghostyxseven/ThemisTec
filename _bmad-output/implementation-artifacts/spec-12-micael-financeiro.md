# IMPLEMENTATION SPEC: Estrutura Financeira no BD (US12)

## 1. Arquivos Modificados

### 1.1 `src/specs/schemas/processo.schema.ts`
- **[MODIFICAR]**
- Atualizar `ProcessoSchema`:
  - `valorHonorarios`: z.number().optional().default(0)
  - `statusPagamento`: z.enum(["PAGO", "PENDENTE", "ATRASADO"]).optional().default("PENDENTE")
- Atualizar os types derivados (`CreateProcessoInput`, `UpdateProcessoInput`, `Processo`) para que reflitam essas alterações corretamente.

### 1.2 `src/services/firebase/FirestoreProcessoAdapter.ts`
- **[MODIFICAR]**
- No método `criar`:
  - Incluir `valorHonorarios` e `statusPagamento` nos dados a serem salvos no Firestore, utilizando os valores padrão caso não sejam enviados na criação.
- No método `listar` e `buscarPorId`:
  - Incluir o mapeamento de `valorHonorarios` (as number) e `statusPagamento` (as string) a partir do `doc.data()`.
- O método `atualizar` no `FirestoreProcessoAdapter` não foi especificado na interface `IProcessoRepository.ts` durante a Fase 1. Se não existir, a atualização ocorrerá no escopo da Issue de Frontend, ou eu precisarei adicioná-lo. Vamos verificar primeiro.

### 1.3 `src/tests/specs/processo.schema.test.ts`
- **[MODIFICAR]**
- Adicionar/Atualizar testes para verificar que os campos financeiros validam corretamente e que valores padrão são aplicados.

## 2. Validação
- Executar `npm run validate` e garantir que o Vitest e Typecheck passem.
