import { z } from "zod";

export const LancamentoFinanceiroSchema = z.object({
  id: z.string().uuid(), userId: z.string().uuid(), tipo: z.enum(["RECEITA", "DESPESA"]),
  descricao: z.string(), categoria: z.string(), valor: z.number().nonnegative(), competencia: z.string().date(),
  vencimento: z.string().date().optional(), pagoEm: z.string().date().optional(), formaPagamento: z.string().optional(),
  status: z.enum(["PENDENTE", "PAGO", "ATRASADO", "PARCIAL"]), processoId: z.string().uuid().optional(),
  clienteId: z.string().uuid().optional(), parcelaNumero: z.number().int().positive().optional(),
  parcelasTotal: z.number().int().positive().optional(), criadoEm: z.string().datetime(), atualizadoEm: z.string().datetime(),
});
export const CreateLancamentoSchema = LancamentoFinanceiroSchema.omit({ id: true, userId: true, criadoEm: true, atualizadoEm: true });
export type LancamentoFinanceiro = z.infer<typeof LancamentoFinanceiroSchema>;
export type CreateLancamentoInput = z.infer<typeof CreateLancamentoSchema>;
export type ResumoFinanceiro = { receitas: number; despesas: number; saldo: number; pendente: number; atrasado: number };
