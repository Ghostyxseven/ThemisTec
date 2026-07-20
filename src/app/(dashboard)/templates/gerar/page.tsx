'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function TemplateGeneratorView() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [processos, setProcessos] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  
  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedProcesso, setSelectedProcesso] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  useEffect(() => {
    // Carrega dados iniciais
    const fetchData = async () => {
      const [{ data: cData }, { data: tData }] = await Promise.all([
        supabase.from('clientes').select('id, nome'),
        supabase.from('document_templates').select('id, nome')
      ]);
      if (cData) setClientes(cData);
      if (tData) setTemplates(tData);
    };
    fetchData();
  }, [supabase]);

  useEffect(() => {
    // Carrega processos do cliente selecionado
    if (!selectedCliente) {
      setProcessos([]);
      return;
    }
    const fetchProcessos = async () => {
      const { data } = await supabase
        .from('processos')
        .select('id, numero')
        .eq('cliente_id', selectedCliente);
      if (data) setProcessos(data);
    };
    fetchProcessos();
  }, [selectedCliente, supabase]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProcesso || !selectedTemplate) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/templates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate,
          processoId: selectedProcesso
        })
      });

      if (!response.ok) throw new Error('Erro ao gerar documento');

      // Processa o blob recebido
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Tentamos usar o nome do arquivo enviado pelo server, mas se falhar usamos padrao
      const disposition = response.headers.get('content-disposition');
      let filename = 'documento_gerado.docx';
      if (disposition && disposition.includes('filename=')) {
        filename = disposition.split('filename=')[1]?.replace(/"/g, '') || filename;
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error(err);
      alert('Erro na geração da petição.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gerador de Petições</h1>
        <p className="text-gray-600">Selecione o modelo, o cliente e o processo para injetar os dados automaticamente.</p>
      </div>

      <form onSubmit={handleGenerate} className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Modelo de Petição (Template)</label>
          <select 
            required
            className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
          >
            <option value="">Selecione um modelo...</option>
            {templates.map(t => (
              <option key={t.id} value={t.id}>{t.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
          <select 
            required
            className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
            value={selectedCliente}
            onChange={(e) => setSelectedCliente(e.target.value)}
          >
            <option value="">Selecione um cliente...</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Processo</label>
          <select 
            required
            disabled={!selectedCliente}
            className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            value={selectedProcesso}
            onChange={(e) => setSelectedProcesso(e.target.value)}
          >
            <option value="">Selecione o processo...</option>
            {processos.map(p => (
              <option key={p.id} value={p.id}>{p.numero}</option>
            ))}
          </select>
        </div>

        <div className="pt-4 border-t">
          <button
            type="submit"
            disabled={isLoading || !selectedTemplate || !selectedProcesso}
            className="w-full bg-blue-600 text-white rounded-md py-3 px-4 font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Gerando Documento...' : 'Gerar e Baixar .docx'}
          </button>
        </div>
      </form>
    </div>
  );
}
