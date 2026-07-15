import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useListPrazos } from "@/app/(authenticated)/prazos/useListPrazos";
import { prazoRepository } from "@/services";

// Mock do auth para simular usuário logado
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({
    currentUser: { uid: "user-123" },
    onAuthStateChanged: vi.fn((callback) => {
      callback({ uid: "user-123" });
      return vi.fn(); // unsubscribe
    })
  })),
}));

// Mock do authService e prazoRepository
vi.mock("@/services", () => ({
  authService: {
    getCurrentUserId: vi.fn(() => "user-123"),
  },
  prazoRepository: {
    listarPorUsuario: vi.fn(),
    marcarConcluido: vi.fn(),
  }
}));

describe("useListPrazos Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve inicializar com o estado correto", () => {
    const { result } = renderHook(() => useListPrazos());
    
    expect(result.current.dados).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.errorMessage).toBe(null);
  });

  it("deve carregar os prazos com sucesso", async () => {
    const mockPrazos = [
      { id: "p1", titulo: "Prazo 1" },
      { id: "p2", titulo: "Prazo 2" },
    ];
    vi.mocked(prazoRepository.listarPorUsuario).mockResolvedValueOnce(mockPrazos as any);

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
    vi.mocked(prazoRepository.listarPorUsuario).mockRejectedValueOnce(new Error("Erro simulado"));

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
    vi.mocked(prazoRepository.listarPorUsuario).mockResolvedValueOnce(mockPrazos as any);
    
    // O repository de concluir resolve sem erro
    vi.mocked(prazoRepository.marcarConcluido).mockResolvedValueOnce();

    const { result } = renderHook(() => useListPrazos());

    // Primeiro carrega
    await act(async () => {
      await result.current.carregarPrazos();
    });

    // Depois conclui e simula que o listar de novo trará o item como concluído
    const mockPrazosConcluidos = [{ id: "p1", titulo: "Prazo 1", status: "CONCLUIDO" }];
    vi.mocked(prazoRepository.listarPorUsuario).mockResolvedValueOnce(mockPrazosConcluidos as any);

    await act(async () => {
      await result.current.concluirPrazo("p1");
    });

    expect(prazoRepository.marcarConcluido).toHaveBeenCalledWith("user-123", "p1");
    expect(result.current.dados[0]?.status).toBe("CONCLUIDO");
  });
});
