-- Migration: Consolidar RLS policies pós multi-tenancy
-- Remove redundância user_id vs tenant_id e migra tabelas que ficaram de fora.

-- ============================================================
-- 1. REMOVER POLICIES REDUNDANTES em clientes e processos
--    A migration 20260719_harden_rls_policies adicionou policies user_id-based
--    SOBRE as tenant-based. Com escritorio_id + tenant triggers, bastam as tenant.
-- ============================================================

DROP POLICY IF EXISTS "Clientes: select_own" ON public.clientes;
DROP POLICY IF EXISTS "Clientes: insert_own" ON public.clientes;
DROP POLICY IF EXISTS "Clientes: update_own" ON public.clientes;
DROP POLICY IF EXISTS "Clientes: delete_own" ON public.clientes;

DROP POLICY IF EXISTS "Processos: select_own" ON public.processos;
DROP POLICY IF EXISTS "Processos: insert_own" ON public.processos;
DROP POLICY IF EXISTS "Processos: update_own" ON public.processos;
DROP POLICY IF EXISTS "Processos: delete_own" ON public.processos;

-- ============================================================
-- 2. MIGRAR documentos_catalogo PARA tenant isolation
-- ============================================================
ALTER TABLE public.documentos_catalogo ADD COLUMN IF NOT EXISTS escritorio_id uuid REFERENCES public.escritorios(id) ON DELETE RESTRICT;

-- Backfill: preencher escritorio_id nos registros existentes
UPDATE public.documentos_catalogo dc
SET escritorio_id = eu.escritorio_id
FROM public.escritorio_usuarios eu
WHERE dc.user_id = eu.user_id AND dc.escritorio_id IS NULL;

-- Substituir policy
DROP POLICY IF EXISTS "documentos_catalogo_owner_all" ON public.documentos_catalogo;
CREATE POLICY "tenant_isolation_documentos_catalogo" ON public.documentos_catalogo FOR ALL
USING (escritorio_id IN (SELECT escritorio_id FROM public.escritorio_usuarios WHERE user_id = auth.uid()));

-- Trigger auto-inject
DROP TRIGGER IF EXISTS trg_set_tenant_id_documentos_catalogo ON public.documentos_catalogo;
CREATE TRIGGER trg_set_tenant_id_documentos_catalogo BEFORE INSERT ON public.documentos_catalogo FOR EACH ROW EXECUTE FUNCTION set_tenant_id();

-- ============================================================
-- 3. MIGRAR notificacoes PARA tenant isolation
-- ============================================================
ALTER TABLE public.notificacoes ADD COLUMN IF NOT EXISTS escritorio_id uuid REFERENCES public.escritorios(id) ON DELETE RESTRICT;

UPDATE public.notificacoes n
SET escritorio_id = eu.escritorio_id
FROM public.escritorio_usuarios eu
WHERE n.user_id = eu.user_id AND n.escritorio_id IS NULL;

DROP POLICY IF EXISTS "notificacoes_owner_all" ON public.notificacoes;
CREATE POLICY "tenant_isolation_notificacoes" ON public.notificacoes FOR ALL
USING (escritorio_id IN (SELECT escritorio_id FROM public.escritorio_usuarios WHERE user_id = auth.uid()));

DROP TRIGGER IF EXISTS trg_set_tenant_id_notificacoes ON public.notificacoes;
CREATE TRIGGER trg_set_tenant_id_notificacoes BEFORE INSERT ON public.notificacoes FOR EACH ROW EXECUTE FUNCTION set_tenant_id();

-- ============================================================
-- 4. MIGRAR cobrancas PARA tenant isolation
-- ============================================================
ALTER TABLE public.cobrancas ADD COLUMN IF NOT EXISTS escritorio_id uuid REFERENCES public.escritorios(id) ON DELETE RESTRICT;

UPDATE public.cobrancas c
SET escritorio_id = eu.escritorio_id
FROM public.escritorio_usuarios eu
WHERE c.user_id = eu.user_id AND c.escritorio_id IS NULL;

DROP POLICY IF EXISTS "Advogados podem ver suas próprias cobranças" ON public.cobrancas;
DROP POLICY IF EXISTS "Advogados podem inserir cobranças" ON public.cobrancas;
DROP POLICY IF EXISTS "Advogados podem atualizar suas próprias cobranças" ON public.cobrancas;
DROP POLICY IF EXISTS "Advogados podem deletar suas próprias cobranças" ON public.cobrancas;

CREATE POLICY "tenant_isolation_cobrancas" ON public.cobrancas FOR ALL
USING (escritorio_id IN (SELECT escritorio_id FROM public.escritorio_usuarios WHERE user_id = auth.uid()));

DROP TRIGGER IF EXISTS trg_set_tenant_id_cobrancas ON public.cobrancas;
CREATE TRIGGER trg_set_tenant_id_cobrancas BEFORE INSERT ON public.cobrancas FOR EACH ROW EXECUTE FUNCTION set_tenant_id();

-- ============================================================
-- 5. preferencias_notificacao permanece user_id (é pessoal, não compartilhada)
-- ============================================================
