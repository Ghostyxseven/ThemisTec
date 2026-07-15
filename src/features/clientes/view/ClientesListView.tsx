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
import { useListClientes } from "../viewmodel/useListClientes";
import { Users, UserCheck, UserPlus, TrendingUp, Search, SlidersHorizontal, Download } from "lucide-react";

const formatCpf = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

export function ClientesListView(): React.ReactNode {
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

  const totalClientes = paginacao?.total ?? 0;

  return (
    <main className="flex-1 px-4 py-8 md:px-8 lg:px-10">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Gestão de <span className="text-primary">Clientes</span>
              </h1>
              <p className="text-sm text-slate-500">
                Gerencie os dados e visualize o cadastro de clientes ativos no sistema.
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
              href="/clientes/cadastro"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-95"
            >
              + Novo Cliente
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={localSearch}
              onChange={handleSearchChange}
              placeholder="Buscar cliente por nome ou CPF..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md"
            />
          </div>
          <button className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 shadow-sm hover:bg-slate-50 hover:shadow-md transition-all">
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        {/* Error */}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-4 rounded-2xl bg-white p-5 border border-slate-100 shadow-soft transition-all hover:shadow-card">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-blue-500 uppercase tracking-wider">Total de Clientes</p>
              <p className="text-xl font-bold text-foreground">{isLoading ? "..." : totalClientes}</p>
              <p className="text-[11px] text-slate-400">{totalClientes === 0 ? "Nenhum cadastro ainda" : `${totalClientes} cadastrado(s)`}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl bg-white p-5 border border-slate-100 shadow-soft transition-all hover:shadow-card">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <UserCheck className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-500 uppercase tracking-wider">Clientes Ativos</p>
              <p className="text-xl font-bold text-foreground">{isLoading ? "..." : totalClientes}</p>
              <p className="text-[11px] text-slate-400">{totalClientes === 0 ? "Nenhum ativo" : "Ativos no sistema"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl bg-white p-5 border border-slate-100 shadow-soft transition-all hover:shadow-card">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50">
              <UserPlus className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-purple-500 uppercase tracking-wider">Novos (este mês)</p>
              <p className="text-xl font-bold text-foreground">0</p>
              <p className="text-[11px] text-slate-400">Nenhum novo cliente</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl bg-white p-5 border border-slate-100 shadow-soft transition-all hover:shadow-card">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
              <TrendingUp className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-amber-500 uppercase tracking-wider">Taxa de Conversão</p>
              <p className="text-xl font-bold text-foreground">0%</p>
              <p className="text-[11px] text-slate-400">Sem dados ainda</p>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-soft border border-slate-100">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-100 border-t-primary"></div>
              <p className="mt-4 text-sm text-slate-500 font-medium">Buscando informações...</p>
            </div>
          ) : dados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-light/10 mb-5">
                <Users className="h-10 w-10 text-primary-light/60" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Nenhum cliente cadastrado</h3>
              <p className="mt-2 text-sm text-slate-500 max-w-sm">
                Sua base de clientes está vazia ou a busca não encontrou resultados.
                Cadastre um novo cliente para começar.
              </p>
              <div className="mt-8">
                <Link
                  href="/clientes/cadastro"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark active:scale-95"
                >
                  + Cadastrar Primeiro Cliente
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-left">
                <thead className="bg-slate-50/80">
                  <tr className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4">Nome do Cliente</th>
                    <th className="px-6 py-4">CPF</th>
                    <th className="px-6 py-4">Telefone</th>
                    <th className="px-6 py-4">E-mail</th>
                    <th className="px-6 py-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm text-slate-600 bg-white">
                  {dados.map((cliente) => {
                    const avatarLetter = cliente.nome.charAt(0).toUpperCase();
                    return (
                      <tr key={cliente.id} className="hover:bg-primary/[0.02] transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light/10 text-primary font-bold text-sm">
                              {avatarLetter}
                            </div>
                            <span className="font-semibold text-foreground">{cliente.nome}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-slate-700 font-medium font-mono text-xs">{formatCpf(cliente.cpf)}</td>
                        <td className="px-6 py-5 whitespace-nowrap">{cliente.telefone || <span className="text-slate-300 italic">Não informado</span>}</td>
                        <td className="px-6 py-5 whitespace-nowrap">{cliente.email || <span className="text-slate-300 italic">Não informado</span>}</td>
                        <td className="px-6 py-5 whitespace-nowrap text-center">
                          <div className="inline-flex gap-4 items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`/clientes/edicao/${cliente.id}`}
                              className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                              title="Editar"
                            >
                              Editar
                            </Link>
                            <button
                              type="button"
                              onClick={() => { void handleExcluir(cliente.id, cliente.nome); }}
                              className="text-sm font-medium text-red-400 hover:text-red-600 transition-colors"
                              title="Excluir"
                            >
                              Excluir
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
                <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4">
                  <div className="text-sm text-slate-500">
                    Página <span className="font-medium">{page}</span> de{" "}
                    <span className="font-medium">{paginacao.totalPaginas}</span> (Total: {paginacao.total} clientes)
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handlePrevPage}
                      disabled={page === 1}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Anterior
                    </button>
                    <button
                      type="button"
                      onClick={handleNextPage}
                      disabled={page >= paginacao.totalPaginas}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
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
