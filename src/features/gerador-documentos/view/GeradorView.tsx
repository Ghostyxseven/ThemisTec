"use client";

import { useState } from "react";
import { useGerador } from "../viewmodel/useGerador";
import { Files, Loader2 } from "lucide-react";

export function GeradorView() {
  const { templates, clientes, loading, gerarDocumento } = useGerador();
  const [clienteId, setClienteId] = useState("");
  const [templateId, setTemplateId] = useState("");

  const handleGerar = () => {
    if (!clienteId || !templateId) return;
    gerarDocumento(clienteId, templateId);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary-light/10 rounded-xl">
            <Files className="w-6 h-6 text-primary-light" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Gerador de Petições</h2>
            <p className="text-sm text-slate-500">Crie documentos a partir de templates automaticamente.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Selecione o Cliente</label>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20"
              disabled={loading}
            >
              <option value="">Selecione...</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nome} ({c.cpf})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Selecione o Template</label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20"
              disabled={loading}
            >
              <option value="">Selecione...</option>
              {templates.length === 0 && <option disabled>Nenhum template cadastrado no banco</option>}
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleGerar}
            disabled={!clienteId || !templateId || loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-light text-white rounded-xl font-medium shadow-sm hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Files className="w-5 h-5" />}
            Gerar Documento
          </button>
        </div>
      </div>
    </div>
  );
}
