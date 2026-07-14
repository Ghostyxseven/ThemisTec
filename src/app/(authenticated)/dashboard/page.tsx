"use client";

import { useDashboard } from "./useDashboard";
import React from "react";

export default function DashboardPage(): React.ReactElement {
  const { isLoading, errorMessage, estatisticas, refetch } = useDashboard();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Resumo geral do seu escritório
          </p>
        </div>
        <button
          onClick={refetch}
          disabled={isLoading}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
          title="Atualizar dados"
        >
          <svg className={`h-6 w-6 ${isLoading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
      </div>

      {errorMessage && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erro ao carregar dados</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{errorMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Card Clientes */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 transition-all hover:shadow-md">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-50/50 ring-1 ring-blue-100 rounded-full p-4">
              <svg className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">Total de Clientes</dt>
                <dd className="flex items-baseline mt-1">
                  <div className="text-4xl font-bold tracking-tight text-gray-900">
                    {isLoading ? (
                      <div className="h-10 w-16 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      estatisticas?.totalClientes ?? 0
                    )}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Card Processos Totais */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 transition-all hover:shadow-md">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-50/50 ring-1 ring-purple-100 rounded-full p-4">
              <svg className="h-7 w-7 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">Total de Processos</dt>
                <dd className="flex items-baseline mt-1">
                  <div className="text-4xl font-bold tracking-tight text-gray-900">
                    {isLoading ? (
                      <div className="h-10 w-16 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      estatisticas?.totalProcessos ?? 0
                    )}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Card Processos Ativos */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 transition-all hover:shadow-md">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-emerald-50/50 ring-1 ring-emerald-100 rounded-full p-4">
              <svg className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">Processos Ativos</dt>
                <dd className="flex items-baseline mt-1">
                  <div className="text-4xl font-bold tracking-tight text-gray-900">
                    {isLoading ? (
                      <div className="h-10 w-16 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      estatisticas?.ativosProcessos ?? 0
                    )}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
