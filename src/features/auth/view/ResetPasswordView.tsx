"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services";
import { NewPasswordSchema, ResetPasswordSchema } from "@/specs/schemas/auth.schema";

export function ResetPasswordView(): React.ReactNode {
  const [isRecovery, setIsRecovery] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsRecovery(window.location.hash.includes("type=recovery") || window.location.search.includes("type=recovery"));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const requestReset = async (): Promise<void> => {
    const parsed = ResetPasswordSchema.safeParse({ email });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "E-mail inválido"); return; }
    setLoading(true); setError(null); setMessage(null);
    try {
      await authService.resetPassword(parsed.data);
      setMessage("Enviamos um link de recuperação para o seu e-mail.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível enviar o link.");
    } finally { setLoading(false); }
  };

  const savePassword = async (): Promise<void> => {
    const parsed = NewPasswordSchema.safeParse({ senha, confirmarSenha });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Senha inválida"); return; }
    setLoading(true); setError(null);
    try {
      await authService.updatePassword(parsed.data.senha);
      setMessage("Senha atualizada com sucesso. Redirecionando...");
      setTimeout(() => router.replace("/login"), 1200);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível atualizar a senha.");
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-xl">
        <h1 className="text-2xl font-bold">{isRecovery ? "Criar nova senha" : "Recuperar senha"}</h1>
        <p className="mt-2 text-sm text-slate-300">{isRecovery ? "Informe e confirme sua nova senha." : "Enviaremos um link seguro para o seu e-mail."}</p>
        {error && <div role="alert" className="mt-5 rounded-xl bg-red-500/15 p-3 text-sm text-red-200">{error}</div>}
        {message && <div role="status" className="mt-5 rounded-xl bg-emerald-500/15 p-3 text-sm text-emerald-200">{message}</div>}
        <div className="mt-6 space-y-4">
          {isRecovery ? <>
            <input aria-label="Nova senha" type="password" value={senha} onChange={(event) => setSenha(event.target.value)} placeholder="Nova senha" className="w-full rounded-xl bg-white/10 px-4 py-3 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-primary" />
            <input aria-label="Confirmar nova senha" type="password" value={confirmarSenha} onChange={(event) => setConfirmarSenha(event.target.value)} placeholder="Confirmar nova senha" className="w-full rounded-xl bg-white/10 px-4 py-3 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-primary" />
            <button type="button" disabled={loading} onClick={() => { void savePassword(); }} className="w-full rounded-xl bg-primary px-4 py-3 font-bold disabled:opacity-50">{loading ? "Salvando..." : "Salvar nova senha"}</button>
          </> : <>
            <input aria-label="E-mail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="seu@email.com" className="w-full rounded-xl bg-white/10 px-4 py-3 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-primary" />
            <button type="button" disabled={loading} onClick={() => { void requestReset(); }} className="w-full rounded-xl bg-primary px-4 py-3 font-bold disabled:opacity-50">{loading ? "Enviando..." : "Enviar link"}</button>
          </>}
        </div>
        <Link href="/login" className="mt-6 inline-block text-sm text-blue-300 hover:text-blue-200">Voltar ao login</Link>
      </div>
    </main>
  );
}
