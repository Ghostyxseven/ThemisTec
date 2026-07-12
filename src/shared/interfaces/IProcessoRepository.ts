import { CreateProcessoInput, Processo, ListProcessosQuery, ProcessoListResponse, Documento } from "@/specs/schemas/processo.schema";

export interface IProcessoRepository {
  criar(dados: CreateProcessoInput, clienteNome: string, userId: string): Promise<Processo>;
  listar(params: ListProcessosQuery, userId: string): Promise<ProcessoListResponse>;
  adicionarDocumento(processoId: string, documento: Documento, userId: string): Promise<void>;
  buscarPorId(id: string, userId: string): Promise<Processo>;
  contarProcessos(userId: string): Promise<number>;
  contarProcessosAtivos(userId: string): Promise<number>;
}
