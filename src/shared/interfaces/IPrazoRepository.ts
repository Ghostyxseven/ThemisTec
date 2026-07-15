import { Prazo, CreatePrazoInput } from "../../specs/schemas/prazo.schema";

export interface IPrazoRepository {
  criar(userId: string, data: CreatePrazoInput): Promise<Prazo>;
  listarPorUsuario(userId: string): Promise<Prazo[]>;
  marcarConcluido(userId: string, prazoId: string): Promise<void>;
}
