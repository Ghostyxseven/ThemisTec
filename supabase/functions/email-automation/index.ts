import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

console.log("Serviço de Automação de E-mails inicializado.");

serve(async (req) => {
  try {
    // 1. Inicializar cliente Supabase com Service Role (Ignora RLS para poder ler a base toda)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 2. Data de Hoje (formatada YYYY-MM-DD para bater com o banco)
    const hoje = new Date().toISOString().split("T")[0];

    // 3. Buscar prazos que vencem hoje
    const { data: prazosHoje, error: prazosError } = await supabase
      .from("prazos")
      .select(`
        id, titulo, descricao, user_id, escritorio_id,
        processos ( numero, clienteNome )
      `)
      .eq("data_vencimento", hoje);

    if (prazosError) throw prazosError;

    // 4. Agrupar alertas por Advogado (user_id)
    const alertasPorUsuario: Record<string, any[]> = {};
    
    (prazosHoje || []).forEach(prazo => {
      if (!alertasPorUsuario[prazo.user_id]) alertasPorUsuario[prazo.user_id] = [];
      alertasPorUsuario[prazo.user_id].push(prazo);
    });

    // 5. "Disparar" e-mails (Integração Mock para Resend/SendGrid)
    let disparos = 0;
    for (const [userId, prazos] of Object.entries(alertasPorUsuario)) {
      // Buscar email real do advogado na tabela de profiles
      const { data: userProfile } = await supabase
        .from("profiles") // ou auth.users em RPC
        .select("email, full_name")
        .eq("id", userId)
        .single();

      if (userProfile?.email) {
        console.log(`[MAILER MOCK] Enviando Daily Digest para ${userProfile.email} (${prazos.length} prazos hoje).`);
        // Aqui entraria a API Call pro Resend:
        // await resend.emails.send({...})
        disparos++;
      }
    }

    return new Response(
      JSON.stringify({ 
        message: "Job diário executado com sucesso", 
        disparosFeitos: disparos,
        prazosEncontrados: prazosHoje?.length || 0 
      }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Erro no motor de automação:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
