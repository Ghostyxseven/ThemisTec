-- Criação da Tabela Financeira
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

create table if not exists public.financeiro (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  escritorio_id uuid not null references public.escritorios(id) on delete cascade,
  processo_id uuid references public.processos(id) on delete set null,
  cliente_id uuid references public.clientes(id) on delete set null,
  
  descricao text not null,
  valor numeric(12, 2) not null,
  tipo text not null check (tipo in ('RECEITA', 'DESPESA')),
  status text not null default 'PENDENTE' check (status in ('PENDENTE', 'PAGO', 'CANCELADO')),
  
  data_vencimento date not null,
  data_pagamento date,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- Habilitar RLS
alter table public.financeiro enable row level security;

-- Política RLS: Isolamento por Tenant (escritorio_id)
create policy "tenant_isolation_financeiro" on public.financeiro for all 
using (escritorio_id in (select escritorio_id from public.escritorio_usuarios where user_id = auth.uid()));

-- Gatilho de update (atualizado_em)
drop trigger if exists handle_updated_at_financeiro on public.financeiro;
create trigger handle_updated_at_financeiro before update on public.financeiro
  for each row execute function public.update_modified_column();
