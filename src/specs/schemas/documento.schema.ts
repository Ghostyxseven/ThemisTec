import { z } from "zod";
export const DocumentoCatalogoSchema = z.object({
  id: z.string().uuid(), userId: z.string().uuid(), nome: z.string(), storagePath: z.string(), pasta: z.string(),
  tags: z.array(z.string()), versao: z.number().int().positive(), versaoAtiva: z.boolean(), tamanho: z.number().nonnegative(),
  mimeType: z.string(), clienteId: z.string().uuid().optional(), processoId: z.string().uuid().optional(),
  excluidoEm: z.string().datetime().optional(), criadoEm: z.string().datetime(), atualizadoEm: z.string().datetime(),
});
export type DocumentoCatalogo = z.infer<typeof DocumentoCatalogoSchema>;
