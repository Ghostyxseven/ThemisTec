import { z } from "zod";
export const ResultadoBuscaSchema = z.object({ tipo: z.string(), id: z.string().uuid(), titulo: z.string(), subtitulo: z.string().nullable(), destino: z.string() });
export type ResultadoBusca = z.infer<typeof ResultadoBuscaSchema>;
