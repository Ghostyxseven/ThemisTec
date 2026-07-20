"use client";

import { useEffect, useState, useCallback } from "react";
import { Building2, UserPlus, Users, Plus, Trash2, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";

interface Escritorio {
  id: string;
  nome: string;
  plano: string;
  criado_em: string;
  total_membros: number;
}

interface Advogado {
  id: string;
  user_id: string;
  email: string;
  nome: string;
  papel: string;
  escritorio_id: string;
  escritorio_nome: string;
  criado_em: string;
}

export default function SuperAdminPage(): React.ReactElement {
  const [tab, setTab] = useState<"escritorios" | "advogados">("escritorios");
  const [escritorios, setEscritorios] = useState<Escritorio[]>([]);
  const [advogados, setAdvogados] = useState<Advogado[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Forms
  const [novoEscritorio, setNovoEscritorio] = useState("");
  const [novoAdv, setNovoAdv] = useState({ nome: "", email: "", senha: "", escritorio_id: "", papel: "admin" });
  const [showFormEscritorio, setShowFormEscritorio] = useState(false);
  const [showFormAdvogado, setShowFormAdvogado] = useState(false);

  const loadEscritorios = useCallback(async (): Promise<void> => {
    const res = await fetch("/api/admin?tipo=escritorios");
    if (res.ok) {
      const data = await res.json() as { escritorios: Escritorio[] };
      setEscritorios(data.escritorios);
    }
  }, []);

  const loadAdvogados = useCallback(async (): Promise<void> => {
    const res = await fetch("/api/admin?tipo=advogados");
    if (res.ok) {
      const data = await res.json() as { advogados: Advogado[] };
      setAdvogados(data.advogados);
    }
  }, []);

  const loadAll = useCallback(async (): Promise<void> => {
    setLoading(true);
    await Promise.all([loadEscritorios(), loadAdvogados()]);
    setLoading(false);
  }, [loadEscritorios, loadAdvogados]);

  useEffect(() => { void loadAll(); }, [loadAll]);

  const criarEscritorio = async (): Promise<void> => {
    if (!novoEscritorio.trim()) return;
    setSubmitting(true);
    setMensagem(null);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acao: "criar_escritorio", nome: novoEscritorio.trim() }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error || "Erro");
      setNovoEscritorio("");
      setShowFormEscritorio(false);
      setMensagem({ tipo: "sucesso", texto: "Escritório criado!" });
      void loadEscritorios();
    } catch (e) { setMensagem({ tipo: "erro", texto: e instanceof Error ? e.message : "Erro" }); }
    finally { setSubmitting(false); }
  };

  const criarAdvogado = async (): Promise<void> => {
    if (!novoAdv.nome || !novoAdv.email || !novoAdv.senha || !novoAdv.escritorio_id) {
      setMensagem({ tipo: "erro", texto: "Preencha todos os campos." });
      return;
    }
    setSubmitting(true);
    setMensagem(null);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acao: "criar_advogado", ...novoAdv }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error || "Erro");
      setNovoAdv({ nome: "", email: "", senha: "", escritorio_id: "", papel: "admin" });
      setShowFormAdvogado(false);
      setMensagem({ tipo: "sucesso", texto: "Advogado criado com sucesso!" });
      void loadAdvogados();
    } catch (e) { setMensagem({ tipo: "erro", texto: e instanceof Error ? e.message : "Erro" }); }
    finally { setSubmitting(false); }
  };

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const removerEscritorio = async (id: string): Promise<void> => {
    try {
      const res = await fetch("/api/admin", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ acao: "remover_escritorio", id }) });
      if (!res.ok) { const d = await res.json() as { error?: string }; throw new Error(d.error || "Erro"); }
      setMensagem({ tipo: "sucesso", texto: "Escritório removido." });
      setConfirmDelete(null);
      void loadAll();
    } catch (e) { setMensagem({ tipo: "erro", texto: e instanceof Error ? e.message : "Erro" }); }
  };

  const removerAdvogado = async (id: string): Promise<void> => {
    try {
      const res = await fetch("/api/admin", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ acao: "remover_advogado", id }) });
      if (!res.ok) { const d = await res.json() as { error?: string }; throw new Error(d.error || "Erro"); }
      setMensagem({ tipo: "sucesso", texto: "Advogado removido." });
      setConfirmDelete(null);
      void loadAdvogados();
    } catch (e) { setMensagem({ tipo: "erro", texto: e instanceof Error ? e.message : "Erro" }); }
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

  return (
    <div className="flex-1 px-4 py-8 md:px-8 lg:px-10">
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-blue-600" />
              Super Admin
            </h1>
            <p className="page-subtitle">Gerencie escritórios e advogados da plataforma</p>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-medium">{escritorios.length} escritório{escritorios.length !== 1 ? "s" : ""}</span>
            <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-medium">{advogados.length} advogado{advogados.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Feedback */}
        {mensagem && (
          <div role="alert" className={`rounded-xl px-4 py-3 text-sm flex items-center gap-3 ${mensagem.tipo === "sucesso" ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
            {mensagem.tipo === "sucesso" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {mensagem.texto}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
          <button onClick={() => setTab("escritorios")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === "escritorios" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <Building2 className="h-4 w-4 inline mr-2" />Escritórios
          </button>
          <button onClick={() => setTab("advogados")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === "advogados" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <Users className="h-4 w-4 inline mr-2" />Advogados
          </button>
        </div>

        {/* Tab: Escritórios */}
        {tab === "escritorios" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800">Escritórios Cadastrados</h2>
              <button onClick={() => setShowFormEscritorio(!showFormEscritorio)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" /> Novo Escritório
              </button>
            </div>

            {showFormEscritorio && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Criar Escritório</h3>
                <div className="flex gap-3">
                  <input type="text" value={novoEscritorio} onChange={(e) => setNovoEscritorio(e.target.value)} placeholder="Nome do escritório" className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" disabled={submitting} onKeyDown={(e) => { if (e.key === "Enter") void criarEscritorio(); }} />
                  <button onClick={() => void criarEscritorio()} disabled={submitting} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50">{submitting ? "..." : "Criar"}</button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {escritorios.map((e) => (
                <div key={e.id} className="flex items-center justify-between p-5 rounded-2xl border border-slate-200/60 bg-white shadow-soft">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{e.nome}</p>
                      <p className="text-xs text-slate-500">{e.total_membros} membro{e.total_membros !== 1 ? "s" : ""} · Criado em {new Date(e.criado_em).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                  {confirmDelete === e.id ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => void removerEscritorio(e.id)} className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700">Confirmar</button>
                      <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs font-medium hover:bg-slate-50">Cancelar</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(e.id)} className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Remover">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              {escritorios.length === 0 && <p className="text-center text-slate-500 py-8">Nenhum escritório cadastrado.</p>}
            </div>
          </div>
        )}

        {/* Tab: Advogados */}
        {tab === "advogados" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800">Advogados Cadastrados</h2>
              <button onClick={() => setShowFormAdvogado(!showFormAdvogado)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                <UserPlus className="h-4 w-4" /> Novo Advogado
              </button>
            </div>

            {showFormAdvogado && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Criar Advogado</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" value={novoAdv.nome} onChange={(e) => setNovoAdv({ ...novoAdv, nome: e.target.value })} placeholder="Nome completo" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" disabled={submitting} />
                  <input type="email" value={novoAdv.email} onChange={(e) => setNovoAdv({ ...novoAdv, email: e.target.value })} placeholder="E-mail" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" disabled={submitting} />
                  <input type="password" value={novoAdv.senha} onChange={(e) => setNovoAdv({ ...novoAdv, senha: e.target.value })} placeholder="Senha inicial" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" disabled={submitting} />
                  <select value={novoAdv.escritorio_id} onChange={(e) => setNovoAdv({ ...novoAdv, escritorio_id: e.target.value })} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white" disabled={submitting}>
                    <option value="">Selecione o escritório</option>
                    {escritorios.map((e) => <option key={e.id} value={e.id}>{e.nome}</option>)}
                  </select>
                  <select value={novoAdv.papel} onChange={(e) => setNovoAdv({ ...novoAdv, papel: e.target.value })} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white" disabled={submitting}>
                    <option value="admin">Admin do escritório</option>
                    <option value="membro">Membro</option>
                  </select>
                  <button onClick={() => void criarAdvogado()} disabled={submitting} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50">{submitting ? "Criando..." : "Criar Advogado"}</button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {advogados.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/60 bg-white shadow-soft">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">
                      {a.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{a.nome}</p>
                      <p className="text-xs text-slate-500">{a.email} · {a.escritorio_nome}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${a.papel === "admin" ? "bg-violet-100 text-violet-700" : "bg-slate-200 text-slate-600"}`}>
                      {a.papel}
                    </span>
                    {confirmDelete === a.id ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => void removerAdvogado(a.id)} className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700">Confirmar</button>
                        <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs font-medium hover:bg-slate-50">Cancelar</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDelete(a.id)} className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Remover">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {advogados.length === 0 && <p className="text-center text-slate-500 py-8">Nenhum advogado cadastrado.</p>}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
