import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET || "");
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "";
const protectedPrefixes = ["/dashboard", "/clientes", "/processos", "/prazos", "/perfil", "/configuracoes", "/agenda", "/financeiro", "/documentos", "/admin"];

export async function proxy(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  // Bloquear registro público — só admin cria contas
  if (pathname === "/register") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Portal do cliente (autenticação via JWT customizado)
  if (pathname.startsWith("/portal/dashboard")) {
    const token = request.cookies.get("portal_token")?.value;
    if (!token) return NextResponse.redirect(new URL("/portal", request.url));
    try {
      await jwtVerify(token, JWT_SECRET);
      return response;
    } catch {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
  }

  // Proteção via Supabase Auth para rotas internas
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

  // Redirecionar para login se não autenticado
  if (!user && isProtected) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Proteger rota /admin — apenas super admin pode acessar
  if (user && pathname.startsWith("/admin")) {
    if (user.email !== SUPER_ADMIN_EMAIL) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*\\\\.js).*)"],
};
