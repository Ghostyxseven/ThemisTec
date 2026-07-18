# Spec 25: Migração integral para Supabase

**Story:** `story-25-migracao-supabase.md`
**Status:** completed

## Decisão técnica

O Supabase será o único backend do ThemisTec:

- Supabase Auth para e-mail/senha, sessão, recuperação e perfil.
- PostgreSQL acessado pelo cliente Supabase para clientes, processos e prazos.
- Supabase Storage com bucket privado `processos` e URLs assinadas.
- RLS baseada em `auth.uid()` como barreira obrigatória de isolamento por usuário.

## Arquitetura

O SDK só pode existir na camada Model/Service. O service locator injeta implementações concretas nas interfaces compartilhadas:

- `SupabaseAuthAdapter implements IAuthService`
- `SupabaseClienteAdapter implements IClienteRepository`
- `SupabaseProcessoAdapter implements IProcessoRepository`
- `SupabasePrazoAdapter implements IPrazoRepository`
- `SupabaseStorageAdapter implements IStorageService`

As Views e ViewModels consomem apenas essas interfaces.

## Persistência

O script `supabase/migrations/202607180001_initial_schema.sql` cria tabelas, índices, gatilhos, RLS e políticas do Storage. Nomes SQL usam `snake_case`; os adapters fazem o mapeamento para os contratos TypeScript em `camelCase`.

## Arquivos permitidos

- `src/features/*/model/*Adapter.ts`
- `src/features/*/viewmodel/*.ts`
- `src/features/perfil/view/PerfilView.tsx`
- `src/components/layout/*.tsx`
- `src/services/index.ts`
- `src/services/supabase/*`
- `src/shared/interfaces/IAuthService.ts`
- `supabase/migrations/*.sql`
- configurações, testes, documentação e dependências relacionadas ao backend

## Segurança

- Nenhuma `service_role` key será exposta no navegador.
- Cada tabela terá RLS vinculando `user_id` a `auth.uid()`.
- Arquivos serão gravados no prefixo `<user_id>/processos/...`.
- O bucket não será público; leitura usa URL assinada temporária.
