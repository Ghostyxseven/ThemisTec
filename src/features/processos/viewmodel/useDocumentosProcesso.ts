import { useState, useCallback } from "react";
import { authService, processoRepository, storageService } from "@/services";
import { TAMANHO_MAXIMO_ARQUIVO, TIPOS_ACEITOS, type Documento } from "@/specs/schemas/processo.schema";

export function useDocumentosProcesso(processoId: string, clienteId: string): {
  uploadDocumento: (file: File, descricao?: string) => Promise<string>;
  baixarDocumento: (storagePath: string) => Promise<void>;
  isUploading: boolean;
  error: string | null;
} {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadDocumento = useCallback(async (file: File, descricao?: string) => {
    setIsUploading(true);
    setError(null);

    try {
      if (file.size > TAMANHO_MAXIMO_ARQUIVO) {
        throw new Error(`O arquivo excede o limite de 25MB.`);
      }

      if (!TIPOS_ACEITOS.some((tipo) => tipo === file.type)) {
        throw new Error("Apenas arquivos PDF são aceitos.");
      }

      // 1. Fazer upload para o R2 usando a URL assinada gerada pelo backend
      const path = `${clienteId}/${processoId}/${file.name}`;
      const s3Key = await storageService.uploadFile(path, file);

      // 2. Salvar metadados no banco de dados via repositório
      const novoDocumento: Documento = {
        id: crypto.randomUUID(),
        nomeArquivo: file.name,
        storagePath: s3Key,
        tamanho: file.size,
        descricao: descricao || "",
        enviadoEm: new Date().toISOString(),
      };

      const uid = await authService.waitForAuth();
      if (!uid) throw new Error("Sessão expirada.");
      await processoRepository.adicionarDocumento(processoId, novoDocumento, uid);
      
      return s3Key;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado ao fazer upload do documento.");
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [processoId, clienteId]);

  const baixarDocumento = useCallback(async (storagePath: string) => {
    try {
      const url = await storageService.getFileUrl(storagePath);
      window.open(url, '_blank');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao gerar URL de download.");
    }
  }, []);

  return {
    uploadDocumento,
    baixarDocumento,
    isUploading,
    error,
  };
}
