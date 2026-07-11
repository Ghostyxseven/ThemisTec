import { CreateClienteInput, Cliente } from "@/specs/schemas/cliente.schema";

export interface IClienteRepository {
  criar(dados: CreateClienteInput, userId: string): Promise<Cliente>;
  buscarPorCpf(cpf: string, userId: string): Promise<Cliente | null>;
}
