import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import type { IAuthService, AuthUser } from "@/shared/interfaces/IAuthService";
import type { LoginInput, RegisterInput, ResetPasswordInput } from "@/specs/schemas/auth.schema";
import { supabaseClient } from "@/services/supabase/supabase.client";

function mapUser(user: User | null): AuthUser | null {
  if (!user) return null;
  const metadata: unknown = user.user_metadata;
  const name = typeof metadata === "object" && metadata !== null && "display_name" in metadata
    ? (metadata as { display_name?: unknown }).display_name
    : undefined;
  return { id: user.id, email: user.email ?? null, displayName: typeof name === "string" ? name : null };
}

function authError(message: string): Error {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) return new Error("E-mail ou senha incorretos.");
  if (normalized.includes("already registered") || normalized.includes("already been registered")) return new Error("Este e-mail já está cadastrado.");
  if (normalized.includes("password")) return new Error("A senha fornecida não atende aos requisitos de segurança.");
  if (normalized.includes("email not confirmed")) return new Error("Por favor, confirme seu e-mail através do link que enviamos antes de fazer login.");
  
  console.error("Supabase Auth Error:", message);
  return new Error("Falha na autenticação. Tente novamente mais tarde.");
}

export class SupabaseAuthAdapter implements IAuthService {
  public async login(dados: LoginInput): Promise<void> {
    const { error } = await supabaseClient.auth.signInWithPassword({ email: dados.email, password: dados.senha });
    if (error) throw authError(error.message);
  }

  public async register(dados: RegisterInput): Promise<void> {
    const { error } = await supabaseClient.auth.signUp({
      email: dados.email,
      password: dados.senha,
      options: { data: { display_name: dados.nome } },
    });
    if (error) throw authError(error.message);
  }

  public async resetPassword(dados: ResetPasswordInput): Promise<void> {
    const redirectTo = typeof window === "undefined" ? undefined : `${window.location.origin}/reset-password`;
    const { error } = await supabaseClient.auth.resetPasswordForEmail(dados.email, { redirectTo });
    if (error) throw authError(error.message);
  }

  public async logout(): Promise<void> {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw new Error("Não foi possível encerrar a sessão.");
  }

  public async updatePassword(password: string): Promise<void> {
    const { error } = await supabaseClient.auth.updateUser({ password });
    if (error) throw authError(error.message);
  }

  public async waitForAuth(): Promise<string | null> {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) return null;
    return data.session?.user.id ?? null;
  }

  public async getCurrentUser(): Promise<AuthUser | null> {
    const { data, error } = await supabaseClient.auth.getUser();
    if (error) return null;
    return mapUser(data.user);
  }

  public async updateDisplayName(displayName: string): Promise<void> {
    const { error } = await supabaseClient.auth.updateUser({ data: { display_name: displayName } });
    if (error) throw new Error("Erro ao atualizar perfil.");
  }

  public onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    const { data } = supabaseClient.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      callback(mapUser(session?.user ?? null));
    });
    void this.getCurrentUser().then(callback);
    return () => data.subscription.unsubscribe();
  }
}
