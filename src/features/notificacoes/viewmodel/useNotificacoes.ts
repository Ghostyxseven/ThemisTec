'use client';

import { useCallback, useEffect, useState } from 'react';
import { authService, notificacaoRepository } from '@/services';
import type { Notificacao } from '@/specs/schemas/notificacao.schema';

export function useNotificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [naoLidas, setNaoLidas] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      setErro(null);

      const userId = await authService.waitForAuth();
      if (!userId) throw new Error('Sessão expirada.');

      const [lista, count] = await Promise.all([
        notificacaoRepository.listar(userId),
        notificacaoRepository.contarNaoLidas(userId),
      ]);

      setNotificacoes(lista);
      setNaoLidas(count);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao carregar notificações');
    } finally {
      setLoading(false);
    }
  }, []);

  const marcarLida = useCallback(async (id: string) => {
    try {
      setErro(null);
      const userId = await authService.waitForAuth();
      if (!userId) throw new Error('Sessão expirada.');
      await notificacaoRepository.marcarLida(userId, id);
      await carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao marcar notificação como lida');
    }
  }, [carregar]);

  const marcarTodasLidas = useCallback(async () => {
    try {
      setErro(null);
      const userId = await authService.waitForAuth();
      if (!userId) throw new Error('Sessão expirada.');
      await notificacaoRepository.marcarTodasLidas(userId);
      await carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao marcar todas como lidas');
    }
  }, [carregar]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregar();
  }, [carregar]);

  return { notificacoes, naoLidas, loading, erro, marcarLida, marcarTodasLidas };
}
