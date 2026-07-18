import { describe, expect, it, vi } from "vitest";

const storageMock = vi.hoisted(() => ({ upload: vi.fn(), createSignedUrl: vi.fn(), remove: vi.fn() }));
vi.mock("@/services/supabase/supabase.client", () => ({
  supabaseClient: { storage: { from: vi.fn(() => storageMock) } },
}));

import { SupabaseStorageAdapter } from "@/features/documentos/model/SupabaseStorageAdapter";

describe("SupabaseStorageAdapter", () => {
  it("gera uma URL nova a partir do caminho persistido", async () => {
    storageMock.createSignedUrl.mockResolvedValueOnce({ data: { signedUrl: "https://example.supabase.co/signed.pdf" }, error: null });
    const url = await new SupabaseStorageAdapter().getFileUrl("user/processos/proc/doc.pdf");
    expect(url).toContain("signed.pdf");
    expect(storageMock.createSignedUrl).toHaveBeenCalledWith("user/processos/proc/doc.pdf", 900);
  });

  it("remove o upload quando não consegue gerar acesso seguro", async () => {
    storageMock.upload.mockResolvedValueOnce({ error: null });
    storageMock.createSignedUrl.mockResolvedValueOnce({ data: null, error: { message: "failed" } });
    storageMock.remove.mockResolvedValueOnce({ error: null });
    const file = new File(["pdf"], "doc.pdf", { type: "application/pdf" });
    await expect(new SupabaseStorageAdapter().uploadFile("user/processos/proc/doc.pdf", file)).rejects.toThrow("Falha ao gerar acesso seguro");
    expect(storageMock.remove).toHaveBeenCalledWith(["user/processos/proc/doc.pdf"]);
  });
});
