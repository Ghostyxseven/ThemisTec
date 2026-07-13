"use client";

import { useState, useEffect, useCallback } from "react";
import { IAuthService } from "@/shared/interfaces/IAuthService";
import { FirebaseAuthAdapter } from "@/services/firebase/FirebaseAuthAdapter";
import { IClienteRepository } from "@/shared/interfaces/IClienteRepository";
import { FirestoreClienteAdapter } from "@/services/firebase/FirestoreClienteAdapter";
import { IProcessoRepository } from "@/shared/interfaces/IProcessoRepository";
import { FirestoreProcessoAdapter } from "@/services/firebase/FirestoreProcessoAdapter";

const authService: IAuthService = new FirebaseAuthAdapter();
const clienteRepository: IClienteRepository = new FirestoreClienteAdapter();
const processoRepository: IProcessoRepository = new FirestoreProcessoAdapter();

interface Estatisticas {
  totalClientes: number;
  totalProcessos: number;
  ativosProcessos: number;
}

interface UseDashboardReturn {
  isLoading: boolean;
  errorMessage: string | null;
  estatisticas: Estatisticas | null;
  refetch: () => void;
}

export function useDashboard(): UseDashboardReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);

  const fetchEstatisticas = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const userId = authService.getCurrentUserId();
      if (!userId) {
        throw new Error("Usuário não autenticado.");
      }

      // Buscar os dados concorrentemente para ser mais rápido
      const [totalClientes, totalProcessos, ativosProcessos] = await Promise.all([
        clienteRepository.contarClientes(userId),
        processoRepository.contarProcessos(userId),
        processoRepository.contarProcessosAtivos(userId)
      ]);

      setEstatisticas({
        totalClientes,
        totalProcessos,
        ativosProcessos,
      });
    } catch (erro) {
      const msg = erro instanceof Error ? erro.message : "Erro ao carregar estatísticas.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const load = async (): Promise<void> => {
      await Promise.resolve();
      if (active) {
        void fetchEstatisticas();
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [fetchEstatisticas]);

  return {
    isLoading,
    errorMessage,
    estatisticas,
    refetch: () => { void fetchEstatisticas(); },
  };
}
