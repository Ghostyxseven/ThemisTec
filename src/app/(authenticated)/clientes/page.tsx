"use client";

/**
 * ClientesPage — View (ADR-0007: MVVM)
 *
 * Responsabilidades:
 * - Exibir tabela/listagem de clientes (US05)
 * - Prover barra de pesquisa reativa por Nome ou CPF
 * - Paginar resultados e gerenciar navegação
 *
 * A View não conhece detalhes do Firestore/Firebase.
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { useListClientes } from "./useListClientes";

const formatCpf = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

export default function ClientesPage(): React.ReactNode {
  const {
    dados,
    paginacao,
    isLoading,
    errorMessage,
    setSearch,
    page,
    setPage,
    excluirCliente,
    isExporting,
    exportarCsv,
  } = useListClientes();

  const handleExcluir = async (id: string, nome: string): Promise<void> => {
    const confirmou = window.confirm(
      `Tem certeza que deseja excluir o cliente "${nome}"? Esta ação não pode ser desfeita.`
    );
    if (confirmou) {
      await excluirCliente(id);
    }
  };

  const [localSearch, setLocalSearch] = useState("");

  // Debounce do input de busca (300ms)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearch(localSearch);
      setPage(1); // Reseta para primeira página ao buscar
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [localSearch, setSearch, setPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLocalSearch(e.target.value);
  };

  const handlePrevPage = (): void => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = (): void => {
    if (paginacao && page < paginacao.totalPaginas) {
      setPage(page + 1);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-12 md:px-8">
      <div className="w-full max-w-5xl">
        
        {/* Topo / Título & CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1a3c5e]">Gestão de Clientes</h1>
            <p className="mt-2 text-sm text-gray-500">
              Gerencie os dados e visualize o cadastro de clientes ativos no sistema.
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
              href="/clientes/cadastro"
              className="
                inline-flex items-center justify-center rounded-lg bg-[#1a3c5e] px-5 py-2.5
                text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0f2540]
                focus:outline-none focus:ring-2 focus:ring-[#1a3c5e] focus:ring-offset-2
              "
            >
              + Novo Cliente
            </Link>
          </div>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={localSearch}
              onChange={handleSearchChange}
              placeholder="Buscar cliente por nome ou CPF..."
              className="
                w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm
                outline-none transition-colors focus:border-[#1a3c5e] focus:ring-2 focus:ring-[#1a3c5e]/20
              "
            />
          </div>
        </div>

        {/* Erro */}
        {errorMessage !== null && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {errorMessage}
          </div>
        )}

        {/* Container da Tabela */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-100 border-t-[#1a3c5e]"></div>
              <p className="mt-4 text-sm text-gray-500 font-medium">Buscando informações...</p>
            </div>
          ) : dados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="rounded-full bg-blue-50 p-5 mb-5 ring-1 ring-blue-100/50">
                <svg className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Nenhum cliente cadastrado</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-sm">
                Sua base de clientes está vazia ou a busca não encontrou resultados. Cadastre um novo cliente para começar.
              </p>
              <div className="mt-8">
                <Link
                  href="/clientes/cadastro"
                  className="
                    inline-flex items-center justify-center rounded-lg bg-[#1a3c5e] px-5 py-2.5
                    text-sm font-semibold text-white hover:bg-[#0f2540] transition-colors shadow-sm
                  "
                >
                  + Cadastrar Primeiro Cliente
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 text-left">
                <thead className="bg-gray-50/80">
                  <tr className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4">Nome do Cliente</th>
                    <th className="px-6 py-4">CPF</th>
                    <th className="px-6 py-4">Telefone</th>
                    <th className="px-6 py-4">E-mail</th>
                    <th className="px-6 py-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm text-gray-600 bg-white">
                  {dados.map((cliente) => {
                    const avatarLetter = cliente.nome.charAt(0).toUpperCase();
                    return (
                      <tr key={cliente.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100/80 text-blue-700 font-bold text-sm ring-1 ring-blue-200/50">
                              {avatarLetter}
                            </div>
                            <span className="font-semibold text-gray-900">{cliente.nome}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-gray-700 font-medium">{formatCpf(cliente.cpf)}</td>
                        <td className="px-6 py-5 whitespace-nowrap">{cliente.telefone || <span className="text-gray-400 italic">Não informado</span>}</td>
                        <td className="px-6 py-5 whitespace-nowrap">{cliente.email || <span className="text-gray-400 italic">Não informado</span>}</td>
                        <td className="px-6 py-5 whitespace-nowrap text-center">
                          <div className="inline-flex gap-3 items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`/clientes/edicao/${cliente.id}`}
                              className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                              title="Editar"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.89 1.14l-2.815.93a.75.75 0 01-.95-.95l.93-2.815a4.5 4.5 0 011.14-1.89l13.43-13.43z" />
                              </svg>
                            </Link>
                            <button
                              type="button"
                              onClick={() => { void handleExcluir(cliente.id, cliente.nome); }}
                              className="text-red-500 hover:text-red-700 transition-colors p-1"
                              title="Excluir"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Paginação */}
              {paginacao && paginacao.totalPaginas > 1 && (
                <div className="flex items-center justify-between border-t border-gray-100 bg-white px-6 py-4">
                  <div className="text-sm text-gray-500">
                    Página <span className="font-medium">{page}</span> de{" "}
                    <span className="font-medium">{paginacao.totalPaginas}</span> (Total: {paginacao.total} clientes)
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handlePrevPage}
                      disabled={page === 1}
                      className="
                        rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600
                        transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50
                      "
                    >
                      Anterior
                    </button>
                    <button
                      type="button"
                      onClick={handleNextPage}
                      disabled={page >= paginacao.totalPaginas}
                      className="
                        rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600
                        transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50
                      "
                    >
                      Próximo
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </main>
  );
}
