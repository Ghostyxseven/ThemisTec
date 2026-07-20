"use client";

import { useCreateCobranca } from "../viewmodel/useCreateCobranca";
import { useState } from "react";
import { PlusCircle, Link as LinkIcon } from "lucide-react";

interface ProcessoCobrancaSectionProps {
  processoId: string;
  clienteId: string;
}

export function ProcessoCobrancaSection({ processoId, clienteId }: ProcessoCobrancaSectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [cobrancaCriada, setCobrancaCriada] = useState<any | null>(null);

  const { register, handleSubmit, errors, isSubmitting, errorMessage } = useCreateCobranca((novaCobranca) => {
    setCobrancaCriada(novaCobranca);
    setIsFormOpen(false);
  });

  return (
    <div className="mt-12 pt-8 border-t border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-foreground">Faturamento (Cobranças)</h2>
        {!isFormOpen && !cobrancaCriada && (
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            Gerar Cobrança
          </button>
        )}
      </div>

      {cobrancaCriada && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <h3 className="text-green-800 font-semibold mb-2">Cobrança Gerada com Sucesso!</h3>
          <p className="text-sm text-green-700 mb-4">
            A cobrança já está disponível no portal do cliente. Você também pode enviar o link abaixo:
          </p>
          <div className="flex items-center gap-3">
            <a
              href={cobrancaCriada.link_pagamento}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 underline"
            >
              <LinkIcon className="h-4 w-4" />
              Abrir Link de Pagamento
            </a>
          </div>
          <button 
            onClick={() => setCobrancaCriada(null)}
            className="mt-4 text-xs text-slate-500 hover:text-slate-700 underline"
          >
            Gerar outra cobrança
          </button>
        </div>
      )}

      {isFormOpen && (
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <form 
            onSubmit={(e) => {
              // Injete manualmente os IDs antes de validar
              e.preventDefault();
              void handleSubmit(e);
            }} 
            className="space-y-4"
          >
            {/* Campos Ocultos para Validação */}
            <input type="hidden" {...register("processoId")} value={processoId} />
            <input type="hidden" {...register("clienteId")} value={clienteId} />

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  {...register("valor", { valueAsNumber: true })}
                  className={`w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary ${errors.valor ? 'border-red-400' : ''}`}
                  placeholder="Ex: 1500.00"
                />
                {errors.valor && <p className="text-red-500 text-xs mt-1">{errors.valor.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vencimento</label>
                <input
                  type="date"
                  {...register("vencimento")}
                  className={`w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary ${errors.vencimento ? 'border-red-400' : ''}`}
                />
                {errors.vencimento && <p className="text-red-500 text-xs mt-1">{errors.vencimento.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
              <input
                type="text"
                {...register("descricao")}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Ex: Honorários Iniciais - Processo Civil"
              />
              {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao.message}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Gerando..." : "Criar Cobrança"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
