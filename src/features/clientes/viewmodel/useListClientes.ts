"use client";

import { useState, useEffect, useCallback } from "react";
import type { Cliente, ListClientesQuery, ClienteListResponse } from "@/specs/schemas/cliente.schema";
import { authService, clienteRepository } from "@/services";
import { ExportService } from "@/services/export/ExportService";

const exportService = new ExportService();

interface UseListClientesReturn {
  isLoading: boolean;
  errorMessage: string | null;
  dados: Cliente[];
  paginacao: ClienteListResponse["paginacao"] | null;
  search: string;
  setSearch: (s: string) => void;
  page: number;
  setPage: (p: number) => void;
  refetch: () => void;
  excluirCliente: (id: string) => Promise<void>;
  isExporting: boolean;
  exportarCsv: () => Promise<void>;
}

export function useListClientes(): UseListClientesReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dados, setDados] = useState<Cliente[]>([]);
  const [paginacao, setPaginacao] = useState<ClienteListResponse["paginacao"] | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const fetchClientes = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const userId = authService.getCurrentUserId();
      if (!userId) {
        throw new Error("Usuário não autenticado.");
      }

      const params: ListClientesQuery = {
        search: search || undefined,
        page,
        limit: 10,
      };

      const response = await clienteRepository.listar(params, userId);
      setDados(response.dados);
      setPaginacao(response.paginacao);
    } catch (erro) {
      const msg = erro instanceof Error ? erro.message : "Erro ao carregar clientes.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, [search, page]);

  const excluirCliente = async (id: string): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const userId = authService.getCurrentUserId();
      if (!userId) {
        throw new Error("Você precisa estar autenticado para realizar esta ação.");
      }

      await clienteRepository.excluir(id, userId);
      await fetchClientes();
    } catch (erro) {
      const msg = erro instanceof Error ? erro.message : "Erro ao excluir cliente.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const exportarCsv = async (): Promise<void> => {
    setIsExporting(true);
    setErrorMessage(null);
    try {
      const userId = authService.getCurrentUserId();
      if (!userId) throw new Error("Usuário não autenticado.");

      const response = await clienteRepository.listar({ limit: 9999, page: 1 }, userId);
      const csvString = exportService.gerarCsvClientes(response.dados);

      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "clientes.csv");
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

  useEffect(() => {
    let active = true;

    const load = async (): Promise<void> => {
      await Promise.resolve();
      if (active) {
        void fetchClientes();
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [fetchClientes]);

  return {
    isLoading,
    errorMessage,
    dados,
    paginacao,
    search,
    setSearch,
    page,
    setPage,
    refetch: () => { void fetchClientes(); },
    excluirCliente,
    isExporting,
    exportarCsv,
  };
}
