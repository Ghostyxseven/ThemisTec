import { collection, doc, setDoc, getDocs, query, where, orderBy, updateDoc, getDoc, Firestore } from "firebase/firestore";
import { getFirestoreDb } from "./firebase.client";
import { IPrazoRepository } from "@/shared/interfaces/IPrazoRepository";
import { Prazo, CreatePrazoInput } from "../../specs/schemas/prazo.schema";

export class FirestorePrazoAdapter implements IPrazoRepository {
  private readonly collectionName = "prazos";
  private readonly processosCollection = "processos";
  private db: Firestore;

  constructor() {
    this.db = getFirestoreDb();
  }

  async criar(userId: string, data: CreatePrazoInput): Promise<Prazo> {
    const newRef = doc(collection(this.db, this.collectionName));
    const now = new Date().toISOString();

    // Fetch processo number
    const procRef = doc(this.db, this.processosCollection, data.processoId);
    const procSnap = await getDoc(procRef);
    let procNum = "N/A";
    const dataSnap = procSnap.data();
    if (procSnap.exists() && dataSnap && dataSnap.userId === userId) {
      procNum = String(dataSnap.numero);
    } else {
      throw new Error("Processo não encontrado ou sem permissão.");
    }

    const prazo: Prazo = {
      id: newRef.id,
      userId,
      processoNumero: procNum,
      ...data,
      descricao: data.descricao ?? "",
      status: data.status ?? "PENDENTE",
      criadoEm: now,
      atualizadoEm: now,
    };

    await setDoc(newRef, prazo);
    return prazo;
  }

  async listarPorUsuario(userId: string): Promise<Prazo[]> {
    const q = query(
      collection(this.db, this.collectionName),
      where("userId", "==", userId),
      orderBy("dataVencimento", "asc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as Prazo);
  }

  async marcarConcluido(userId: string, prazoId: string): Promise<void> {
    const docRef = doc(this.db, this.collectionName, prazoId);
    
    // Auth check
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists() || docSnap.data().userId !== userId) {
      throw new Error("Prazo não encontrado ou sem permissão.");
    }

    await updateDoc(docRef, {
      status: "CONCLUIDO",
      atualizadoEm: new Date().toISOString()
    });
  }
}
