import type { IPrazoRepository } from "@/shared/interfaces/IPrazoRepository";
import type { CreatePrazoInput, Prazo } from "@/specs/schemas/prazo.schema";
import { supabaseClient } from "@/services/supabase/supabase.client";

type PrazoRow = { id: string; user_id: string; processo_id: string; processo_numero: string; titulo: string; descricao: string | null; data_vencimento: string; status: "PENDENTE" | "CONCLUIDO"; criado_em: string; atualizado_em: string };
const mapPrazo = (row: PrazoRow): Prazo => ({ id: row.id, userId: row.user_id, processoId: row.processo_id, processoNumero: row.processo_numero, titulo: row.titulo, ...(row.descricao ? { descricao: row.descricao } : {}), dataVencimento: row.data_vencimento, status: row.status, criadoEm: row.criado_em, atualizadoEm: row.atualizado_em });

export class SupabasePrazoAdapter implements IPrazoRepository {
  public async criar(userId: string, dados: CreatePrazoInput): Promise<Prazo> {
    const { data: processo } = await supabaseClient.from("processos").select("numero").eq("id", dados.processoId).eq("user_id", userId).maybeSingle<{ numero: string }>();
    if (!processo) throw new Error("Processo não encontrado ou sem permissão.");
    const { data, error } = await supabaseClient.from("prazos").insert({ user_id: userId, processo_id: dados.processoId, processo_numero: processo.numero, titulo: dados.titulo, descricao: dados.descricao ?? null, data_vencimento: dados.dataVencimento, status: dados.status ?? "PENDENTE" }).select().single<PrazoRow>();
    if (error || !data) throw new Error("Erro ao cadastrar prazo."); return mapPrazo(data);
  }
  public async listarPorUsuario(userId: string): Promise<Prazo[]> {
    const { data, error } = await supabaseClient.from("prazos").select("*").eq("user_id", userId).order("data_vencimento", { ascending: true });
    if (error) throw new Error("Erro ao listar prazos."); return (data as PrazoRow[]).map(mapPrazo);
  }
  public async marcarConcluido(userId: string, prazoId: string): Promise<void> {
    const { error } = await supabaseClient.from("prazos").update({ status: "CONCLUIDO", atualizado_em: new Date().toISOString() }).eq("id", prazoId).eq("user_id", userId);
    if (error) throw new Error("Prazo não encontrado ou sem permissão.");
  }
  public async contarPrazosDaSemana(userId: string): Promise<number> {
    const inicio = new Date(); const fim = new Date(); fim.setDate(inicio.getDate() + 7);
    const { count, error } = await supabaseClient.from("prazos").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("status", "PENDENTE").gte("data_vencimento", inicio.toISOString().slice(0, 10)).lte("data_vencimento", fim.toISOString().slice(0, 10));
    if (error) throw new Error("Erro ao contar prazos."); return count ?? 0;
  }
  public async excluir(userId: string, prazoId: string): Promise<void> {
    const { error } = await supabaseClient.from("prazos").delete().eq("id", prazoId).eq("user_id", userId);
    if (error) throw new Error("Prazo não encontrado ou sem permissão.");
  }
}
