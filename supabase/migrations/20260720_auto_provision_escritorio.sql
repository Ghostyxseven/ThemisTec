-- Auto-provisionar escritório para novos usuários ao se registrar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE new_escritorio_id uuid;
BEGIN
  INSERT INTO public.escritorios (nome) VALUES ('Escritorio Padrao') RETURNING id INTO new_escritorio_id;
  INSERT INTO public.escritorio_usuarios (escritorio_id, user_id, papel) VALUES (new_escritorio_id, NEW.id, 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
