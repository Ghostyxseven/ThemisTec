"use client";

import React, { useState, useRef } from "react";
import { useDocumentosProcesso } from "../viewmodel/useDocumentosProcesso";
import { Documento } from "@/specs/schemas/processo.schema";

interface ProcessosDocumentosViewProps {
  processoId: string;
  clienteId: string;
  numeroProcesso: string;
  documentosExistentes: Documento[];
  onDocumentoAdicionado?: () => void;
}

export function ProcessosDocumentosView({
  processoId,
  clienteId,
  numeroProcesso,
  documentosExistentes,
  onDocumentoAdicionado,
}: ProcessosDocumentosViewProps) {
  const { uploadDocumento, baixarDocumento, isUploading, error } = useDocumentosProcesso(processoId, clienteId);
  const [descricao, setDescricao] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadDocumento(file, descricao);
      setDescricao(""); // limpa o campo de descrição
      if (fileInputRef.current) fileInputRef.current.value = ""; // limpa o input
      if (onDocumentoAdicionado) onDocumentoAdicionado();
    } catch (err) {
      // Erro já é tratado pelo viewModel e exposto via 'error'
      console.error("Falha no upload", err);
    }
  };

  return (
    <div className="flex flex-col space-y-6 w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Documentos do Processo
        </h2>
        <p className="text-sm text-slate-500">
          Gerencie os arquivos e anexos do processo {numeroProcesso}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Upload Area */}
      <div className="bg-slate-50 p-6 rounded-lg border border-dashed border-slate-300">
        <h3 className="text-md font-medium text-slate-800 mb-4">Anexar Novo PDF (Máx. 25MB)</h3>
        
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descrição (opcional)
            </label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Petição Inicial"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={200}
              disabled={isUploading}
            />
          </div>

          <div className="flex items-center">
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isUploading}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100 disabled:opacity-50"
            />
            {isUploading && (
              <span className="ml-4 text-sm text-blue-600 flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Documentos */}
      <div>
        <h3 className="text-md font-medium text-slate-800 mb-4">Arquivos Anexados</h3>
        {documentosExistentes.length === 0 ? (
          <p className="text-sm text-slate-500 italic">Nenhum documento anexado ainda.</p>
        ) : (
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            <ul className="divide-y divide-slate-200">
              {documentosExistentes.map((doc) => (
                <li key={doc.id || doc.storagePath} className="px-4 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">{doc.nomeArquivo}</span>
                    <span className="text-xs text-slate-500 mt-1">
                      {doc.descricao ? `${doc.descricao} • ` : ""} 
                      {(doc.tamanho / 1024 / 1024).toFixed(2)} MB • Enviado em {new Date(doc.enviadoEm).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <button
                    onClick={() => doc.storagePath && baixarDocumento(doc.storagePath)}
                    disabled={!doc.storagePath}
                    className="ml-4 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md transition-colors disabled:opacity-50"
                  >
                    Baixar PDF
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
