'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Search, X, FileText, Users, Scale, Clock, FolderOpen } from 'lucide-react'
import { useBusca } from '../viewmodel/useBusca'

const ICON_MAP: Record<string, React.ElementType> = {
  cliente: Users,
  processo: Scale,
  prazo: Clock,
  movimentacao: FolderOpen,
  documento: FileText,
}

const LABEL_MAP: Record<string, string> = {
  cliente: 'Clientes',
  processo: 'Processos',
  prazo: 'Prazos',
  movimentacao: 'Movimentações',
  documento: 'Documentos',
}

export default function BuscaView() {
  const { resultados, loading, erro, termo, buscar, limpar } = useBusca()
  const [input, setInput] = useState('')
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (input.trim().length === 0) {
      limpar()
      return
    }

    debounceRef.current = setTimeout(() => {
      void buscar(input.trim())
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [input, buscar, limpar])

  const handleClear = () => {
    setInput('')
    limpar()
  }

  const grouped = resultados.reduce<Record<string, typeof resultados>>((acc, item) => {
    const list = acc[item.tipo] ?? [];
    list.push(item);
    acc[item.tipo] = list;
    return acc;
  }, {});

  const hasResults = resultados.length > 0
  const showEmpty = !loading && !hasResults && termo.length >= 2

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative rounded-2xl bg-white shadow-sm border">
        <div className="flex items-center px-4 py-3">
          <Search className="h-5 w-5 text-slate-500 shrink-0" aria-hidden="true" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Buscar clientes, processos, documentos..."
            aria-label="Busca global"
            className="flex-1 ml-3 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
          />
          {input.length > 0 && (
            <button
              onClick={handleClear}
              aria-label="Limpar busca"
              className="p-1 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-6 border-t">
            <div className="h-5 w-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            <span className="ml-2 text-sm text-slate-500">Buscando...</span>
          </div>
        )}

        {erro && (
          <div className="px-4 py-3 border-t text-sm text-red-600">
            {erro}
          </div>
        )}

        {!loading && hasResults && (
          <div role="listbox" aria-label="Resultados da busca" className="border-t divide-y">
            {Object.entries(grouped).map(([tipo, items]) => {
              const Icon = ICON_MAP[tipo] || FileText
              const label = LABEL_MAP[tipo] || tipo

              return (
                <div key={tipo} className="py-2">
                  <div className="px-4 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {label}
                  </div>
                  {items.map((resultado) => (
                    <Link
                      key={resultado.id}
                      href={resultado.destino}
                      role="option"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors"
                    >
                      <Icon className="h-4 w-4 text-slate-500 shrink-0" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {resultado.titulo}
                        </p>
                        {resultado.subtitulo && (
                          <p className="text-xs text-slate-500 truncate">
                            {resultado.subtitulo}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )
            })}
          </div>
        )}

        {showEmpty && (
          <div className="flex flex-col items-center justify-center py-8 border-t">
            <Search className="h-8 w-8 text-slate-300 mb-2" aria-hidden="true" />
            <p className="text-sm text-slate-500">
              Nenhum resultado encontrado para &ldquo;{termo}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
