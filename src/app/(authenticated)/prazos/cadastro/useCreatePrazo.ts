import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authService, processoRepository, prazoRepository } from "@/services";
import { CreatePrazoInput } from "@/specs/schemas/prazo.schema";
import { Processo } from "@/specs/schemas/processo.schema";

export function useCreatePrazo() {
  const router = useRouter();
  
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadProcessos = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const userId = authService.getCurrentUserId();
      if (!userId) throw new Error("Usuário não autenticado");
      const data = await processoRepository.listar({ limit: 1000, page: 1 }, userId);
      setProcessos(data.dados);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Erro ao carregar processos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPrazo = async (data: CreatePrazoInput) => {
    try {
      setIsSaving(true);
      setErrorMessage(null);
      const userId = authService.getCurrentUserId();
      if (!userId) throw new Error("Usuário não autenticado");
      await prazoRepository.criar(userId, data);
      router.push("/prazos");
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Erro ao criar prazo.");
      setIsSaving(false);
    }
  };

  return {
    processos,
    loadProcessos,
    createPrazo,
    isLoading,
    isSaving,
    errorMessage
  };
}
