"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RegisterSchema } from "@/specs/schemas/auth.schema";
import { useRegister } from "./useRegister";

type RegisterFormInput = z.infer<typeof RegisterSchema>;

export default function RegisterPage(): React.ReactNode {
  const { registerUser, isLoading, errorMessage, successMessage } = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
    },
  });

  const onSubmit = async (data: RegisterFormInput): Promise<void> => {
    await registerUser(data);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Logo / Cabeçalho */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#1a3c5e]">ThemisTec</h1>
          <p className="mt-2 text-sm text-gray-500">
            Gestão jurídica para advogados autônomos
          </p>
        </div>

        {/* Card do formulário */}
        <div className="rounded-2xl bg-white px-8 py-10 shadow-md">
          <h2 className="mb-6 text-xl font-semibold text-gray-800">Criar sua conta</h2>

          {/* Erro geral (vindo do ViewModel) */}
          {errorMessage !== null && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {errorMessage}
            </div>
          )}

          {/* Sucesso geral (vindo do ViewModel) */}
          {successMessage !== null ? (
            <div className="text-center py-4 space-y-4">
              <div
                role="alert"
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              >
                {successMessage}
              </div>
              <Link
                href="/login"
                className="
                  inline-block w-full rounded-lg bg-[#1a3c5e] px-4 py-3
                  text-sm font-semibold text-white transition-colors hover:bg-[#0f2540]
                "
              >
                Ir para o Login
              </Link>
            </div>
          ) : (
            <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} noValidate className="space-y-5">
              
              {/* Campo Nome */}
              <div>
                <label
                  htmlFor="nome"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Nome Completo
                </label>
                <input
                  id="nome"
                  type="text"
                  autoComplete="name"
                  {...register("nome")}
                  disabled={isLoading}
                  aria-describedby={errors.nome ? "nome-error" : undefined}
                  aria-invalid={errors.nome !== undefined}
                  placeholder="Seu nome"
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

              {/* Campo E-mail */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  {...register("email")}
                  disabled={isLoading}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  aria-invalid={errors.email !== undefined}
                  placeholder="seu@email.com"
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

              {/* Campo Senha */}
              <div>
                <label
                  htmlFor="senha"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...register("senha")}
                    disabled={isLoading}
                    aria-describedby={errors.senha ? "senha-error" : undefined}
                    aria-invalid={errors.senha !== undefined}
                    placeholder="Mínimo 8 caracteres"
                    className={`
                      w-full rounded-lg border pl-4 pr-12 py-2.5 text-sm
                      outline-none transition-colors
                      focus:border-[#1a3c5e] focus:ring-2 focus:ring-[#1a3c5e]/20
                      disabled:cursor-not-allowed disabled:bg-gray-100
                      ${errors.senha ? "border-red-400 bg-red-50" : "border-gray-300"}
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => { setShowPassword(!showPassword); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.senha?.message !== undefined && (
                  <p id="senha-error" className="mt-1 text-sm text-red-500">
                    {errors.senha.message}
                  </p>
                )}
              </div>

              {/* Botão de submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="
                  mt-2 w-full rounded-lg bg-[#1a3c5e] px-4 py-3
                  text-sm font-semibold text-white
                  transition-colors hover:bg-[#0f2540]
                  focus:outline-none focus:ring-2 focus:ring-[#1a3c5e] focus:ring-offset-2
                  disabled:cursor-not-allowed disabled:opacity-60
                "
              >
                {isLoading ? "Criando conta..." : "Criar Conta"}
              </button>
            </form>
          )}

          {/* Rodapé do card */}
          {successMessage === null && (
            <p className="mt-6 text-center text-sm text-gray-500">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="font-medium text-[#1a3c5e] hover:underline"
              >
                Entrar
              </Link>
            </p>
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} ThemisTec · Todos os direitos reservados
        </p>

      </div>
    </main>
  );
}
