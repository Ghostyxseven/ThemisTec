-- Criar tabela de cobrancas
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.cobrancas (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    processo_id uuid REFERENCES public.processos(id) ON DELETE CASCADE,
    cliente_id uuid REFERENCES public.clientes(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    gateway_id text,
    valor numeric(10,2) NOT NULL,
    vencimento date NOT NULL,
    status text NOT NULL DEFAULT 'PENDENTE',
    link_pagamento text,
    payload_gateway jsonb,
    criado_em timestamptz DEFAULT now(),
    atualizado_em timestamptz DEFAULT now()
);

-- Ativar RLS
ALTER TABLE public.cobrancas ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para Advogados (donos do registro)
CREATE POLICY "Advogados podem ver suas próprias cobranças" 
    ON public.cobrancas FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Advogados podem inserir cobranças" 
    ON public.cobrancas FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Advogados podem atualizar suas próprias cobranças" 
    ON public.cobrancas FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Advogados podem deletar suas próprias cobranças" 
    ON public.cobrancas FOR DELETE 
    USING (auth.uid() = user_id);

-- Para simplificar o acesso local pelo backend e Portal do Cliente sem o Supabase Auth (via JWT customizado)
-- não definiremos uma policy estrita para clientes aqui pois o backend (via API) acessará usando Service Role Key
-- garantindo a integridade via código (adapter).

-- Trigger para atualizar `atualizado_em`
DROP TRIGGER IF EXISTS update_cobrancas_modtime ON public.cobrancas;
CREATE TRIGGER update_cobrancas_modtime
BEFORE UPDATE ON public.cobrancas
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();
