-- A tabela 'financeiro' é redundante com 'lancamentos_financeiros' (schema mais completo).
-- Remove trigger, policies e tabela.

DROP TRIGGER IF EXISTS handle_updated_at_financeiro ON public.financeiro;
DROP POLICY IF EXISTS "tenant_isolation_financeiro" ON public.financeiro;
DROP TABLE IF EXISTS public.financeiro;
