import { z } from "zod";
export const NotificacaoSchema = z.object({
  id: z.string().uuid(), userId: z.string().uuid(), titulo: z.string(), mensagem: z.string(),
  prioridade: z.enum(["BAIXA", "NORMAL", "ALTA", "URGENTE"]), origem: z.string(), destinoUrl: z.string().optional(),
  lidaEm: z.string().datetime().optional(), chaveIdempotencia: z.string(), criadoEm: z.string().datetime(),
});
export type Notificacao = z.infer<typeof NotificacaoSchema>;
