import { useState, useCallback, useEffect } from "react";
import { authService, prazoRepository } from "@/services";
import { Prazo } from "@/specs/schemas/prazo.schema";
import { getAuth } from "firebase/auth";
import { getFirebaseApp } from "@/services/firebase/firebase.client";

export function useListPrazos() {
  const [dados, setDados] = useState<Prazo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const carregarPrazos = useCallback(async (userId?: string) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      const uid = userId || authService.getCurrentUserId();
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
    const auth = getAuth(getFirebaseApp());
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        void carregarPrazos(user.uid);
      } else {
        setErrorMessage("Usuário não autenticado");
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [carregarPrazos]);

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
