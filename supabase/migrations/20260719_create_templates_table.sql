CREATE TABLE IF NOT EXISTS public.document_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem ver seus próprios templates" ON public.document_templates;
CREATE POLICY "Usuários podem ver seus próprios templates" 
ON public.document_templates FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem inserir seus próprios templates" ON public.document_templates;
CREATE POLICY "Usuários podem inserir seus próprios templates" 
ON public.document_templates FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar seus próprios templates" ON public.document_templates;
CREATE POLICY "Usuários podem deletar seus próprios templates" 
ON public.document_templates FOR DELETE 
USING (auth.uid() = user_id);
