"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Calendar, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePrazoSchema, CreatePrazoInput } from "@/specs/schemas/prazo.schema";
import { useCreatePrazo } from "../viewmodel/useCreatePrazo";

export function PrazosCreateView(): React.JSX.Element {
  const {
    processos,
    loadProcessos,
    createPrazo,
    isLoading,
    isSaving,
    errorMessage,
  } = useCreatePrazo();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof CreatePrazoSchema>>({
    resolver: zodResolver(CreatePrazoSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      processoId: "",
      dataVencimento: "",
      status: "PENDENTE",
    },
  });

  useEffect(() => {
    void loadProcessos();
  }, [loadProcessos]);

  const onSubmit = async (data: z.input<typeof CreatePrazoSchema>): Promise<void> => {
    await createPrazo(data as CreatePrazoInput);
  };

  return (
    <main className="flex-1 px-4 py-8 md:px-8 lg:px-10 bg-background">
      <div className="w-full max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href="/prazos"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para agenda
          </Link>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light/10">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Novo <span className="text-primary">Prazo</span></h1>
            <p className="text-sm text-slate-500">
              Vincule uma data importante a um processo existente.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white px-8 py-10 shadow-soft border border-slate-100">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary"></div>
              <p className="mt-4 text-sm text-slate-500 font-medium">Carregando processos...</p>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} noValidate className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  
                  <div className="col-span-1 md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">Título *</label>
                    <input
                      type="text"
                      {...register("titulo")}
                      disabled={isSaving}
                      placeholder="Ex: Audiência de Instrução"
                      className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                    {errors.titulo && <p className="mt-1 text-sm text-red-500">{errors.titulo.message}</p>}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Processo Vinculado *</label>
                    <select
                      {...register("processoId")}
                      disabled={isSaving}
                      className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                    >
                      <option value="">Selecione um processo...</option>
                      {processos.map((p) => (
                        <option key={p.id} value={p.id}>{p.numero} - {p.clienteNome}</option>
                      ))}
                    </select>
                    {errors.processoId && <p className="mt-1 text-sm text-red-500">{errors.processoId.message}</p>}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Data de Vencimento *</label>
                    <input
                      type="date"
                      {...register("dataVencimento")}
                      disabled={isSaving}
                      className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                    {errors.dataVencimento && <p className="mt-1 text-sm text-red-500">{errors.dataVencimento.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Descrição (Opcional)</label>
                  <textarea
                    rows={3}
                    {...register("descricao")}
                    disabled={isSaving}
                    placeholder="Instruções adicionais sobre o prazo..."
                    className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                  />
                  {errors.descricao && <p className="mt-1 text-sm text-red-500">{errors.descricao.message}</p>}
                </div>

                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-100">
                  <Link href="/prazos" className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200">
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    disabled={isSaving || processos.length === 0}
                    className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark shadow-lg shadow-primary/25 disabled:opacity-60"
                  >
                    {isSaving ? "Salvando..." : "Salvar Prazo"}
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
