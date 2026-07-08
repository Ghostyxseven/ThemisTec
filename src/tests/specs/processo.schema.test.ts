import { describe, it, expect } from "vitest";
import {
  CreateProcessoSchema,
  UpdateProcessoSchema,
  ListProcessosQuerySchema,
  TAMANHO_MAXIMO_ARQUIVO,
  TIPOS_ACEITOS,
} from "@/specs/schemas/processo.schema";

describe("Processo Schemas - Contratos de Entrada", () => {
  describe("CreateProcessoSchema (US07)", () => {
    it("deve aceitar processo válido", () => {
      const input = {
        numero: "0001234-56.2026.8.01.0001",
        tipo: "civil",
        clienteId: "abc123",
        dataAbertura: "2026-06-01",
      };
      const result = CreateProcessoSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("deve aplicar status padrão 'em_andamento'", () => {
      const input = {
        numero: "0001234-56.2026.8.01.0001",
        tipo: "criminal",
        clienteId: "abc123",
        dataAbertura: "2026-06-01",
      };
      const result = CreateProcessoSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe("em_andamento");
      }
    });

    it("deve aceitar todos os tipos de processo", () => {
      const tipos = ["civil", "criminal", "trabalhista", "tributario", "administrativo", "outro"];
      tipos.forEach((tipo) => {
        const input = {
          numero: "123",
          tipo,
          clienteId: "abc",
          dataAbertura: "2026-01-01",
        };
        const result = CreateProcessoSchema.safeParse(input);
        expect(result.success).toBe(true);
      });
    });

    it("deve rejeitar tipo inválido", () => {
      const input = {
        numero: "123",
        tipo: "invalido",
        clienteId: "abc",
        dataAbertura: "2026-01-01",
      };
      const result = CreateProcessoSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar sem número", () => {
      const input = {
        tipo: "civil",
        clienteId: "abc",
        dataAbertura: "2026-01-01",
      };
      const result = CreateProcessoSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar sem clienteId", () => {
      const input = {
        numero: "123",
        tipo: "civil",
        dataAbertura: "2026-01-01",
      };
      const result = CreateProcessoSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar sem dataAbertura", () => {
      const input = {
        numero: "123",
        tipo: "civil",
        clienteId: "abc",
      };
      const result = CreateProcessoSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar descrição acima de 1000 caracteres", () => {
      const input = {
        numero: "123",
        tipo: "civil",
        clienteId: "abc",
        dataAbertura: "2026-01-01",
        descricao: "A".repeat(1001),
      };
      const result = CreateProcessoSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe("UpdateProcessoSchema", () => {
    it("deve aceitar atualização de status", () => {
      const input = { status: "concluido" };
      const result = UpdateProcessoSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("deve rejeitar status inválido", () => {
      const input = { status: "cancelado" };
      const result = UpdateProcessoSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe("ListProcessosQuerySchema (US08)", () => {
    it("deve aceitar filtros válidos", () => {
      const input = { clienteId: "abc", status: "em_andamento", page: 1, limit: 10 };
      const result = ListProcessosQuerySchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("deve aplicar defaults", () => {
      const result = ListProcessosQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
      }
    });
  });

  describe("Constantes de Upload (US09)", () => {
    it("tamanho máximo deve ser 10MB", () => {
      expect(TAMANHO_MAXIMO_ARQUIVO).toBe(10 * 1024 * 1024);
    });

    it("apenas PDF aceito", () => {
      expect(TIPOS_ACEITOS).toContain("application/pdf");
      expect(TIPOS_ACEITOS).toHaveLength(1);
    });
  });
});
