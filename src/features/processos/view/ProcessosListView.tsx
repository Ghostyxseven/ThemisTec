"use client";

/**
 * ProcessosPage — View (ADR-0007: MVVM)
 *
 * Responsabilidades:
 * - Exibir a listagem de processos associados ao advogado logado (US08)
 * - Permitir filtragem por Cliente Vinculado e Status
 * - Controlar a paginação reativamente
 *
 * NÃO contém lógica de banco de dados direta.
 */

import { useEffect } from "react";
import Link from "next/link";
import { useListProcessos } from "../viewmodel/useListProcessos";
import { Scale, Search, Download, FileText, CheckCircle2, Clock, Pencil, Trash2, X, AlertTriangle } from "lucide-react";
import { useState } from "react";

const translateTipo = (tipo: string): string => {
  const map: Record<string, string> = {
    civil: "Cível",
    criminal: "Criminal",
    trabalhista: "Trabalhista",
    tributario: "Tributário",
    administrativo: "Administrativo",
    outro: "Outro",
  };
  return map[tipo] || tipo;
};

const formatProcessoNum = (value: string): string => {
  if (!value) return value;
  // Remove tudo que não for número (limpa as vírgulas estranhas que vieram no cadastro)
  const digits = value.replace(/\D/g, "");
  // Formato Padrão CNJ: 0000000-00.0000.0.00.0000 (20 dígitos)
  if (digits.length === 20) {
    return digits.replace(/(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})/, "$1-$2.$3.$4.$5.$6");
  }
  return value; // Retorna como está se não for padrão CNJ, mas poderia apenas retornar os digits
};

const formatDate = (isoString: string): string => {
  try {
    const [year, month, day] = isoString.split("-");
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    return new Date(isoString).toLocaleDateString("pt-BR");
  } catch {
    return isoString;
  }
};

export function ProcessosListView(): React.ReactNode {
  const {
    dados,
    paginacao,
    isLoading,
    errorMessage,
    filtroClienteId,
    setFiltroClienteId,
    filtroStatus,
    setFiltroStatus,
    page,
    setPage,
    clientes,
    loadClientes,
    isExporting,
    exportarCsv,
    excluirProcesso,
  } = useListProcessos();

  const [processoParaExcluir, setProcessoParaExcluir] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    void loadClientes();
  }, [loadClientes]);

  const handleClienteChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setFiltroClienteId(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setFiltroStatus(e.target.value);
    setPage(1);
  };

  const confirmarExclusao = async (): Promise<void> => {
    if (!processoParaExcluir) return;
    try {
      setIsDeleting(true);
      await excluirProcesso(processoParaExcluir);
      setProcessoParaExcluir(null);
    } catch {
      // erro tratado no hook
    } finally {
      setIsDeleting(false);
    }
  };

  const totalProcessos = paginacao?.total ?? 0;

  return (
    <main className="flex-1 px-4 py-8 md:px-8 lg:px-10">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light/10">
              <Scale className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Gestão de <span className="text-primary">Processos</span>
              </h1>
              <p className="text-sm text-slate-500">
                Acompanhe o andamento das ações e prazos dos seus clientes.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { void exportarCsv(); }}
              disabled={isExporting}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              {isExporting ? "Exportando..." : "Exportar CSV"}
            </button>
            <Link
              href="/processos/cadastro"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-95"
            >
              + Novo Processo
            </Link>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar processo por número..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md"
            />
          </div>
          <select
            value={filtroClienteId}
            onChange={handleClienteChange}
            className="md:w-64 rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md"
          >
            <option value="">Todos os clientes</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
          <select
            value={filtroStatus}
            onChange={handleStatusChange}
            className="md:w-48 rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md"
          >
            <option value="">Todos os status</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluido">Concluído</option>
            <option value="arquivado">Arquivado</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-4 rounded-2xl bg-white p-5 border border-slate-100 shadow-soft transition-all hover:shadow-card">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50">
              <Scale className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-purple-500 uppercase tracking-wider">Total de Processos</p>
              <p className="text-xl font-bold text-foreground">{isLoading ? "..." : totalProcessos}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl bg-white p-5 border border-slate-100 shadow-soft transition-all hover:shadow-card">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-500 uppercase tracking-wider">Em Andamento</p>
              <p className="text-xl font-bold text-foreground">{isLoading ? "..." : dados.filter(p => p.status === 'em_andamento').length}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl bg-white p-5 border border-slate-100 shadow-soft transition-all hover:shadow-card">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-amber-500 uppercase tracking-wider">Honorários Pendentes</p>
              <p className="text-xl font-bold text-foreground">{isLoading ? "..." : dados.filter(p => p.statusPagamento !== 'PAGO').length}</p>
            </div>
          </div>
        </div>

        {/* Exibição Geral de Erro */}
        {errorMessage !== null && (
          <div
            role="alert"
            className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
              <svg className="h-3.5 w-3.5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
            </div>
            {errorMessage}
          </div>
        )}

        {/* Tabela de Listagem */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-soft border border-slate-100">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-100 border-t-primary"></div>
              <p className="mt-4 text-sm text-slate-500 font-medium">Buscando processos...</p>
            </div>
          ) : dados.length === 0 ? (
            /* Estado Vazio (Empty State) */
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-light/10 mb-5">
                <Scale className="h-10 w-10 text-primary-light/60" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Nenhum processo encontrado</h3>
              <p className="mt-2 text-sm text-slate-500 max-w-sm">
                Não existem processos cadastrados para os filtros aplicados no momento.
              </p>
              {filtroClienteId || filtroStatus ? (
                <button
                  type="button"
                  onClick={() => {
                    setFiltroClienteId("");
                    setFiltroStatus("");
                    setPage(1);
                  }}
                  className="mt-6 text-sm font-semibold text-primary hover:text-primary-dark transition-colors hover:underline"
                >
                  Limpar filtros de busca
                </button>
              ) : (
                <Link
                  href="/processos/cadastro"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark active:scale-95"
                >
                  + Cadastrar Primeiro Processo
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                  <thead className="bg-slate-50/80">
                    <tr className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      <th className="px-6 py-4">Número do Processo</th>
                      <th className="px-6 py-4">Cliente Vinculado</th>
                      <th className="px-6 py-4">Tipo</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4">Abertura</th>
                      <th className="px-6 py-4 text-center">Pagamento</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 bg-white text-slate-600">
                    {dados.map((processo) => (
                      <tr key={processo.id} className="hover:bg-primary/[0.02] transition-colors group">
                        <td className="px-6 py-5 font-mono font-medium text-foreground text-xs">
                          {formatProcessoNum(processo.numero)}
                        </td>
                        <td className="px-6 py-5 font-semibold text-primary">
                          {processo.clienteNome}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          {translateTipo(processo.tipo)}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-center">
                          <span
                            className={`
                              inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold
                              ${
                                processo.status === "em_andamento"
                                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20"
                                  : processo.status === "concluido"
                                  ? "bg-blue-50 text-blue-700 ring-1 ring-blue-500/20"
                                  : "bg-slate-100 text-slate-600 ring-1 ring-slate-400/20"
                              }
                            `}
                          >
                            <svg className={`h-1.5 w-1.5 ${
                              processo.status === "em_andamento" ? "fill-emerald-500" :
                              processo.status === "concluido" ? "fill-blue-500" : "fill-slate-400"
                            }`} viewBox="0 0 6 6" aria-hidden="true">
                              <circle cx="3" cy="3" r="3" />
                            </svg>
                            {processo.status === "em_andamento"
                              ? "Em Andamento"
                              : processo.status === "concluido"
                              ? "Concluído"
                              : "Arquivado"}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          {formatDate(processo.dataAbertura)}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-center">
                          <span
                            className={`
                              inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold
                              ${
                                processo.statusPagamento === "PAGO"
                                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20"
                                  : processo.statusPagamento === "ATRASADO"
                                  ? "bg-red-50 text-red-700 ring-1 ring-red-500/20"
                                  : "bg-amber-50 text-amber-700 ring-1 ring-amber-500/20"
                              }
                            `}
                          >
                            <svg className={`h-1.5 w-1.5 ${
                              processo.statusPagamento === "PAGO" ? "fill-emerald-500" :
                              processo.statusPagamento === "ATRASADO" ? "fill-red-500" : "fill-amber-500"
                            }`} viewBox="0 0 6 6" aria-hidden="true">
                              <circle cx="3" cy="3" r="3" />
                            </svg>
                            {processo.statusPagamento === "PAGO"
                              ? "Pago"
                              : processo.statusPagamento === "ATRASADO"
                              ? "Atrasado"
                              : "Pendente"}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/processos/documentos/${processo.id}`}
                              title="Anexos"
                              className="
                                inline-flex items-center justify-center h-8 w-8 text-slate-400 hover:text-primary
                                hover:bg-primary/10 rounded-lg transition-colors
                              "
                            >
                              <FileText className="h-4 w-4" />
                            </Link>
                            <Link
                              href={`/processos/editar/${processo.id}`}
                              title="Editar"
                              className="
                                inline-flex items-center justify-center h-8 w-8 text-slate-400 hover:text-primary
                                hover:bg-primary/10 rounded-lg transition-colors
                              "
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                            <button
                              type="button"
                              title="Excluir"
                              onClick={() => setProcessoParaExcluir(processo.id)}
                              className="
                                inline-flex items-center justify-center h-8 w-8 text-slate-400 hover:text-red-500
                                hover:bg-red-50 rounded-lg transition-colors
                              "
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              {paginacao && paginacao.totalPaginas > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4">
                  <div className="text-sm text-slate-500">
                    Página <span className="font-medium">{page}</span> de{" "}
                    <span className="font-medium">{paginacao.totalPaginas}</span> (Total: {paginacao.total} processos)
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Anterior
                    </button>
                    <button
                      type="button"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= paginacao.totalPaginas}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Próximo
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal de Exclusão */}
        {processoParaExcluir && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setProcessoParaExcluir(null)} />
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <button
                onClick={() => setProcessoParaExcluir(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-7 w-7 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Excluir Processo</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Tem certeza que deseja excluir este processo permanentemente? Esta ação não poderá ser desfeita.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setProcessoParaExcluir(null)}
                  disabled={isDeleting}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => { void confirmarExclusao(); }}
                  disabled={isDeleting}
                  className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "Excluindo..." : "Sim, Excluir"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
