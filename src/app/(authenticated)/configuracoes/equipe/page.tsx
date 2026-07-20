"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";

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
      <div className="p-8 max-w-4xl mx-auto">
        <p className="text-zinc-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Escritório e Equipe</h1>
        <p className="text-zinc-400">Gerencie o nome do seu escritório e os membros da equipe.</p>
      </div>

      {/* Mensagem de feedback */}
      {mensagem && (
        <div
          role="alert"
          className={`rounded-xl px-4 py-3 text-sm ${
            mensagem.tipo === "sucesso"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
              : "bg-red-500/10 border border-red-500/30 text-red-300"
          }`}
        >
          {mensagem.texto}
        </div>
      )}

      {/* Seção: Nome do Escritório */}
      <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-medium text-zinc-100 mb-4">Nome do Escritório</h2>
        {editandoNome ? (
          <div className="flex space-x-4">
            <input
              type="text"
              value={nomeEscritorio}
              onChange={(e) => setNomeEscritorio(e.target.value)}
              placeholder="Nome do escritório"
              className="flex-1 rounded-xl bg-zinc-800/50 border border-zinc-700 px-4 py-2 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-600"
              disabled={submitting}
            />
            <Button onClick={() => void handleRenomear()} variant="primary" disabled={submitting}>
              {submitting ? "Salvando..." : "Salvar"}
            </Button>
            <Button onClick={() => { setEditandoNome(false); setNomeEscritorio(escritorio?.nome || ""); }} variant="outline" disabled={submitting}>
              Cancelar
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg text-zinc-200 font-semibold">{escritorio?.nome}</p>
              <p className="text-sm text-zinc-500">Plano: {escritorio?.plano || "FREE"}</p>
            </div>
            {papel === "admin" && (
              <Button onClick={() => setEditandoNome(true)} variant="outline" size="sm">
                Editar Nome
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Seção: Convidar Membro */}
      {papel === "admin" && (
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-medium text-zinc-100 mb-2">Adicionar Membro</h2>
          <p className="text-sm text-zinc-500 mb-4">
            O usuário precisa já ter uma conta criada no ThemisTec. Ao adicioná-lo, ele terá acesso a todos os dados do escritório.
          </p>
          <div className="flex space-x-4">
            <input
              type="email"
              value={emailConvite}
              onChange={(e) => setEmailConvite(e.target.value)}
              placeholder="e-mail do colega"
              className="flex-1 rounded-xl bg-zinc-800/50 border border-zinc-700 px-4 py-2 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-600"
              disabled={submitting}
              onKeyDown={(e) => { if (e.key === "Enter") void handleConvidar(); }}
            />
            <Button onClick={() => void handleConvidar()} variant="primary" disabled={submitting}>
              {submitting ? "Adicionando..." : "Adicionar"}
            </Button>
          </div>
        </div>
      )}

      {/* Seção: Membros */}
      <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-medium text-zinc-100 mb-4">
          Membros ({membros.length})
        </h2>
        {membros.length === 0 ? (
          <p className="text-zinc-500">Nenhum membro encontrado.</p>
        ) : (
          <div className="space-y-3">
            {membros.map((m) => (
              <div key={m.id} className="flex justify-between items-center bg-zinc-800/30 p-4 rounded-xl border border-zinc-800/80">
                <div>
                  <p className="font-medium text-zinc-200">{m.email}</p>
                  <p className="text-sm text-zinc-500">
                    Membro desde {new Date(m.criado_em).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  m.papel === "admin" 
                    ? "bg-violet-500/20 text-violet-300 border border-violet-500/30" 
                    : "bg-zinc-700/50 text-zinc-300"
                }`}>
                  {m.papel}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
