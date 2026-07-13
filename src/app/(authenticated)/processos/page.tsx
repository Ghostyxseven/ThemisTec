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
import { useListProcessos } from "./useListProcessos";

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
  // Retorna o valor original para evitar forçar máscara caso o formato varie,
  // mas se for CNJ padrão 20 dígitos (7-2.4.4.1.2.4), podemos formatar ou apenas exibir.
  return value;
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

export default function ProcessosPage(): React.ReactNode {
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
  } = useListProcessos();

  // Carrega a relação de clientes para alimentar o filtro dropdown
  useEffect(() => {
    void loadClientes();
  }, [loadClientes]);

  // Handlers para alteração de filtros (reseta para a página 1)
  const handleClienteChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setFiltroClienteId(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setFiltroStatus(e.target.value);
    setPage(1);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-12 md:px-8">
      <div className="w-full max-w-6xl">
        
        {/* Cabeçalho */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#1a3c5e]">Processos Jurídicos</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie as ações civis, criminais e trabalhistas vinculadas a seus clientes.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { void exportarCsv(); }}
              disabled={isExporting}
              className="
                inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5
                text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exportando...
                </>
              ) : (
                "Exportar CSV"
              )}
            </button>
            <Link
              href="/processos/cadastro"
              className="
                inline-flex items-center rounded-lg bg-[#1a3c5e] px-5 py-2.5
                text-sm font-semibold text-white shadow-sm hover:bg-[#0f2540]
                transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a3c5e] focus:ring-offset-2
              "
            >
              + Novo Processo
            </Link>
          </div>
        </div>

        {/* Painel de Filtros */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">Filtrar Consulta</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* Filtro por Cliente */}
            <div>
              <label htmlFor="filtro-cliente" className="mb-1 block text-xs font-semibold text-gray-600">
                Cliente
              </label>
              <select
                id="filtro-cliente"
                value={filtroClienteId}
                onChange={handleClienteChange}
                className="
                  w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm
                  outline-none transition-colors focus:border-[#1a3c5e] focus:ring-1 focus:ring-[#1a3c5e]
                "
              >
                <option value="">Todos os clientes</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Status */}
            <div>
              <label htmlFor="filtro-status" className="mb-1 block text-xs font-semibold text-gray-600">
                Status
              </label>
              <select
                id="filtro-status"
                value={filtroStatus}
                onChange={handleStatusChange}
                className="
                  w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm
                  outline-none transition-colors focus:border-[#1a3c5e] focus:ring-1 focus:ring-[#1a3c5e]
                "
              >
                <option value="">Todos os status</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
                <option value="arquivado">Arquivado</option>
              </select>
            </div>

          </div>
        </div>

        {/* Exibição Geral de Erro */}
        {errorMessage !== null && (
          <div
            role="alert"
            className="mb-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {errorMessage}
          </div>
        )}

        {/* Tabela de Listagem */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-100 border-t-[#1a3c5e]"></div>
              <p className="mt-4 text-sm text-gray-500 font-medium">Buscando processos...</p>
            </div>
          ) : dados.length === 0 ? (
            /* Estado Vazio (Empty State) */
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="rounded-full bg-purple-50 p-5 mb-5 ring-1 ring-purple-100/50">
                <svg className="h-10 w-10 text-purple-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Nenhum processo encontrado</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-sm">
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
                  className="mt-6 text-sm font-semibold text-[#1a3c5e] hover:text-[#0f2540] transition-colors hover:underline"
                >
                  Limpar filtros de busca
                </button>
              ) : (
                <Link
                  href="/processos/cadastro"
                  className="
                    mt-8 inline-flex items-center justify-center rounded-lg bg-[#1a3c5e] px-5 py-2.5
                    text-sm font-semibold text-white hover:bg-[#0f2540] transition-colors shadow-sm
                  "
                >
                  + Cadastrar Primeiro Processo
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100 text-left text-sm">
                  <thead className="bg-gray-50/80 text-xs font-bold uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-6 py-4">Número do Processo</th>
                      <th className="px-6 py-4">Cliente Vinculado</th>
                      <th className="px-6 py-4">Tipo</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4">Abertura</th>
                      <th className="px-6 py-4 text-center">Pagamento</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white text-gray-600">
                    {dados.map((processo) => (
                      <tr key={processo.id} className="hover:bg-purple-50/30 transition-colors group">
                        <td className="px-6 py-5 font-mono font-medium text-gray-900">
                          {formatProcessoNum(processo.numero)}
                        </td>
                        <td className="px-6 py-5 font-semibold text-[#1a3c5e]">
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
                                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                                  : processo.status === "concluido"
                                  ? "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20"
                                  : "bg-gray-50 text-gray-600 ring-1 ring-gray-500/20"
                              }
                            `}
                          >
                            <svg className={`h-1.5 w-1.5 ${
                              processo.status === "em_andamento" ? "fill-emerald-500" :
                              processo.status === "concluido" ? "fill-blue-500" : "fill-gray-400"
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
                                  ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                                  : processo.statusPagamento === "ATRASADO"
                                  ? "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                                  : "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20"
                              }
                            `}
                          >
                            <svg className={`h-1.5 w-1.5 ${
                              processo.statusPagamento === "PAGO" ? "fill-green-500" :
                              processo.statusPagamento === "ATRASADO" ? "fill-red-500" : "fill-yellow-500"
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
                          <Link
                            href={`/processos/documentos/${processo.id}`}
                            className="
                              inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-[#1a3c5e]
                              hover:bg-[#1a3c5e]/5 rounded-lg transition-colors opacity-80 group-hover:opacity-100
                            "
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                            </svg>
                            Anexos ({processo.documentos.length})
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              {paginacao && paginacao.totalPaginas > 1 && (
                <div className="flex items-center justify-between border-t border-gray-100 bg-white px-6 py-4">
                  <div className="text-sm text-gray-500">
                    Página <span className="font-medium">{page}</span> de{" "}
                    <span className="font-medium">{paginacao.totalPaginas}</span> (Total de{" "}
                    <span className="font-medium">{paginacao.total}</span> processos)
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="
                        rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700
                        hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                      "
                    >
                      Anterior
                    </button>
                    <button
                      type="button"
                      disabled={page === paginacao.totalPaginas}
                      onClick={() => setPage(page + 1)}
                      className="
                        rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700
                        hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                      "
                    >
                      Próximo
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </main>
  );
}
