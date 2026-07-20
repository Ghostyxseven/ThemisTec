import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/services/supabase/supabase.server";
import { CreateCobrancaSchema } from "@/specs/schemas/cobranca.schema";
import { AsaasGatewayAdapter } from "@/features/cobrancas/model/AsaasGatewayAdapter";
import { SupabaseCobrancaAdapter } from "@/features/cobrancas/model/SupabaseCobrancaAdapter";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    // 1. Verificar autenticação
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // 2. Validar payload
    const json = await request.json();
    const result = CreateCobrancaSchema.safeParse(json);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors }, { status: 400 });
    }

    const payload = result.data;

    // 3. Buscar dados do cliente no Supabase para enviar ao Asaas
    const { data: cliente, error: clienteError } = await supabase
      .from("clientes")
      .select("*")
      .eq("id", payload.clienteId)
      .single();

    if (clienteError || !cliente) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
    }

    // 4. Integrar com Asaas
    const gateway = new AsaasGatewayAdapter();
    
    // 4.1 Criar ou buscar cliente no Asaas
    const clienteAsaasId = await gateway.criarCliente(
      cliente.nome, 
      cliente.cpf, 
      cliente.email || undefined
    );

    // 4.2 Gerar a cobrança Pix
    const cobrancaExterna = await gateway.criarCobranca({
      clienteAsaasId,
      valor: payload.valor,
      vencimento: payload.vencimento,
      descricao: payload.descricao || `Cobrança referente ao processo`,
      externalReference: `${payload.processoId}|${payload.clienteId}`, // Rastreabilidade
    });

    // 5. Salvar no Supabase
    const adapter = new SupabaseCobrancaAdapter(supabase);
    const novaCobranca = await adapter.create({
      processo_id: payload.processoId,
      cliente_id: payload.clienteId,
      user_id: user.id,
      gateway_id: cobrancaExterna.gatewayId,
      valor: payload.valor,
      vencimento: payload.vencimento,
      status: "PENDENTE",
      link_pagamento: cobrancaExterna.linkPagamento,
      payload_gateway: cobrancaExterna.payloadOriginal,
    });

    return NextResponse.json({ success: true, data: novaCobranca });
  } catch (error: any) {
    console.error("Erro na criação de cobrança:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
