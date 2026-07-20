import { supabaseClient } from "@/services/supabase/supabase.client";
import type { Processo } from "@/specs/schemas/processo.schema";
import type { Cliente } from "@/specs/schemas/cliente.schema";
import type { Cobranca, CobrancaRow } from "@/specs/schemas/cobranca.schema";
import { cobrancaRowToDomain } from "@/specs/schemas/cobranca.schema";

export class SupabasePortalAdapter {
  public async autenticar(cpf: string, dataNascimento: string): Promise<Cliente> {
    const { data, error } = await supabaseClient
      .from("clientes")
      .select("*")
      .eq("cpf", cpf.replace(/\D/g, ''))
      .eq("data_nascimento", dataNascimento)
      .maybeSingle();
      
    if (error || !data) {
      throw new Error("Credenciais inválidas ou cliente não encontrado.");
    }
    
    return {
      id: data.id,
      nome: data.nome,
      cpf: data.cpf,
      email: data.email || undefined,
      dataNascimento: data.data_nascimento || undefined,
      telefone: data.telefone || undefined,
      endereco: data.endereco || undefined,
      observacoes: data.observacoes || undefined,
      userId: data.user_id,
      criadoEm: data.criado_em,
      atualizadoEm: data.atualizado_em,
    };
  }

  public async listarProcessos(clienteId: string): Promise<Processo[]> {
    const { data, error } = await supabaseClient
      .from("processos")
      .select("*")
      .eq("cliente_id", clienteId)
      .order("criado_em", { ascending: false });

    if (error) {
      throw new Error("Erro ao carregar processos.");
    }

    return (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      clienteId: row.cliente_id,
      clienteNome: row.cliente_nome,
      numero: row.numero,
      tipo: row.tipo,
      status: row.status,
      descricao: row.descricao || undefined,
      dataAbertura: row.data_abertura,
      valorHonorarios: row.valor_honorarios,
      statusPagamento: row.status_pagamento,
      documentos: typeof row.documentos === 'string' ? JSON.parse(row.documentos) : row.documentos,
      criadoEm: row.criado_em,
      atualizadoEm: row.atualizado_em,
    }));
  }

  public async listarCobrancas(clienteId: string): Promise<(Cobranca & { processoNumero?: string | null })[]> {
    const { data, error } = await supabaseClient
      .from("cobrancas")
      .select("*, processos(numero)")
      .eq("cliente_id", clienteId)
      .order("vencimento", { ascending: true });

    if (error) {
      throw new Error("Erro ao carregar cobranças.");
    }

    return (data || []).map((row) => {
      const base = cobrancaRowToDomain(row as CobrancaRow);
      return { ...base, processoNumero: row.processos?.numero ?? null };
    });
  }
}
