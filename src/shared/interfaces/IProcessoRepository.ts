import { CreateProcessoInput, Processo, ListProcessosQuery, ProcessoListResponse } from "@/specs/schemas/processo.schema";

export interface IProcessoRepository {
  criar(dados: CreateProcessoInput, clienteNome: string, userId: string): Promise<Processo>;
  listar(params: ListProcessosQuery, userId: string): Promise<ProcessoListResponse>;
}
