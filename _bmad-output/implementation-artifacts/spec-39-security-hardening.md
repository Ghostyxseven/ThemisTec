# Spec 39: Blindagem de Segurança RLS (Implementation Artifact)

## 1. Escopo Técnico
A implementação da Story 39 trata-se puramente de uma intervenção em nível de banco de dados, configurando o PostgreSQL (Supabase) via SQL migration.

## 2. Arquivos a serem Criados/Modificados
- **[NEW]** `supabase/migrations/20260719_harden_rls_policies.sql`: Arquivo contendo as restrições explícitas e rigorosas de controle de acesso (Role Level Security).

## 3. Padrões de Código
- O nome da migration segue o formato `<Data>_<Descricao>.sql` padrão de migrações do sistema.
- As políticas (Policies) usarão `USING (auth.uid() = user_id)` para operações estáticas (SELECT, DELETE, UPDATE) e `WITH CHECK (auth.uid() = user_id)` para operações de verificação posterior à escrita (INSERT).
