"use client";

import { useCallback, useEffect, useState } from "react";
import { authService, documentoRepository } from "@/services";
import type { DocumentoCatalogo } from "@/specs/schemas/documento.schema";

export function useDocumentosCentral() {
  const [documentos, setDocumentos] = useState<DocumentoCatalogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [verLixeira, setVerLixeira] = useState(false);

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      setErro(null);
      const uid = await authService.waitForAuth();
      if (!uid) throw new Error("Sessão expirada.");
      const lista = await documentoRepository.listar(uid, verLixeira);
      setDocumentos(lista);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao carregar documentos.");
    } finally {
      setLoading(false);
    }
  }, [verLixeira]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregar();
  }, [carregar]);

  const moverParaLixeira = useCallback(async (id: string) => {
    try {
      setErro(null);
      const uid = await authService.waitForAuth();
      if (!uid) throw new Error("Sessão expirada.");
      await documentoRepository.moverParaLixeira(uid, id);
      await carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao mover para lixeira.");
    }
  }, [carregar]);

  const restaurar = useCallback(async (id: string) => {
    try {
      setErro(null);
      const uid = await authService.waitForAuth();
      if (!uid) throw new Error("Sessão expirada.");
      await documentoRepository.restaurar(uid, id);
      await carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao restaurar documento.");
    }
  }, [carregar]);

  const excluirDefinitivo = useCallback(async (id: string) => {
    try {
      setErro(null);
      const uid = await authService.waitForAuth();
      if (!uid) throw new Error("Sessão expirada.");
      await documentoRepository.excluirDefinitivo(uid, id);
      await carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao excluir documento.");
    }
  }, [carregar]);

  return {
    documentos,
    loading,
    erro,
    verLixeira,
    setVerLixeira,
    moverParaLixeira,
    restaurar,
    excluirDefinitivo,
  };
}
