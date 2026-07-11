"use client";

/**
 * useLogin — ViewModel (ADR-0007: MVVM)
 *
 * Responsabilidades:
 * - Gerenciar estado da chamada de login
 * - Expor estado de loading, erro e a função login para a View
 *
 * A View (login/page.tsx) NÃO conhece Firebase diretamente —
 * apenas consome este hook.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LoginInput } from "@/specs/schemas/auth.schema";
import { IAuthService } from "@/shared/interfaces/IAuthService";
import { FirebaseAuthAdapter } from "@/services/firebase/FirebaseAuthAdapter";

// Instanciando o serviço (Padrão Adapter / POO) criado pelo Micael
const authService: IAuthService = new FirebaseAuthAdapter();

interface UseLoginReturn {
  isLoading: boolean;
  errorMessage: string | null;
  login: (dados: LoginInput) => Promise<void>;
}

export function useLogin(): UseLoginReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const login = async (dados: LoginInput): Promise<void> => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      // Delega a chamada para o Firebase ao Adapter de Autenticação
      await authService.login(dados);
      router.push("/dashboard");
    } catch (erro) {
      const mensagem =
        erro instanceof Error ? erro.message : "Erro ao fazer login. Tente novamente.";
      setErrorMessage(mensagem);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, errorMessage, login };
}
