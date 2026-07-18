import type { IProcessoRepository } from "@/shared/interfaces/IProcessoRepository";
import type { CreateProcessoInput, Documento, ListProcessosQuery, Processo, ProcessoListResponse, StatusPagamento, StatusProcesso, TipoProcesso, UpdateProcessoInput } from "@/specs/schemas/processo.schema";
import { supabaseClient } from "@/services/supabase/supabase.client";

type ProcessoRow = { id: string; user_id: string; cliente_id: string; cliente_nome: string; numero: string; tipo: TipoProcesso; status: StatusProcesso; descricao: string | null; data_abertura: string; valor_honorarios: number | string; status_pagamento: StatusPagamento; documentos: Documento[] | null; criado_em: string; atualizado_em: string };
const mapProcesso = (row: ProcessoRow): Processo => ({ id: row.id, userId: row.user_id, clienteId: row.cliente_id, clienteNome: row.cliente_nome, numero: row.numero, tipo: row.tipo, status: row.status, ...(row.descricao ? { descricao: row.descricao } : {}), dataAbertura: row.data_abertura, valorHonorarios: Number(row.valor_honorarios), statusPagamento: row.status_pagamento, documentos: row.documentos ?? [], criadoEm: row.criado_em, atualizadoEm: row.atualizado_em });

export class SupabaseProcessoAdapter implements IProcessoRepository {
  public async criar(dados: CreateProcessoInput, clienteNome: string, userId: string): Promise<Processo> {
    const { data, error } = await supabaseClient.from("processos").insert({ user_id: userId, cliente_id: dados.clienteId, cliente_nome: clienteNome, numero: dados.numero, tipo: dados.tipo, status: dados.status, descricao: dados.descricao ?? null, data_abertura: dados.dataAbertura, valor_honorarios: dados.valorHonorarios ?? 0, status_pagamento: dados.statusPagamento ?? "PENDENTE", documentos: [] }).select().single<ProcessoRow>();
    if (error || !data) throw new Error("Falha ao registrar processo. Tente novamente mais tarde.");
    return mapProcesso(data);
  }

  public async listar(params: ListProcessosQuery, userId: string): Promise<ProcessoListResponse> {
    const pagina = params.page ?? 1; const limite = params.limit ?? 10; const inicio = (pagina - 1) * limite;
    let query = supabaseClient.from("processos").select("*", { count: "exact" }).eq("user_id", userId).order("criado_em", { ascending: false }).range(inicio, inicio + limite - 1);
    if (params.clienteId) query = query.eq("cliente_id", params.clienteId);
    if (params.status) query = query.eq("status", params.status);
    const { data, error, count } = await query;
    if (error) throw new Error("Erro ao buscar a lista de processos.");
    const total = count ?? 0;
    return { dados: (data as ProcessoRow[]).map(mapProcesso), paginacao: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) || 1 } };
  }

  public async buscarPorId(id: string, userId: string): Promise<Processo> {
    const { data, error } = await supabaseClient.from("processos").select("*").eq("id", id).eq("user_id", userId).maybeSingle<ProcessoRow>();
    if (error) throw new Error("Falha ao buscar detalhes do processo.");
    if (!data) throw new Error("Processo não encontrado.");
    return mapProcesso(data);
  }

  public async adicionarDocumento(processoId: string, documento: Documento, userId: string): Promise<void> {
    const processo = await this.buscarPorId(processoId, userId);
    const { error } = await supabaseClient.from("processos").update({ documentos: [...processo.documentos, documento], atualizado_em: new Date().toISOString() }).eq("id", processoId).eq("user_id", userId);
    if (error) throw new Error("Falha ao anexar documento ao processo.");
  }

  public async removerDocumento(processoId: string, documentoId: string, userId: string): Promise<void> {
    const processo = await this.buscarPorId(processoId, userId);
    const { error } = await supabaseClient.from("processos").update({ documentos: processo.documentos.filter((doc) => doc.id !== documentoId), atualizado_em: new Date().toISOString() }).eq("id", processoId).eq("user_id", userId);
    if (error) throw new Error("Falha ao remover documento do processo.");
  }

  public async atualizar(id: string, dados: UpdateProcessoInput, userId: string): Promise<Processo> {
    const payload = { ...(dados.tipo !== undefined ? { tipo: dados.tipo } : {}), ...(dados.status !== undefined ? { status: dados.status } : {}), ...(dados.descricao !== undefined ? { descricao: dados.descricao ?? null } : {}), ...(dados.valorHonorarios !== undefined ? { valor_honorarios: dados.valorHonorarios } : {}), ...(dados.statusPagamento !== undefined ? { status_pagamento: dados.statusPagamento } : {}), atualizado_em: new Date().toISOString() };
    const { data, error } = await supabaseClient.from("processos").update(payload).eq("id", id).eq("user_id", userId).select().maybeSingle<ProcessoRow>();
    if (error) throw new Error("Erro ao atualizar os dados do processo.");
    if (!data) throw new Error("Processo não encontrado.");
    return mapProcesso(data);
  }

  public async excluir(id: string, userId: string): Promise<void> {
    const { error } = await supabaseClient.from("processos").delete().eq("id", id).eq("user_id", userId);
    if (error) throw new Error("Erro ao excluir o processo.");
  }

  private async contar(userId: string, status?: StatusProcesso): Promise<number> {
    let query = supabaseClient.from("processos").select("id", { count: "exact", head: true }).eq("user_id", userId);
    if (status) query = query.eq("status", status);
    const { count, error } = await query; if (error) throw new Error("Erro ao contar processos."); return count ?? 0;
  }
  public contarProcessos(userId: string): Promise<number> { return this.contar(userId); }
  public contarProcessosAtivos(userId: string): Promise<number> { return this.contar(userId, "em_andamento"); }

  public async somarHonorariosAReceber(userId: string): Promise<number> {
    const { data, error } = await supabaseClient.from("processos").select("valor_honorarios").eq("user_id", userId).in("status_pagamento", ["PENDENTE", "ATRASADO", "PARCIAL"]);
    if (error) throw new Error("Erro ao somar honorários a receber.");
    return (data as Array<{ valor_honorarios: number | string }>).reduce((total, item) => total + Number(item.valor_honorarios), 0);
  }
}
