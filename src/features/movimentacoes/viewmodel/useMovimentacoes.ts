"use client";
import { useCallback, useEffect, useState } from "react";
import { authService, movimentacaoRepository } from "@/services";
import type { CreateMovimentacaoInput, Movimentacao } from "@/specs/schemas/movimentacao.schema";

export function useMovimentacoes(processoId: string): {
  movimentacoes: Movimentacao[];
  loading: boolean;
  erro: string | null;
  criar: (d: CreateMovimentacaoInput) => Promise<void>;
  excluir: (id: string) => Promise<void>;
} {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async (): Promise<void> => {
    if (!processoId) return;
    try {
      setLoading(true);
      setErro(null);
      const uid = await authService.waitForAuth();
      if (!uid) throw new Error("Sessão expirada.");
      const lista = await movimentacaoRepository.listar(uid, processoId);
      setMovimentacoes(lista);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao carregar movimentações.");
    } finally {
      setLoading(false);
    }
  }, [processoId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregar();
  }, [carregar]);

  const criar = async (d: CreateMovimentacaoInput): Promise<void> => {
    const uid = await authService.waitForAuth();
    if (!uid) throw new Error("Sessão expirada.");
    await movimentacaoRepository.criar(uid, d);
    await carregar();
  };

  const excluir = async (id: string): Promise<void> => {
    const uid = await authService.waitForAuth();
    if (!uid) throw new Error("Sessão expirada.");
    await movimentacaoRepository.excluir(uid, id);
    await carregar();
  };

  return { movimentacoes, loading, erro, criar, excluir };
}
