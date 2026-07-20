import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET || "sua_chave_secreta_padrao_para_desenvolvimento");
const protectedPrefixes = ["/dashboard", "/clientes", "/processos", "/prazos", "/perfil", "/configuracoes", "/agenda", "/financeiro", "/documentos", "/onboarding", "/admin"];

export async function proxy(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  // Lógica do portal
  if (pathname.startsWith('/portal/dashboard')) {
    const token = request.cookies.get('portal_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/portal', request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return response;
    } catch {
      return NextResponse.redirect(new URL('/portal', request.url));
    }
  }

  // Lógica de proteção do Supabase Auth para as rotas internas da aplicação
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (items) => {
        items.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        items.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  if (!user && isProtected) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se o usuário está logado e acessando rotas protegidas, verificar se precisa de onboarding
  if (user && isProtected && !pathname.startsWith("/onboarding")) {
    const { data: vinculo } = await supabase
      .from("escritorio_usuarios")
      .select("escritorio_id, papel")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (vinculo) {
      const { data: escritorio } = await supabase
        .from("escritorios")
        .select("nome")
        .eq("id", vinculo.escritorio_id)
        .single();

      if (escritorio && escritorio.nome === "Escritorio Padrao") {
        const onboardingUrl = request.nextUrl.clone();
        onboardingUrl.pathname = "/onboarding";
        return NextResponse.redirect(onboardingUrl);
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*\\\\.js).*)"],
};
