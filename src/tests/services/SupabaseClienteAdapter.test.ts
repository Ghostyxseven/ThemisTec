/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";

const terminal = vi.fn();
const query: Record<string, any> = {};
for (const method of ["select", "eq", "maybeSingle"]) query[method] = vi.fn(() => query);
query.then = (resolve: (value: unknown) => unknown) => Promise.resolve(terminal()).then(resolve);

vi.mock("@/services/supabase/supabase.client", () => ({
  supabaseClient: { from: vi.fn(() => query) },
}));

import { SupabaseClienteAdapter } from "@/features/clientes/model/SupabaseClienteAdapter";

describe("SupabaseClienteAdapter", () => {
  beforeEach(() => terminal.mockReset());

  it("converte colunas SQL opcionais para o contrato do domínio", async () => {
    terminal.mockReturnValueOnce({
      data: {
        id: "cliente-1", user_id: "user-1", nome: "Maria", cpf: "12345678901",
        email: null, telefone: "86999999999", endereco: null, observacoes: null,
        criado_em: "2026-07-18T00:00:00.000Z", atualizado_em: "2026-07-18T00:00:00.000Z",
      },
      error: null,
    });

    await expect(new SupabaseClienteAdapter().buscarPorId("cliente-1", "user-1")).resolves.toEqual({
      id: "cliente-1", userId: "user-1", nome: "Maria", cpf: "12345678901",
      telefone: "86999999999", criadoEm: "2026-07-18T00:00:00.000Z",
      atualizadoEm: "2026-07-18T00:00:00.000Z",
    });
  });

  it("retorna nulo quando o cliente não existe", async () => {
    terminal.mockReturnValueOnce({ data: null, error: null });
    await expect(new SupabaseClienteAdapter().buscarPorId("ausente", "user-1")).resolves.toBeNull();
  });
});
