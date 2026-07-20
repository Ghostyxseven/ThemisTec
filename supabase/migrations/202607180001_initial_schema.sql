create extension if not exists pgcrypto;

create table if not exists public.clientes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  cpf text not null,
  email text,
  telefone text,
  endereco text,
  observacoes text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (user_id, cpf)
);

create table if not exists public.processos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cliente_id uuid not null references public.clientes(id) on delete restrict,
  cliente_nome text not null,
  numero text not null,
  tipo text not null,
  status text not null default 'em_andamento',
  descricao text,
  data_abertura date not null,
  valor_honorarios numeric(14,2) not null default 0,
  status_pagamento text not null default 'PENDENTE',
  documentos jsonb not null default '[]'::jsonb,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.prazos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  processo_id uuid not null references public.processos(id) on delete cascade,
  processo_numero text not null,
  titulo text not null,
  descricao text,
  data_vencimento date not null,
  status text not null default 'PENDENTE',
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists clientes_user_id_idx on public.clientes(user_id);
create index if not exists processos_user_id_idx on public.processos(user_id);
create index if not exists processos_cliente_id_idx on public.processos(cliente_id);
create index if not exists prazos_user_id_data_idx on public.prazos(user_id, data_vencimento);

alter table public.clientes enable row level security;
alter table public.processos enable row level security;
alter table public.prazos enable row level security;

create policy "clientes_owner_all" on public.clientes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "processos_owner_all" on public.processos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "prazos_owner_all" on public.prazos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('processos', 'processos', false)
on conflict (id) do update set public = false;

create policy "processos_storage_owner_select" on storage.objects for select
using (bucket_id = 'processos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "processos_storage_owner_insert" on storage.objects for insert
with check (bucket_id = 'processos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "processos_storage_owner_delete" on storage.objects for delete
using (bucket_id = 'processos' and (storage.foldername(name))[1] = auth.uid()::text);
