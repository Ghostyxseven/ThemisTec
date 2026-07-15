import { describe, it, expect } from "vitest";
import { CreatePrazoSchema } from "../../specs/schemas/prazo.schema";

describe("Prazo Schema Validation", () => {
  it("deve validar um input correto", () => {
    const input = {
      processoId: "proc-123",
      titulo: "Audiência de Conciliação",
      descricao: "Levar testemunhas",
      dataVencimento: "2026-08-01",
      status: "PENDENTE",
    };
    
    const parsed = CreatePrazoSchema.safeParse(input);
    expect(parsed.success).toBe(true);
  });

  it("deve falhar se a data estiver no formato incorreto", () => {
    const input = {
      processoId: "proc-123",
      titulo: "Prazo",
      dataVencimento: "01/08/2026", // formato brasileiro não aceito pelo banco/iso
    };
    
    const parsed = CreatePrazoSchema.safeParse(input);
    expect(parsed.success).toBe(false);
  });
});
