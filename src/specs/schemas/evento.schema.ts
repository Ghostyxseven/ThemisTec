import { z } from "zod";

export const TipoEventoEnum = z.enum(["PRAZO", "AUDIENCIA", "REUNIAO", "COMPROMISSO"]);
export const EventoAgendaSchema = z.object({
  id: z.string().uuid(), userId: z.string().uuid(), titulo: z.string(), tipo: TipoEventoEnum,
  inicio: z.string().datetime(), fim: z.string().datetime().optional(), descricao: z.string().optional(),
  processoId: z.string().uuid().optional(), clienteId: z.string().uuid().optional(),
  lembreteMinutos: z.number().int().min(0).optional(), status: z.enum(["PENDENTE", "CONCLUIDO"]),
  criadoEm: z.string().datetime(), atualizadoEm: z.string().datetime(),
});
export const CreateEventoSchema = z.object({
  titulo: z.string().min(2).max(150), tipo: TipoEventoEnum, inicio: z.string().datetime(),
  fim: z.string().datetime().optional(), descricao: z.string().max(1000).optional(),
  processoId: z.string().uuid().optional(), clienteId: z.string().uuid().optional(),
  lembreteMinutos: z.number().int().min(0).optional(),
});
export type EventoAgenda = z.infer<typeof EventoAgendaSchema>;
export type CreateEventoInput = z.infer<typeof CreateEventoSchema>;
