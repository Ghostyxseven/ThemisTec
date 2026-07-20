import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/services/supabase/supabase.server";
import { buscarMovimentacoesNovas } from "@/features/movimentacoes/model/DataJudAdapter";

/**
 * POST /api/sync-processos
 * Sincroniza movimentações de todos os processos do escritório com a API DataJud do CNJ.
 * Busca apenas movimentações novas (após a última movimentação registrada).
 */
export async function POST(): Promise<NextResponse> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    // Buscar todos os processos do usuário
    const { data: processos, error: procError } = await supabase
      .from("processos")
      .select("id, numero")
      .eq("user_id", user.id);

    if (procError) throw new Error("Erro ao buscar processos");
    if (!processos || processos.length === 0) {
      return NextResponse.json({ success: true, message: "Nenhum processo cadastrado", sincronizados: 0 });
    }

    let totalNovas = 0;
    const erros: string[] = [];

    for (const processo of processos) {
      try {
        // Buscar última movimentação registrada para este processo
        const { data: ultimaMov } = await supabase
          .from("movimentacoes")
          .select("data_evento")
          .eq("processo_id", processo.id)
          .order("data_evento", { ascending: false })
          .limit(1)
          .single();

        const aposData = ultimaMov?.data_evento || undefined;

        // Buscar movimentações novas na API DataJud
        const novas = await buscarMovimentacoesNovas(processo.numero, aposData);

        if (novas.length === 0) continue;

        // Inserir novas movimentações no banco
        for (const mov of novas) {
          const { error: insertErr } = await supabase
            .from("movimentacoes")
            .insert({
              processo_id: processo.id,
              user_id: user.id,
              tipo: "DESPACHO",
              titulo: mov.nome,
              descricao: mov.complemento || null,
              data_evento: mov.dataHora,
              responsavel: "DataJud/CNJ",
              origem_captura: "automatica",
              id_integracao: `datajud_${processo.numero}_${mov.dataHora}`,
            });

          if (!insertErr) totalNovas++;
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Erro desconhecido";
        erros.push(`${processo.numero}: ${msg}`);
      }
    }

    return NextResponse.json({
      success: true,
      sincronizados: totalNovas,
      processosVerificados: processos.length,
      erros: erros.length > 0 ? erros : undefined,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
