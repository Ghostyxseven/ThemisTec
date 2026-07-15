import { z } from "zod";

export const PrazoSchema = z.object({
  id: z.string(),
  processoId: z.string().min(1, "O processo vinculado é obrigatório."),
  processoNumero: z.string().min(1, "O número do processo é obrigatório."), // Desnormalizado
  titulo: z.string().min(3, "O título do prazo deve ter pelo menos 3 caracteres.").max(100),
  descricao: z.string().max(500).optional(),
  dataVencimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD."),
  status: z.enum(["PENDENTE", "CONCLUIDO"]).default("PENDENTE"),
  userId: z.string().min(1, "O ID do usuário é obrigatório."),
  criadoEm: z.string(),
  atualizadoEm: z.string(),
});

export const BaseCreatePrazoSchema = PrazoSchema.omit({
  id: true,
  userId: true,
  criadoEm: true,
  atualizadoEm: true,
  processoNumero: true, // we will inject this in the adapter
});

export const CreatePrazoSchema = BaseCreatePrazoSchema.refine((data) => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); // Ajusta para o início do dia
  
  // Como dataVencimento é 'YYYY-MM-DD', podemos criar um Date
  const parts = data.dataVencimento.split("-");
  if (parts.length !== 3) return false;
  
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  const dataVenc = new Date(year, month - 1, day);
  
  return dataVenc >= hoje;
}, {
  message: "A data de vencimento não pode ser anterior a hoje.",
  path: ["dataVencimento"],
});

export const UpdatePrazoSchema = BaseCreatePrazoSchema.partial();

export type Prazo = z.infer<typeof PrazoSchema>;
export type CreatePrazoInput = z.infer<typeof CreatePrazoSchema>;
export type UpdatePrazoInput = z.infer<typeof UpdatePrazoSchema>;
