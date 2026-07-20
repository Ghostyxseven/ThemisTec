import type { IStorageService } from "@/shared/interfaces/IStorageService";
import { supabaseClient } from "@/services/supabase/supabase.client";

const BUCKET = "processos";

export class SupabaseStorageAdapter implements IStorageService {
  public async uploadFile(path: string, file: File): Promise<string> {
    const { error } = await supabaseClient.storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: true });

    if (error) {
      throw new Error(`Falha ao enviar o arquivo: ${error.message}`);
    }

    // Retorna o path (key) que é armazenado no banco de dados
    return path;
  }

  public async getFileUrl(path: string): Promise<string> {
    const { data, error } = await supabaseClient.storage
      .from(BUCKET)
      .createSignedUrl(path, 60 * 15); // 15 minutos

    if (error || !data?.signedUrl) {
      throw new Error("Falha ao gerar acesso seguro ao arquivo.");
    }

    return data.signedUrl;
  }

  public async deleteFile(path: string): Promise<void> {
    const { error } = await supabaseClient.storage
      .from(BUCKET)
      .remove([path]);

    if (error) {
      throw new Error("Falha ao remover o arquivo do servidor.");
    }
  }
}
