# Spec 44: Migração de Schemas para Multi-tenancy

## Arquivos a Modificar / Criar
1. **`src/specs/schemas/organizacao.schema.ts`**
   - Criar Zod schema para `Organizacao` (id, nome, plano, criadoEm).
   - Criar `OrganizacaoMembro` (userId, organizacaoId, role: ADMIN | USER).

2. **`src/specs/schemas/processo.schema.ts`** e **`cliente.schema.ts`**
   - Atualizar todos os core schemas adicionando `tenantId: z.string().uuid()`.
   - Modificar os Adapters no código para incluir o tenantId nas gravações.

## Validação
- Executar `npm run typecheck` para garantir que o projeto não foi quebrado.
