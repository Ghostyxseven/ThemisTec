import { z } from "zod";

export const CobrancaStatusSchema = z.enum(["PENDENTE", "PAGA", "VENCIDA", "CANCELADA"]);

export const CreateCobrancaSchema = z.object({
  processoId: z.string().uuid("Processo ID inválido"),
  clienteId: z.string().uuid("Cliente ID inválido"),
  valor: z.number().min(1, "O valor deve ser maior que zero"),
  vencimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido (YYYY-MM-DD)"),
  descricao: z.string().max(255).optional(),
});

/** Schema canônico em camelCase (para uso no domínio TypeScript) */
export const CobrancaSchema = z.object({
  id: z.string().uuid(),
  processoId: z.string().uuid(),
  clienteId: z.string().uuid(),
  userId: z.string().uuid(),
  gatewayId: z.string().optional().nullable(),
  valor: z.number(),
  vencimento: z.string(),
  status: CobrancaStatusSchema,
  linkPagamento: z.string().url().optional().nullable(),
  payloadGateway: z.any().optional().nullable(),
  criadoEm: z.string().datetime(),
  atualizadoEm: z.string().datetime(),
});

/** Schema em snake_case (espelha colunas do banco — usado no adapter) */
export const CobrancaRowSchema = z.object({
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

/** Converte row do banco (snake_case) para domínio (camelCase) */
export function cobrancaRowToDomain(row: CobrancaRow): Cobranca {
  return {
    id: row.id,
    processoId: row.processo_id,
    clienteId: row.cliente_id,
    userId: row.user_id,
    gatewayId: row.gateway_id,
    valor: row.valor,
    vencimento: row.vencimento,
    status: row.status,
    linkPagamento: row.link_pagamento,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    payloadGateway: row.payload_gateway,
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em,
  };
}

export type Cobranca = z.infer<typeof CobrancaSchema>;
export type CobrancaRow = z.infer<typeof CobrancaRowSchema>;
export type CreateCobrancaInput = z.infer<typeof CreateCobrancaSchema>;
export type CobrancaStatus = z.infer<typeof CobrancaStatusSchema>;
