"use client";
import { useCallback, useEffect, useState } from "react";
import { authService, financeiroRepository } from "@/services";
import type { CreateLancamentoInput, LancamentoFinanceiro, ResumoFinanceiro } from "@/specs/schemas/financeiro.schema";

const inicioMes = (): string => {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().split("T")[0] ?? "";
};
const fimMes = (): string => {
  const d = new Date();
  d.setMonth(d.getMonth() + 1, 0);
  return d.toISOString().split("T")[0] ?? "";
};

export type PeriodoFinanceiro = { inicio: string; fim: string };

export function useFinanceiro(): {
  lancamentos: LancamentoFinanceiro[];
  resumo: ResumoFinanceiro | null;
  loading: boolean;
  erro: string | null;
  periodo: PeriodoFinanceiro;
  setPeriodo: (p: PeriodoFinanceiro) => void;
  criar: (d: CreateLancamentoInput) => Promise<void>;
  excluir: (id: string) => Promise<void>;
} {
  const [lancamentos, setLancamentos] = useState<LancamentoFinanceiro[]>([]);
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState<PeriodoFinanceiro>({ inicio: inicioMes(), fim: fimMes() });

  const carregar = useCallback(async (p: PeriodoFinanceiro): Promise<void> => {
    try {
      setLoading(true);
      setErro(null);
      const uid = await authService.waitForAuth();
      if (!uid) throw new Error("Sessão expirada.");
      const [lista, res] = await Promise.all([
        financeiroRepository.listar(uid, p.inicio, p.fim),
        financeiroRepository.resumo(uid, p.inicio, p.fim),
      ]);
      setLancamentos(lista);
      setResumo(res);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao carregar financeiro.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregar(periodo);
  }, [carregar, periodo]);

  const criar = async (d: CreateLancamentoInput): Promise<void> => {
    const uid = await authService.waitForAuth();
    if (!uid) throw new Error("Sessão expirada.");
    await financeiroRepository.criar(uid, d);
    await carregar(periodo);
  };

  const excluir = async (id: string): Promise<void> => {
    const uid = await authService.waitForAuth();
    if (!uid) throw new Error("Sessão expirada.");
    await financeiroRepository.excluir(uid, id);
    await carregar(periodo);
  };

  return { lancamentos, resumo, loading, erro, periodo, setPeriodo, criar, excluir };
}
