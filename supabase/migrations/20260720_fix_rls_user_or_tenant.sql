-- Fix: RLS policies agora permitem acesso via user_id direto OU via tenant (escritorio_id).
-- Isso garante que usuarios sem escritorio_id preenchido ainda consigam acessar seus dados.

-- Dropar policies antigas e recriar com OR
DO $$ 
DECLARE 
  t text;
  policy_name text;
BEGIN
  FOR t IN SELECT unnest(ARRAY['clientes','processos','prazos','document_templates','movimentacoes','eventos_agenda','lancamentos_financeiros','documentos_catalogo','notificacoes','cobrancas'])
  LOOP
    policy_name := CASE 
      WHEN t = 'lancamentos_financeiros' THEN 'tenant_isolation_financeiro'
      WHEN t = 'document_templates' THEN 'tenant_isolation_templates'
      ELSE 'tenant_isolation_' || t
    END;
    
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_name, t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL USING (auth.uid() = user_id OR escritorio_id IN (SELECT escritorio_id FROM public.escritorio_usuarios WHERE user_id = auth.uid())) WITH CHECK (auth.uid() = user_id)',
      policy_name, t
    );
  END LOOP;
END $$;
