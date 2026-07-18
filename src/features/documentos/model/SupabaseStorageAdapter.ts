import type { IStorageService } from "@/shared/interfaces/IStorageService";
import { supabaseClient } from "@/services/supabase/supabase.client";

const BUCKET = "processos";

export class SupabaseStorageAdapter implements IStorageService {
  public async uploadFile(path: string, file: File): Promise<string> {
    const { error } = await supabaseClient.storage.from(BUCKET).upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) throw new Error("Falha ao enviar o arquivo para o servidor.");
    try {
      return await this.getFileUrl(path);
    } catch (error) {
      await supabaseClient.storage.from(BUCKET).remove([path]);
      throw error;
    }
  }

  public async getFileUrl(path: string): Promise<string> {
    const { data, error: signedError } = await supabaseClient.storage.from(BUCKET).createSignedUrl(path, 60 * 15);
    if (signedError) {
      throw new Error("Falha ao gerar acesso seguro ao arquivo.");
    }
    return data.signedUrl;
  }

  public async deleteFile(path: string): Promise<void> {
    const { error } = await supabaseClient.storage.from(BUCKET).remove([path]);
    if (error) throw new Error("Falha ao remover o arquivo do servidor.");
  }
}
