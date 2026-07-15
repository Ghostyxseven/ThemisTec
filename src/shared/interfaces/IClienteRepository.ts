import { CreateClienteInput, Cliente, ListClientesQuery, ClienteListResponse, UpdateClienteInput } from "@/specs/schemas/cliente.schema";

export interface IClienteRepository {
  criar(dados: CreateClienteInput, userId: string): Promise<Cliente>;
  buscarPorCpf(cpf: string, userId: string): Promise<Cliente | null>;
  listar(params: ListClientesQuery, userId: string): Promise<ClienteListResponse>;
  buscarPorId(id: string, userId: string): Promise<Cliente | null>;
  atualizar(id: string, dados: UpdateClienteInput, userId: string): Promise<Cliente>;
  excluir(id: string, userId: string): Promise<void>;
  contarClientes(userId: string): Promise<number>;
}
