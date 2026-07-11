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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateClienteSchema } from "@/specs/schemas/cliente.schema";
import type { CreateClienteInput } from "@/specs/schemas/cliente.schema";
import { useCreateCliente } from "./useCreateCliente";

const formatCpf = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

export default function CadastroClientePage(): React.ReactNode {
  const { createCliente, isLoading, errorMessage } = useCreateCliente();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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

  const cpfValue = watch("cpf") || "";
  const { ref: cpfRef, ...cpfRegister } = register("cpf");

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const rawValue = e.target.value.replace(/\D/g, "").slice(0, 11);
    setValue("cpf", rawValue, { shouldValidate: true });
  };

  const onSubmit = async (data: CreateClienteInput): Promise<void> => {
    await createCliente(data);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-12 md:px-8">
      <div className="w-full max-w-2xl">
        
        {/* Link para voltar */}
        <div className="mb-6">
          <Link
            href="/clientes"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Voltar para listagem
          </Link>
        </div>

        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1a3c5e]">Novo Cliente</h1>
          <p className="mt-2 text-sm text-gray-500">
            Cadastre os dados pessoais do cliente para vinculação de processos.
          </p>
        </div>

        {/* Card do formulário */}
        <div className="rounded-2xl bg-white px-8 py-10 shadow-md">
          <h2 className="mb-6 text-xl font-semibold text-gray-800">Dados do Cliente</h2>

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
                <label htmlFor="nome" className="mb-1 block text-sm font-medium text-gray-700">
                  Nome Completo *
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
                    w-full rounded-lg border px-4 py-2.5 text-sm
                    outline-none transition-colors
                    focus:border-[#1a3c5e] focus:ring-2 focus:ring-[#1a3c5e]/20
                    disabled:cursor-not-allowed disabled:bg-gray-100
                    ${errors.nome ? "border-red-400 bg-red-50" : "border-gray-300"}
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
                <label htmlFor="cpf" className="mb-1 block text-sm font-medium text-gray-700">
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
                    w-full rounded-lg border px-4 py-2.5 text-sm
                    outline-none transition-colors
                    focus:border-[#1a3c5e] focus:ring-2 focus:ring-[#1a3c5e]/20
                    disabled:cursor-not-allowed disabled:bg-gray-100
                    ${errors.cpf ? "border-red-400 bg-red-50" : "border-gray-300"}
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
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
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
                    w-full rounded-lg border px-4 py-2.5 text-sm
                    outline-none transition-colors
                    focus:border-[#1a3c5e] focus:ring-2 focus:ring-[#1a3c5e]/20
                    disabled:cursor-not-allowed disabled:bg-gray-100
                    ${errors.email ? "border-red-400 bg-red-50" : "border-gray-300"}
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
                <label htmlFor="telefone" className="mb-1 block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <input
                  id="telefone"
                  type="text"
                  placeholder="(00) 00000-0000"
                  {...register("telefone")}
                  disabled={isLoading}
                  className="
                    w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                    outline-none transition-colors
                    focus:border-[#1a3c5e] focus:ring-2 focus:ring-[#1a3c5e]/20
                    disabled:cursor-not-allowed disabled:bg-gray-100
                  "
                />
              </div>

            </div>

            {/* Campo Endereço */}
            <div>
              <label htmlFor="endereco" className="mb-1 block text-sm font-medium text-gray-700">
                Endereço Residencial
              </label>
              <input
                id="endereco"
                type="text"
                placeholder="Rua, número, bairro, cidade - UF"
                {...register("endereco")}
                disabled={isLoading}
                className="
                  w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                  outline-none transition-colors
                  focus:border-[#1a3c5e] focus:ring-2 focus:ring-[#1a3c5e]/20
                  disabled:cursor-not-allowed disabled:bg-gray-100
                "
              />
            </div>

            {/* Campo Observações */}
            <div>
              <label htmlFor="observacoes" className="mb-1 block text-sm font-medium text-gray-700">
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
                  w-full rounded-lg border px-4 py-2.5 text-sm
                  outline-none transition-colors resize-none
                  focus:border-[#1a3c5e] focus:ring-2 focus:ring-[#1a3c5e]/20
                  disabled:cursor-not-allowed disabled:bg-gray-100
                  ${errors.observacoes ? "border-red-400 bg-red-50" : "border-gray-300"}
                `}
              />
              {errors.observacoes?.message !== undefined && (
                <p id="observacoes-error" className="mt-1 text-sm text-red-500">
                  {errors.observacoes.message}
                </p>
              )}
            </div>

            {/* Ações */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
              <Link
                href="/clientes"
                className="
                  px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800
                  transition-colors rounded-lg border border-gray-300 hover:bg-gray-50
                "
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="
                  rounded-lg bg-[#1a3c5e] px-6 py-2.5
                  text-sm font-semibold text-white
                  transition-colors hover:bg-[#0f2540]
                  focus:outline-none focus:ring-2 focus:ring-[#1a3c5e] focus:ring-offset-2
                  disabled:cursor-not-allowed disabled:opacity-60
                "
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
