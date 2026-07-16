import { describe, it, expect, vi, beforeEach } from "vitest";
import "../setup/firebaseMock"; // Importa o mock ANTES do adapter
import { FirestorePrazoAdapter } from "@/features/prazos/model/FirestorePrazoAdapter";
import { setDoc, getDocs, updateDoc, getDoc } from "firebase/firestore";

describe("FirestorePrazoAdapter", () => {
  let adapter: FirestorePrazoAdapter;
  const mockUserId = "user-123";

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new FirestorePrazoAdapter();
  });

  describe("criar()", () => {
    it("deve criar um prazo com sucesso se o processo existir e pertencer ao usuario", async () => {
      // Configurar o mock do getDoc para simular que o processo existe
      vi.mocked(getDoc).mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ userId: mockUserId, numero: "12345" }),
      } as any);

      const payload = {
        processoId: "proc-1",
        titulo: "Audiência Trabalhista",
        dataVencimento: "2026-10-10",
        descricao: "Levar testemunhas",
        status: "PENDENTE" as const,
      };

      const result = await adapter.criar(mockUserId, payload);

      expect(getDoc).toHaveBeenCalled(); // Verificou o processo
      expect(setDoc).toHaveBeenCalled(); // Salvou o prazo
      
      expect(result.id).toBe("mocked-auto-id");
      expect(result.userId).toBe(mockUserId);
      expect(result.processoNumero).toBe("12345");
      expect(result.titulo).toBe(payload.titulo);
      expect(result.status).toBe("PENDENTE"); // Valor default
    });

    it("deve lançar erro se o processo não for encontrado ou for de outro usuario", async () => {
      // Simular processo não encontrado ou de outro dono
      vi.mocked(getDoc).mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ userId: "outro-usuario", numero: "12345" }),
      } as any);

      const payload = {
        processoId: "proc-1",
        titulo: "Audiência",
        dataVencimento: "2026-10-10",
        status: "PENDENTE" as const,
      };

      await expect(adapter.criar(mockUserId, payload)).rejects.toThrow("Processo não encontrado ou sem permissão.");
      expect(setDoc).not.toHaveBeenCalled();
    });
  });

  describe("listarPorUsuario()", () => {
    it("deve retornar uma lista de prazos", async () => {
      const mockDocs = [
        { data: () => ({ id: "p1", titulo: "Prazo 1" }) },
        { data: () => ({ id: "p2", titulo: "Prazo 2" }) },
      ];

      vi.mocked(getDocs).mockResolvedValueOnce({
        docs: mockDocs,
      } as any);

      const result = await adapter.listarPorUsuario(mockUserId);

      expect(getDocs).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]?.titulo).toBe("Prazo 1");
    });
  });

  describe("marcarConcluido()", () => {
    it("deve atualizar o status para CONCLUIDO se o prazo pertencer ao usuario", async () => {
      vi.mocked(getDoc).mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ userId: mockUserId }),
      } as any);

      await adapter.marcarConcluido(mockUserId, "prazo-1");

      expect(updateDoc).toHaveBeenCalled();
      // O primeiro argumento (docRef) é complexo de testar diretamente sem destrinchar o firestoreMock, 
      // mas verificamos se o payload de update passou CONCLUIDO
      const calls = vi.mocked(updateDoc).mock.calls;
      expect(calls[0]?.[1]).toMatchObject({
        status: "CONCLUIDO"
      });
    });

    it("deve falhar ao tentar concluir prazo de outro usuario", async () => {
      vi.mocked(getDoc).mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ userId: "outro-usuario" }),
      } as any);

      await expect(adapter.marcarConcluido(mockUserId, "prazo-1")).rejects.toThrow("Prazo não encontrado ou sem permissão.");
      expect(updateDoc).not.toHaveBeenCalled();
    });
  });
});
