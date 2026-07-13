import { describe, it, expect } from "vitest";
import { ExportService } from "@/services/export/ExportService";
import { Processo } from "@/specs/schemas/processo.schema";

describe("ExportService", () => {
  it("deve gerar o CSV corretamente para um array de processos", () => {
    const service = new ExportService();
    const mockProcessos: Processo[] = [
      {
        id: "1",
        numero: "12345-67",
        tipo: "civil",
        status: "em_andamento",
        clienteId: "abc",
        clienteNome: "João da Silva",
        dataAbertura: "2026-07-01",
        valorHonorarios: 1500.5,
        statusPagamento: "PENDENTE",
        documentos: [],
        userId: "user1",
        criadoEm: "2026-07-01T10:00:00Z",
        atualizadoEm: "2026-07-01T10:00:00Z",
      },
      {
        id: "2",
        numero: "98765-43",
        tipo: "criminal",
        status: "concluido",
        clienteId: "def",
        clienteNome: "Maria Souza",
        dataAbertura: "2026-05-15",
        valorHonorarios: 5000,
        statusPagamento: "PAGO",
        documentos: [],
        userId: "user1",
        criadoEm: "2026-05-15T10:00:00Z",
        atualizadoEm: "2026-05-15T10:00:00Z",
      },
    ];

    const csv = service.gerarCsvProcessos(mockProcessos);

    const linhas = csv.split("\n");
    expect(linhas.length).toBe(3); // Cabecalho + 2 linhas
    expect(linhas[0]).toBe("Número;Tipo;Status;Cliente;Data Abertura;Honorários;Status Pagamento");
    expect(linhas[1]).toBe('"12345-67";"civil";"em_andamento";"João da Silva";"2026-07-01";"1500,50";"PENDENTE"');
    expect(linhas[2]).toBe('"98765-43";"criminal";"concluido";"Maria Souza";"2026-05-15";"5000,00";"PAGO"');
  });

  it("deve gerar apenas o cabeçalho se o array estiver vazio", () => {
    const service = new ExportService();
    const csv = service.gerarCsvProcessos([]);
    
    // Split com trim para remover \n no final ou lidar adequadamente
    const linhas = csv.split("\n").filter(linha => linha.trim() !== "");
    expect(linhas.length).toBe(1);
    expect(linhas[0]).toBe("Número;Tipo;Status;Cliente;Data Abertura;Honorários;Status Pagamento");
  });
});
