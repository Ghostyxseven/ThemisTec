"use client";

import { use } from "react";
import Link from "next/link";
import { Scale, ArrowLeft } from "lucide-react";
import { useEditProcesso } from "../viewmodel/useEditProcesso";
import { Timeline } from "../../../components/ui/Timeline";
import { ProcessoCobrancaSection } from "../../cobrancas/view/ProcessoCobrancaSection";

export function ProcessosEditView({ params }: { params: Promise<{ id: string }> }): React.JSX.Element {
  const resolvedParams = use(params);
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isLoading,
    errorMessage,
    movimentacoes,
    clienteId,
  } = useEditProcesso(resolvedParams.id);

  return (
    <main className="flex-1 px-4 py-8 md:px-8 lg:px-10 bg-background">
      <div className="w-full max-w-3xl mx-auto">
        
        {/* Link para voltar */}
        <div className="mb-6">
          <Link
            href="/processos"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para listagem
          </Link>
        </div>

        {/* Cabeçalho */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light/10">
            <Scale className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Editar <span className="text-primary">Processo</span></h1>
            <p className="text-sm text-slate-500">
              Atualize as informações, status e honorários deste processo.
            </p>
          </div>
        </div>

        {/* Card do formulário */}
        <div className="rounded-xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200">
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary"></div>
              <p className="mt-4 text-sm text-slate-500 font-medium">Carregando dados do processo...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                <div className="h-2 w-2 rounded-full bg-violet-600" />
                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Dados Atualizáveis</h2>
              </div>

              {/* Erro geral (vindo do ViewModel) */}
              {errorMessage !== null && (
                <div
                  role="alert"
                  className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {errorMessage}
                </div>
              )}

              <form onSubmit={(e) => { void handleSubmit(e); }} noValidate className="space-y-6">
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  
                  {/* Campo Status do Processo */}
                  <div>
                    <label htmlFor="status" className="mb-1 block text-sm font-medium text-slate-700">
                      Status do Processo
                    </label>
                    <select
                      id="status"
                      {...register("status")}
                      disabled={isSubmitting}
                      className={`
                        block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md
                        disabled:cursor-not-allowed disabled:bg-slate-50
                        ${errors.status ? "border-red-400 bg-red-50" : ""}
                      `}
                    >
                      <option value="em_andamento">Em Andamento</option>
                      <option value="concluido">Concluído</option>
                      <option value="arquivado">Arquivado</option>
                    </select>
                    {errors.status?.message && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.status.message as string}
                      </p>
                    )}
                  </div>

                  {/* Campo Tipo de Ação */}
                  <div>
                    <label htmlFor="tipo" className="mb-1 block text-sm font-medium text-slate-700">
                      Tipo de Ação
                    </label>
                    <select
                      id="tipo"
                      {...register("tipo")}
                      disabled={isSubmitting}
                      className={`
                        block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md
                        disabled:cursor-not-allowed disabled:bg-slate-50
                        ${errors.tipo ? "border-red-400 bg-red-50" : ""}
                      `}
                    >
                      <option value="civil">Cível</option>
                      <option value="criminal">Criminal</option>
                      <option value="trabalhista">Trabalhista</option>
                      <option value="tributario">Tributário</option>
                      <option value="administrativo">Administrativo</option>
                      <option value="outro">Outro</option>
                    </select>
                    {errors.tipo?.message && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.tipo.message as string}
                      </p>
                    )}
                  </div>

                  {/* Campo Valor Honorários */}
                  <div>
                    <label htmlFor="valorHonorarios" className="mb-1 block text-sm font-medium text-slate-700">
                      Valor dos Honorários (R$)
                    </label>
                    <input
                      id="valorHonorarios"
                      type="number"
                      step="0.01"
                      min="0"
                      {...register("valorHonorarios", { valueAsNumber: true })}
                      disabled={isSubmitting}
                      placeholder="Ex: 5000.00"
                      className={`
                        block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md
                        disabled:cursor-not-allowed disabled:bg-slate-50
                        ${errors.valorHonorarios ? "border-red-400 bg-red-50" : ""}
                      `}
                    />
                    {errors.valorHonorarios?.message && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.valorHonorarios.message as string}
                      </p>
                    )}
                  </div>

                  {/* Campo Status do Pagamento */}
                  <div>
                    <label htmlFor="statusPagamento" className="mb-1 block text-sm font-medium text-slate-700">
                      Status do Pagamento
                    </label>
                    <select
                      id="statusPagamento"
                      {...register("statusPagamento")}
                      disabled={isSubmitting}
                      className={`
                        block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md
                        disabled:cursor-not-allowed disabled:bg-slate-50
                        ${errors.statusPagamento ? "border-red-400 bg-red-50" : ""}
                      `}
                    >
                      <option value="PENDENTE">Pendente</option>
                      <option value="PARCIAL">Parcial</option>
                      <option value="PAGO">Pago</option>
                      <option value="ATRASADO">Atrasado</option>
                    </select>
                    {errors.statusPagamento?.message && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.statusPagamento.message as string}
                      </p>
                    )}
                  </div>
                </div>

                {/* Campo Descrição */}
                <div>
                  <label htmlFor="descricao" className="mb-1 block text-sm font-medium text-slate-700">
                    Descrição do Caso
                  </label>
                  <textarea
                    id="descricao"
                    rows={4}
                    placeholder="Breve resumo sobre o que se trata a ação..."
                    {...register("descricao")}
                    disabled={isSubmitting}
                    className={`
                      block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md resize-none
                      disabled:cursor-not-allowed disabled:bg-slate-50
                      ${errors.descricao ? "border-red-400 bg-red-50" : ""}
                    `}
                  />
                  {errors.descricao?.message && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.descricao.message as string}
                    </p>
                  )}
                </div>

                {/* Ações */}
                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-100">
                  <Link
                    href="/processos"
                    className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors rounded-xl border border-slate-200 hover:bg-slate-50"
                  >
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
                      rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white
                      transition-all duration-200 hover:bg-primary-dark shadow-lg shadow-primary/25
                      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                      disabled:cursor-not-allowed disabled:opacity-60 active:scale-95
                    "
                  >
                    {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </div>
              </form>

              {/* Seção da Timeline (Injetada como Melhoria) */}
              <div className="mt-12 pt-8 border-t border-slate-200">
                <h2 className="mb-6 text-lg font-semibold text-foreground">Histórico de Movimentações</h2>
                {movimentacoes.length > 0 ? (
                  <Timeline movimentacoes={movimentacoes} />
                ) : (
                  <p className="text-sm text-zinc-500">Nenhuma movimentação registrada.</p>
                )}
              </div>

              {/* Integração de Cobranças (Faturamento) */}
              {resolvedParams.id && clienteId && !isLoading && (
                <ProcessoCobrancaSection 
                  processoId={resolvedParams.id} 
                  clienteId={clienteId} 
                />
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
