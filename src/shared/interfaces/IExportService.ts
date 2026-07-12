import { Processo } from "@/specs/schemas/processo.schema";

export interface IExportService {
  gerarCsvProcessos(processos: Processo[]): string;
}
