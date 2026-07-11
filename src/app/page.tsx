import { redirect } from "next/navigation";

/**
 * Rota raiz — redireciona para /login.
 * O middleware de autenticação (a ser implementado) redireciona
 * usuários autenticados diretamente para /dashboard.
 */
export default function RootPage(): never {
  redirect("/login");
}
