-- Fix: escritorio_usuarios tinha policy auto-referenciante causando recursao infinita (500).
-- A policy agora usa simplesmente user_id = auth.uid() sem subquery.

DROP POLICY IF EXISTS "tenant_isolation_escritorio_usuarios" ON public.escritorio_usuarios;
CREATE POLICY "escritorio_usuarios_own" ON public.escritorio_usuarios FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "tenant_isolation_escritorios" ON public.escritorios;
CREATE POLICY "escritorios_member" ON public.escritorios FOR ALL
  USING (id IN (SELECT escritorio_id FROM public.escritorio_usuarios WHERE user_id = auth.uid()))
  WITH CHECK (id IN (SELECT escritorio_id FROM public.escritorio_usuarios WHERE user_id = auth.uid()));
