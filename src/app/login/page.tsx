"use client";

/**
 * LoginPage — View (ADR-0007: MVVM)
 *
 * Responsabilidades:
 * - Renderizar o formulário de login (US01)
 * - Delegar lógica e estado ao hook useLogin (ViewModel)
 * - Exibir erros de validação e estado de carregamento
 *
 * NÃO contém lógica de negócio nem chamadas ao Firebase.
 */

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/specs/schemas/auth.schema";
import type { LoginInput } from "@/specs/schemas/auth.schema";
import { useLogin } from "./useLogin";

export default function LoginPage(): React.ReactNode {
  const { login, isLoading, errorMessage } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const onSubmit = async (data: LoginInput): Promise<void> => {
    await login(data);
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
          <h2 className="mb-6 text-xl font-semibold text-gray-800">Entrar na sua conta</h2>

          {/* Erro geral (vindo do ViewModel) */}
          {errorMessage !== null && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} noValidate className="space-y-5">

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
              <div className="mb-1 flex items-center justify-between">
                <label
                  htmlFor="senha"
                  className="text-sm font-medium text-gray-700"
                >
                  Senha
                </label>
                <Link
                  href="/reset-password"
                  className="text-xs text-[#1a3c5e] hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
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
              {isLoading ? "Carregando..." : "Entrar"}
            </button>
          </form>

          {/* Rodapé do card */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Não tem uma conta?{" "}
            <Link
              href="/register"
              className="font-medium text-[#1a3c5e] hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} ThemisTec · Todos os direitos reservados
        </p>

      </div>
    </main>
  );
}
