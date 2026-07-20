"use client";

import { useState } from "react";
import { RefreshCcw, CheckCircle2, AlertCircle, Zap } from "lucide-react";

export default function ConfiguracoesPage(): React.ReactElement {
  const [syncing, setSyncing] = useState(false);
  const [resultado, setResultado] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  const handleSync = async (): Promise<void> => {
    setSyncing(true);
    setResultado(null);
    try {
      const res = await fetch("/api/sync-processos", { method: "POST" });
      const data = await res.json() as { success?: boolean; sincronizados?: number; processosVerificados?: number; erros?: string[]; error?: string };

      if (!res.ok) throw new Error(data.error || "Erro na sincronização");

      if (data.sincronizados === 0) {
        setResultado({ tipo: "sucesso", texto: `Verificados ${data.processosVerificados} processo(s). Nenhuma movimentação nova encontrada.` });
      } else {
        setResultado({ tipo: "sucesso", texto: `${data.sincronizados} movimentação(ões) nova(s) importada(s) de ${data.processosVerificados} processo(s).${data.erros ? ` (${data.erros.length} erro(s))` : ""}` });
      }
    } catch (e) {
      setResultado({ tipo: "erro", texto: e instanceof Error ? e.message : "Erro ao sincronizar" });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex-1 px-4 py-8 md:px-8 lg:px-10">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
        <div>
          <h1 className="page-title">Configurações</h1>
          <p className="page-subtitle">Integrações e sincronização de dados</p>
        </div>

        {/* Feedback */}
        {resultado && (
          <div role="alert" className={`rounded-xl px-4 py-3 text-sm flex items-center gap-3 ${resultado.tipo === "sucesso" ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
            {resultado.tipo === "sucesso" ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" /> : <AlertCircle className="h-4 w-4 flex-shrink-0" />}
            {resultado.texto}
          </div>
        )}

        {/* Card: Sincronização DataJud */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Sincronização com Tribunais</h2>
              <p className="text-sm text-slate-500">API Pública DataJud — Conselho Nacional de Justiça</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 mb-5">
            <p className="text-sm text-slate-600 leading-relaxed">
              Busca automaticamente as <strong>movimentações processuais</strong> de todos os seus processos cadastrados diretamente nos sistemas dos tribunais brasileiros (90+ tribunais cobertos).
            </p>
            <ul className="mt-3 text-xs text-slate-500 space-y-1">
              <li>• Dados públicos de processos não sigilosos</li>
              <li>• Cobertura: TJs, TRFs, TRTs, STF, STJ, TST, TSE</li>
              <li>• Importa apenas movimentações novas (não duplica)</li>
            </ul>
          </div>

          <button
            onClick={() => void handleSync()}
            disabled={syncing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCcw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Sincronizando..." : "Sincronizar Agora"}
          </button>
        </div>

        {/* Info */}
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
          <p className="text-sm text-amber-800">
            <strong>Dica:</strong> Para que a sincronização funcione, os processos devem estar cadastrados com o número CNJ no formato correto (ex: 0000000-00.0000.0.00.0000).
          </p>
        </div>
      </div>
    </div>
  );
}
