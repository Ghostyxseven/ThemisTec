import { z } from "zod";
import { DocumentoSchema } from "./processo.schema";

export const TipoMovimentacaoEnum = z.enum(["DESPACHO", "AUDIENCIA", "DECISAO", "PETICAO", "NOTA", "OUTRO"]);
export const MovimentacaoSchema = z.object({
  id: z.string().uuid(), userId: z.string().uuid(), processoId: z.string().uuid(), tipo: TipoMovimentacaoEnum,
  titulo: z.string(), descricao: z.string().optional(), dataEvento: z.string().datetime(), responsavel: z.string(),
  anexos: z.array(DocumentoSchema), criadoEm: z.string().datetime(), atualizadoEm: z.string().datetime(),
  origemCaptura: z.enum(["manual", "automatica"]).default("manual"),
  idIntegracao: z.string().optional(),
});
export const CreateMovimentacaoSchema = MovimentacaoSchema.omit({ id: true, userId: true, anexos: true, criadoEm: true, atualizadoEm: true });
export type Movimentacao = z.infer<typeof MovimentacaoSchema>;
export type CreateMovimentacaoInput = z.infer<typeof CreateMovimentacaoSchema>;

export const WebhookTribunalSchema = z.object({
  numero_cnj: z.string().min(1, "O CNJ é obrigatório"),
  data_andamento: z.string().datetime().optional(),
  descricao: z.string().min(1, "A descrição do andamento é obrigatória"),
  titulo: z.string().optional(),
});
export type WebhookTribunalPayload = z.infer<typeof WebhookTribunalSchema>;
