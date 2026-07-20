'use client';

import { useCallback, useState } from 'react';
import { buscaRepository } from '@/services';
import type { ResultadoBusca } from '@/specs/schemas/busca.schema';

export function useBusca() {
  const [resultados, setResultados] = useState<ResultadoBusca[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [termo, setTermo] = useState('');

  const buscar = useCallback(async (termoBusca: string) => {
    const termoTrimmed = termoBusca.trim();
    setTermo(termoTrimmed);

    if (!termoTrimmed) {
      setResultados([]);
      setErro(null);
      return;
    }

    setLoading(true);
    setErro(null);

    try {
      const dados = await buscaRepository.buscar(termoTrimmed);
      setResultados(dados);
    } catch (error) {
      const mensagem =
        error instanceof Error ? error.message : 'Erro ao realizar busca.';
      setErro(mensagem);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const limpar = useCallback(() => {
    setResultados([]);
    setLoading(false);
    setErro(null);
    setTermo('');
  }, []);

  return { resultados, loading, erro, termo, buscar, limpar };
}
