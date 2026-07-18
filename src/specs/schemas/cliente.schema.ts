import { z } from "zod";

// ═══════════════════════════════════════════
// CLIENTE SCHEMAS (EP02 - Gestão de Clientes)
// ═══════════════════════════════════════════

/** Validação de CPF (11 dígitos numéricos, ignorando pontuação) */
const cpfSchema = z
  .string()
  .transform((val) => val.replace(/[^\d]/g, ""))
  .refine((val) => val.length === 11, "CPF deve conter exatamente 11 dígitos numéricos");

/** US04 - Cadastrar cliente */
export const CreateClienteSchema = z.object({
  nome: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  cpf: cpfSchema,
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  observacoes: z
    .string()
    .max(500, "Observações devem ter no máximo 500 caracteres")
    .optional(),
});

/** US06 - Editar cliente */
export const UpdateClienteSchema = z.object({
  nome: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .optional(),
  cpf: cpfSchema.optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  observacoes: z
    .string()
    .max(500, "Observações devem ter no máximo 500 caracteres")
    .optional(),
});

/** US05 - Parâmetros de listagem/busca */
export const ListClientesQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

/** Modelo completo do Cliente */
export const ClienteSchema = z.object({
  id: z.string(),
  nome: z.string(),
  cpf: cpfSchema,
  email: z.string().email().optional(),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  observacoes: z.string().optional(),
  userId: z.string(), // dono do registro (advogado)
  criadoEm: z.string().datetime(),
  atualizadoEm: z.string().datetime(),
});

/** Resposta paginada */
export const ClienteListResponseSchema = z.object({
  dados: z.array(ClienteSchema),
  paginacao: z.object({
    pagina: z.number(),
    limite: z.number(),
    total: z.number(),
    totalPaginas: z.number(),
  }),
});

// ═══════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════

export type CreateClienteInput = z.infer<typeof CreateClienteSchema>;
export type UpdateClienteInput = z.infer<typeof UpdateClienteSchema>;
export type ListClientesQuery = z.infer<typeof ListClientesQuerySchema>;
export type Cliente = z.infer<typeof ClienteSchema>;
export type ClienteListResponse = z.infer<typeof ClienteListResponseSchema>;
