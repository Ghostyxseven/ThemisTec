"use client";

import { useState, useEffect, useCallback } from "react";
import type { Cliente, ListClientesQuery, ClienteListResponse } from "@/specs/schemas/cliente.schema";
import { IClienteRepository } from "@/shared/interfaces/IClienteRepository";
import { FirestoreClienteAdapter } from "@/services/firebase/FirestoreClienteAdapter";
import { IAuthService } from "@/shared/interfaces/IAuthService";
import { FirebaseAuthAdapter } from "@/services/firebase/FirebaseAuthAdapter";

const clienteRepository: IClienteRepository = new FirestoreClienteAdapter();
const authService: IAuthService = new FirebaseAuthAdapter();

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
}

export function useListClientes(): UseListClientesReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dados, setDados] = useState<Cliente[]>([]);
  const [paginacao, setPaginacao] = useState<ClienteListResponse["paginacao"] | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

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
  };
}
