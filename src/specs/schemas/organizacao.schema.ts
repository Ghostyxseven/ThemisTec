import { z } from "zod";

export const OrganizacaoSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(2, "Nome da organização é muito curto"),
  plano: z.enum(["FREE", "PRO", "ENTERPRISE"]).default("FREE"),
  criadoEm: z.string().datetime(),
});

export type Organizacao = z.infer<typeof OrganizacaoSchema>;

export const OrganizacaoMembroSchema = z.object({
  id: z.string().uuid(),
  organizacaoId: z.string().uuid(),
  userId: z.string().uuid(),
  papel: z.enum(["admin", "membro"]).default("membro"),
  criadoEm: z.string().datetime(),
});

export type OrganizacaoMembro = z.infer<typeof OrganizacaoMembroSchema>;
