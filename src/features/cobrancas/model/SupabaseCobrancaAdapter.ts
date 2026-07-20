import { SupabaseClient } from "@supabase/supabase-js";
import { Cobranca, CobrancaStatus } from "@/specs/schemas/cobranca.schema";

export interface CobrancaComProcesso extends Cobranca {
  processos?: { numero: string | null } | null;
}

export class SupabaseCobrancaAdapter {
  constructor(private readonly supabase: SupabaseClient) {}

  async create(data: Omit<Cobranca, "id" | "criado_em" | "atualizado_em">): Promise<Cobranca> {
    const { data: result, error } = await this.supabase
      .from("cobrancas")
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar cobranca: ${error.message}`);
    }

    return result as unknown as Cobranca;
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

    return data as unknown as Cobranca;
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

    return (data || []) as unknown as Cobranca[];
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

    return (data || []) as unknown as CobrancaComProcesso[];
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
