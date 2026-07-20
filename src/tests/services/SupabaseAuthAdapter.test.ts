import { beforeEach, describe, expect, it, vi } from "vitest";

const authMock = vi.hoisted(() => ({
  signInWithPassword: vi.fn(), signUp: vi.fn(), resetPasswordForEmail: vi.fn(),
  updateUser: vi.fn(), signOut: vi.fn(), getSession: vi.fn(), getUser: vi.fn(),
  onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
}));
vi.mock("@/services/supabase/supabase.client", () => ({ supabaseClient: { auth: authMock } }));

import { SupabaseAuthAdapter } from "@/features/auth/model/SupabaseAuthAdapter";

describe("SupabaseAuthAdapter", () => {
  const adapter = new SupabaseAuthAdapter();
  beforeEach(() => vi.clearAllMocks());

  it("autentica com e-mail e senha", async () => {
    authMock.signInWithPassword.mockResolvedValueOnce({ error: null });
    await adapter.login({ email: "teste@themistec.com", senha: "12345678" });
    expect(authMock.signInWithPassword).toHaveBeenCalledWith({ email: "teste@themistec.com", password: "12345678" });
  });

  it("traduz credenciais inválidas", async () => {
    authMock.signInWithPassword.mockResolvedValueOnce({ error: { message: "Invalid login credentials" } });
    await expect(adapter.login({ email: "teste@themistec.com", senha: "12345678" })).rejects.toThrow("E-mail ou senha incorretos.");
  });

  it("atualiza a senha da sessão de recuperação", async () => {
    authMock.updateUser.mockResolvedValueOnce({ error: null });
    await adapter.updatePassword("nova-senha-segura");
    expect(authMock.updateUser).toHaveBeenCalledWith({ password: "nova-senha-segura" });
  });
});
