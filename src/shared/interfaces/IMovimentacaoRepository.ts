import type { CreateMovimentacaoInput, Movimentacao } from "@/specs/schemas/movimentacao.schema";
export interface IMovimentacaoRepository { listar(userId: string, processoId: string): Promise<Movimentacao[]>; criar(userId: string, dados: CreateMovimentacaoInput): Promise<Movimentacao>; excluir(userId: string, id: string): Promise<void> }
