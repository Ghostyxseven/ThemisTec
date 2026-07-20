-- Nova Tabela: Escritórios
create table if not exists public.escritorios (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  criado_em timestamptz not null default now()
);

-- Nova Tabela: Vínculo Escritório <-> Usuários
create table if not exists public.escritorio_usuarios (
  id uuid primary key default gen_random_uuid(),
  escritorio_id uuid not null references public.escritorios(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  papel text not null default 'membro', -- 'admin' ou 'membro'
  criado_em timestamptz not null default now(),
  unique (escritorio_id, user_id)
);

-- Adicionar coluna escritorio_id
alter table public.clientes add column if not exists escritorio_id uuid references public.escritorios(id) on delete restrict;
alter table public.processos add column if not exists escritorio_id uuid references public.escritorios(id) on delete restrict;
alter table public.prazos add column if not exists escritorio_id uuid references public.escritorios(id) on delete restrict;
alter table public.document_templates add column if not exists escritorio_id uuid references public.escritorios(id) on delete restrict;

-- Data Backfill: Criar escritórios para todos os usuários existentes
do $$
declare
  r record;
  new_escritorio_id uuid;
begin
  for r in (
    select distinct user_id from (
      select user_id from public.clientes
      union
      select user_id from public.processos
      union
      select user_id from public.prazos
    ) as users
  ) loop
    -- Cria um escritório para este usuário
    insert into public.escritorios (nome) values ('Escritório Padrão') returning id into new_escritorio_id;
    -- Vincula o usuário como admin
    insert into public.escritorio_usuarios (escritorio_id, user_id, papel) values (new_escritorio_id, r.user_id, 'admin');
    
    -- Migra todos os dados deste usuário para este escritório
    update public.clientes set escritorio_id = new_escritorio_id where user_id = r.user_id;
    update public.processos set escritorio_id = new_escritorio_id where user_id = r.user_id;
    update public.prazos set escritorio_id = new_escritorio_id where user_id = r.user_id;
    update public.document_templates set escritorio_id = new_escritorio_id where user_id = r.user_id;
  end loop;
end $$;

-- Refatoração RLS
-- Remover políticas antigas
drop policy if exists "clientes_owner_all" on public.clientes;
drop policy if exists "processos_owner_all" on public.processos;
drop policy if exists "prazos_owner_all" on public.prazos;
drop policy if exists "templates_owner_all" on public.document_templates;
drop policy if exists "tenant_isolation_templates" on public.document_templates;

-- Criar novas políticas baseadas em Tenant
create policy "tenant_isolation_clientes" on public.clientes for all 
using (escritorio_id in (select escritorio_id from public.escritorio_usuarios where user_id = auth.uid()));

create policy "tenant_isolation_processos" on public.processos for all 
using (escritorio_id in (select escritorio_id from public.escritorio_usuarios where user_id = auth.uid()));

create policy "tenant_isolation_prazos" on public.prazos for all 
using (escritorio_id in (select escritorio_id from public.escritorio_usuarios where user_id = auth.uid()));

create policy "tenant_isolation_templates" on public.document_templates for all 
using (escritorio_id in (select escritorio_id from public.escritorio_usuarios where user_id = auth.uid()));

-- Habilitar RLS para as novas tabelas
alter table public.escritorios enable row level security;
alter table public.escritorio_usuarios enable row level security;

create policy "tenant_isolation_escritorios" on public.escritorios for all
using (id in (select escritorio_id from public.escritorio_usuarios where user_id = auth.uid()));

create policy "tenant_isolation_escritorio_usuarios" on public.escritorio_usuarios for all
using (user_id = auth.uid() or escritorio_id in (select escritorio_id from public.escritorio_usuarios where user_id = auth.uid()));

