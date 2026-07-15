"use client";

/**
 * CadastroProcessoPage — View (ADR-0007: MVVM)
 *
 * Responsabilidades:
 * - Renderizar o formulário de cadastro de processos vinculados a cliente (US07)
 * - Carregar a lista de clientes para seleção no dropdown
 * - Validar a entrada via react-hook-form + zodResolver
 * - Chamar a ViewModel useCreateProcesso
 *
 * NÃO contém lógica de banco de dados direta.
 */

import { useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Scale, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProcessoSchema } from "@/specs/schemas/processo.schema";
import type { CreateProcessoInput } from "@/specs/schemas/processo.schema";
import { useCreateProcesso } from "../viewmodel/useCreateProcesso";

export function ProcessosCreateView(): React.ReactNode {
  const {
    clientes,
    loadClientes,
    createProcesso,
    isLoading,
    isSaving,
    errorMessage,
  } = useCreateProcesso();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof CreateProcessoSchema>>({
    resolver: zodResolver(CreateProcessoSchema),
    defaultValues: {
      numero: "",
      clienteId: "",
      tipo: "civil",
      descricao: "",
      status: "em_andamento",
      dataAbertura: new Date().toISOString().split("T")[0],
      valorHonorarios: 0,
      statusPagamento: "PENDENTE",
    },
  });

  useEffect(() => {
    void loadClientes();
  }, [loadClientes]);

  const onSubmit = async (data: z.input<typeof CreateProcessoSchema>): Promise<void> => {
    await createProcesso(data as CreateProcessoInput);
  };

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
            <h1 className="text-2xl font-bold text-foreground">Novo <span className="text-primary">Processo</span></h1>
            <p className="text-sm text-slate-500">
              Cadastre um novo processo e vincule a um cliente existente.
            </p>
          </div>
        </div>

        {/* Card do formulário */}
        <div className="rounded-2xl bg-white px-8 py-10 shadow-soft border border-slate-100">
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary"></div>
              <p className="mt-4 text-sm text-slate-500 font-medium">Carregando dados necessários...</p>
            </div>
          ) : (
            <>
              <h2 className="mb-6 text-lg font-semibold text-foreground border-b border-slate-100 pb-4">Dados do Processo</h2>

              {/* Erro geral (vindo do ViewModel) */}
              {errorMessage !== null && (
                <div
                  role="alert"
                  className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {errorMessage}
                </div>
              )}

              <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} noValidate className="space-y-6">
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  
                  {/* Campo Número do Processo */}
                  <div className="col-span-1 md:col-span-2">
                    <label htmlFor="numero" className="mb-1 block text-sm font-medium text-slate-700">
                      Número do Processo (CNJ) *
                    </label>
                    <input
                      id="numero"
                      type="text"
                      {...register("numero")}
                      disabled={isSaving}
                      placeholder="Ex: 0000000-00.0000.0.00.0000"
                      aria-describedby={errors.numero ? "numero-error" : undefined}
                      aria-invalid={errors.numero !== undefined}
                      className={`
                        block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md
                        disabled:cursor-not-allowed disabled:bg-slate-50
                        ${errors.numero ? "border-red-400 bg-red-50" : ""}
                      `}
                    />
                    {errors.numero?.message !== undefined && (
                      <p id="numero-error" className="mt-1 text-sm text-red-500">
                        {errors.numero.message}
                      </p>
                    )}
                  </div>

                  {/* Campo Cliente Vinculado */}
                  <div>
                    <label htmlFor="clienteId" className="mb-1 block text-sm font-medium text-slate-700">
                      Cliente Vinculado *
                    </label>
                    {clientes.length === 0 ? (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                        Nenhum cliente cadastrado.{" "}
                        <Link href="/clientes/cadastro" className="text-primary hover:underline font-semibold">
                          Cadastre um cliente primeiro.
                        </Link>
                      </div>
                    ) : (
                      <select
                        id="clienteId"
                        {...register("clienteId")}
                        disabled={isSaving}
                        aria-describedby={errors.clienteId ? "clienteId-error" : undefined}
                        aria-invalid={errors.clienteId !== undefined}
                        className={`
                          block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md
                          disabled:cursor-not-allowed disabled:bg-slate-50
                          ${errors.clienteId ? "border-red-400 bg-red-50" : ""}
                        `}
                      >
                        <option value="">Selecione um cliente...</option>
                        {clientes.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nome} ({c.cpf})
                          </option>
                        ))}
                      </select>
                    )}
                    {errors.clienteId?.message !== undefined && (
                      <p id="clienteId-error" className="mt-1 text-sm text-red-500">
                        {errors.clienteId.message}
                      </p>
                    )}
                  </div>

                  {/* Campo Tipo de Ação */}
                  <div>
                    <label htmlFor="tipo" className="mb-1 block text-sm font-medium text-slate-700">
                      Tipo de Ação *
                    </label>
                    <select
                      id="tipo"
                      {...register("tipo")}
                      disabled={isSaving}
                      aria-describedby={errors.tipo ? "tipo-error" : undefined}
                      aria-invalid={errors.tipo !== undefined}
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
                    {errors.tipo?.message !== undefined && (
                      <p id="tipo-error" className="mt-1 text-sm text-red-500">
                        {errors.tipo.message}
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
                      disabled={isSaving}
                      placeholder="Ex: 5000.00"
                      aria-describedby={errors.valorHonorarios ? "valorHonorarios-error" : undefined}
                      aria-invalid={errors.valorHonorarios !== undefined}
                      className={`
                        block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md
                        disabled:cursor-not-allowed disabled:bg-slate-50
                        ${errors.valorHonorarios ? "border-red-400 bg-red-50" : ""}
                      `}
                    />
                    {errors.valorHonorarios?.message !== undefined && (
                      <p id="valorHonorarios-error" className="mt-1 text-sm text-red-500">
                        {errors.valorHonorarios.message}
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
                      disabled={isSaving}
                      aria-describedby={errors.statusPagamento ? "statusPagamento-error" : undefined}
                      aria-invalid={errors.statusPagamento !== undefined}
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
                    {errors.statusPagamento?.message !== undefined && (
                      <p id="statusPagamento-error" className="mt-1 text-sm text-red-500">
                        {errors.statusPagamento.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Campo Descrição (Opcional) */}
                <div>
                  <label htmlFor="descricao" className="mb-1 block text-sm font-medium text-slate-700">
                    Descrição do Caso
                  </label>
                  <textarea
                    id="descricao"
                    rows={4}
                    placeholder="Breve resumo sobre o que se trata a ação..."
                    {...register("descricao")}
                    disabled={isSaving}
                    aria-describedby={errors.descricao ? "descricao-error" : undefined}
                    aria-invalid={errors.descricao !== undefined}
                    className={`
                      block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md resize-none
                      disabled:cursor-not-allowed disabled:bg-slate-50
                      ${errors.descricao ? "border-red-400 bg-red-50" : ""}
                    `}
                  />
                  {errors.descricao?.message !== undefined && (
                    <p id="descricao-error" className="mt-1 text-sm text-red-500">
                      {errors.descricao.message}
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
                    disabled={isSaving || clientes.length === 0}
                    className="
                      rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white
                      transition-all duration-200 hover:bg-primary-dark shadow-lg shadow-primary/25
                      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                      disabled:cursor-not-allowed disabled:opacity-60 active:scale-95
                    "
                  >
                    {isSaving ? "Salvando..." : "Salvar Processo"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
