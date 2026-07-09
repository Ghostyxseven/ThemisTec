"use client";

/**
 * useLogin — ViewModel (ADR-0007: MVVM)
 *
 * Responsabilidades:
 * - Gerenciar estado do formulário de login
 * - Validar entrada com LoginSchema (Zod) antes de chamar o serviço
 * - Expor estado de loading, erro e a função de submit para a View
 *
 * A View (login/page.tsx) NÃO conhece Firebase diretamente —
 * apenas consome este hook.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginSchema } from "@/specs/schemas/auth.schema";
import type { LoginInput } from "@/specs/schemas/auth.schema";

interface UseLoginReturn {
  isLoading: boolean;
  errorMessage: string | null;
  handleSubmit: (dados: LoginInput) => Promise<void>;
}

export function useLogin(): UseLoginReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (dados: LoginInput): Promise<void> => {
    setErrorMessage(null);

    // Validação Zod na fronteira de entrada (Harness: contrato obrigatório)
    const resultado = LoginSchema.safeParse(dados);
    if (!resultado.success) {
      const primeiroErro = resultado.error.errors[0];
      setErrorMessage(primeiroErro?.message ?? "Dados inválidos.");
      return;
    }

    setIsLoading(true);
    try {
      /**
       * TODO (Micael): substituir pelo FirebaseAuthAdapter quando implementado.
       * Por ora, simula o fluxo para desenvolvimento do layout.
       */
      await new Promise<void>((resolve) => setTimeout(resolve, 800));
      router.push("/dashboard");
    } catch (erro) {
      const mensagem =
        erro instanceof Error ? erro.message : "Erro ao fazer login. Tente novamente.";
      setErrorMessage(mensagem);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, errorMessage, handleSubmit };
}
