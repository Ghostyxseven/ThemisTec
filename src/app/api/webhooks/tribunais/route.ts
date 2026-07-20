import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

import { WebhookTribunalSchema } from '@/specs/schemas/movimentacao.schema';

// Usamos o cliente raiz (admin) pois webhooks rodam no background sem sessão de usuário
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // 1. Validação de Segurança (Secret do Parceiro)
    const secret = req.headers.get('x-webhook-secret');
    if (secret !== process.env.WEBHOOK_TRIBUNAIS_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();
    
    // 1.1 Validação de Contrato (Zod)
    const validacao = WebhookTribunalSchema.safeParse(payload);
    if (!validacao.success) {
      return NextResponse.json(
        { error: 'Contrato de dados inválido', detalhes: validacao.error.format() },
        { status: 422 }
      );
    }

    const { numero_cnj, data_andamento, descricao, titulo } = validacao.data;

    // 2. Busca processo no banco pelo CNJ
    // Como estamos usando o admin client, ele ignora RLS.
    const { data: processo, error: processoError } = await supabaseAdmin
      .from('processos')
      .select('id, user_id')
      .eq('numero', numero_cnj)
      .single();

    if (processoError || !processo) {
      // Retornar 200 para a API externa não ficar tentando reenviar se não temos o processo
      return NextResponse.json({ message: 'Processo não encontrado no sistema.' }, { status: 200 });
    }

    // 3. Insere a movimentação atrelando ao dono do processo
    const { error: insertError } = await supabaseAdmin
      .from('movimentacoes')
      .insert({
        processo_id: processo.id,
        user_id: processo.user_id, // Mantém a posse pro advogado
        tipo: 'ANDAMENTO_TRIBUNAL',
        titulo: titulo || 'Novo andamento processual',
        descricao: descricao,
        data_evento: data_andamento || new Date().toISOString(),
        responsavel: 'API_TRIBUNAL'
      });

    if (insertError) throw insertError;

    return NextResponse.json({ success: true }, { status: 200 });
    
  } catch (error: any) {
    console.error('Erro no webhook de tribunais:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
