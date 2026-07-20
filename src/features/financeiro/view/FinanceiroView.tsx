"use client";
import { useState } from "react";
import { WalletCards, Plus, Trash2, TrendingUp, TrendingDown, Clock, AlertCircle, X, CreditCard } from "lucide-react";
import { useFinanceiro } from "../viewmodel/useFinanceiro";
import type { CreateLancamentoInput } from "@/specs/schemas/financeiro.schema";

const fmt = (v: number): string =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const statusBadge: Record<string, string> = {
  PAGO: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20",
  PENDENTE: "bg-amber-50 text-amber-700 ring-1 ring-amber-500/20",
  ATRASADO: "bg-red-50 text-red-700 ring-1 ring-red-500/20",
  PARCIAL: "bg-blue-50 text-blue-700 ring-1 ring-blue-500/20",
};

export function FinanceiroView(): React.JSX.Element {
  const { lancamentos, resumo, loading, erro, periodo, setPeriodo, criar, excluir } = useFinanceiro();
  const [aberto, setAberto] = useState(false);
  const [excluindo, setExcluindo] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [statusForm, setStatusForm] = useState("PENDENTE");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSalvando(true);
    try {
      const f = new FormData(e.currentTarget);
      const d: CreateLancamentoInput = {
        tipo: f.get("tipo") as "RECEITA" | "DESPESA",
        descricao: String(f.get("descricao")),
        categoria: String(f.get("categoria")),
        valor: Number(f.get("valor")),
        competencia: String(f.get("competencia")),
        status: f.get("status") as "PENDENTE" | "PAGO" | "ATRASADO" | "PARCIAL",
      };
      const vencimento = String(f.get("vencimento") || "");
      if (vencimento) d.vencimento = vencimento;
      const pagoEm = String(f.get("pago_em") || "");
      if (pagoEm) d.pagoEm = pagoEm;
      const formaPagamento = String(f.get("forma_pagamento") || "");
      if (formaPagamento) d.formaPagamento = formaPagamento;

      // Parcelas
      if (statusForm === "PARCIAL") {
        const parcelasTotal = Number(f.get("parcelas_total") || 0);
        const parcelaNumero = Number(f.get("parcela_numero") || 0);
        if (parcelasTotal > 0) d.parcelasTotal = parcelasTotal;
        if (parcelaNumero > 0) d.parcelaNumero = parcelaNumero;
      }

      await criar(d);
      setAberto(false);
      setStatusForm("PENDENTE");
    } finally {
      setSalvando(false);
    }
  };

  const confirmarExclusao = async (): Promise<void> => {
    if (!excluindo) return;
    try {
      await excluir(excluindo);
    } finally {
      setExcluindo(null);
    }
  };

  return (
    <main className="flex-1 px-4 py-8 md:px-8 lg:px-10">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Financeiro</h1>
            <p className="page-subtitle">Controle de receitas, despesas e honorários do escritório.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={periodo.inicio}
                onChange={(e) => setPeriodo({ ...periodo, inicio: e.target.value })}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <span className="text-slate-400 text-sm">até</span>
              <input
                type="date"
                value={periodo.fim}
                onChange={(e) => setPeriodo({ ...periodo, fim: e.target.value })}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <button
              onClick={() => setAberto(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Novo Lançamento
            </button>
          </div>
        </div>

        {/* Resumo Cards */}
        {resumo && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <div className="stat-card !p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold uppercase">Receitas</p>
                <p className="text-lg font-bold text-slate-900">{fmt(resumo.receitas)}</p>
              </div>
            </div>
            <div className="stat-card !p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold uppercase">Despesas</p>
                <p className="text-lg font-bold text-slate-900">{fmt(resumo.despesas)}</p>
              </div>
            </div>
            <div className="stat-card !p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <WalletCards className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold uppercase">Saldo</p>
                <p className={`text-lg font-bold ${resumo.saldo >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {fmt(resumo.saldo)}
                </p>
              </div>
            </div>
            <div className="stat-card !p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold uppercase">Pendente</p>
                <p className="text-lg font-bold text-slate-900">{fmt(resumo.pendente)}</p>
              </div>
            </div>
            <div className="stat-card !p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold uppercase">Atrasado</p>
                <p className="text-lg font-bold text-red-600">{fmt(resumo.atrasado)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Dica para o usuário */}
        {lancamentos.length === 0 && !loading && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-start gap-3">
            <CreditCard className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Dica: Registre os honorários aqui</p>
              <p className="text-sm text-blue-600 mt-1">
                Ao criar um processo com valor de honorários, registre um lançamento financeiro aqui com tipo &quot;Receita&quot; e categoria &quot;Honorários&quot;. 
                Use a opção &quot;Parcial&quot; no status para controlar pagamentos parcelados.
              </p>
            </div>
          </div>
        )}

        {/* Erro */}
        {erro && (
          <div role="alert" className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />{erro}
          </div>
        )}

        {/* Tabela */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-200">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-100 border-t-blue-600" />
              <p className="mt-4 text-sm text-slate-500">Carregando lançamentos...</p>
            </div>
          ) : lancamentos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mb-4">
                <WalletCards className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700">Nenhum lançamento no período</h3>
              <p className="mt-1 text-sm text-slate-500 max-w-sm">Registre receitas e despesas para acompanhar o financeiro do escritório.</p>
              <button
                onClick={() => setAberto(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" /> Novo Lançamento
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3">Tipo</th>
                    <th className="px-5 py-3">Descrição</th>
                    <th className="px-5 py-3">Categoria</th>
                    <th className="px-5 py-3">Competência</th>
                    <th className="px-5 py-3">Parcela</th>
                    <th className="px-5 py-3 text-right">Valor</th>
                    <th className="px-5 py-3 text-center">Status</th>
                    <th className="px-5 py-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white text-slate-600">
                  {lancamentos.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${l.tipo === "RECEITA" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                          {l.tipo === "RECEITA" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {l.tipo}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-900">{l.descricao}</td>
                      <td className="px-5 py-3.5 text-slate-500">{l.categoria}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{l.competencia}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-500">
                        {l.parcelaNumero && l.parcelasTotal
                          ? `${l.parcelaNumero}/${l.parcelasTotal}`
                          : <span className="text-slate-300">—</span>
                        }
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold">
                        <span className={l.tipo === "RECEITA" ? "text-emerald-600" : "text-red-600"}>{fmt(l.valor)}</span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge[l.status] ?? ""}`}>
                          {l.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          aria-label={`Excluir lançamento ${l.descricao}`}
                          onClick={() => setExcluindo(l.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Novo Lançamento */}
        {aberto && (
          <div role="dialog" aria-modal="true" aria-labelledby="titulo-lancamento" className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 backdrop-blur-sm p-4">
            <form onSubmit={(e) => void handleSubmit(e)} className="w-full max-w-lg space-y-5 rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 id="titulo-lancamento" className="text-lg font-bold text-slate-900">Novo Lançamento</h2>
                <button type="button" onClick={() => { setAberto(false); }} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Descrição *</label>
                  <input name="descricao" required placeholder="Ex: Honorários — Processo 0001234" className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tipo *</label>
                  <select name="tipo" required className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-blue-500 outline-none">
                    <option value="RECEITA">Receita</option>
                    <option value="DESPESA">Despesa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Categoria *</label>
                  <select name="categoria" required className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-blue-500 outline-none">
                    <option value="Honorários">Honorários</option>
                    <option value="Custas Processuais">Custas Processuais</option>
                    <option value="Aluguel">Aluguel</option>
                    <option value="Material">Material</option>
                    <option value="Serviços">Serviços</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Valor Total (R$) *</label>
                  <input name="valor" required type="number" min="0" step="0.01" placeholder="5000.00" className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Competência *</label>
                  <input name="competencia" required type="date" defaultValue={new Date().toISOString().split("T")[0]} className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Vencimento</label>
                  <input name="vencimento" type="date" className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Status *</label>
                  <select name="status" required value={statusForm} onChange={(e) => setStatusForm(e.target.value)} className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-blue-500 outline-none">
                    <option value="PENDENTE">Pendente</option>
                    <option value="PAGO">Pago</option>
                    <option value="ATRASADO">Atrasado</option>
                    <option value="PARCIAL">Parcial (parcelado)</option>
                  </select>
                </div>

                {/* Campos extras quando PAGO */}
                {statusForm === "PAGO" && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Data do Pagamento</label>
                      <input name="pago_em" type="date" defaultValue={new Date().toISOString().split("T")[0]} className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Forma de Pagamento</label>
                      <select name="forma_pagamento" className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-blue-500 outline-none">
                        <option value="">Selecione...</option>
                        <option value="PIX">PIX</option>
                        <option value="Transferência">Transferência</option>
                        <option value="Dinheiro">Dinheiro</option>
                        <option value="Cartão">Cartão</option>
                        <option value="Boleto">Boleto</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Parcelas */}
                {statusForm === "PARCIAL" && (
                  <div className="col-span-2 rounded-lg border border-blue-200 bg-blue-50 p-4 space-y-3">
                    <p className="text-xs font-semibold text-blue-800">Informações de Parcelamento</p>
                    <p className="text-xs text-blue-600">
                      Informe o valor da parcela atual no campo &quot;Valor&quot; acima.
                      Registre cada parcela como um lançamento separado.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-blue-800 mb-1">Parcela Nº</label>
                        <input name="parcela_numero" type="number" min="1" placeholder="1" className="w-full rounded-lg border border-blue-200 bg-white p-2.5 text-sm focus:border-blue-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-blue-800 mb-1">Total de Parcelas</label>
                        <input name="parcelas_total" type="number" min="1" placeholder="3" className="w-full rounded-lg border border-blue-200 bg-white p-2.5 text-sm focus:border-blue-500 outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-blue-800 mb-1">Data Pagamento</label>
                        <input name="pago_em" type="date" className="w-full rounded-lg border border-blue-200 bg-white p-2.5 text-sm focus:border-blue-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-blue-800 mb-1">Forma de Pagamento</label>
                        <select name="forma_pagamento" className="w-full rounded-lg border border-blue-200 bg-white p-2.5 text-sm focus:border-blue-500 outline-none">
                          <option value="">Selecione...</option>
                          <option value="PIX">PIX</option>
                          <option value="Transferência">Transferência</option>
                          <option value="Dinheiro">Dinheiro</option>
                          <option value="Cartão">Cartão</option>
                          <option value="Boleto">Boleto</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => { setAberto(false); }} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
                <button type="submit" disabled={salvando} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-all disabled:opacity-50">
                  {salvando ? "Salvando..." : "Salvar Lançamento"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal Confirmar Exclusão */}
        {excluindo && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button type="button" aria-label="Fechar" className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setExcluindo(null)} />
            <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center">
              <div className="mb-4 flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Excluir lançamento?</h3>
              <p className="text-sm text-slate-500 mb-6">Esta ação não pode ser desfeita.</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setExcluindo(null)} className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button>
                <button type="button" onClick={() => void confirmarExclusao()} className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600">Excluir</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
