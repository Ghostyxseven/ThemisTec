"use client";

import { useState, useEffect, useCallback } from "react";
import type { Processo, ProcessoListResponse, StatusProcesso } from "@/specs/schemas/processo.schema";
import type { Cliente } from "@/specs/schemas/cliente.schema";
import { IProcessoRepository } from "@/shared/interfaces/IProcessoRepository";
import { FirestoreProcessoAdapter } from "@/services/firebase/FirestoreProcessoAdapter";
import { IClienteRepository } from "@/shared/interfaces/IClienteRepository";
import { FirestoreClienteAdapter } from "@/services/firebase/FirestoreClienteAdapter";
import { IAuthService } from "@/shared/interfaces/IAuthService";
import { FirebaseAuthAdapter } from "@/services/firebase/FirebaseAuthAdapter";

const processoRepository: IProcessoRepository = new FirestoreProcessoAdapter();
const clienteRepository: IClienteRepository = new FirestoreClienteAdapter();
const authService: IAuthService = new FirebaseAuthAdapter();

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

  const loadClientes = useCallback(async (): Promise<void> => {
    try {
      const userId = authService.getCurrentUserId();
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
      const userId = authService.getCurrentUserId();
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
  };
}
