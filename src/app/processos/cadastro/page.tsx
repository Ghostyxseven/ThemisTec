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
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProcessoSchema } from "@/specs/schemas/processo.schema";
import type { CreateProcessoInput } from "@/specs/schemas/processo.schema";
import { useCreateProcesso } from "./useCreateProcesso";

export default function CadastroProcessoPage(): React.ReactNode {
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
  } = useForm<CreateProcessoInput>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreateProcessoSchema) as any,
    defaultValues: {
      numero: "",
      tipo: "civil",
      status: "em_andamento",
      descricao: "",
      clienteId: "",
      dataAbertura: "",
    },
  });

  // Carrega clientes da conta ativa para alimentar o dropdown
  useEffect(() => {
    void loadClientes();
  }, [loadClientes]);

  const onSubmit = async (data: CreateProcessoInput): Promise<void> => {
    await createProcesso(data);
  };

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>): void => {
    void handleSubmit(onSubmit)(e);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-12 md:px-8">
      <div className="w-full max-w-2xl">
        
        {/* Link para voltar */}
        <div className="mb-6">
          <Link
            href="/processos"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Voltar para listagem
          </Link>
        </div>

        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1a3c5e]">Novo Processo</h1>
          <p className="mt-2 text-sm text-gray-500">
            Cadastre os dados de um novo processo e vincule a um cliente cadastrado.
          </p>
        </div>

        {/* Card do formulário */}
        <div className="rounded-2xl bg-white px-8 py-10 shadow-md">
          <h2 className="mb-6 text-xl font-semibold text-gray-800">Dados do Processo</h2>

          {/* Erro geral (vindo do ViewModel) */}
          {errorMessage !== null && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {errorMessage}
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#1a3c5e]"></div>
              <p className="mt-4 text-sm text-gray-500 font-medium">Buscando relação de clientes...</p>
            </div>
          ) : (
            <form onSubmit={onSubmitForm} noValidate className="space-y-6">
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                
                {/* Campo Número do Processo */}
                <div>
                  <label htmlFor="numero" className="mb-1 block text-sm font-medium text-gray-700">
                    Número do Processo *
                  </label>
                  <input
                    id="numero"
                    type="text"
                    {...register("numero")}
                    disabled={isSaving}
                    placeholder="Ex: 5003928-12.2026.8.24.0023"
                    aria-describedby={errors.numero ? "numero-error" : undefined}
                    aria-invalid={errors.numero !== undefined}
                    className={`
                      w-full rounded-lg border px-4 py-2.5 text-sm
                      outline-none transition-colors
                      focus:border-[#1a3c5e] focus:ring-2 focus:ring-[#1a3c5e]/20
                      disabled:cursor-not-allowed disabled:bg-gray-100
                      ${errors.numero ? "border-red-400 bg-red-50" : "border-gray-300"}
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
                  <label htmlFor="clienteId" className="mb-1 block text-sm font-medium text-gray-700">
                    Cliente Vinculado *
                  </label>
                  {clientes.length === 0 ? (
                    <div className="text-sm text-gray-500 mt-2">
                      Nenhum cliente cadastrado.{" "}
                      <Link href="/clientes/cadastro" className="text-[#1a3c5e] hover:underline font-semibold">
                        Cadastrar agora
                      </Link>
                    </div>
                  ) : (
                    <>
                      <select
                        id="clienteId"
                        {...register("clienteId")}
                        disabled={isSaving}
                        aria-describedby={errors.clienteId ? "clienteId-error" : undefined}
                        aria-invalid={errors.clienteId !== undefined}
                        className={`
                          w-full rounded-lg border px-4 py-2.5 text-sm bg-white
                          outline-none transition-colors
                          focus:border-[#1a3c5e] focus:ring-2 focus:ring-[#1a3c5e]/20
                          disabled:cursor-not-allowed disabled:bg-gray-100
                          ${errors.clienteId ? "border-red-400 bg-red-50" : "border-gray-300"}
                        `}
                      >
                        <option value="">Selecione um cliente...</option>
                        {clientes.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nome} ({c.cpf.slice(0, 3)}.***.***-**)
                          </option>
                        ))}
                      </select>
                      {errors.clienteId?.message !== undefined && (
                        <p id="clienteId-error" className="mt-1 text-sm text-red-500">
                          {errors.clienteId.message}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Campo Tipo do Processo */}
                <div>
                  <label htmlFor="tipo" className="mb-1 block text-sm font-medium text-gray-700">
                    Tipo do Processo *
                  </label>
                  <select
                    id="tipo"
                    {...register("tipo")}
                    disabled={isSaving}
                    className="
                      w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm
                      outline-none transition-colors
                      focus:border-[#1a3c5e] focus:ring-2 focus:ring-[#1a3c5e]/20
                      disabled:cursor-not-allowed disabled:bg-gray-100
                    "
                  >
                    <option value="civil">Cível</option>
                    <option value="criminal">Criminal</option>
                    <option value="trabalhista">Trabalhista</option>
                    <option value="tributario">Tributário</option>
                    <option value="administrativo">Administrativo</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                {/* Campo Data de Abertura */}
                <div>
                  <label htmlFor="dataAbertura" className="mb-1 block text-sm font-medium text-gray-700">
                    Data de Abertura *
                  </label>
                  <input
                    id="dataAbertura"
                    type="date"
                    {...register("dataAbertura")}
                    disabled={isSaving}
                    aria-describedby={errors.dataAbertura ? "dataAbertura-error" : undefined}
                    aria-invalid={errors.dataAbertura !== undefined}
                    className={`
                      w-full rounded-lg border px-4 py-2.5 text-sm
                      outline-none transition-colors
                      focus:border-[#1a3c5e] focus:ring-2 focus:ring-[#1a3c5e]/20
                      disabled:cursor-not-allowed disabled:bg-gray-100
                      ${errors.dataAbertura ? "border-red-400 bg-red-50" : "border-gray-300"}
                    `}
                  />
                  {errors.dataAbertura?.message !== undefined && (
                    <p id="dataAbertura-error" className="mt-1 text-sm text-red-500">
                      {errors.dataAbertura.message}
                    </p>
                  )}
                </div>

              </div>

              {/* Campo Descrição */}
              <div>
                <label htmlFor="descricao" className="mb-1 block text-sm font-medium text-gray-700">
                  Descrição / Detalhes do Processo
                </label>
                <textarea
                  id="descricao"
                  rows={4}
                  placeholder="Sumário do objeto da ação, pedidos ou anotações relevantes"
                  {...register("descricao")}
                  disabled={isSaving}
                  aria-describedby={errors.descricao ? "descricao-error" : undefined}
                  aria-invalid={errors.descricao !== undefined}
                  className={`
                    w-full rounded-lg border px-4 py-2.5 text-sm
                    outline-none transition-colors resize-none
                    focus:border-[#1a3c5e] focus:ring-2 focus:ring-[#1a3c5e]/20
                    disabled:cursor-not-allowed disabled:bg-gray-100
                    ${errors.descricao ? "border-red-400 bg-red-50" : "border-gray-300"}
                  `}
                />
                {errors.descricao?.message !== undefined && (
                  <p id="descricao-error" className="mt-1 text-sm text-red-500">
                    {errors.descricao.message}
                  </p>
                )}
              </div>

              {/* Ações */}
              <div className="flex items-center justify-end space-x-4 pt-4 border-t">
                <Link
                  href="/processos"
                  className="
                    px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800
                    transition-colors rounded-lg border border-gray-300 hover:bg-gray-50
                  "
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="
                    rounded-lg bg-[#1a3c5e] px-6 py-2.5
                    text-sm font-semibold text-white
                    transition-colors hover:bg-[#0f2540]
                    focus:outline-none focus:ring-2 focus:ring-[#1a3c5e] focus:ring-offset-2
                    disabled:cursor-not-allowed disabled:opacity-60
                  "
                >
                  {isSaving ? "Salvando..." : "Registrar Processo"}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </main>
  );
}
