import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/services/supabase/supabase.server";
import { createClient } from "@supabase/supabase-js";

// GET: retorna dados do escritório do usuário logado
export async function GET(): Promise<NextResponse> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  // Buscar escritório do usuário
  const { data: vinculo } = await supabase
    .from("escritorio_usuarios")
    .select("escritorio_id, papel")
    .eq("user_id", user.id)
    .single();

  if (!vinculo) return NextResponse.json({ error: "Escritório não encontrado" }, { status: 404 });

  const { data: escritorio } = await supabase
    .from("escritorios")
    .select("id, nome, plano, criado_em")
    .eq("id", vinculo.escritorio_id)
    .single();

  // Buscar membros com email (via service role para acessar auth.users)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: membros } = await supabaseAdmin
    .from("escritorio_usuarios")
    .select("id, user_id, papel, criado_em")
    .eq("escritorio_id", vinculo.escritorio_id);

  // Enriquecer com emails
  const membrosComEmail = await Promise.all(
    (membros || []).map(async (m) => {
      const { data: { user: u } } = await supabaseAdmin.auth.admin.getUserById(m.user_id);
      return { ...m, email: u?.email || "desconhecido" };
    })
  );

  return NextResponse.json({
    escritorio,
    papel: vinculo.papel,
    membros: membrosComEmail,
  });
}

// PATCH: renomear escritório
export async function PATCH(request: Request): Promise<NextResponse> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json() as { nome?: string };
  if (!body.nome || body.nome.trim().length < 2) {
    return NextResponse.json({ error: "Nome deve ter pelo menos 2 caracteres" }, { status: 400 });
  }

  // Verificar se é admin
  const { data: vinculo } = await supabase
    .from("escritorio_usuarios")
    .select("escritorio_id, papel")
    .eq("user_id", user.id)
    .single();

  if (!vinculo || vinculo.papel !== "admin") {
    return NextResponse.json({ error: "Apenas administradores podem renomear o escritório" }, { status: 403 });
  }

  // Usar service role para update (bypass RLS para segurança)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin
    .from("escritorios")
    .update({ nome: body.nome.trim() })
    .eq("id", vinculo.escritorio_id);

  if (error) return NextResponse.json({ error: "Erro ao renomear escritório" }, { status: 500 });

  return NextResponse.json({ success: true });
}

// POST: convidar membro por email
export async function POST(request: Request): Promise<NextResponse> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json() as { email?: string };
  if (!body.email || !body.email.includes("@")) {
    return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
  }

  // Verificar se é admin
  const { data: vinculo } = await supabase
    .from("escritorio_usuarios")
    .select("escritorio_id, papel")
    .eq("user_id", user.id)
    .single();

  if (!vinculo || vinculo.papel !== "admin") {
    return NextResponse.json({ error: "Apenas administradores podem convidar membros" }, { status: 403 });
  }

  // Buscar usuário por email (precisa service role)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Listar usuários e filtrar por email
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 });

  const targetUser = users.find(u => u.email === body.email!.toLowerCase().trim());
  if (!targetUser) {
    return NextResponse.json({ error: "Nenhum usuário encontrado com este e-mail. O usuário precisa criar uma conta primeiro." }, { status: 404 });
  }

  // Verificar se já é membro
  const { data: existing } = await supabaseAdmin
    .from("escritorio_usuarios")
    .select("id")
    .eq("escritorio_id", vinculo.escritorio_id)
    .eq("user_id", targetUser.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Este usuário já é membro do escritório" }, { status: 409 });
  }

  // Criar vínculo
  const { error: insertError } = await supabaseAdmin
    .from("escritorio_usuarios")
    .insert({
      escritorio_id: vinculo.escritorio_id,
      user_id: targetUser.id,
      papel: "membro",
    });

  if (insertError) {
    return NextResponse.json({ error: "Erro ao adicionar membro" }, { status: 500 });
  }

  return NextResponse.json({ success: true, email: targetUser.email });
}
