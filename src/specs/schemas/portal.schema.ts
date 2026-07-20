import { z } from "zod";

const cpfSchema = z
  .string()
  .transform((val) => val.replace(/[^\d]/g, ""))
  .refine((val) => val.length === 11, "CPF deve conter exatamente 11 dígitos numéricos");

export const PortalLoginSchema = z.object({
  cpf: cpfSchema,
  dataNascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido (YYYY-MM-DD)"),
});

export type PortalLoginInput = z.infer<typeof PortalLoginSchema>;
