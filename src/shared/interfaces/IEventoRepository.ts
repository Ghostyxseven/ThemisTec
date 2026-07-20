import type { CreateEventoInput, EventoAgenda } from "@/specs/schemas/evento.schema";
export interface IEventoRepository { listar(userId: string, inicio: string, fim: string): Promise<EventoAgenda[]>; criar(userId: string, dados: CreateEventoInput): Promise<EventoAgenda>; concluir(userId: string, id: string): Promise<void>; excluir(userId: string, id: string): Promise<void> }
