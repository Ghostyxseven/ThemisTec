"use client";

import { useState, useCallback } from "react";
import type { Processo, Documento } from "@/specs/schemas/processo.schema";
import { TAMANHO_MAXIMO_ARQUIVO } from "@/specs/schemas/processo.schema";
import { authService, processoRepository } from "@/services";
import { supabaseClient } from "@/services/supabase/supabase.client";

interface UseDocumentosProcessoReturn {
  processo: Processo | null;
  isLoading: boolean;
  isUploading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  carregarProcesso: (processoId: string) => Promise<void>;
  anexarDocumento: (processoId: string, file: File, descricao?: string) => Promise<void>;
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
      const userId = authService.getCurrentUserId();
      if (!userId) {
        throw new Error("Usuário não autenticado.");
      }
      const dados = await processoRepository.buscarPorId(processoId, userId);
      setProcesso(dados);
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
      const userId = authService.getCurrentUserId();
      if (!userId) {
        throw new Error("Usuário não autenticado.");
      }

      // Validações estritas de arquivo no cliente
      if (file.type !== "application/pdf") {
        throw new Error("Apenas arquivos PDF são aceitos.");
      }

      if (file.size > TAMANHO_MAXIMO_ARQUIVO) {
        throw new Error("O tamanho do arquivo excede o limite de 5 MB.");
      }

      // Gerar path único no Firebase Storage
      const uuid = typeof window !== "undefined" && window.crypto?.randomUUID
        ? window.crypto.randomUUID()
        : Math.random().toString(36).substring(2, 15);
      const filePath = `processos/${processoId}/${uuid}.pdf`;

      // Upload do arquivo para o Supabase
      const { error } = await supabaseClient.storage
        .from("processos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Supabase error:", error);
        throw new Error("Falha ao enviar o arquivo para o servidor.");
      }

      // Pegar URL Pública
      const { data: urlData } = supabaseClient.storage
        .from("processos")
        .getPublicUrl(filePath);

      const downloadUrl = urlData.publicUrl;

      // Metadados do documento
      const novoDocumento: Documento = {
        id: uuid,
        nomeArquivo: file.name,
        url: downloadUrl,
        tamanho: file.size,
        ...(descricao ? { descricao } : {}),
        enviadoEm: new Date().toISOString(),
      };

      try {
        // Registrar referência no Firestore
        await processoRepository.adicionarDocumento(processoId, novoDocumento, userId);
      } catch (firestoreError) {
        // Compensação (Rollback): Ocorreu um erro no banco, então deleta o PDF que acabou de subir
        await supabaseClient.storage.from("processos").remove([filePath]);
        throw firestoreError; // Repassa o erro para o catch principal
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

  return {
    processo,
    isLoading,
    isUploading,
    errorMessage,
    successMessage,
    carregarProcesso,
    anexarDocumento,
    setErrorMessage,
    setSuccessMessage,
  };
}
