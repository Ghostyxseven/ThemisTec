-- Adicionar colunas que existem no schema Zod mas não na tabela
ALTER TABLE public.movimentacoes ADD COLUMN IF NOT EXISTS origem_captura text NOT NULL DEFAULT 'manual';
ALTER TABLE public.movimentacoes ADD COLUMN IF NOT EXISTS id_integracao text;
