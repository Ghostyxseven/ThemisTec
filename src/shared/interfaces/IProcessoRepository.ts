import { CreateProcessoInput, Processo, ListProcessosQuery, ProcessoListResponse, Documento, UpdateProcessoInput } from "@/specs/schemas/processo.schema";

export interface IProcessoRepository {
  criar(dados: CreateProcessoInput, clienteNome: string, userId: string): Promise<Processo>;
  listar(params: ListProcessosQuery, userId: string): Promise<ProcessoListResponse>;
  adicionarDocumento(processoId: string, documento: Documento, userId: string): Promise<void>;
  atualizar(id: string, dados: UpdateProcessoInput, userId: string): Promise<Processo>;
  buscarPorId(id: string, userId: string): Promise<Processo>;
  contarProcessos(userId: string): Promise<number>;
  contarProcessosAtivos(userId: string): Promise<number>;
  excluir(id: string, userId: string): Promise<void>;
}
