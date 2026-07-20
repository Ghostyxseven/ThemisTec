import { useState, useEffect } from "react";
import { SupabaseTemplateAdapter, DocumentTemplate } from "../model/SupabaseTemplateAdapter";
import { clienteRepository, authService } from "@/services";
import type { Cliente } from "@/specs/schemas/cliente.schema";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import { toast } from "sonner";

const templateAdapter = new SupabaseTemplateAdapter();

export function useGerador() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      setLoading(true);
      // Fallback in case templates table is empty for POC
      const uid = (await authService.waitForAuth()) || "";
      const [tpls, clis] = await Promise.all([
        templateAdapter.getTemplates().catch(() => []), 
        clienteRepository.listar({ page: 1, limit: 100 }, uid)
      ]);
      setTemplates(tpls);
      setClientes(clis.dados);
    } catch (err) {
      toast.error("Erro ao carregar os dados. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  }

  async function gerarDocumento(clienteId: string, templateId: string) {
    try {
      setLoading(true);
      
      const cliente = clientes.find(c => c.id === clienteId);
      const template = templates.find(t => t.id === templateId);

      if (!cliente) throw new Error("Cliente não encontrado.");
      if (!template) throw new Error("Template não encontrado.");

      const blob = await templateAdapter.downloadTemplate(template.storage_path);
      const arrayBuffer = await blob.arrayBuffer();
      
      const zip = new PizZip(arrayBuffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      doc.render({
        nome_cliente: cliente.nome,
        cpf_cliente: cliente.cpf,
        email_cliente: cliente.email || "",
      });

      const out = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      saveAs(out, `${template.nome}_${cliente.nome}.docx`);
      toast.success("Documento gerado com sucesso!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao gerar documento.");
    } finally {
      setLoading(false);
    }
  }

  return { templates, clientes, loading, gerarDocumento };
}
