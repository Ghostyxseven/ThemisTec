import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { fetchMovimentacoesProvider } from "./provider-adapter.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  try {
    const { data: processos, error: errorProcessos } = await supabase
      .from("processos")
      .select("id, id_integracao")
      .not("id_integracao", "is", null);

    if (errorProcessos) throw errorProcessos;

    for (const processo of processos) {
      const novasMovimentacoes = await fetchMovimentacoesProvider(processo.id_integracao);
      
      for (const mov of novasMovimentacoes) {
        await supabase.from("movimentacoes").insert({
          processo_id: processo.id,
          titulo: mov.titulo,
          descricao: mov.descricao,
          data_evento: mov.data,
          tipo: "OUTRO",
          origem_captura: "automatica",
          id_integracao: mov.id_externo,
        });
      }
    }

    return new Response(JSON.stringify({ success: true, count: processos.length }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
