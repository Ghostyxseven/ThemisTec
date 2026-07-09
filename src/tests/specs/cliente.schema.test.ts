import { describe, it, expect } from "vitest";
import {
  CreateClienteSchema,
  UpdateClienteSchema,
  ListClientesQuerySchema,
} from "@/specs/schemas/cliente.schema";

describe("Cliente Schemas - Contratos de Entrada", () => {
  describe("CreateClienteSchema (US04)", () => {
    it("deve aceitar cliente válido com campos obrigatórios", () => {
      const input = { nome: "João da Silva", cpf: "12345678901" };
      const result = CreateClienteSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("deve aceitar cliente com todos os campos", () => {
      const input = {
        nome: "Maria Oliveira",
        cpf: "98765432100",
        email: "maria@email.com",
        telefone: "11999998888",
        endereco: "Rua das Flores, 123",
        observacoes: "Cliente VIP",
      };
      const result = CreateClienteSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("deve rejeitar CPF com menos de 11 dígitos", () => {
      const input = { nome: "João", cpf: "1234567890" };
      const result = CreateClienteSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar CPF com letras", () => {
      const input = { nome: "João", cpf: "1234567890a" };
      const result = CreateClienteSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar CPF com mais de 11 dígitos", () => {
      const input = { nome: "João", cpf: "123456789012" };
      const result = CreateClienteSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar sem nome", () => {
      const input = { cpf: "12345678901" };
      const result = CreateClienteSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar sem CPF", () => {
      const input = { nome: "João da Silva" };
      const result = CreateClienteSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar observações com mais de 500 caracteres", () => {
      const input = {
        nome: "João",
        cpf: "12345678901",
        observacoes: "A".repeat(501),
      };
      const result = CreateClienteSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe("UpdateClienteSchema (US06)", () => {
    it("deve aceitar atualização parcial", () => {
      const input = { nome: "Novo Nome" };
      const result = UpdateClienteSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("deve aceitar objeto vazio (nenhuma alteração)", () => {
      const result = UpdateClienteSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe("ListClientesQuerySchema (US05)", () => {
    it("deve aceitar busca com parâmetros", () => {
      const input = { search: "João", page: 1, limit: 10 };
      const result = ListClientesQuerySchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("deve aplicar defaults quando vazio", () => {
      const result = ListClientesQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
      }
    });

    it("deve rejeitar limit acima de 50", () => {
      const input = { page: 1, limit: 51 };
      const result = ListClientesQuerySchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});
