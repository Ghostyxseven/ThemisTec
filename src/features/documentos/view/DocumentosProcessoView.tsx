"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UploadDocumentoSchema } from "@/specs/schemas/processo.schema";
import { useDocumentosProcesso } from "../viewmodel/useDocumentosProcesso";

type DocumentoFormInput = z.infer<typeof UploadDocumentoSchema>;

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (isoString: string): string => {
  try {
    return new Date(isoString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
};

export function DocumentosProcessoView({ params }: { params: Promise<{ id: string }> }): React.ReactNode {
  const resolvedParams = use(params);
  const processoId = resolvedParams.id;
  const {
    processo,
    isLoading,
    isUploading,
    errorMessage,
    successMessage,
    carregarProcesso,
    anexarDocumento,
    removerDocumento,
    setErrorMessage,
    setSuccessMessage,
  } = useDocumentosProcesso();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DocumentoFormInput>({
    resolver: zodResolver(UploadDocumentoSchema),
    defaultValues: {
      descricao: "",
    },
  });

  useEffect(() => {
    if (processoId) {
      void carregarProcesso(processoId);
    }
  }, [processoId, carregarProcesso]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFileError(null);
    setErrorMessage(null);
    setSuccessMessage(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file) {
        setSelectedFile(null);
        return;
      }
      if (file.type !== "application/pdf") {
        setFileError("Apenas arquivos no formato PDF são aceitos.");
        setSelectedFile(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFileError("O arquivo excede o limite máximo de 5 MB.");
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const onSubmit = async (data: DocumentoFormInput): Promise<void> => {
    if (!selectedFile) {
      setFileError("Selecione um arquivo PDF para fazer o upload.");
      return;
    }
    await anexarDocumento(processoId, selectedFile, data.descricao);
    // Se o upload foi bem sucedido, reseta o form
    if (!errorMessage) {
      setSelectedFile(null);
      setFileError(null);
      reset();
      // Limpa o input de arquivo manual
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-12 md:px-8">
      <div className="w-full max-w-4xl">
        
        {/* Breadcrumb / Botão Voltar */}
        <div className="mb-6">
          <Link
            href="/processos"
            className="inline-flex items-center text-sm font-semibold text-[#1a3c5e] hover:underline"
          >
            ← Voltar para Processos
          </Link>
        </div>

        {/* Loading Geral do Processo */}
        {isLoading && !processo ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#1a3c5e]"></div>
            <p className="mt-4 text-sm text-gray-500 font-medium">Carregando processo...</p>
          </div>
        ) : !processo ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm border border-gray-100">
            <p className="text-gray-500">Processo não encontrado ou erro ao carregar.</p>
            {errorMessage && <p className="mt-2 text-sm text-red-500">{errorMessage}</p>}
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Cabeçalho do Processo */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Processo Vinculado</span>
                <h1 className="text-2xl font-bold text-gray-900 mt-1">{processo.numero}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Cliente: <span className="font-semibold text-[#1a3c5e]">{processo.clienteNome}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`
                    inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border
                    ${
                      processo.status === "em_andamento"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : processo.status === "concluido"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }
                  `}
                >
                  {processo.status === "em_andamento"
                    ? "Em Andamento"
                    : processo.status === "concluido"
                    ? "Concluído"
                    : "Arquivado"}
                </span>
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200 uppercase">
                  {processo.tipo}
                </span>
              </div>
            </div>

            {/* Alert Messages */}
            {errorMessage && (
              <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div role="alert" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            )}

            {/* Grid Layout: Enviar Novo Anexo & Lista de Anexos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Form Upload */}
              <div className="lg:col-span-1 space-y-6">
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Anexar Novo PDF</h2>
                  
                  <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} noValidate className="space-y-4">
                    
                    {/* Input de Arquivo */}
                    <div>
                      <label htmlFor="file-upload" className="block text-sm font-semibold text-gray-600 mb-2">
                        Selecione o arquivo PDF
                      </label>
                      <div className="relative border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-[#1a3c5e]/50 transition-colors">
                        <input
                          id="file-upload"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          disabled={isUploading}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <div className="space-y-1">
                          <span className="block text-2xl">📄</span>
                          <span className="block text-xs font-semibold text-[#1a3c5e] hover:underline">
                            {selectedFile ? selectedFile.name : "Clique para escolher"}
                          </span>
                          <span className="block text-[10px] text-gray-400">PDF de até 5MB</span>
                        </div>
                      </div>
                      {fileError && <p className="mt-1.5 text-xs font-medium text-red-500">{fileError}</p>}
                    </div>

                    {/* Descrição opcional */}
                    <div>
                      <label htmlFor="descricao" className="block text-sm font-semibold text-gray-600 mb-1">
                        Descrição (opcional)
                      </label>
                      <input
                        id="descricao"
                        type="text"
                        placeholder="Ex: Petição Inicial, Procuração..."
                        {...register("descricao")}
                        disabled={isUploading}
                        className={`
                          w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors
                          focus:border-[#1a3c5e] focus:ring-1 focus:ring-[#1a3c5e]
                          disabled:bg-gray-50 disabled:cursor-not-allowed
                          ${errors.descricao ? "border-red-400 focus:border-red-400" : "border-gray-200"}
                        `}
                      />
                      {errors.descricao?.message && (
                        <p className="mt-1 text-xs font-medium text-red-500">{errors.descricao.message}</p>
                      )}
                    </div>

                    {/* Botão de Envio */}
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="
                        w-full rounded-lg bg-[#1a3c5e] px-4 py-2.5
                        text-sm font-semibold text-white shadow-sm hover:bg-[#0f2540]
                        transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a3c5e] focus:ring-offset-2
                        disabled:opacity-60 disabled:cursor-not-allowed
                        flex items-center justify-center gap-2
                      "
                    >
                      {isUploading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                          Enviando...
                        </>
                      ) : (
                        "Fazer Upload"
                      )}
                    </button>

                  </form>
                </div>
              </div>

              {/* Lista de Documentos */}
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Documentos Anexados</h2>

                  {processo.documentos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <span className="text-4xl mb-3 text-gray-300">folder_open</span>
                      <p className="text-sm font-semibold text-gray-500">Nenhum documento anexado</p>
                      <p className="text-xs text-gray-400 mt-1">Utilize o painel lateral para anexar o primeiro arquivo PDF.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {processo.documentos.map((doc) => (
                        <div key={doc.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="space-y-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate" title={doc.nomeArquivo}>
                              {doc.nomeArquivo}
                            </h3>
                            {doc.descricao && (
                              <p className="text-xs text-gray-600 italic">
                                {doc.descricao}
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                              <span>{formatBytes(doc.tamanho)}</span>
                              <span>•</span>
                              <span>{formatDate(doc.enviadoEm)}</span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-center gap-2 mt-3 sm:mt-0">
                            <a
                              href={doc.url ?? "#"}
                              onClick={(event) => { if (!doc.url) event.preventDefault(); }}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="
                                inline-flex items-center justify-center rounded-lg border border-gray-200
                                bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50
                                transition-colors shadow-sm w-full sm:w-auto
                              "
                            >
                              {doc.url ? "Visualizar PDF ↗" : "Arquivo indisponível"}
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm("Tem certeza que deseja excluir este documento?")) {
                                  void removerDocumento(processoId, doc.id);
                                }
                              }}
                              disabled={isUploading}
                              className="
                                inline-flex items-center justify-center rounded-lg border border-red-200
                                bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100
                                transition-colors shadow-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed
                              "
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </main>
  );
}
