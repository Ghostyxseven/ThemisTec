"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scale, Building2, ArrowRight } from "lucide-react";

export default function OnboardingPage(): React.ReactElement {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!nome.trim() || nome.trim().length < 2) {
      setError("O nome do escritório deve ter pelo menos 2 caracteres.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/escritorio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome.trim() }),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error || "Erro ao salvar");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-[480px] px-6 py-12">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-black/50 rounded-3xl p-8 sm:p-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg mb-6 ring-1 ring-white/20">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              Bem-vindo ao ThemisTec! 🎉
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Para começar, dê um nome ao seu escritório. Você será o administrador e poderá convidar outros membros depois.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-6">
            <div>
              <label htmlFor="nome-escritorio" className="block text-sm font-medium text-slate-200 mb-2">
                Nome do Escritório
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Building2 className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="nome-escritorio"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Advocacia Silva & Associados"
                  autoFocus
                  disabled={loading}
                  className="block w-full rounded-xl border-0 bg-white/5 py-3.5 pl-12 pr-4 text-white shadow-inner ring-1 ring-inset ring-white/10 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all hover:bg-white/10 hover:ring-white/20 disabled:opacity-50"
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Você poderá alterar isso depois nas configurações.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !nome.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Criando...
                </>
              ) : (
                <>
                  Começar a usar
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </main>
  );
}
