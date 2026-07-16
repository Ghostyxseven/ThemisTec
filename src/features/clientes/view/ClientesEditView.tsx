"use client";

/**
 * EdicaoClientePage — View (ADR-0007: MVVM)
 *
 * Responsabilidades:
 * - Renderizar o formulário de edição de cliente (US06)
 * - Exibir o CPF como leitura/bloqueado para edição
 * - Validar a entrada via react-hook-form + zodResolver
 * - Chamar a ViewModel useUpdateCliente
 *
 * NÃO contém lógica de banco de dados direta.
 */

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { UserCheck, ArrowLeft } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateClienteSchema } from "@/specs/schemas/cliente.schema";
import type { UpdateClienteInput } from "@/specs/schemas/cliente.schema";
import { useUpdateCliente } from "../viewmodel/useUpdateCliente";

const formatCpf = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

export function ClientesEditView(): React.ReactNode {
  const { id } = useParams<{ id: string }>();
  const {
    cliente,
    loadCliente,
    updateCliente,
    isLoading,
    isSaving,
    errorMessage,
  } = useUpdateCliente();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateClienteInput>({
    resolver: zodResolver(UpdateClienteSchema),
    defaultValues: {
      nome: "",
      cpf: "",
      email: "",
      telefone: "",
      endereco: "",
      observacoes: "",
    },
  });

  useEffect(() => {
    if (id) {
      void loadCliente(id);
    }
  }, [id, loadCliente]);

  useEffect(() => {
    if (cliente) {
      reset({
        nome: cliente.nome,
        cpf: formatCpf(cliente.cpf),
        email: cliente.email || "",
        telefone: cliente.telefone || "",
        endereco: cliente.endereco || "",
        observacoes: cliente.observacoes || "",
      });
    }
  }, [cliente, reset]);

  const onSubmit = async (data: UpdateClienteInput): Promise<void> => {
    if (id) {
      await updateCliente(id, data);
    }
  };

  return (
    <main className="flex-1 px-4 py-8 md:px-8 lg:px-10 bg-background">
      <div className="w-full max-w-2xl mx-auto">
        
        {/* Link de volta */}
        <div className="mb-6">
          <Link
            href="/clientes"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancelar e voltar
          </Link>
        </div>

        {/* Cabeçalho */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light/10">
            <UserCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Editar <span className="text-primary">Cliente</span></h1>
            <p className="text-sm text-slate-500">
              Atualize as informações cadastrais do cliente selecionado.
            </p>
          </div>
        </div>

        {/* Card do formulário */}
        <div className="rounded-2xl bg-white px-8 py-10 shadow-soft border border-slate-100">
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary"></div>
              <p className="mt-4 text-sm text-slate-500 font-medium">Buscando dados do cliente...</p>
            </div>
          ) : (
            <>
              <h2 className="mb-6 text-lg font-semibold text-foreground border-b border-slate-100 pb-4">Dados Cadastrais</h2>

              {/* Erro geral */}
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
                  
                  {/* Campo Nome */}
                  <div>
                    <label htmlFor="nome" className="mb-1 block text-sm font-medium text-slate-700">
                      Nome Completo *
                    </label>
                    <input
                      id="nome"
                      type="text"
                      {...register("nome")}
                      disabled={isSaving}
                      placeholder="Nome do cliente"
                      aria-describedby={errors.nome ? "nome-error" : undefined}
                      aria-invalid={errors.nome !== undefined}
                      className={`
                        block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md
                        disabled:cursor-not-allowed disabled:bg-slate-50
                        ${errors.nome ? "border-red-400 bg-red-50" : ""}
                      `}
                    />
                    {errors.nome?.message !== undefined && (
                      <p id="nome-error" className="mt-1 text-sm text-red-500">
                        {errors.nome.message}
                      </p>
                    )}
                  </div>

                  {/* Campo CPF (Editável) */}
                  <div>
                    <label htmlFor="cpf" className="mb-1 block text-sm font-medium text-slate-700">
                      CPF
                    </label>
                    <input
                      id="cpf"
                      type="text"
                      inputMode="numeric"
                      placeholder="000.000.000-00"
                      {...register("cpf")}
                      disabled={isSaving}
                      aria-describedby={errors.cpf ? "cpf-error" : "cpf-hint"}
                      aria-invalid={errors.cpf !== undefined}
                      className={`
                        block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md
                        disabled:cursor-not-allowed disabled:bg-slate-50
                        ${errors.cpf ? "border-red-400 bg-red-50" : ""}
                      `}
                    />
                    {errors.cpf?.message !== undefined ? (
                      <p id="cpf-error" className="mt-1 text-sm text-red-500">
                        {errors.cpf.message}
                      </p>
                    ) : (
                      <p id="cpf-hint" className="mt-1 text-xs text-slate-400">
                        Altere somente se o CPF foi cadastrado incorretamente.
                      </p>
                    )}
                  </div>

                  {/* Campo E-mail */}
                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                      E-mail
                    </label>
                    <input
                      id="email"
                      type="email"
                      inputMode="email"
                      placeholder="exemplo@email.com"
                      {...register("email")}
                      disabled={isSaving}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      aria-invalid={errors.email !== undefined}
                      className={`
                        block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md
                        disabled:cursor-not-allowed disabled:bg-slate-50
                        ${errors.email ? "border-red-400 bg-red-50" : ""}
                      `}
                    />
                    {errors.email?.message !== undefined && (
                      <p id="email-error" className="mt-1 text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Campo Telefone */}
                  <div>
                    <label htmlFor="telefone" className="mb-1 block text-sm font-medium text-slate-700">
                      Telefone
                    </label>
                    <input
                      id="telefone"
                      type="text"
                      placeholder="(00) 00000-0000"
                      {...register("telefone")}
                      disabled={isSaving}
                      className="
                        block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md
                        disabled:cursor-not-allowed disabled:bg-slate-50
                      "
                    />
                  </div>

                </div>

                {/* Campo Endereço */}
                <div>
                  <label htmlFor="endereco" className="mb-1 block text-sm font-medium text-slate-700">
                    Endereço Residencial
                  </label>
                  <input
                    id="endereco"
                    type="text"
                    placeholder="Rua, número, bairro, cidade - UF"
                    {...register("endereco")}
                    disabled={isSaving}
                    className="
                      block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md
                      disabled:cursor-not-allowed disabled:bg-slate-50
                    "
                  />
                </div>

                {/* Campo Observações */}
                <div>
                  <label htmlFor="observacoes" className="mb-1 block text-sm font-medium text-slate-700">
                    Observações Adicionais
                  </label>
                  <textarea
                    id="observacoes"
                    rows={4}
                    placeholder="Detalhes ou anotações sobre o cliente"
                    {...register("observacoes")}
                    disabled={isSaving}
                    aria-describedby={errors.observacoes ? "observacoes-error" : undefined}
                    aria-invalid={errors.observacoes !== undefined}
                    className={`
                      block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md resize-none
                      disabled:cursor-not-allowed disabled:bg-slate-50
                      ${errors.observacoes ? "border-red-400 bg-red-50" : ""}
                    `}
                  />
                  {errors.observacoes?.message !== undefined && (
                    <p id="observacoes-error" className="mt-1 text-sm text-red-500">
                      {errors.observacoes.message}
                    </p>
                  )}
                </div>

                {/* Ações */}
                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-100">
                  <Link
                    href="/clientes"
                    className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors rounded-xl border border-slate-200 hover:bg-slate-50"
                  >
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="
                      rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white
                      transition-all duration-200 hover:bg-primary-dark shadow-lg shadow-primary/25
                      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                      disabled:cursor-not-allowed disabled:opacity-60 active:scale-95
                    "
                  >
                    {isSaving ? "Salvando..." : "Salvar Alterações"}
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
