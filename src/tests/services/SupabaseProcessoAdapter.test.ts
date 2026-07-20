/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";

const terminal = vi.fn();
const query: Record<string, any> = {};
for (const method of ["select", "eq", "maybeSingle"]) query[method] = vi.fn(() => query);
query.then = (resolve: (value: unknown) => unknown) => Promise.resolve(terminal()).then(resolve);

vi.mock("@/services/supabase/supabase.client", () => ({
  supabaseClient: { from: vi.fn(() => query) },
}));

import { SupabaseProcessoAdapter } from "@/features/processos/model/SupabaseProcessoAdapter";

describe("SupabaseProcessoAdapter", () => {
  beforeEach(() => terminal.mockReset());

  it("converte colunas SQL, valor decimal e documentos para o domínio", async () => {
    terminal.mockReturnValueOnce({
      data: {
        id: "processo-1", user_id: "user-1", cliente_id: "cliente-1", cliente_nome: "Maria",
        numero: "00000010020268180001", tipo: "civil", status: "em_andamento", descricao: null,
        data_abertura: "2026-07-18", valor_honorarios: "1250.50", status_pagamento: "PENDENTE",
        documentos: null, criado_em: "2026-07-18T00:00:00.000Z", atualizado_em: "2026-07-18T00:00:00.000Z",
      },
      error: null,
    });

    await expect(new SupabaseProcessoAdapter().buscarPorId("processo-1", "user-1")).resolves.toMatchObject({
      id: "processo-1", userId: "user-1", clienteId: "cliente-1", valorHonorarios: 1250.5,
      documentos: [],
    });
  });

  it("não mascara processo ausente como sucesso", async () => {
    terminal.mockReturnValueOnce({ data: null, error: null });
    await expect(new SupabaseProcessoAdapter().buscarPorId("ausente", "user-1"))
      .rejects.toThrow("Processo não encontrado.");
  });
});
