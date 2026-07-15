import { Processo } from "@/specs/schemas/processo.schema";
import { Cliente } from "@/specs/schemas/cliente.schema";
import { IExportService } from "@/shared/interfaces/IExportService";

export class ExportService implements IExportService {
  public gerarCsvProcessos(processos: Processo[]): string {
    const cabecalho = "Número;Tipo;Status;Cliente;Data Abertura;Honorários;Status Pagamento\n";
    
    const linhas = processos.map((p) => {
      // Garantir que os campos que podem conter ponto e vírgula sejam escapados.
      const numero = `"${p.numero}"`;
      const tipo = `"${p.tipo}"`;
      const status = `"${p.status}"`;
      const clienteNome = `"${p.clienteNome}"`;
      const dataAbertura = `"${p.dataAbertura}"`;
      // Formatar número para duas casas decimais no CSV
      const valorHonorarios = `"${p.valorHonorarios.toFixed(2).replace('.', ',')}"`;
      const statusPagamento = `"${p.statusPagamento}"`;

      return `${numero};${tipo};${status};${clienteNome};${dataAbertura};${valorHonorarios};${statusPagamento}`;
    });

    return cabecalho + linhas.join("\n");
  }

  public gerarCsvClientes(clientes: Cliente[]): string {
    const cabecalho = "Nome;CPF;Telefone;E-mail;Criado Em\n";
    
    const linhas = clientes.map((c) => {
      const nome = `"${c.nome}"`;
      const cpf = `"${c.cpf}"`;
      const telefone = `"${c.telefone || ""}"`;
      const email = `"${c.email || ""}"`;
      const criadoEm = `"${c.criadoEm}"`;

      return `${nome};${cpf};${telefone};${email};${criadoEm}`;
    });

    return cabecalho + linhas.join("\n");
  }
}
