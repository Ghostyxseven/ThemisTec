import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useListPrazos } from "@/features/prazos/viewmodel/useListPrazos";
import { prazoRepository } from "@/services";

import { Prazo } from "@/specs/schemas/prazo.schema";

// Mock do auth para simular usuário logado
// Mock do authService e prazoRepository
vi.mock("@/services", () => ({
  authService: {
    getCurrentUserId: vi.fn(() => "user-123"),
    waitForAuth: vi.fn().mockResolvedValue("user-123"),
  },
  prazoRepository: {
    listarPorUsuario: vi.fn(),
    marcarConcluido: vi.fn(),
    excluir: vi.fn(),
  }
}));

describe("useListPrazos Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve inicializar e concluir o carregamento automático", async () => {
    vi.mocked(prazoRepository.listarPorUsuario).mockResolvedValue([]);
    const { result } = renderHook(() => useListPrazos());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.dados).toEqual([]);
    expect(result.current.errorMessage).toBe(null);
  });

  it("deve carregar os prazos com sucesso", async () => {
    const mockPrazos = [
      { id: "p1", titulo: "Prazo 1" },
      { id: "p2", titulo: "Prazo 2" },
    ];
    vi.mocked(prazoRepository.listarPorUsuario).mockResolvedValue(mockPrazos as unknown as Prazo[]);

    const { result } = renderHook(() => useListPrazos());

    await act(async () => {
      await result.current.carregarPrazos();
    });

    expect(result.current.dados).toEqual(mockPrazos);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.errorMessage).toBe(null);
    expect(prazoRepository.listarPorUsuario).toHaveBeenCalledWith("user-123");
  });

  it("deve tratar erro ao carregar prazos", async () => {
    vi.mocked(prazoRepository.listarPorUsuario).mockRejectedValue(new Error("Erro simulado"));

    const { result } = renderHook(() => useListPrazos());

    await act(async () => {
      await result.current.carregarPrazos();
    });

    expect(result.current.dados).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.errorMessage).toBe("Erro simulado");
  });

  it("deve marcar prazo como concluido com sucesso", async () => {
    // Configura prazos iniciais
    const mockPrazos = [{ id: "p1", titulo: "Prazo 1" }];
    const mockPrazosConcluidos = [{ id: "p1", titulo: "Prazo 1", status: "CONCLUIDO" }];

    vi.mocked(prazoRepository.listarPorUsuario)
      .mockResolvedValueOnce(mockPrazos as unknown as Prazo[])
      .mockResolvedValueOnce(mockPrazos as unknown as Prazo[])
      .mockResolvedValueOnce(mockPrazosConcluidos as unknown as Prazo[]);
    
    // O repository de concluir resolve sem erro
    vi.mocked(prazoRepository.marcarConcluido).mockResolvedValueOnce();

    const { result } = renderHook(() => useListPrazos());

    // Primeiro carrega
    await act(async () => {
      await result.current.carregarPrazos();
    });

    await act(async () => {
      await result.current.concluirPrazo("p1");
    });

    expect(prazoRepository.marcarConcluido).toHaveBeenCalledWith("user-123", "p1");
    expect(result.current.dados[0]?.status).toBe("CONCLUIDO");
  });
});
