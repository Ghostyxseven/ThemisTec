import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateDocx } from '@/lib/templates/docx-generator';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
    
    // Verifica sessão
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { templateId, processoId } = body;

    // 1. Busca os dados do processo e do cliente associado
    const { data: processo, error: processoError } = await (await supabase)
      .from('processos')
      .select('*, clientes(*)')
      .eq('id', processoId)
      .single();
      
    if (processoError || !processo) throw new Error("Processo não encontrado");

    // 2. Busca o path do template no banco
    const { data: template, error: templateError } = await (await supabase)
      .from('document_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (templateError || !template) throw new Error("Template não encontrado");

    // 3. Baixa o arquivo do Storage
    const { data: fileData, error: fileError } = await (await supabase).storage
      .from('templates')
      .download(template.storage_path);

    if (fileError || !fileData) throw new Error("Erro ao baixar arquivo do storage");

    const arrayBuffer = await fileData.arrayBuffer();

    // 4. Mapeia os dados para injeção
    const mergeData = {
      processo_numero: processo.numero,
      cliente_nome: processo.clientes?.nome || '',
      cliente_cpf: processo.clientes?.cpf || '',
    };

    // 5. Gera o novo Docx
    const outputBuffer = generateDocx(arrayBuffer, mergeData);

    // 6. Retorna como arquivo para download
    return new NextResponse(outputBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="Petição_${processo.clientes?.nome}.docx"`
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
