-- Ativar RLS em tabelas centrais (garantia caso ainda não estejam ativadas)
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processos ENABLE ROW LEVEL SECURITY;

-- Limpar políticas antigas (se existirem, para evitar redundâncias)
DROP POLICY IF EXISTS "Usuários podem acessar seus próprios clientes" ON public.clientes;
DROP POLICY IF EXISTS "Usuários podem acessar seus próprios processos" ON public.processos;

-- Políticas de CLIENTES (Isolamento total por user_id)
CREATE POLICY "Clientes: select_own" ON public.clientes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Clientes: insert_own" ON public.clientes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Clientes: update_own" ON public.clientes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Clientes: delete_own" ON public.clientes FOR DELETE USING (auth.uid() = user_id);

-- Políticas de PROCESSOS (Isolamento total por user_id)
CREATE POLICY "Processos: select_own" ON public.processos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Processos: insert_own" ON public.processos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Processos: update_own" ON public.processos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Processos: delete_own" ON public.processos FOR DELETE USING (auth.uid() = user_id);
