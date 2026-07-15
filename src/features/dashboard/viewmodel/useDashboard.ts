"use client";

import { useState, useEffect, useCallback } from "react";
import { authService, clienteRepository, processoRepository, prazoRepository } from "@/services";

interface Estatisticas {
  totalClientes: number;
  totalProcessos: number;
  ativosProcessos: number;
  honorariosAReceber: number;
  prazosDaSemana: number;
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
      const userId = await authService.waitForAuth();
      if (!userId) {
        throw new Error("Usuário não autenticado.");
      }

      // Buscar os dados concorrentemente para ser mais rápido
      const [totalClientes, totalProcessos, ativosProcessos, honorariosAReceber, prazosDaSemana] = await Promise.all([
        clienteRepository.contarClientes(userId),
        processoRepository.contarProcessos(userId),
        processoRepository.contarProcessosAtivos(userId),
        processoRepository.somarHonorariosAReceber(userId),
        prazoRepository.contarPrazosDaSemana(userId)
      ]);

      setEstatisticas({
        totalClientes,
        totalProcessos,
        ativosProcessos,
        honorariosAReceber,
        prazosDaSemana,
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
