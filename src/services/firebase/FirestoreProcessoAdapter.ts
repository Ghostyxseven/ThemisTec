import { IProcessoRepository } from "@/shared/interfaces/IProcessoRepository";
import { CreateProcessoInput, Processo } from "@/specs/schemas/processo.schema";
import { getFirebaseApp } from "./firebase.client";
import {
  getFirestore,
  collection,
  addDoc,
  Firestore,
} from "firebase/firestore";

export class FirestoreProcessoAdapter implements IProcessoRepository {
  private db: Firestore;

  constructor() {
    const app = getFirebaseApp();
    this.db = getFirestore(app);
  }

  public async criar(dados: CreateProcessoInput, clienteNome: string, userId: string): Promise<Processo> {
    const agora = new Date().toISOString();
    const novoProcessoData = {
      ...dados,
      clienteNome,
      userId,
      documentos: [],
      criadoEm: agora,
      atualizadoEm: agora,
    };

    try {
      const processosRef = collection(this.db, "processos");
      const docRef = await addDoc(processosRef, novoProcessoData);

      return {
        id: docRef.id,
        ...novoProcessoData,
      } as Processo;
    } catch {
      throw new Error("Falha ao registrar processo. Tente novamente mais tarde.");
    }
  }
}
