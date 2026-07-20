import type { Notificacao } from "@/specs/schemas/notificacao.schema";
export interface INotificacaoRepository { listar(userId: string): Promise<Notificacao[]>; contarNaoLidas(userId: string): Promise<number>; marcarLida(userId: string, id: string): Promise<void>; marcarTodasLidas(userId: string): Promise<void> }
