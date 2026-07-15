"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { CreateProcessoInput } from "@/specs/schemas/processo.schema";
import type { Cliente } from "@/specs/schemas/cliente.schema";
import { authService, clienteRepository, processoRepository } from "@/services";

interface UseCreateProcessoReturn {
  isLoading: boolean;
  isSaving: boolean;
  errorMessage: string | null;
  clientes: Cliente[];
  loadClientes: () => Promise<void>;
  createProcesso: (dados: CreateProcessoInput) => Promise<void>;
}

export function useCreateProcesso(): UseCreateProcessoReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const router = useRouter();

  const loadClientes = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const userId = await authService.waitForAuth();
      if (!userId) {
        throw new Error("Você precisa estar autenticado.");
      }

      // Buscar todos os clientes daquele advogado sem limites (ou limit de 50) para vinculação
      const res = await clienteRepository.listar({ limit: 50, page: 1 }, userId);
      setClientes(res.dados);
    } catch (erro) {
      const msg = erro instanceof Error ? erro.message : "Erro ao carregar lista de clientes.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProcesso = async (dados: CreateProcessoInput): Promise<void> => {
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const userId = await authService.waitForAuth();
      if (!userId) {
        throw new Error("Você precisa estar autenticado para registrar um processo.");
      }

      // Encontrar nome do cliente vinculado
      const cliente = clientes.find((c) => c.id === dados.clienteId);
      if (!cliente) {
        throw new Error("Cliente selecionado inválido.");
      }

      await processoRepository.criar(dados, cliente.nome, userId);
      router.push("/processos");
    } catch (erro) {
      const msg = erro instanceof Error ? erro.message : "Erro ao registrar processo.";
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isLoading,
    isSaving,
    errorMessage,
    clientes,
    loadClientes,
    createProcesso,
  };
}
