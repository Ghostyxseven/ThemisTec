import { DocumentosProcessoView } from "@/features/documentos/view/DocumentosProcessoView";

export default function DocumentosProcessoPage(props: { params: Promise<{ id: string }> }) {
  return <DocumentosProcessoView {...props} />;
}
