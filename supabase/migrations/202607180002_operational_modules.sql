create table if not exists public.eventos_agenda (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  titulo text not null, tipo text not null, inicio timestamptz not null, fim timestamptz,
  descricao text, processo_id uuid references public.processos(id) on delete set null,
  cliente_id uuid references public.clientes(id) on delete set null, lembrete_minutos integer,
  status text not null default 'PENDENTE', criado_em timestamptz not null default now(), atualizado_em timestamptz not null default now()
);

create table if not exists public.movimentacoes (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  processo_id uuid not null references public.processos(id) on delete cascade, tipo text not null,
  titulo text not null, descricao text, data_evento timestamptz not null, responsavel text not null,
  anexos jsonb not null default '[]'::jsonb, criado_em timestamptz not null default now(), atualizado_em timestamptz not null default now()
);

create table if not exists public.lancamentos_financeiros (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null, descricao text not null, categoria text not null, valor numeric(14,2) not null check (valor >= 0),
  competencia date not null, vencimento date, pago_em date, forma_pagamento text, status text not null default 'PENDENTE',
  processo_id uuid references public.processos(id) on delete set null, cliente_id uuid references public.clientes(id) on delete set null,
  parcela_numero integer, parcelas_total integer, criado_em timestamptz not null default now(), atualizado_em timestamptz not null default now()
);

create table if not exists public.documentos_catalogo (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null, storage_path text not null, pasta text not null default '/', tags text[] not null default '{}',
  versao integer not null default 1, versao_ativa boolean not null default true, tamanho bigint not null default 0,
  mime_type text not null default 'application/pdf', cliente_id uuid references public.clientes(id) on delete set null,
  processo_id uuid references public.processos(id) on delete set null, excluido_em timestamptz,
  criado_em timestamptz not null default now(), atualizado_em timestamptz not null default now()
);

create table if not exists public.notificacoes (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  titulo text not null, mensagem text not null, prioridade text not null default 'NORMAL', origem text not null,
  destino_url text, lida_em timestamptz, chave_idempotencia text not null,
  criado_em timestamptz not null default now(), unique (user_id, chave_idempotencia)
);

create table if not exists public.preferencias_notificacao (
  user_id uuid primary key references auth.users(id) on delete cascade, email_habilitado boolean not null default false,
  resumo_diario boolean not null default false, antecedencia_minutos integer not null default 1440, atualizado_em timestamptz not null default now()
);

create index if not exists eventos_agenda_user_inicio_idx on public.eventos_agenda(user_id, inicio);
create index if not exists movimentacoes_processo_data_idx on public.movimentacoes(processo_id, data_evento desc);
create index if not exists lancamentos_user_competencia_idx on public.lancamentos_financeiros(user_id, competencia);
create index if not exists documentos_catalogo_user_idx on public.documentos_catalogo(user_id, excluido_em);
create index if not exists notificacoes_user_lida_idx on public.notificacoes(user_id, lida_em, criado_em desc);

alter table public.eventos_agenda enable row level security;
alter table public.movimentacoes enable row level security;
alter table public.lancamentos_financeiros enable row level security;
alter table public.documentos_catalogo enable row level security;
alter table public.notificacoes enable row level security;
alter table public.preferencias_notificacao enable row level security;

create policy "eventos_owner_all" on public.eventos_agenda for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "movimentacoes_owner_all" on public.movimentacoes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "financeiro_owner_all" on public.lancamentos_financeiros for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "documentos_catalogo_owner_all" on public.documentos_catalogo for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notificacoes_owner_all" on public.notificacoes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "preferencias_owner_all" on public.preferencias_notificacao for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.buscar_global(termo text)
returns table(tipo text, id uuid, titulo text, subtitulo text, destino text)
language sql stable security invoker set search_path = public
as $$
  select 'cliente', c.id, c.nome, c.cpf, '/clientes/edicao/' || c.id from clientes c
  where c.user_id = auth.uid() and (c.nome ilike '%' || termo || '%' or c.cpf like '%' || regexp_replace(termo, '\D', '', 'g') || '%')
  union all
  select 'processo', p.id, p.numero, p.cliente_nome, '/processos/editar/' || p.id from processos p
  where p.user_id = auth.uid() and regexp_replace(p.numero, '\D', '', 'g') like '%' || regexp_replace(termo, '\D', '', 'g') || '%'
  union all
  select 'prazo', z.id, z.titulo, z.processo_numero, '/prazos' from prazos z
  where z.user_id = auth.uid() and z.titulo ilike '%' || termo || '%'
  union all
  select 'movimentacao', m.id, m.titulo, m.tipo, '/processos/movimentacoes/' || m.processo_id from movimentacoes m
  where m.user_id = auth.uid() and (m.titulo ilike '%' || termo || '%' or coalesce(m.descricao, '') ilike '%' || termo || '%')
  union all
  select 'documento', d.id, d.nome, array_to_string(d.tags, ', '), '/documentos' from documentos_catalogo d
  where d.user_id = auth.uid() and d.excluido_em is null and (d.nome ilike '%' || termo || '%' or termo = any(d.tags));
$$;
