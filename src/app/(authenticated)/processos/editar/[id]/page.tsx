import { ProcessosEditView } from "@/features/processos/view/ProcessosEditView";

export default function EditarProcessoPage(props: { params: Promise<{ id: string }> }) {
  return <ProcessosEditView {...props} />;
}
