"use client";

import { useState, useCallback } from "react";
import type { Processo, Documento } from "@/specs/schemas/processo.schema";
import { TAMANHO_MAXIMO_ARQUIVO } from "@/specs/schemas/processo.schema";
import { authService, processoRepository, storageService } from "@/services";

interface UseDocumentosProcessoReturn {
  processo: Processo | null;
  isLoading: boolean;
  isUploading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  carregarProcesso: (processoId: string) => Promise<void>;
  anexarDocumento: (processoId: string, file: File, descricao?: string) => Promise<void>;
  removerDocumento: (processoId: string, documentoId: string) => Promise<void>;
  setErrorMessage: (msg: string | null) => void;
  setSuccessMessage: (msg: string | null) => void;
}

export function useDocumentosProcesso(): UseDocumentosProcessoReturn {
  const [processo, setProcesso] = useState<Processo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const carregarProcesso = useCallback(async (processoId: string): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const userId = await authService.waitForAuth();
      if (!userId) {
        throw new Error("Usuário não autenticado.");
      }
      const dados = await processoRepository.buscarPorId(processoId, userId);
      const documentos = await Promise.all(dados.documentos.map(async (documento) => {
        if (!documento.storagePath) return documento;
        try {
          const url = await storageService.getFileUrl(documento.storagePath);
          return { ...documento, url };
        } catch {
          return { ...documento, url: undefined };
        }
      }));
      setProcesso({ ...dados, documentos });
    } catch (erro) {
      const msg = erro instanceof Error ? erro.message : "Erro ao carregar detalhes do processo.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const anexarDocumento = async (processoId: string, file: File, descricao?: string): Promise<void> => {
    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const userId = await authService.waitForAuth();
      if (!userId) {
        throw new Error("Usuário não autenticado.");
      }

      // Validações estritas de arquivo no cliente
      if (file.type !== "application/pdf") {
        throw new Error("Apenas arquivos PDF são aceitos.");
      }

      if (file.size > TAMANHO_MAXIMO_ARQUIVO) {
        throw new Error("O tamanho do arquivo excede o limite de 25 MB.");
      }

      // Gerar caminho único no Storage.
      const uuid = typeof window !== "undefined" && window.crypto?.randomUUID
        ? window.crypto.randomUUID()
        : Math.random().toString(36).substring(2, 15);
      const filePath = `${userId}/processos/${processoId}/${uuid}.pdf`;

      // Upload do arquivo para o Supabase
      const downloadUrl = await storageService.uploadFile(filePath, file);

      // Pegar URL Pública
      // Metadados do documento
      const novoDocumento: Documento = {
        id: uuid,
        nomeArquivo: file.name,
        url: downloadUrl,
        storagePath: filePath,
        tamanho: file.size,
        ...(descricao ? { descricao } : {}),
        enviadoEm: new Date().toISOString(),
      };

      try {
        // Registrar referência no banco.
        await processoRepository.adicionarDocumento(processoId, novoDocumento, userId);
      } catch (databaseError) {
        // Compensação (Rollback): Ocorreu um erro no banco, então deleta o PDF que acabou de subir
        await storageService.deleteFile(filePath);
        throw databaseError;
      }

      setSuccessMessage("Documento anexado com sucesso!");
      
      // Recarregar os dados do processo
      await carregarProcesso(processoId);
    } catch (erro) {
      const msg = erro instanceof Error ? erro.message : "Erro ao enviar o documento.";
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const removerDocumento = async (processoId: string, documentoId: string): Promise<void> => {
    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const userId = await authService.waitForAuth();
      if (!userId) {
        throw new Error("Usuário não autenticado.");
      }

      await processoRepository.removerDocumento(processoId, documentoId, userId);

      const filePath = `${userId}/processos/${processoId}/${documentoId}.pdf`;
      await storageService.deleteFile(filePath);

      setSuccessMessage("Documento removido com sucesso!");
      await carregarProcesso(processoId);
    } catch (erro) {
      const msg = erro instanceof Error ? erro.message : "Erro ao remover o documento.";
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return {
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
  };
}
