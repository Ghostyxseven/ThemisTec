"use client";


import Link from "next/link";
import { Calendar, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { useListPrazos } from "../viewmodel/useListPrazos";

const isAtrasado = (dataISO: string): boolean => {
  const today = new Date();
  today.setHours(0,0,0,0);
  const todayStr = today.toISOString().split("T")[0] || "";
  return dataISO < todayStr;
};

const isToday = (dataISO: string): boolean => {
  const todayStr = new Date().toISOString().split("T")[0] || "";
  return dataISO === todayStr;
};

export function PrazosListView(): React.JSX.Element {
  const { dados, isLoading, errorMessage, concluirPrazo, excluirPrazo } = useListPrazos();

  return (
    <main className="flex-1 px-4 py-8 md:px-8 lg:px-10">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Agenda de <span className="text-primary">Prazos</span>
              </h1>
              <p className="text-sm text-slate-500">
                Acompanhe as datas críticas dos seus processos.
              </p>
            </div>
          </div>
          <div>
            <Link
              href="/prazos/cadastro"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-95"
            >
              + Novo Prazo
            </Link>
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* List */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-soft border border-slate-100">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-100 border-t-primary"></div>
              <p className="mt-4 text-sm text-slate-500 font-medium">Carregando agenda...</p>
            </div>
          ) : dados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-light/10 mb-5">
                <Calendar className="h-10 w-10 text-primary-light/60" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Sua agenda está livre</h3>
              <p className="mt-2 text-sm text-slate-500 max-w-sm">
                Nenhum prazo cadastrado. Aproveite para organizar seus processos.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                <thead className="bg-slate-50/80">
                  <tr className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Título</th>
                    <th className="px-6 py-4">Processo</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white text-slate-600">
                  {dados.map((prazo) => {
                    const atrasado = isAtrasado(prazo.dataVencimento) && prazo.status === "PENDENTE";
                    const hoje = isToday(prazo.dataVencimento) && prazo.status === "PENDENTE";
                    
                    return (
                      <tr key={prazo.id} className="hover:bg-primary/[0.02] transition-colors group">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className={`font-semibold ${atrasado ? 'text-red-600' : hoje ? 'text-amber-600' : 'text-slate-700'}`}>
                            {prazo.dataVencimento.split("-").reverse().join("/")}
                          </span>
                          {atrasado && <AlertCircle className="inline h-4 w-4 text-red-500 ml-2" />}
                          {hoje && <span className="ml-2 text-xs font-bold text-amber-500">HOJE</span>}
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-semibold text-primary">{prazo.titulo}</p>
                          {prazo.descricao && <p className="text-xs text-slate-400 mt-1">{prazo.descricao}</p>}
                        </td>
                        <td className="px-6 py-5 font-mono text-xs">
                          {prazo.processoNumero}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            prazo.status === "CONCLUIDO" ? "bg-emerald-50 text-emerald-700" :
                            atrasado ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {prazo.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right flex items-center justify-end gap-3">
                          {prazo.status === "PENDENTE" ? (
                            <button
                              type="button"
                              onClick={() => void concluirPrazo(prazo.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Concluir
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium">Finalizado</span>
                          )}
                          <button
                            type="button"
                            aria-label={`Excluir prazo ${prazo.titulo}`}
                            onClick={() => {
                              if (confirm("Tem certeza que deseja excluir este prazo?")) {
                                void excluirPrazo(prazo.id);
                              }
                            }}
                            className="inline-flex items-center justify-center p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir Prazo"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
