'use client'

import { FolderOpen, Trash2, RotateCcw, FileText, Tag } from 'lucide-react'
import { useDocumentosCentral } from '../viewmodel/useDocumentosCentral'

function formatarTamanho(bytes: number): string {
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function DocumentosCentralView() {
  const {
    documentos,
    loading,
    erro,
    verLixeira,
    setVerLixeira,
    moverParaLixeira,
    restaurar,
    excluirDefinitivo,
  } = useDocumentosCentral()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Central de Documentos</h1>
        <button
          onClick={() => setVerLixeira(!verLixeira)}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            verLixeira
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Trash2 className="h-4 w-4" />
          {verLixeira ? 'Ver documentos' : 'Ver lixeira'}
        </button>
      </div>

      {/* Error state */}
      {erro && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {erro}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-sm text-slate-500">Carregando documentos...</div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !erro && documentos.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-16 shadow-sm">
          <FileText className="mb-3 h-12 w-12 text-slate-300" />
          <p className="text-sm text-slate-500">
            {verLixeira ? 'Lixeira vazia' : 'Nenhum documento catalogado'}
          </p>
        </div>
      )}

      {/* Document list */}
      {!loading && documentos.length > 0 && (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Documento</th>
                <th className="px-4 py-3">Pasta</th>
                <th className="px-4 py-3">Tags</th>
                <th className="px-4 py-3">Tamanho</th>
                <th className="px-4 py-3">Criado em</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {documentos.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50">
                  {/* Nome */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="font-medium text-slate-700">{doc.nome}</span>
                    </div>
                  </td>

                  {/* Pasta */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-slate-500">
                      <FolderOpen className="h-3.5 w-3.5" />
                      <span>{doc.pasta || '—'}</span>
                    </div>
                  </td>

                  {/* Tags */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.length > 0 ? (
                        doc.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-0.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                          >
                            <Tag className="h-2.5 w-2.5" />
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </div>
                  </td>

                  {/* Tamanho */}
                  <td className="px-4 py-3 text-slate-500">
                    {formatarTamanho(doc.tamanho)}
                  </td>

                  {/* Criado em */}
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(doc.criadoEm).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>

                  {/* Ações */}
                  <td className="px-4 py-3">
                    {verLixeira ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => void restaurar(doc.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:opacity-90"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Restaurar
                        </button>
                        <button
                          onClick={() => void excluirDefinitivo(doc.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                          Excluir definitivamente
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => void moverParaLixeira(doc.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
                      >
                        <Trash2 className="h-3 w-3" />
                        Mover para lixeira
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
