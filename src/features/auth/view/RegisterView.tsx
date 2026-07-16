"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RegisterSchema } from "@/specs/schemas/auth.schema";
import { useRegister } from "../viewmodel/useRegister";
import { Scale, ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

type RegisterFormInput = z.infer<typeof RegisterSchema>;

export function RegisterView(): React.ReactNode {
  const { registerUser, isLoading, errorMessage, successMessage } = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { nome: "", email: "", senha: "" },
  });

  const onSubmit = async (data: RegisterFormInput): Promise<void> => {
    await registerUser(data);
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-900 selection:bg-primary selection:text-white">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/30 blur-[120px] mix-blend-screen animate-pulse duration-10000" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[40%] left-[20%] w-[40%] h-[60%] rounded-full bg-blue-500/20 blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] px-6 py-12">
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Voltar para o Início
        </Link>

        {/* Glassmorphism Card */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-black/50 rounded-3xl p-8 sm:p-10">
          
          <div className="text-center mb-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark shadow-lg mb-6 ring-1 ring-white/20">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Criar sua conta</h2>
            <p className="text-sm text-slate-300">
              Já possui cadastro?{" "}
              <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                Faça login
              </Link>
            </p>
          </div>

          {errorMessage && (
            <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-400" />
              <p className="text-sm font-medium leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {successMessage ? (
            <div className="text-center py-6 space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 ring-1 ring-emerald-500/30">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              <div role="alert" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-200 font-medium">
                {successMessage}
              </div>
              <Link
                href="/login"
                className="
                  flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30
                  hover:bg-primary-light hover:shadow-xl hover:shadow-primary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                  transition-all duration-200 active:scale-[0.98]
                "
              >
                Ir para o Login
              </Link>
            </div>
          ) : (
            <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} noValidate className="space-y-5">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-slate-200 mb-1.5">
                  Nome Completo
                </label>
                <input
                  id="nome"
                  type="text"
                  autoComplete="name"
                  {...register("nome")}
                  disabled={isLoading}
                  aria-invalid={errors.nome !== undefined}
                  placeholder="Dr(a). Seu Nome"
                  className={`
                    block w-full rounded-xl border-0 bg-white/5 py-3 px-4 text-white shadow-inner ring-1 ring-inset ring-white/10
                    placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm
                    transition-all disabled:opacity-50 disabled:cursor-not-allowed
                    ${errors.nome ? "ring-red-500/50 focus:ring-red-500" : "hover:bg-white/10 hover:ring-white/20"}
                  `}
                />
                {errors.nome && (
                  <p className="mt-2 text-xs text-red-400">{errors.nome.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-1.5">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  {...register("email")}
                  disabled={isLoading}
                  aria-invalid={errors.email !== undefined}
                  placeholder="seu@email.com"
                  className={`
                    block w-full rounded-xl border-0 bg-white/5 py-3 px-4 text-white shadow-inner ring-1 ring-inset ring-white/10
                    placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm
                    transition-all disabled:opacity-50 disabled:cursor-not-allowed
                    ${errors.email ? "ring-red-500/50 focus:ring-red-500" : "hover:bg-white/10 hover:ring-white/20"}
                  `}
                />
                {errors.email && (
                  <p className="mt-2 text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-slate-200 mb-1.5">
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...register("senha")}
                    disabled={isLoading}
                    aria-invalid={errors.senha !== undefined}
                    placeholder="Mínimo 8 caracteres"
                    className={`
                      block w-full rounded-xl border-0 bg-white/5 py-3 pl-4 pr-11 text-white shadow-inner ring-1 ring-inset ring-white/10
                      placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm
                      transition-all disabled:opacity-50 disabled:cursor-not-allowed
                      ${errors.senha ? "ring-red-500/50 focus:ring-red-500" : "hover:bg-white/10 hover:ring-white/20"}
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.senha && (
                  <p className="mt-2 text-xs text-red-400">{errors.senha.message}</p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30
                    hover:bg-primary-light hover:shadow-xl hover:shadow-primary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]
                  "
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Criando conta...</span>
                    </>
                  ) : (
                    "Criar Conta Agora"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
        
        {successMessage === null && (
          <p className="text-center text-xs font-medium text-slate-500 mt-8">
            ThemisTec © {new Date().getFullYear()}
          </p>
        )}
      </div>
    </main>
  );
}
