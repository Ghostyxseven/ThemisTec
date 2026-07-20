-- Adicionar coluna plano conforme OrganizacaoSchema (FREE | PRO | ENTERPRISE)
ALTER TABLE public.escritorios
  ADD COLUMN IF NOT EXISTS plano text NOT NULL DEFAULT 'FREE'
  CHECK (plano IN ('FREE', 'PRO', 'ENTERPRISE'));
