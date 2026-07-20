'use client';

import { useState } from 'react';
import {
  Plus,
  Trash2,
  FileText,
  Loader2,
  AlertCircle,
  Calendar,
  User,
} from 'lucide-react';
import { useMovimentacoes } from '../viewmodel/useMovimentacoes';

const TIPOS = [
  'DESPACHO',
  'AUDIENCIA',
  'DECISAO',
  'PETICAO',
  'NOTA',
  'OUTRO',
] as const;

type Tipo = (typeof TIPOS)[number];

const TIPO_LABELS: Record<Tipo, string> = {
  DESPACHO: 'Despacho',
  AUDIENCIA: 'Audiência',
  DECISAO: 'Decisão',
  PETICAO: 'Petição',
  NOTA: 'Nota',
  OUTRO: 'Outro',
};

const TIPO_COLORS: Record<Tipo, string> = {
  DESPACHO: 'bg-blue-100 text-blue-800',
  AUDIENCIA: 'bg-purple-100 text-purple-800',
  DECISAO: 'bg-amber-100 text-amber-800',
  PETICAO: 'bg-green-100 text-green-800',
  NOTA: 'bg-slate-100 text-slate-700',
  OUTRO: 'bg-slate-100 text-slate-700',
};

interface MovimentacoesViewProps {
  processoId: string;
}

export default function MovimentacoesView({ processoId }: MovimentacoesViewProps) {
  const { movimentacoes, loading, erro, criar, excluir } =
    useMovimentacoes(processoId);

  const [modalAberto, setModalAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // Form state
  const [tipo, setTipo] = useState<Tipo>('NOTA');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataEvento, setDataEvento] = useState('');
  const [responsavel, setResponsavel] = useState('');

  function resetForm() {
    setTipo('NOTA');
    setTitulo('');
    setDescricao('');
    setDataEvento('');
    setResponsavel('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    try {
      await criar({
        processoId,
        tipo,
        titulo,
        descricao: descricao || undefined,
        dataEvento,
        responsavel,
        origemCaptura: 'manual',
      });
      resetForm();
      setModalAberto(false);
    } finally {
      setEnviando(false);
    }
  }

  async function handleExcluir(id: string) {
    if (window.confirm('Tem certeza que deseja excluir esta movimentação?')) {
      await excluir(id);
    }
  }

  function formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12" role="status">
        <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
        <span className="ml-2 text-slate-500">Carregando movimentações...</span>
      </div>
    );
  }

  // Error state
  if (erro) {
    return (
      <div
        className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4"
        role="alert"
      >
        <AlertCircle className="h-5 w-5 text-red-500" />
        <p className="text-red-700">{erro}</p>
      </div>
    );
  }

  return (
    <section aria-label="Movimentações do processo">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Movimentações</h2>
        <button
          type="button"
          onClick={() => setModalAberto(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
          aria-label="Nova movimentação"
        >
          <Plus className="h-4 w-4" />
          Nova Movimentação
        </button>
      </div>

      {/* Empty state */}
      {movimentacoes.length === 0 && (
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <FileText className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-slate-500">
            Nenhuma movimentação registrada para este processo.
          </p>
        </div>
      )}

      {/* Cards grid */}
      {movimentacoes.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {movimentacoes.map((mov) => (
            <article
              key={mov.id}
              className="relative rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
              role="listitem"
            >
              {/* Badge + delete */}
              <div className="mb-3 flex items-start justify-between">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${TIPO_COLORS[mov.tipo as Tipo] ?? TIPO_COLORS.OUTRO}`}
                >
                  {TIPO_LABELS[mov.tipo as Tipo] ?? mov.tipo}
                </span>
                <button
                  type="button"
                  onClick={() => void handleExcluir(mov.id)}
                  className="rounded p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  aria-label={`Excluir movimentação: ${mov.titulo}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Title */}
              <h3 className="mb-1 font-medium text-slate-800">{mov.titulo}</h3>

              {/* Description */}
              {mov.descricao && (
                <p className="mb-3 line-clamp-2 text-sm text-slate-500">
                  {mov.descricao}
                </p>
              )}

              {/* Meta */}
              <div className="mt-auto flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(mov.dataEvento)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {mov.responsavel}
                </span>
              </div>

              {/* Origem badge */}
              {mov.origemCaptura === 'automatica' && (
                <span className="mt-2 inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                  Captura automática
                </span>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Modal de criação */}
      {modalAberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Nova movimentação"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">
              Nova Movimentação
            </h3>

            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
              {/* Tipo */}
              <div>
                <label
                  htmlFor="mov-tipo"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Tipo
                </label>
                <select
                  id="mov-tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as Tipo)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                >
                  {TIPOS.map((t) => (
                    <option key={t} value={t}>
                      {TIPO_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Título */}
              <div>
                <label
                  htmlFor="mov-titulo"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Título
                </label>
                <input
                  id="mov-titulo"
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                  placeholder="Ex: Despacho de citação"
                />
              </div>

              {/* Descrição */}
              <div>
                <label
                  htmlFor="mov-descricao"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Descrição (opcional)
                </label>
                <textarea
                  id="mov-descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Detalhes da movimentação..."
                />
              </div>

              {/* Data do evento */}
              <div>
                <label
                  htmlFor="mov-data"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Data do Evento
                </label>
                <input
                  id="mov-data"
                  type="date"
                  value={dataEvento}
                  onChange={(e) => setDataEvento(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              {/* Responsável */}
              <div>
                <label
                  htmlFor="mov-responsavel"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Responsável
                </label>
                <input
                  id="mov-responsavel"
                  type="text"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                  placeholder="Nome do responsável"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setModalAberto(false);
                  }}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  disabled={enviando}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={enviando}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
                >
                  {enviando && <Loader2 className="h-4 w-4 animate-spin" />}
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
