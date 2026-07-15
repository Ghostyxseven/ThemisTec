import { useState, useCallback, useEffect } from "react";
import { authService, prazoRepository } from "@/services";
import { Prazo } from "@/specs/schemas/prazo.schema";

export function useListPrazos(): {
  dados: Prazo[];
  isLoading: boolean;
  errorMessage: string | null;
  carregarPrazos: () => Promise<void>;
  concluirPrazo: (prazoId: string) => Promise<void>;
  excluirPrazo: (prazoId: string) => Promise<void>;
} {
  const [dados, setDados] = useState<Prazo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const carregarPrazos = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      const uid = await authService.waitForAuth();
      if (!uid) throw new Error("Usuário não autenticado");
      
      const prazos = await prazoRepository.listarPorUsuario(uid);
      setDados(prazos);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Erro ao carregar prazos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregarPrazos();
  }, [carregarPrazos]);

  const concluirPrazo = async (prazoId: string): Promise<void> => {
    try {
      const userId = await authService.waitForAuth();
      if (!userId) throw new Error("Usuário não autenticado");
      await prazoRepository.marcarConcluido(userId, prazoId);
      await carregarPrazos();
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Erro ao concluir prazo.");
    }
  };

  const excluirPrazo = async (prazoId: string): Promise<void> => {
    try {
      const userId = await authService.waitForAuth();
      if (!userId) throw new Error("Usuário não autenticado");
      await prazoRepository.excluir(userId, prazoId);
      await carregarPrazos();
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Erro ao excluir prazo.");
    }
  };

  return {
    dados,
    isLoading,
    errorMessage,
    carregarPrazos,
    concluirPrazo,
    excluirPrazo
  };
}
