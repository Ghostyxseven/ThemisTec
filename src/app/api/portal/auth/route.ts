import { NextResponse } from "next/server";
import { SupabasePortalAdapter } from "@/features/portal-cliente/model/SupabasePortalAdapter";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET || "sua_chave_secreta_padrao_para_desenvolvimento");

export async function POST(request: Request) {
  try {
    const { cpf, dataNascimento } = await request.json();

    if (!cpf || !dataNascimento) {
      return NextResponse.json({ error: "CPF e Data de Nascimento são obrigatórios." }, { status: 400 });
    }

    const adapter = new SupabasePortalAdapter();
    const cliente = await adapter.autenticar(cpf, dataNascimento);

    const token = await new SignJWT({
      sub: cliente.id,
      role: "portal_cliente",
      nome: cliente.nome,
      advogadoId: cliente.userId,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    const response = NextResponse.json({ sucesso: true, cliente });
    
    response.cookies.set("portal_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 horas
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
