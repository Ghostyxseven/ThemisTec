import { Processo } from "@/specs/schemas/processo.schema";
import { Cliente } from "@/specs/schemas/cliente.schema";

export interface IExportService {
  gerarCsvProcessos(processos: Processo[]): string;
  gerarCsvClientes(clientes: Cliente[]): string;
}
