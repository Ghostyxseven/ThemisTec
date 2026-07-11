"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Cliente, UpdateClienteInput } from "@/specs/schemas/cliente.schema";
import { IClienteRepository } from "@/shared/interfaces/IClienteRepository";
import { FirestoreClienteAdapter } from "@/services/firebase/FirestoreClienteAdapter";
import { IAuthService } from "@/shared/interfaces/IAuthService";
import { FirebaseAuthAdapter } from "@/services/firebase/FirebaseAuthAdapter";

const clienteRepository: IClienteRepository = new FirestoreClienteAdapter();
const authService: IAuthService = new FirebaseAuthAdapter();

interface UseUpdateClienteReturn {
  isLoading: boolean;
  isSaving: boolean;
  errorMessage: string | null;
  cliente: Cliente | null;
  loadCliente: (id: string) => Promise<void>;
  updateCliente: (id: string, dados: UpdateClienteInput) => Promise<void>;
}

export function useUpdateCliente(): UseUpdateClienteReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const router = useRouter();

  const loadCliente = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const userId = authService.getCurrentUserId();
      if (!userId) {
        throw new Error("Você precisa estar autenticado para visualizar esta página.");
      }

      const res = await clienteRepository.buscarPorId(id, userId);
      if (!res) {
        throw new Error("Cliente não encontrado ou acesso não autorizado.");
      }

      setCliente(res);
    } catch (erro) {
      const msg =
        erro instanceof Error ? erro.message : "Erro ao carregar dados do cliente.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCliente = async (id: string, dados: UpdateClienteInput): Promise<void> => {
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const userId = authService.getCurrentUserId();
      if (!userId) {
        throw new Error("Você precisa estar autenticado para realizar esta ação.");
      }

      await clienteRepository.atualizar(id, dados, userId);
      router.push("/clientes");
    } catch (erro) {
      const msg = erro instanceof Error ? erro.message : "Erro ao salvar alterações.";
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isLoading,
    isSaving,
    errorMessage,
    cliente,
    loadCliente,
    updateCliente,
  };
}
