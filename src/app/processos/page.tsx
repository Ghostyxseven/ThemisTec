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
          <div>
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
        <div className="overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#1a3c5e]"></div>
              <p className="mt-4 text-sm text-gray-500 font-medium">Buscando processos...</p>
            </div>
          ) : dados.length === 0 ? (
            /* Estado Vazio (Empty State) */
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <span className="text-5xl">folder_open</span>
              <h3 className="mt-4 text-lg font-bold text-gray-700">Nenhum processo encontrado</h3>
              <p className="mt-1 text-sm text-gray-400 max-w-sm">
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
                  className="mt-6 text-sm font-semibold text-[#1a3c5e] hover:underline"
                >
                  Limpar filtros de busca
                </button>
              ) : (
                <Link
                  href="/processos/cadastro"
                  className="mt-6 text-sm font-semibold text-[#1a3c5e] hover:underline"
                >
                  Cadastrar seu primeiro processo
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100 text-left text-sm">
                  <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
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
                  <tbody className="divide-y divide-gray-100 bg-white text-gray-700">
                    {dados.map((processo) => (
                      <tr key={processo.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono font-medium text-gray-900">
                          {formatProcessoNum(processo.numero)}
                        </td>
                        <td className="px-6 py-4 font-semibold text-[#1a3c5e]">
                          {processo.clienteNome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {translateTipo(processo.tipo)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`
                              inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border
                              ${
                                processo.status === "em_andamento"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : processo.status === "concluido"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-gray-100 text-gray-600 border-gray-200"
                              }
                            `}
                          >
                            {processo.status === "em_andamento"
                              ? "Em Andamento"
                              : processo.status === "concluido"
                              ? "Concluído"
                              : "Arquivado"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDate(processo.dataAbertura)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`
                              inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border
                              ${
                                processo.statusPagamento === "PAGO"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : processo.statusPagamento === "ATRASADO"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
                              }
                            `}
                          >
                            {processo.statusPagamento === "PAGO"
                              ? "Pago"
                              : processo.statusPagamento === "ATRASADO"
                              ? "Atrasado"
                              : "Pendente"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex gap-2">
                            {/* Link para visualização/documentos de anexo (Story 09) */}
                            <Link
                              href={`/processos/documentos/${processo.id}`}
                              className="
                                px-3 py-1.5 text-xs font-semibold text-[#1a3c5e] border border-[#1a3c5e]/30
                                rounded-md hover:bg-[#1a3c5e]/5 transition-colors inline-block
                              "
                            >
                              Anexos ({processo.documentos.length})
                            </Link>
                          </div>
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
