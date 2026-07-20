# Spec 41: Infraestrutura de Sincronização de Processos

## Arquivos a Modificar
1. **`src/specs/movimentacao.schema.ts`**
   - Atualizar o Zod Schema para incluir `origem_captura: z.enum(['manual', 'automatica']).default('manual')`.
   - Incluir `id_integracao: z.string().optional()`.

2. **`supabase/functions/sync-processos/index.ts`**
   - Criar script base Deno/Edge Function do Supabase para buscar e inserir dados na tabela `movimentacoes` no banco.
   
3. **`supabase/functions/sync-processos/provider-adapter.ts`**
   - Mock do adaptador do provedor externo.

## Validação
- O schema Zod deve compilar.
- O código da Edge function deve passar na verificação de tipagem Deno.
