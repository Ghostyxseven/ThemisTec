"use client";

/**
 * useCreateCliente — ViewModel (ADR-0007: MVVM)
 *
 * Responsabilidades:
 * - Gerenciar estado da gravação de um novo cliente
 * - Validar se o usuário está autenticado
 * - Chamar a camada de serviço/adapter
 *
 * A View (page.tsx) NÃO conhece Firebase diretamente.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CreateClienteInput } from "@/specs/schemas/cliente.schema";
import { IClienteRepository } from "@/shared/interfaces/IClienteRepository";
import { FirestoreClienteAdapter } from "@/services/firebase/FirestoreClienteAdapter";
import { IAuthService } from "@/shared/interfaces/IAuthService";
import { FirebaseAuthAdapter } from "@/services/firebase/FirebaseAuthAdapter";

const clienteRepository: IClienteRepository = new FirestoreClienteAdapter();
const authService: IAuthService = new FirebaseAuthAdapter();

interface UseCreateClienteReturn {
  isLoading: boolean;
  errorMessage: string | null;
  createCliente: (dados: CreateClienteInput) => Promise<void>;
}

export function useCreateCliente(): UseCreateClienteReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const createCliente = async (dados: CreateClienteInput): Promise<void> => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const userId = authService.getCurrentUserId();
      if (!userId) {
        throw new Error("Você precisa estar autenticado para realizar esta ação.");
      }

      await clienteRepository.criar(dados, userId);
      router.push("/clientes");
    } catch (erro) {
      const mensagem =
        erro instanceof Error ? erro.message : "Erro ao cadastrar cliente. Tente novamente.";
      setErrorMessage(mensagem);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, errorMessage, createCliente };
}
