"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Building2, Users, Scale, FileText, Calendar, DollarSign, Settings, UserPlus, Crown, AlertCircle, CheckCircle2 } from "lucide-react";

interface Escritorio {
  id: string;
  nome: string;
  plano: string;
  criado_em: string;
}

interface Membro {
  id: string;
  user_id: string;
  email: string;
  papel: string;
  criado_em: string;
}

export default function AdminPage(): React.ReactElement {
  const [escritorio, setEscritorio] = useState<Escritorio | null>(null);
  const [membros, setMembros] = useState<Membro[]>([]);
  const [papel, setPapel] = useState("");
  const [loading, setLoading] = useState(true);
  const [nomeEdit, setNomeEdit] = useState("");
  const [editando, setEditando] = useState(false);
  const [emailConvite, setEmailConvite] = useState("");
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadDados = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch("/api/escritorio");
      if (!res.ok) throw new Error();
      const data = await res.json() as { escritorio: Escritorio; papel: string; membros: Membro[] };
      setEscritorio(data.escritorio);
      setPapel(data.papel);
      setMembros(data.membros);
      setNomeEdit(data.escritorio.nome);
    } catch {
      setMensagem({ tipo: "erro", texto: "Erro ao carregar dados." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadDados(); }, [loadDados]);

  const handleRenomear = async (): Promise<void> => {
    if (!nomeEdit.trim() || nomeEdit.trim().length < 2) return;
    setSubmitting(true);
    setMensagem(null);
    try {
      const res = await fetch("/api/escritorio", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nome: nomeEdit.trim() }) });
      if (!res.ok) { const d = await res.json() as { error?: string }; throw new Error(d.error || "Erro"); }
      setEscritorio(prev => prev ? { ...prev, nome: nomeEdit.trim() } : prev);
      setEditando(false);
      setMensagem({ tipo: "sucesso", texto: "Nome atualizado!" });
    } catch (e) { setMensagem({ tipo: "erro", texto: e instanceof Error ? e.message : "Erro" }); }
    finally { setSubmitting(false); }
  };

  const handleConvidar = async (): Promise<void> => {
    if (!emailConvite.trim() || !emailConvite.includes("@")) { setMensagem({ tipo: "erro", texto: "E-mail inválido." }); return; }
    setSubmitting(true);
    setMensagem(null);
    try {
      const res = await fetch("/api/escritorio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: emailConvite.trim() }) });
      const data = await res.json() as { error?: string; email?: string };
      if (!res.ok) throw new Error(data.error || "Erro");
      setEmailConvite("");
      setMensagem({ tipo: "sucesso", texto: `${data.email} adicionado!` });
      void loadDados();
    } catch (e) { setMensagem({ tipo: "erro", texto: e instanceof Error ? e.message : "Erro" }); }
    finally { setSubmitting(false); }
  };

  if (loading) {
    return (
      <div className="flex-1 px-4 py-8 md:px-8 lg:px-10">
        <div className="max-w-6xl mx-auto flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (papel !== "admin") {
    return (
      <div className="flex-1 px-4 py-8 md:px-8 lg:px-10">
        <div className="max-w-6xl mx-auto text-center py-20">
          <p className="text-slate-500">Você não tem permissão de administrador.</p>
          <Link href="/dashboard" className="text-blue-600 hover:underline mt-2 inline-block">Voltar ao Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 py-8 md:px-8 lg:px-10">
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Painel Administrativo</h1>
            <p className="page-subtitle">Gerencie seu escritório, equipe e configurações</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
            <Crown className="h-3.5 w-3.5" />
            Administrador
          </span>
        </div>

        {/* Feedback */}
        {mensagem && (
          <div role="alert" className={`rounded-xl px-4 py-3 text-sm flex items-center gap-3 ${mensagem.tipo === "sucesso" ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
            {mensagem.tipo === "sucesso" ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" /> : <AlertCircle className="h-4 w-4 flex-shrink-0" />}
            {mensagem.texto}
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Users className="h-4 w-4" /></div>
              <span className="text-sm font-medium text-slate-500">Membros</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{membros.length}</p>
          </div>
          <Link href="/clientes" className="stat-card hover:border-blue-200 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><FileText className="h-4 w-4" /></div>
              <span className="text-sm font-medium text-slate-500">Clientes</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">→</p>
          </Link>
          <Link href="/processos" className="stat-card hover:border-blue-200 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><Scale className="h-4 w-4" /></div>
              <span className="text-sm font-medium text-slate-500">Processos</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">→</p>
          </Link>
          <Link href="/financeiro" className="stat-card hover:border-blue-200 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><DollarSign className="h-4 w-4" /></div>
              <span className="text-sm font-medium text-slate-500">Financeiro</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">→</p>
          </Link>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Escritório */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Building2 className="h-5 w-5" /></div>
              <h2 className="text-lg font-semibold text-slate-800">Escritório</h2>
            </div>

            {editando ? (
              <div className="space-y-3">
                <input type="text" value={nomeEdit} onChange={(e) => setNomeEdit(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" disabled={submitting} autoFocus />
                <div className="flex gap-2">
                  <button onClick={() => void handleRenomear()} disabled={submitting} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50">{submitting ? "..." : "Salvar"}</button>
                  <button onClick={() => { setEditando(false); setNomeEdit(escritorio?.nome || ""); }} className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 text-sm hover:bg-slate-50">Cancelar</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-800">{escritorio?.nome}</p>
                    <p className="text-sm text-slate-500">Plano {escritorio?.plano}</p>
                  </div>
                  <button onClick={() => setEditando(true)} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Editar</button>
                </div>
                <div className="text-xs text-slate-400">
                  Criado em {escritorio ? new Date(escritorio.criado_em).toLocaleDateString("pt-BR") : ""}
                </div>
              </div>
            )}
          </div>

          {/* Convidar Membro */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><UserPlus className="h-5 w-5" /></div>
              <h2 className="text-lg font-semibold text-slate-800">Convidar Membro</h2>
            </div>
            <p className="text-sm text-slate-500 mb-4">O colega precisa ter uma conta no ThemisTec.</p>
            <div className="flex gap-3">
              <input type="email" value={emailConvite} onChange={(e) => setEmailConvite(e.target.value)} placeholder="email@exemplo.com" className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" disabled={submitting} onKeyDown={(e) => { if (e.key === "Enter") void handleConvidar(); }} />
              <button onClick={() => void handleConvidar()} disabled={submitting} className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap">{submitting ? "..." : "Adicionar"}</button>
            </div>
          </div>
        </div>

        {/* Membros */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><Users className="h-5 w-5" /></div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Equipe</h2>
                <p className="text-sm text-slate-500">{membros.length} membro{membros.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {membros.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                    {m.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{m.email}</p>
                    <p className="text-xs text-slate-500">Desde {new Date(m.criado_em).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${m.papel === "admin" ? "bg-violet-100 text-violet-700" : "bg-slate-200 text-slate-600"}`}>
                  {m.papel === "admin" && <Crown className="h-3 w-3" />}
                  {m.papel === "admin" ? "Admin" : "Membro"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/configuracoes" className="flex items-center gap-2 p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-medium text-slate-700">
            <Settings className="h-4 w-4 text-slate-400" /> Configurações
          </Link>
          <Link href="/agenda" className="flex items-center gap-2 p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-medium text-slate-700">
            <Calendar className="h-4 w-4 text-slate-400" /> Agenda
          </Link>
          <Link href="/prazos" className="flex items-center gap-2 p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-medium text-slate-700">
            <Calendar className="h-4 w-4 text-slate-400" /> Prazos
          </Link>
          <Link href="/documentos" className="flex items-center gap-2 p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-medium text-slate-700">
            <FileText className="h-4 w-4 text-slate-400" /> Documentos
          </Link>
        </div>

      </div>
    </div>
  );
}
