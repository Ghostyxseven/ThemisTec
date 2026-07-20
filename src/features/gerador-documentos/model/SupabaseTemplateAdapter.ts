import { supabaseClient as supabase } from "@/services/supabase/supabase.client";

export interface DocumentTemplate {
  id: string;
  user_id: string;
  nome: string;
  tipo: string;
  storage_path: string;
  created_at: string;
}

export class SupabaseTemplateAdapter {
  async getTemplates(): Promise<DocumentTemplate[]> {
    const { data, error } = await supabase.from("document_templates").select("*");
    if (error) throw error;
    return data || [];
  }

  async downloadTemplate(storagePath: string): Promise<Blob> {
    const { data, error } = await supabase.storage.from("documentos").download(storagePath);
    if (error) throw error;
    return data;
  }
}
