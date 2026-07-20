import { DocumentosProcessoView } from "@/features/documentos/view/DocumentosProcessoView";

export default function DocumentosProcessoPage(props: { params: Promise<{ id: string }> }): React.JSX.Element {
  return <DocumentosProcessoView {...props} />;
}
