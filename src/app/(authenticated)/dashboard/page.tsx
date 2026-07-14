"use client";

import { useDashboard } from "./useDashboard";
import React from "react";
import Link from "next/link";
import { LayoutDashboard, Users, Scale, ArrowUpRight, RefreshCcw } from "lucide-react";

export default function DashboardPage(): React.ReactElement {
  const { isLoading, errorMessage, estatisticas, refetch } = useDashboard();

  return (
    <div className="flex-1 px-4 py-8 md:px-8 lg:px-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light/10">
              <LayoutDashboard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                <span className="text-primary">Dashboard</span>
              </h1>
              <p className="text-sm text-slate-500">
                Resumo geral do seu escritório
              </p>
            </div>
          </div>
          <button
            onClick={refetch}
            disabled={isLoading}
            className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 disabled:opacity-50"
            title="Atualizar dados"
          >
            <RefreshCcw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {errorMessage && (
          <div className="rounded-xl bg-red-50 p-4 border border-red-200">
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {/* Card Clientes */}
          <div className="rounded-2xl bg-white border border-slate-100 shadow-soft p-6 transition-all duration-300 hover:shadow-card hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <Link href="/clientes" className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark transition-colors">
                Ver todos <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total de Clientes</p>
            <div className="mt-1">
              {isLoading ? (
                <div className="h-9 w-16 bg-slate-100 rounded-lg animate-pulse"></div>
              ) : (
                <p className="text-3xl font-bold text-foreground tracking-tight">{estatisticas?.totalClientes ?? 0}</p>
              )}
            </div>
          </div>

          {/* Card Processos Totais */}
          <div className="rounded-2xl bg-white border border-slate-100 shadow-soft p-6 transition-all duration-300 hover:shadow-card hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
                <Scale className="h-6 w-6 text-purple-500" />
              </div>
              <Link href="/processos" className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark transition-colors">
                Ver todos <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total de Processos</p>
            <div className="mt-1">
              {isLoading ? (
                <div className="h-9 w-16 bg-slate-100 rounded-lg animate-pulse"></div>
              ) : (
                <p className="text-3xl font-bold text-foreground tracking-tight">{estatisticas?.totalProcessos ?? 0}</p>
              )}
            </div>
          </div>

          {/* Card Processos Ativos */}
          <div className="rounded-2xl bg-white border border-slate-100 shadow-soft p-6 transition-all duration-300 hover:shadow-card hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Processos Ativos</p>
            <div className="mt-1">
              {isLoading ? (
                <div className="h-9 w-16 bg-slate-100 rounded-lg animate-pulse"></div>
              ) : (
                <p className="text-3xl font-bold text-foreground tracking-tight">{estatisticas?.ativosProcessos ?? 0}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
