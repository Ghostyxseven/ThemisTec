"use client";

/**
 * CadastroClientePage — View (ADR-0007: MVVM)
 *
 * Responsabilidades:
 * - Renderizar o formulário de cadastro de cliente (US04)
 * - Aplicar máscara visual de CPF (999.999.999-99)
 * - Validar a entrada via react-hook-form + zodResolver
 * - Chamar a ViewModel useCreateCliente
 *
 * NÃO contém lógica de banco de dados direta.
 */

import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { UserPlus, ArrowLeft } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateClienteSchema } from "@/specs/schemas/cliente.schema";
import type { CreateClienteInput } from "@/specs/schemas/cliente.schema";
import { useCreateCliente } from "../viewmodel/useCreateCliente";

const formatCpf = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

export function ClientesCreateView(): React.ReactNode {
  const { createCliente, isLoading, errorMessage } = useCreateCliente();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateClienteInput>({
    resolver: zodResolver(CreateClienteSchema),
    defaultValues: {
      nome: "",
      cpf: "",
      email: "",
      telefone: "",
      endereco: "",
      observacoes: "",
    },
  });

  const cpfValue = useWatch({ control, name: "cpf" }) || "";
  const { ref: cpfRef, ...cpfRegister } = register("cpf");

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const rawValue = e.target.value.replace(/\D/g, "").slice(0, 11);
    setValue("cpf", rawValue, { shouldValidate: true });
  };

  const onSubmit = async (data: CreateClienteInput): Promise<void> => {
    await createCliente(data);
  };

  return (
    <main className="flex-1 px-4 py-8 md:px-8 lg:px-10">
      <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
        
        {/* Link para voltar */}
        <div className="mb-6">
          <Link
            href="/clientes"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Voltar para listagem
          </Link>
        </div>

        {/* Cabeçalho */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Novo Cliente</h1>
            <p className="text-sm text-slate-500">
              Cadastre os dados pessoais do cliente para vinculação de processos.
            </p>
          </div>
        </div>

        {/* Card do formulário */}
        <div className="rounded-xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <div className="h-2 w-2 rounded-full bg-blue-600" />
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Dados Cadastrais</h2>
          </div>

          {/* Erro geral (vindo do ViewModel) */}
          {errorMessage !== null && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} noValidate className="space-y-6">
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              
              {/* Campo Nome */}
              <div>
                <label htmlFor="nome" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Nome Completo <span className="text-red-400">*</span>
                </label>
                <input
                  id="nome"
                  type="text"
                  {...register("nome")}
                  disabled={isLoading}
                  placeholder="Nome do cliente"
                  aria-describedby={errors.nome ? "nome-error" : undefined}
                  aria-invalid={errors.nome !== undefined}
                  className={`
                      block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md
                    disabled:cursor-not-allowed disabled:bg-slate-50
                    ${errors.nome ? "border-red-400 bg-red-50" : "border-slate-200"}
                  `}
                />
                {errors.nome?.message !== undefined && (
                  <p id="nome-error" className="mt-1 text-sm text-red-500">
                    {errors.nome.message}
                  </p>
                )}
              </div>

              {/* Campo CPF */}
              <div>
                <label htmlFor="cpf" className="mb-1.5 block text-sm font-medium text-slate-700">
                  CPF * (Apenas números)
                </label>
                <input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={formatCpf(cpfValue)}
                  onChange={handleCpfChange}
                  onBlur={(e) => { void cpfRegister.onBlur(e); }}
                  name={cpfRegister.name}
                  ref={cpfRef}
                  disabled={isLoading}
                  aria-describedby={errors.cpf ? "cpf-error" : undefined}
                  aria-invalid={errors.cpf !== undefined}
                  className={`
                      block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md
                    disabled:cursor-not-allowed disabled:bg-slate-50
                    ${errors.cpf ? "border-red-400 bg-red-50" : "border-slate-200"}
                  `}
                />
                {errors.cpf?.message !== undefined && (
                  <p id="cpf-error" className="mt-1 text-sm text-red-500">
                    {errors.cpf.message}
                  </p>
                )}
              </div>

              {/* Campo E-mail */}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  placeholder="exemplo@email.com"
                  {...register("email")}
                  disabled={isLoading}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  aria-invalid={errors.email !== undefined}
                  className={`
                      block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md
                    disabled:cursor-not-allowed disabled:bg-slate-50
                    ${errors.email ? "border-red-400 bg-red-50" : "border-slate-200"}
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
                <label htmlFor="telefone" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Telefone
                </label>
                <input
                  id="telefone"
                  type="text"
                  placeholder="(00) 00000-0000"
                  {...register("telefone")}
                  disabled={isLoading}
                  className="
                      block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md
                    disabled:cursor-not-allowed disabled:bg-slate-50
                  "
                />
              </div>

            </div>

            {/* Campo Endereço */}
            <div>
              <label htmlFor="endereco" className="mb-1.5 block text-sm font-medium text-slate-700">
                Endereço Residencial
              </label>
              <input
                id="endereco"
                type="text"
                placeholder="Rua, número, bairro, cidade - UF"
                {...register("endereco")}
                disabled={isLoading}
                className="
                      block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md
                  disabled:cursor-not-allowed disabled:bg-slate-50
                "
              />
            </div>

            {/* Campo Observações */}
            <div>
              <label htmlFor="observacoes" className="mb-1.5 block text-sm font-medium text-slate-700">
                Observações Adicionais
              </label>
              <textarea
                id="observacoes"
                rows={4}
                placeholder="Detalhes ou anotações sobre o cliente"
                {...register("observacoes")}
                disabled={isLoading}
                aria-describedby={errors.observacoes ? "observacoes-error" : undefined}
                aria-invalid={errors.observacoes !== undefined}
                className={`
                      block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-md
                  disabled:cursor-not-allowed disabled:bg-slate-50
                  ${errors.observacoes ? "border-red-400 bg-red-50" : "border-slate-200"}
                `}
              />
              {errors.observacoes?.message !== undefined && (
                <p id="observacoes-error" className="mt-1 text-sm text-red-500">
                  {errors.observacoes.message}
                </p>
              )}
            </div>

            {/* Ações */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
              <Link
                href="/clientes"
                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 active:scale-95 transition-all"
              >
                {isLoading ? "Salvando..." : "Salvar Cliente"}
              </button>
            </div>

          </form>

        </div>

      </div>
    </main>
  );
}
