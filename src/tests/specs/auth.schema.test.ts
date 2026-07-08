import { describe, it, expect } from "vitest";
import { LoginSchema, RegisterSchema, ResetPasswordSchema } from "@/specs/schemas/auth.schema";

describe("Auth Schemas - Contratos de Entrada", () => {
  describe("LoginSchema (US01)", () => {
    it("deve aceitar login válido", () => {
      const input = { email: "advogado@email.com", senha: "minhasenha123" };
      const result = LoginSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("deve rejeitar e-mail inválido", () => {
      const input = { email: "invalido", senha: "minhasenha123" };
      const result = LoginSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar senha com menos de 8 caracteres", () => {
      const input = { email: "advogado@email.com", senha: "1234567" };
      const result = LoginSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar campos vazios", () => {
      const result = LoginSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe("RegisterSchema (US02)", () => {
    it("deve aceitar cadastro válido", () => {
      const input = {
        nome: "Dr. Rafael Silva",
        email: "rafael@email.com",
        senha: "senhasegura123",
      };
      const result = RegisterSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("deve rejeitar nome com menos de 2 caracteres", () => {
      const input = { nome: "A", email: "a@b.com", senha: "12345678" };
      const result = RegisterSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar nome com mais de 100 caracteres", () => {
      const input = { nome: "A".repeat(101), email: "a@b.com", senha: "12345678" };
      const result = RegisterSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe("ResetPasswordSchema (US03)", () => {
    it("deve aceitar e-mail válido", () => {
      const result = ResetPasswordSchema.safeParse({ email: "teste@email.com" });
      expect(result.success).toBe(true);
    });

    it("deve rejeitar e-mail inválido", () => {
      const result = ResetPasswordSchema.safeParse({ email: "nao-email" });
      expect(result.success).toBe(false);
    });
  });
});
