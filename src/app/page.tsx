import { redirect } from "next/navigation";

/**
 * Rota raiz — redireciona para /dashboard.
 * O middleware de autenticação interceptará se o usuário não estiver logado
 * e fará o redirecionamento para /login se necessário.
 */
export default function RootPage(): never {
  redirect("/dashboard");
}
