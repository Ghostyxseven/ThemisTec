import { useState, useCallback } from "react";
import { authService, prazoRepository } from "@/services";
import { Prazo } from "@/specs/schemas/prazo.schema";

export function useListPrazos() {
  const [dados, setDados] = useState<Prazo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const carregarPrazos = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const userId = authService.getCurrentUserId();
      if (!userId) throw new Error("Usuário não autenticado");
      const prazos = await prazoRepository.listarPorUsuario(userId);
      setDados(prazos);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Erro ao carregar prazos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const concluirPrazo = async (prazoId: string) => {
    try {
      const userId = authService.getCurrentUserId();
      if (!userId) throw new Error("Usuário não autenticado");
      await prazoRepository.marcarConcluido(userId, prazoId);
      await carregarPrazos();
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Erro ao concluir prazo.");
    }
  };

  return {
    dados,
    isLoading,
    errorMessage,
    carregarPrazos,
    concluirPrazo
  };
}
