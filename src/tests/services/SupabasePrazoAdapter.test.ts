/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi } from "vitest";

const terminal = vi.fn();
const query: Record<string, any> = {};
for (const method of ["select", "eq", "order"]) query[method] = vi.fn(() => query);
query.then = (resolve: (value: unknown) => unknown) => Promise.resolve(terminal()).then(resolve);

vi.mock("@/services/supabase/supabase.client", () => ({ supabaseClient: { from: vi.fn(() => query) } }));
import { SupabasePrazoAdapter } from "@/features/prazos/model/SupabasePrazoAdapter";

describe("SupabasePrazoAdapter", () => {
  it("converte colunas SQL para o contrato do domínio", async () => {
    const userId = "00000000-0000-0000-0000-000000000001";
    terminal.mockReturnValueOnce({ data: [{ id: "p1", user_id: userId, processo_id: "proc1", processo_numero: "123", titulo: "Audiência", descricao: null, data_vencimento: "2026-10-10", status: "PENDENTE", criado_em: "2026-07-18T00:00:00.000Z", atualizado_em: "2026-07-18T00:00:00.000Z" }], error: null });
    const result = await new SupabasePrazoAdapter().listarPorUsuario(userId);
    expect(result[0]).toMatchObject({ id: "p1", userId, processoId: "proc1" });
  });
});
