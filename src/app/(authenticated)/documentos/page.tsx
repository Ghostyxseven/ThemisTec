import { Metadata } from "next";
import { GeradorView } from "@/features/gerador-documentos/view/GeradorView";

export const metadata: Metadata = {
  title: "Gerador de Petições | ThemisTec",
  description: "Gerador automático de documentos jurídicos.",
};

export default function GeradorPage() {
  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Documentos Automatizados</h1>
        <p className="text-slate-500 mt-1">Selecione um cliente e um template para gerar a petição.</p>
      </div>

      <GeradorView />
    </div>
  );
}
