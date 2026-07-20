-- 1. Adicionar escritorio_id nas tabelas que faltaram na migration anterior
ALTER TABLE public.movimentacoes ADD COLUMN IF NOT EXISTS escritorio_id uuid REFERENCES public.escritorios(id) ON DELETE RESTRICT;
ALTER TABLE public.eventos_agenda ADD COLUMN IF NOT EXISTS escritorio_id uuid REFERENCES public.escritorios(id) ON DELETE RESTRICT;
ALTER TABLE public.lancamentos_financeiros ADD COLUMN IF NOT EXISTS escritorio_id uuid REFERENCES public.escritorios(id) ON DELETE RESTRICT;
ALTER TABLE public.documentos_catalogo ADD COLUMN IF NOT EXISTS escritorio_id uuid REFERENCES public.escritorios(id) ON DELETE RESTRICT;

-- 2. Função para auto-injetar escritorio_id baseado na sessão atual
CREATE OR REPLACE FUNCTION set_tenant_id()
RETURNS TRIGGER AS $$
DECLARE
  active_tenant uuid;
BEGIN
  IF NEW.escritorio_id IS NOT NULL THEN
    RETURN NEW;
  END IF;

  SELECT escritorio_id INTO active_tenant
  FROM public.escritorio_usuarios
  WHERE user_id = auth.uid()
  ORDER BY criado_em ASC
  LIMIT 1;

  IF active_tenant IS NOT NULL THEN
    NEW.escritorio_id := active_tenant;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Atribuir a trigger nas tabelas necessárias
DROP TRIGGER IF EXISTS trg_set_tenant_id_clientes ON public.clientes;
CREATE TRIGGER trg_set_tenant_id_clientes BEFORE INSERT ON public.clientes FOR EACH ROW EXECUTE FUNCTION set_tenant_id();

DROP TRIGGER IF EXISTS trg_set_tenant_id_processos ON public.processos;
CREATE TRIGGER trg_set_tenant_id_processos BEFORE INSERT ON public.processos FOR EACH ROW EXECUTE FUNCTION set_tenant_id();

DROP TRIGGER IF EXISTS trg_set_tenant_id_prazos ON public.prazos;
CREATE TRIGGER trg_set_tenant_id_prazos BEFORE INSERT ON public.prazos FOR EACH ROW EXECUTE FUNCTION set_tenant_id();

DROP TRIGGER IF EXISTS trg_set_tenant_id_templates ON public.document_templates;
CREATE TRIGGER trg_set_tenant_id_templates BEFORE INSERT ON public.document_templates FOR EACH ROW EXECUTE FUNCTION set_tenant_id();

DROP TRIGGER IF EXISTS trg_set_tenant_id_movimentacoes ON public.movimentacoes;
CREATE TRIGGER trg_set_tenant_id_movimentacoes BEFORE INSERT ON public.movimentacoes FOR EACH ROW EXECUTE FUNCTION set_tenant_id();

DROP TRIGGER IF EXISTS trg_set_tenant_id_eventos_agenda ON public.eventos_agenda;
CREATE TRIGGER trg_set_tenant_id_eventos_agenda BEFORE INSERT ON public.eventos_agenda FOR EACH ROW EXECUTE FUNCTION set_tenant_id();

DROP TRIGGER IF EXISTS trg_set_tenant_id_lancamentos ON public.lancamentos_financeiros;
CREATE TRIGGER trg_set_tenant_id_lancamentos BEFORE INSERT ON public.lancamentos_financeiros FOR EACH ROW EXECUTE FUNCTION set_tenant_id();

-- 4. Atualizar RLS para usar Tenant-Isolation nas novas colunas
DROP POLICY IF EXISTS "movimentacoes_owner_all" ON public.movimentacoes;
CREATE POLICY "tenant_isolation_movimentacoes" ON public.movimentacoes FOR ALL 
USING (escritorio_id IN (SELECT escritorio_id FROM public.escritorio_usuarios WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "eventos_owner_all" ON public.eventos_agenda;
CREATE POLICY "tenant_isolation_eventos_agenda" ON public.eventos_agenda FOR ALL 
USING (escritorio_id IN (SELECT escritorio_id FROM public.escritorio_usuarios WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "financeiro_owner_all" ON public.lancamentos_financeiros;
CREATE POLICY "tenant_isolation_financeiro" ON public.lancamentos_financeiros FOR ALL 
USING (escritorio_id IN (SELECT escritorio_id FROM public.escritorio_usuarios WHERE user_id = auth.uid()));
