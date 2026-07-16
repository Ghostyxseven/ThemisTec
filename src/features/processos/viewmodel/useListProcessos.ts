"use client";

import { useState, useEffect, useCallback } from "react";
import type { Processo, ProcessoListResponse, StatusProcesso } from "@/specs/schemas/processo.schema";
import type { Cliente } from "@/specs/schemas/cliente.schema";
import { authService, clienteRepository, processoRepository } from "@/services";
import { ExportService } from "@/services/export/ExportService";

const exportService = new ExportService();

interface UseListProcessosReturn {
  isLoading: boolean;
  errorMessage: string | null;
  dados: Processo[];
  paginacao: ProcessoListResponse["paginacao"] | null;
  filtroClienteId: string;
  setFiltroClienteId: (id: string) => void;
  filtroStatus: string;
  setFiltroStatus: (status: string) => void;
  page: number;
  setPage: (p: number) => void;
  clientes: Cliente[];
  loadClientes: () => Promise<void>;
  refetch: () => void;
  isExporting: boolean;
  exportarCsv: () => Promise<void>;
  excluirProcesso: (id: string) => Promise<void>;
}

export function useListProcessos(): UseListProcessosReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dados, setDados] = useState<Processo[]>([]);
  const [paginacao, setPaginacao] = useState<ProcessoListResponse["paginacao"] | null>(null);
  const [filtroClienteId, setFiltroClienteId] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [page, setPage] = useState(1);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const loadClientes = useCallback(async (): Promise<void> => {
    try {
      const userId = await authService.waitForAuth();
      if (userId) {
        const res = await clienteRepository.listar({ limit: 100, page: 1 }, userId);
        setClientes(res.dados);
      }
    } catch {
      // Falha silenciosa para dropdown de filtros
    }
  }, []);

  const fetchProcessos = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const userId = await authService.waitForAuth();
      if (!userId) {
        throw new Error("Usuário não autenticado.");
      }

      const response = await processoRepository.listar(
        {
          clienteId: filtroClienteId || undefined,
          status: (filtroStatus || undefined) as StatusProcesso | undefined,
          page,
          limit: 10,
        },
        userId
      );
      setDados(response.dados);
      setPaginacao(response.paginacao);
    } catch (erro) {
      const msg = erro instanceof Error ? erro.message : "Erro ao carregar processos.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, [filtroClienteId, filtroStatus, page]);

  const exportarCsv = async (): Promise<void> => {
    setIsExporting(true);
    setErrorMessage(null);
    try {
      const userId = authService.getCurrentUserId();
      if (!userId) throw new Error("Usuário não autenticado.");

      const response = await processoRepository.listar(
        {
          clienteId: filtroClienteId || undefined,
          status: (filtroStatus || undefined) as StatusProcesso | undefined,
          limit: 9999,
          page: 1,
        },
        userId
      );
      const csvString = exportService.gerarCsvProcessos(response.dados);

      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "processos.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (erro) {
      const msg = erro instanceof Error ? erro.message : "Erro ao exportar CSV.";
      setErrorMessage(msg);
    } finally {
      setIsExporting(false);
    }
  };

  const excluirProcesso = async (id: string): Promise<void> => {
    try {
      const userId = authService.getCurrentUserId();
      if (!userId) throw new Error("Usuário não autenticado.");
      await processoRepository.excluir(id, userId);
      void fetchProcessos();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao excluir processo.";
      setErrorMessage(msg);
      throw new Error(msg); // re-throw para a interface
    }
  };

  useEffect(() => {
    let active = true;

    const load = async (): Promise<void> => {
      await Promise.resolve();
      if (active) {
        void fetchProcessos();
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [fetchProcessos]);

  return {
    isLoading,
    errorMessage,
    dados,
    paginacao,
    filtroClienteId,
    setFiltroClienteId,
    filtroStatus,
    setFiltroStatus,
    page,
    setPage,
    clientes,
    loadClientes,
    refetch: () => { void fetchProcessos(); },
    isExporting,
    exportarCsv,
    excluirProcesso,
  };
}
