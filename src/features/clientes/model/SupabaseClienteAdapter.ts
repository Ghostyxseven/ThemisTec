import type { IClienteRepository } from "@/shared/interfaces/IClienteRepository";
import type { Cliente, ClienteListResponse, CreateClienteInput, ListClientesQuery, UpdateClienteInput } from "@/specs/schemas/cliente.schema";
import { supabaseClient } from "@/services/supabase/supabase.client";

type ClienteRow = { id: string; user_id: string; nome: string; cpf: string; email: string | null; telefone: string | null; endereco: string | null; observacoes: string | null; criado_em: string; atualizado_em: string };

function mapCliente(row: ClienteRow): Cliente {
  return {
    id: row.id, userId: row.user_id, nome: row.nome, cpf: row.cpf,
    ...(row.email ? { email: row.email } : {}), ...(row.telefone ? { telefone: row.telefone } : {}),
    ...(row.endereco ? { endereco: row.endereco } : {}), ...(row.observacoes ? { observacoes: row.observacoes } : {}),
    criadoEm: row.criado_em, atualizadoEm: row.atualizado_em,
  };
}

export class SupabaseClienteAdapter implements IClienteRepository {
  public async buscarPorCpf(cpf: string, userId: string): Promise<Cliente | null> {
    const { data, error } = await supabaseClient.from("clientes").select("*").eq("user_id", userId).eq("cpf", cpf).maybeSingle<ClienteRow>();
    if (error) throw new Error("Erro ao buscar cliente por CPF.");
    return data ? mapCliente(data) : null;
  }

  public async criar(dados: CreateClienteInput, userId: string): Promise<Cliente> {
    const { data, error } = await supabaseClient.from("clientes").insert({ user_id: userId, nome: dados.nome, cpf: dados.cpf, email: dados.email || null, telefone: dados.telefone || null, endereco: dados.endereco || null, observacoes: dados.observacoes || null }).select().single<ClienteRow>();
    if (error?.code === "23505") throw new Error("Já existe um cliente cadastrado com este CPF.");
    if (error || !data) throw new Error("Falha ao salvar cliente. Tente novamente mais tarde.");
    return mapCliente(data);
  }

  public async listar(params: ListClientesQuery, userId: string): Promise<ClienteListResponse> {
    const pagina = params.page ?? 1; const limite = params.limit ?? 10; const inicio = (pagina - 1) * limite;
    let query = supabaseClient.from("clientes").select("*", { count: "exact" }).eq("user_id", userId).order("criado_em", { ascending: false }).range(inicio, inicio + limite - 1);
    if (params.search?.trim()) query = query.or(`nome.ilike.%${params.search.trim()}%,cpf.ilike.%${params.search.replace(/\D/g, "")}%`);
    const { data, error, count } = await query;
    if (error) throw new Error("Erro ao buscar a lista de clientes.");
    const total = count ?? 0;
    return { dados: (data as ClienteRow[]).map(mapCliente), paginacao: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) || 1 } };
  }

  public async buscarPorId(id: string, userId: string): Promise<Cliente | null> {
    const { data, error } = await supabaseClient.from("clientes").select("*").eq("id", id).eq("user_id", userId).maybeSingle<ClienteRow>();
    if (error) throw new Error("Erro ao buscar cliente.");
    return data ? mapCliente(data) : null;
  }

  public async atualizar(id: string, dados: UpdateClienteInput, userId: string): Promise<Cliente> {
    const payload = { ...(dados.nome !== undefined ? { nome: dados.nome } : {}), ...(dados.cpf !== undefined ? { cpf: dados.cpf } : {}), ...(dados.email !== undefined ? { email: dados.email || null } : {}), ...(dados.telefone !== undefined ? { telefone: dados.telefone || null } : {}), ...(dados.endereco !== undefined ? { endereco: dados.endereco || null } : {}), ...(dados.observacoes !== undefined ? { observacoes: dados.observacoes || null } : {}), atualizado_em: new Date().toISOString() };
    const { data, error } = await supabaseClient.from("clientes").update(payload).eq("id", id).eq("user_id", userId).select().maybeSingle<ClienteRow>();
    if (error?.code === "23505") throw new Error("Já existe outro cliente cadastrado com este CPF.");
    if (error) throw new Error("Erro ao atualizar os dados do cliente.");
    if (!data) throw new Error("Cliente não encontrado.");
    return mapCliente(data);
  }

  public async excluir(id: string, userId: string): Promise<void> {
    const { error } = await supabaseClient.from("clientes").delete().eq("id", id).eq("user_id", userId);
    if (error) throw new Error("Erro ao excluir o cliente.");
  }

  public async contarClientes(userId: string): Promise<number> {
    const { count, error } = await supabaseClient.from("clientes").select("id", { count: "exact", head: true }).eq("user_id", userId);
    if (error) throw new Error("Erro ao contar clientes.");
    return count ?? 0;
  }
}
