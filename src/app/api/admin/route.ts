import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/services/supabase/supabase.server";

// Super admin email - only this user can access admin APIs
const SUPER_ADMIN_EMAIL = "cardosomicael245@gmail.com";

async function verifySuperAdmin(): Promise<{ authorized: boolean; error?: NextResponse }> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== SUPER_ADMIN_EMAIL) {
    return { authorized: false, error: NextResponse.json({ error: "Acesso negado" }, { status: 403 }) };
  }
  return { authorized: true };
}

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET: listar escritórios e advogados
export async function GET(request: Request): Promise<NextResponse> {
  const { authorized, error } = await verifySuperAdmin();
  if (!authorized) return error!;

  const admin = getAdminClient();
  const url = new URL(request.url);
  const tipo = url.searchParams.get("tipo") || "escritorios";

  if (tipo === "escritorios") {
    const { data: escritorios } = await admin.from("escritorios").select("*").order("criado_em", { ascending: false });
    
    // Enriquecer com contagem de membros
    const result = await Promise.all(
      (escritorios || []).map(async (e) => {
        const { count } = await admin.from("escritorio_usuarios").select("id", { count: "exact", head: true }).eq("escritorio_id", e.id);
        return { ...e, total_membros: count || 0 };
      })
    );
    
    return NextResponse.json({ escritorios: result });
  }

  if (tipo === "advogados") {
    const escritorioId = url.searchParams.get("escritorio_id");
    
    let query = admin.from("escritorio_usuarios").select("id, user_id, papel, escritorio_id, criado_em");
    if (escritorioId) query = query.eq("escritorio_id", escritorioId);
    
    const { data: vinculos } = await query.order("criado_em", { ascending: false });
    
    // Enriquecer com email e nome
    const advogados = await Promise.all(
      (vinculos || []).map(async (v) => {
        const { data: { user } } = await admin.auth.admin.getUserById(v.user_id);
        const { data: esc } = await admin.from("escritorios").select("nome").eq("id", v.escritorio_id).single();
        return {
          ...v,
          email: user?.email || "?",
          nome: (user?.user_metadata as { display_name?: string })?.display_name || user?.email?.split("@")[0] || "?",
          escritorio_nome: esc?.nome || "?",
        };
      })
    );
    
    return NextResponse.json({ advogados });
  }

  return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
}

// POST: criar escritório ou advogado
export async function POST(request: Request): Promise<NextResponse> {
  const { authorized, error } = await verifySuperAdmin();
  if (!authorized) return error!;

  const admin = getAdminClient();
  const body = await request.json() as { acao: string; [key: string]: unknown };

  // Criar escritório
  if (body.acao === "criar_escritorio") {
    const nome = body.nome as string;
    if (!nome || nome.trim().length < 2) {
      return NextResponse.json({ error: "Nome do escritório é obrigatório (min 2 caracteres)" }, { status: 400 });
    }

    const { data, error: err } = await admin.from("escritorios").insert({ nome: nome.trim() }).select().single();
    if (err) return NextResponse.json({ error: err.message }, { status: 500 });

    return NextResponse.json({ success: true, escritorio: data });
  }

  // Criar advogado (usuário) e vincular a um escritório
  if (body.acao === "criar_advogado") {
    const email = body.email as string;
    const nome = body.nome as string;
    const senha = body.senha as string;
    const escritorioId = body.escritorio_id as string;
    const papel = (body.papel as string) || "membro";

    if (!email || !nome || !senha || !escritorioId) {
      return NextResponse.json({ error: "Campos obrigatórios: email, nome, senha, escritorio_id" }, { status: 400 });
    }

    if (senha.length < 6) {
      return NextResponse.json({ error: "Senha deve ter pelo menos 6 caracteres" }, { status: 400 });
    }

    // Verificar se escritório existe
    const { data: esc } = await admin.from("escritorios").select("id").eq("id", escritorioId).single();
    if (!esc) return NextResponse.json({ error: "Escritório não encontrado" }, { status: 404 });

    // Criar usuário no Supabase Auth
    const { data: newUser, error: authErr } = await admin.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password: senha,
      email_confirm: true, // já confirma o email direto
      user_metadata: { display_name: nome.trim() },
    });

    if (authErr) {
      if (authErr.message.includes("already been registered")) {
        return NextResponse.json({ error: "Já existe um usuário com este e-mail" }, { status: 409 });
      }
      return NextResponse.json({ error: authErr.message }, { status: 500 });
    }

    // Vincular ao escritório
    const { error: vincErr } = await admin.from("escritorio_usuarios").insert({
      escritorio_id: escritorioId,
      user_id: newUser.user.id,
      papel: papel,
    });

    if (vincErr) {
      // Rollback: deletar usuário criado
      await admin.auth.admin.deleteUser(newUser.user.id);
      return NextResponse.json({ error: "Erro ao vincular advogado ao escritório" }, { status: 500 });
    }

    return NextResponse.json({ success: true, advogado: { id: newUser.user.id, email, nome, escritorio_id: escritorioId, papel } });
  }

  return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
}

// DELETE: remover advogado ou escritório
export async function DELETE(request: Request): Promise<NextResponse> {
  const { authorized, error } = await verifySuperAdmin();
  if (!authorized) return error!;

  const admin = getAdminClient();
  const body = await request.json() as { acao: string; id: string };

  if (body.acao === "remover_advogado") {
    // Remove vínculo (não deleta o usuário, só desvincula)
    const { error: err } = await admin.from("escritorio_usuarios").delete().eq("id", body.id);
    if (err) return NextResponse.json({ error: err.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (body.acao === "remover_escritorio") {
    // Remove escritório (cascade remove vínculos)
    const { error: err } = await admin.from("escritorios").delete().eq("id", body.id);
    if (err) return NextResponse.json({ error: err.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
}
