'use client';

import { Bell, CheckCheck, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useNotificacoes } from '../viewmodel/useNotificacoes';

const PRIORIDADE_COLORS: Record<string, string> = {
  URGENTE: 'bg-red-100 text-red-700',
  ALTA: 'bg-orange-100 text-orange-700',
  NORMAL: 'bg-blue-100 text-blue-700',
  BAIXA: 'bg-slate-100 text-slate-700',
};

export default function NotificacoesView() {
  const { notificacoes, naoLidas, loading, erro, marcarLida, marcarTodasLidas } =
    useNotificacoes();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  if (erro) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-center text-red-600">{erro}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-slate-500" />
          <h1 className="text-lg font-semibold text-slate-900">Notificações</h1>
          {naoLidas > 0 && (
            <span className="inline-flex items-center rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-medium text-white">
              {naoLidas}
            </span>
          )}
        </div>

        {naoLidas > 0 && (
          <button
            onClick={() => void marcarTodasLidas()}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
          >
            <CheckCheck className="h-4 w-4" />
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* List */}
      {notificacoes.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <Bell className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">Nenhuma notificação</p>
        </div>
      ) : (
        <ul className="divide-y">
          {notificacoes.map((notificacao) => {
            const naoLida = !notificacao.lidaEm;
            const corPrioridade =
              PRIORIDADE_COLORS[notificacao.prioridade] ?? PRIORIDADE_COLORS.NORMAL;

            return (
              <li
                key={notificacao.id}
                onClick={() => void marcarLida(notificacao.id)}
                className={`flex cursor-pointer items-start gap-4 px-6 py-4 transition hover:bg-slate-50 ${
                  naoLida ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${corPrioridade}`}
                    >
                      {notificacao.prioridade}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {notificacao.titulo}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600">{notificacao.mensagem}</p>

                  <p className="text-xs text-slate-500">
                    {notificacao.origem} ·{' '}
                    {new Date(notificacao.criadoEm).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                {notificacao.destinoUrl && (
                  <Link
                    href={notificacao.destinoUrl}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1 flex-shrink-0 text-slate-400 transition hover:text-blue-600"
                    aria-label="Ir para destino"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
