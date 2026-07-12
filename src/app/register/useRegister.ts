"use client";

import { useState } from "react";
import type { RegisterInput } from "@/specs/schemas/auth.schema";
import { IAuthService } from "@/shared/interfaces/IAuthService";
import { FirebaseAuthAdapter } from "@/services/firebase/FirebaseAuthAdapter";

const authService: IAuthService = new FirebaseAuthAdapter();

interface UseRegisterReturn {
  isLoading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  registerUser: (dados: RegisterInput) => Promise<void>;
  setErrorMessage: (msg: string | null) => void;
  setSuccessMessage: (msg: string | null) => void;
}

export function useRegister(): UseRegisterReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const registerUser = async (dados: RegisterInput): Promise<void> => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);
    try {
      await authService.register(dados);
      setSuccessMessage(
        "Cadastro realizado com sucesso! Por favor, verifique sua caixa de entrada para confirmar seu e-mail antes de fazer login."
      );
    } catch (erro) {
      const mensagem =
        erro instanceof Error ? erro.message : "Erro ao realizar o cadastro. Tente novamente.";
      setErrorMessage(mensagem);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    errorMessage,
    successMessage,
    registerUser,
    setErrorMessage,
    setSuccessMessage,
  };
}
