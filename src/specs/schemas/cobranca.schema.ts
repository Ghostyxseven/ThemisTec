import { z } from "zod";

export const CobrancaStatusSchema = z.enum(["PENDENTE", "PAGA", "VENCIDA", "CANCELADA"]);

export const CreateCobrancaSchema = z.object({
  processoId: z.string().uuid("Processo ID inválido"),
  clienteId: z.string().uuid("Cliente ID inválido"),
  valor: z.number().min(1, "O valor deve ser maior que zero"),
  vencimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido (YYYY-MM-DD)"),
  descricao: z.string().max(255).optional(),
});

export const CobrancaSchema = z.object({
  id: z.string().uuid(),
  processo_id: z.string().uuid(),
  cliente_id: z.string().uuid(),
  user_id: z.string().uuid(),
  gateway_id: z.string().optional().nullable(),
  valor: z.number(),
  vencimento: z.string(),
  status: CobrancaStatusSchema,
  link_pagamento: z.string().url().optional().nullable(),
  payload_gateway: z.any().optional().nullable(),
  criado_em: z.string().datetime(),
  atualizado_em: z.string().datetime(),
});

export type Cobranca = z.infer<typeof CobrancaSchema>;
export type CreateCobrancaInput = z.infer<typeof CreateCobrancaSchema>;
export type CobrancaStatus = z.infer<typeof CobrancaStatusSchema>;
