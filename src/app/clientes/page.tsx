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
        <div className="overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#1a3c5e]"></div>
              <p className="mt-4 text-sm text-gray-500 font-medium">Buscando informações...</p>
            </div>
          ) : dados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <svg
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Nenhum cliente cadastrado</h3>
              <p className="mt-1 text-sm text-gray-500 max-w-sm">
                Não localizamos nenhum cliente correspondente à sua busca. Comece cadastrando um novo cliente.
              </p>
              <div className="mt-6">
                <Link
                  href="/clientes/cadastro"
                  className="
                    inline-flex items-center justify-center rounded-lg bg-gray-100 px-4 py-2
                    text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors
                  "
                >
                  Cadastrar Cliente
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4">Nome</th>
                    <th className="px-6 py-4">CPF</th>
                    <th className="px-6 py-4">Telefone</th>
                    <th className="px-6 py-4">E-mail</th>
                    <th className="px-6 py-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
                  {dados.map((cliente) => (
                    <tr key={cliente.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-800">{cliente.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatCpf(cliente.cpf)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{cliente.telefone || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{cliente.email || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="inline-flex gap-2">
                          <Link
                            href={`/clientes/edicao/${cliente.id}`}
                            className="
                              px-3 py-1.5 text-xs font-semibold text-[#1a3c5e] border border-[#1a3c5e]/30
                              rounded-md hover:bg-[#1a3c5e]/5 transition-colors inline-block
                            "
                          >
                            Editar
                          </Link>
                          <button
                            type="button"
                            onClick={() => { void handleExcluir(cliente.id, cliente.nome); }}
                            className="
                              px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200
                              rounded-md hover:bg-red-50 transition-colors
                            "
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
