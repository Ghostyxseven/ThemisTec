"use client";

import { useDashboard } from "../viewmodel/useDashboard";
import React from "react";
import Link from "next/link";
import { Users, Scale, ArrowUpRight, RefreshCcw, Calendar, DollarSign, Activity, AlertCircle } from "lucide-react";

export function DashboardView(): React.ReactElement {
  const { isLoading, errorMessage, estatisticas, refetch } = useDashboard();

  return (
    <div className="flex-1 px-4 py-8 md:px-8 lg:px-10">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">

        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Resumo geral do seu escritório</p>
          </div>
          <button
            onClick={refetch}
            disabled={isLoading}
            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
            title="Atualizar dados"
          >
            <RefreshCcw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Error State */}
        {errorMessage && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Erro ao carregar dados</p>
              <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card Clientes */}
          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                <Users className="h-5 w-5" />
              </div>
              <Link href="/clientes" className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors opacity-0 group-hover:opacity-100">
                Ver todos <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <p className="section-label">Total de Clientes</p>
            <div className="mt-1">
              {isLoading ? (
                <div className="skeleton h-9 w-16" />
              ) : (
                <p className="text-3xl font-bold text-slate-900 tracking-tight">{estatisticas?.totalClientes ?? 0}</p>
              )}
            </div>
          </div>

          {/* Card Processos Totais */}
          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-100 transition-colors">
                <Scale className="h-5 w-5" />
              </div>
              <Link href="/processos" className="flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors opacity-0 group-hover:opacity-100">
                Ver todos <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <p className="section-label">Total de Processos</p>
            <div className="mt-1">
              {isLoading ? (
                <div className="skeleton h-9 w-16" />
              ) : (
                <p className="text-3xl font-bold text-slate-900 tracking-tight">{estatisticas?.totalProcessos ?? 0}</p>
              )}
            </div>
          </div>

          {/* Card Processos Ativos */}
          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                <Activity className="h-5 w-5" />
              </div>
            </div>
            <p className="section-label">Processos Ativos</p>
            <div className="mt-1">
              {isLoading ? (
                <div className="skeleton h-9 w-16" />
              ) : (
                <p className="text-3xl font-bold text-slate-900 tracking-tight">{estatisticas?.ativosProcessos ?? 0}</p>
              )}
            </div>
          </div>

          {/* Card Honorários */}
          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <p className="section-label">Honorários a Receber</p>
            <div className="mt-1">
              {isLoading ? (
                <div className="skeleton h-9 w-24" />
              ) : (
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estatisticas?.honorariosAReceber ?? 0)}
                </p>
              )}
            </div>
          </div>

          {/* Card Prazos da Semana */}
          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
                <Calendar className="h-5 w-5" />
              </div>
              <Link href="/prazos" className="flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors opacity-0 group-hover:opacity-100">
                Ver todos <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <p className="section-label">Prazos (Próx. 7 dias)</p>
            <div className="mt-1 flex items-baseline gap-2">
              {isLoading ? (
                <div className="skeleton h-9 w-12" />
              ) : (
                <>
                  <p className="text-3xl font-bold text-slate-900 tracking-tight">{estatisticas?.prazosDaSemana ?? 0}</p>
                  {(estatisticas?.prazosDaSemana ?? 0) > 0 && (
                    <span className="badge badge-warning">atenção</span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              href="/clientes/cadastro"
              className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-4 text-center text-sm font-medium text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <Users className="h-5 w-5" />
              Novo Cliente
            </Link>
            <Link
              href="/processos/cadastro"
              className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-4 text-center text-sm font-medium text-slate-600 transition-all hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
            >
              <Scale className="h-5 w-5" />
              Novo Processo
            </Link>
            <Link
              href="/prazos/cadastro"
              className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-4 text-center text-sm font-medium text-slate-600 transition-all hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
            >
              <Calendar className="h-5 w-5" />
              Novo Prazo
            </Link>
            <Link
              href="/financeiro"
              className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-4 text-center text-sm font-medium text-slate-600 transition-all hover:border-green-200 hover:bg-green-50 hover:text-green-700"
            >
              <DollarSign className="h-5 w-5" />
              Financeiro
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
