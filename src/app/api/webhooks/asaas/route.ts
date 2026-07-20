import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SupabaseCobrancaAdapter } from "@/features/cobrancas/model/SupabaseCobrancaAdapter";
import { CobrancaStatus } from "@/specs/schemas/cobranca.schema";

// Bypass default Next.js edge runtime for webhooks if needed (Node.js is fine too)
// export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    // Validação básica do Webhook Asaas via Token
    // No painel do Asaas você configura um Auth Token.
    const asaasToken = request.headers.get("asaas-access-token");
    const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN;

    if (expectedToken && asaasToken !== expectedToken) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const payload = await request.json();

    // Verificamos apenas os eventos que nos interessam
    const eventType = payload.event;
    if (!eventType || !payload.payment) {
      return NextResponse.json({ success: true, message: "Ignorado" });
    }

    let novoStatus: CobrancaStatus | null = null;
    
    // Mapeia eventos do Asaas para nossos status
    switch (eventType) {
      case "PAYMENT_RECEIVED":
      case "PAYMENT_CONFIRMED":
        novoStatus = "PAGA";
        break;
      case "PAYMENT_OVERDUE":
        novoStatus = "VENCIDA";
        break;
      case "PAYMENT_DELETED":
      case "PAYMENT_REFUNDED":
        novoStatus = "CANCELADA";
        break;
      default:
        // Outros eventos (ex: PAYMENT_CREATED) ignoramos
        return NextResponse.json({ success: true });
    }

    if (novoStatus) {
      // Cria client do Supabase usando Service Role para ignorar RLS e atualizar banco de forma sistêmica
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const adapter = new SupabaseCobrancaAdapter(supabaseAdmin);
      const gatewayId = payload.payment.id;
      
      // Atualiza a cobrança na nossa base
      await adapter.updateStatus(gatewayId, novoStatus);

      // (Opcional) Se pago, também podemos atualizar o status_pagamento do Processo.
      if (novoStatus === "PAGA") {
        const { data: cobranca } = await supabaseAdmin
          .from("cobrancas")
          .select("processo_id")
          .eq("gateway_id", gatewayId)
          .single();
          
        if (cobranca) {
          await supabaseAdmin
            .from("processos")
            .update({ statusPagamento: "PAGO" })
            .eq("id", cobranca.processo_id);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro no webhook do Asaas:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
