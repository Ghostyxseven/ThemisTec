import { z } from "zod";

// ═══════════════════════════════════════════
// PROCESSO SCHEMAS (EP03 - Gestão de Processos)
// ═══════════════════════════════════════════

/** Tipos de processo */
export const TipoProcessoEnum = z.enum([
  "civil",
  "criminal",
  "trabalhista",
  "tributario",
  "administrativo",
  "outro",
]);

/** Status do processo */
export const StatusProcessoEnum = z.enum([
  "em_andamento",
  "concluido",
  "arquivado",
]);

/** Status Financeiro (US12) */
export const StatusPagamentoEnum = z.enum([
  "PAGO",
  "PENDENTE",
  "ATRASADO",
  "PARCIAL",
]);

/** US07 - Registrar processo */
export const CreateProcessoSchema = z.object({
  numero: z.string().min(1, "Número do processo é obrigatório"),
  tipo: TipoProcessoEnum,
  status: StatusProcessoEnum.default("em_andamento"),
  descricao: z
    .string()
    .max(1000, "Descrição deve ter no máximo 1000 caracteres")
    .optional(),
  clienteId: z.string().min(1, "Cliente vinculado é obrigatório"),
  dataAbertura: z.string().date("Data de abertura inválida"),
  valorHonorarios: z.number().optional().default(0),
  statusPagamento: StatusPagamentoEnum.optional().default("PENDENTE"),
});

/** Atualizar processo */
export const UpdateProcessoSchema = z.object({
  tipo: TipoProcessoEnum.optional(),
  status: StatusProcessoEnum.optional(),
  descricao: z
    .string()
    .max(1000, "Descrição deve ter no máximo 1000 caracteres")
    .optional(),
  valorHonorarios: z.number().optional(),
  statusPagamento: StatusPagamentoEnum.optional(),
});

/** US08 - Parâmetros de listagem/filtro */
export const ListProcessosQuerySchema = z.object({
  clienteId: z.string().optional(),
  status: StatusProcessoEnum.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

/** US09 - Validação de upload de documento */
export const UploadDocumentoSchema = z.object({
  descricao: z.string().max(200, "Descrição deve ter no máximo 200 caracteres").optional(),
});

/** Tamanho máximo: 5MB */
export const TAMANHO_MAXIMO_ARQUIVO = 5 * 1024 * 1024; // 5242880 bytes

/** Tipos MIME aceitos */
export const TIPOS_ACEITOS = ["application/pdf"] as const;

/** Schema do Documento */
export const DocumentoSchema = z.object({
  id: z.string(),
  nomeArquivo: z.string(),
  url: z.string().url(),
  tamanho: z.number().max(TAMANHO_MAXIMO_ARQUIVO),
  descricao: z.string().optional(),
  enviadoEm: z.string().datetime(),
});

/** Modelo completo do Processo (Firestore) */
export const ProcessoSchema = z.object({
  id: z.string(),
  numero: z.string(),
  tipo: TipoProcessoEnum,
  status: StatusProcessoEnum,
  descricao: z.string().optional(),
  clienteId: z.string(),
  clienteNome: z.string(),
  dataAbertura: z.string(),
  valorHonorarios: z.number(),
  statusPagamento: StatusPagamentoEnum,
  documentos: z.array(DocumentoSchema).default([]),
  userId: z.string(), // dono do registro (advogado)
  criadoEm: z.string().datetime(),
  atualizadoEm: z.string().datetime(),
});

/** Resposta paginada */
export const ProcessoListResponseSchema = z.object({
  dados: z.array(ProcessoSchema),
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

export type TipoProcesso = z.infer<typeof TipoProcessoEnum>;
export type StatusProcesso = z.infer<typeof StatusProcessoEnum>;
export type StatusPagamento = z.infer<typeof StatusPagamentoEnum>;
export type CreateProcessoInput = z.infer<typeof CreateProcessoSchema>;
export type UpdateProcessoInput = z.infer<typeof UpdateProcessoSchema>;
export type ListProcessosQuery = z.infer<typeof ListProcessosQuerySchema>;
export type Documento = z.infer<typeof DocumentoSchema>;
export type Processo = z.infer<typeof ProcessoSchema>;
export type ProcessoListResponse = z.infer<typeof ProcessoListResponseSchema>;
