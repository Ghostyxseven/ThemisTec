import { SupabaseClient } from "@supabase/supabase-js";
import { Cobranca, CobrancaRow, CobrancaStatus, cobrancaRowToDomain } from "@/specs/schemas/cobranca.schema";

export interface CobrancaComProcesso extends Cobranca {
  processoNumero?: string | null;
}

export class SupabaseCobrancaAdapter {
  constructor(private readonly supabase: SupabaseClient) {}

  async create(data: { processo_id: string; cliente_id: string; user_id: string; gateway_id?: string | null; valor: number; vencimento: string; status?: string; link_pagamento?: string | null; payload_gateway?: unknown }): Promise<Cobranca> {
    const { data: result, error } = await this.supabase
      .from("cobrancas")
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar cobranca: ${error.message}`);
    }

    return cobrancaRowToDomain(result as CobrancaRow);
  }

  async getById(id: string): Promise<Cobranca | null> {
    const { data, error } = await this.supabase
      .from("cobrancas")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }

    return cobrancaRowToDomain(data as CobrancaRow);
  }

  async getByProcesso(processoId: string): Promise<Cobranca[]> {
    const { data, error } = await this.supabase
      .from("cobrancas")
      .select("*")
      .eq("processo_id", processoId)
      .order("criado_em", { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar cobrancas do processo: ${error.message}`);
    }

    return (data || []).map((row) => cobrancaRowToDomain(row as CobrancaRow));
  }

  async getByCliente(clienteId: string): Promise<CobrancaComProcesso[]> {
    const { data, error } = await this.supabase
      .from("cobrancas")
      .select("*, processos(numero)")
      .eq("cliente_id", clienteId)
      .order("vencimento", { ascending: true });

    if (error) {
      throw new Error(`Erro ao buscar cobrancas do cliente: ${error.message}`);
    }

    return (data || []).map((row) => {
      const base = cobrancaRowToDomain(row as CobrancaRow);
      return { ...base, processoNumero: row.processos?.numero ?? null };
    });
  }

  async updateStatus(gatewayId: string, status: CobrancaStatus): Promise<boolean> {
    const { error } = await this.supabase
      .from("cobrancas")
      .update({ status })
      .eq("gateway_id", gatewayId);

    if (error) {
      throw new Error(`Erro ao atualizar status: ${error.message}`);
    }

    return true;
  }
}
