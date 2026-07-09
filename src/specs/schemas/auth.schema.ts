import { z } from "zod";

// ═══════════════════════════════════════════
// AUTH SCHEMAS (EP01 - Autenticação)
// ═══════════════════════════════════════════

/** US01 - Login com e-mail e senha */
export const LoginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
});

/** US02 - Cadastro de conta */
export const RegisterSchema = z.object({
  nome: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
});

/** US03 - Recuperação de senha */
export const ResetPasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

/** Resposta de autenticação */
export const AuthResponseSchema = z.object({
  token: z.string(),
  usuario: z.object({
    id: z.string(),
    nome: z.string(),
    email: z.string().email(),
  }),
});

// ═══════════════════════════════════════════
// TYPES (inferidos dos schemas)
// ═══════════════════════════════════════════

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
