"use client";

import { useEffect, useState, useCallback } from "react";
import { Building2, UserPlus, Users, Crown, AlertCircle, CheckCircle2 } from "lucide-react";

interface Membro {
  id: string;
  user_id: string;
  email: string;
  papel: string;
  criado_em: string;
}

interface Escritorio {
  id: string;
  nome: string;
  plano: string;
  criado_em: string;
}

export default function EquipePage(): React.ReactElement {
  const [escritorio, setEscritorio] = useState<Escritorio | null>(null);
  const [membros, setMembros] = useState<Membro[]>([]);
  const [papel, setPapel] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [emailConvite, setEmailConvite] = useState("");
  const [nomeEscritorio, setNomeEscritorio] = useState("");
  const [editandoNome, setEditandoNome] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadDados = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch("/api/escritorio");
      if (!res.ok) throw new Error("Erro ao carregar dados");
      const data = await res.json() as { escritorio: Escritorio; papel: string; membros: Membro[] };
      setEscritorio(data.escritorio);
      setPapel(data.papel);
      setMembros(data.membros);
      setNomeEscritorio(data.escritorio.nome);
    } catch {
      setMensagem({ tipo: "erro", texto: "Erro ao carregar dados do escritório." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDados();
  }, [loadDados]);

  const handleRenomear = async (): Promise<void> => {
    if (!nomeEscritorio.trim() || nomeEscritorio.trim().length < 2) {
      setMensagem({ tipo: "erro", texto: "Nome deve ter pelo menos 2 caracteres." });
      return;
    }
    setSubmitting(true);
    setMensagem(null);
    try {
      const res = await fetch("/api/escritorio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nomeEscritorio.trim() }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error || "Erro ao renomear");
      setEscritorio(prev => prev ? { ...prev, nome: nomeEscritorio.trim() } : prev);
      setEditandoNome(false);
      setMensagem({ tipo: "sucesso", texto: "Nome do escritório atualizado!" });
    } catch (e) {
      setMensagem({ tipo: "erro", texto: e instanceof Error ? e.message : "Erro ao renomear" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConvidar = async (): Promise<void> => {
    if (!emailConvite.trim() || !emailConvite.includes("@")) {
      setMensagem({ tipo: "erro", texto: "Digite um e-mail válido." });
      return;
    }
    setSubmitting(true);
    setMensagem(null);
    try {
      const res = await fetch("/api/escritorio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailConvite.trim() }),
      });
      const data = await res.json() as { error?: string; email?: string };
      if (!res.ok) throw new Error(data.error || "Erro ao convidar");
      setEmailConvite("");
      setMensagem({ tipo: "sucesso", texto: `Membro ${data.email} adicionado com sucesso!` });
      void loadDados();
    } catch (e) {
      setMensagem({ tipo: "erro", texto: e instanceof Error ? e.message : "Erro ao convidar" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 px-4 py-8 md:px-8 lg:px-10">
        <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 py-8 md:px-8 lg:px-10">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">

        {/* Header */}
        <div>
          <h1 className="page-title">Escritório</h1>
          <p className="page-subtitle">Gerencie o nome e os membros da sua equipe</p>
        </div>

        {/* Mensagem de feedback */}
        {mensagem && (
          <div
            role="alert"
            className={`rounded-xl px-4 py-3 text-sm flex items-center gap-3 ${
              mensagem.tipo === "sucesso"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {mensagem.tipo === "sucesso" ? (
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
            )}
            {mensagem.texto}
          </div>
        )}

        {/* Card: Nome do Escritório */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">Nome do Escritório</h2>
          </div>

          {editandoNome ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={nomeEscritorio}
                onChange={(e) => setNomeEscritorio(e.target.value)}
                placeholder="Nome do escritório"
                className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                disabled={submitting}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => void handleRenomear()}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? "Salvando..." : "Salvar"}
                </button>
                <button
                  onClick={() => { setEditandoNome(false); setNomeEscritorio(escritorio?.nome || ""); }}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-semibold text-slate-800">{escritorio?.nome}</p>
                <p className="text-sm text-slate-500 mt-1">Plano {escritorio?.plano || "FREE"}</p>
              </div>
              {papel === "admin" && (
                <button
                  onClick={() => setEditandoNome(true)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Editar
                </button>
              )}
            </div>
          )}
        </div>

        {/* Card: Convidar Membro */}
        {papel === "admin" && (
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <UserPlus className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800">Adicionar Membro</h2>
            </div>
            <p className="text-sm text-slate-500 mb-4 ml-[52px]">
              O colega precisa já ter uma conta no ThemisTec. Ele terá acesso a todos os dados do escritório.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={emailConvite}
                onChange={(e) => setEmailConvite(e.target.value)}
                placeholder="e-mail do colega"
                className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                disabled={submitting}
                onKeyDown={(e) => { if (e.key === "Enter") void handleConvidar(); }}
              />
              <button
                onClick={() => void handleConvidar()}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {submitting ? "Adicionando..." : "Adicionar"}
              </button>
            </div>
          </div>
        )}

        {/* Card: Membros */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Membros da Equipe</h2>
              <p className="text-sm text-slate-500">{membros.length} membro{membros.length !== 1 ? "s" : ""}</p>
            </div>
          </div>

          {membros.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">Nenhum membro encontrado.</p>
          ) : (
            <div className="space-y-3">
              {membros.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                      {m.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{m.email}</p>
                      <p className="text-xs text-slate-500">
                        Desde {new Date(m.criado_em).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                    m.papel === "admin"
                      ? "bg-violet-100 text-violet-700"
                      : "bg-slate-200 text-slate-600"
                  }`}>
                    {m.papel === "admin" && <Crown className="h-3 w-3" />}
                    {m.papel === "admin" ? "Admin" : "Membro"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
