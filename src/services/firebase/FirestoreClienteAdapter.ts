import { IClienteRepository } from "@/shared/interfaces/IClienteRepository";
import { CreateClienteInput, Cliente } from "@/specs/schemas/cliente.schema";
import { getFirebaseApp } from "./firebase.client";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Firestore,
} from "firebase/firestore";

export class FirestoreClienteAdapter implements IClienteRepository {
  private db: Firestore;

  constructor() {
    const app = getFirebaseApp();
    this.db = getFirestore(app);
  }

  public async buscarPorCpf(cpf: string, userId: string): Promise<Cliente | null> {
    try {
      const clientesRef = collection(this.db, "clientes");
      const q = query(
        clientesRef,
        where("userId", "==", userId),
        where("cpf", "==", cpf)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      if (!doc) return null;
      const data = doc.data();

      return {
        id: doc.id,
        nome: data["nome"] as string,
        cpf: data["cpf"] as string,
        email: data["email"] as string | undefined,
        telefone: data["telefone"] as string | undefined,
        endereco: data["endereco"] as string | undefined,
        observacoes: data["observacoes"] as string | undefined,
        userId: data["userId"] as string,
        criadoEm: data["criadoEm"] as string,
        atualizadoEm: data["atualizadoEm"] as string,
      } as Cliente;
    } catch {
      throw new Error("Erro ao buscar cliente por CPF.");
    }
  }

  public async criar(dados: CreateClienteInput, userId: string): Promise<Cliente> {
    // 1. Verificar se CPF é único
    const clienteExistente = await this.buscarPorCpf(dados.cpf, userId);
    if (clienteExistente) {
      throw new Error("Já existe um cliente cadastrado com este CPF.");
    }

    // 2. Preparar dados para o Firestore
    const agora = new Date().toISOString();
    const novoClienteData = {
      ...dados,
      userId,
      criadoEm: agora,
      atualizadoEm: agora,
    };

    try {
      // 3. Salvar no Firestore
      const clientesRef = collection(this.db, "clientes");
      const docRef = await addDoc(clientesRef, novoClienteData);

      return {
        id: docRef.id,
        ...novoClienteData,
      } as Cliente;
    } catch {
      throw new Error("Falha ao salvar cliente. Tente novamente mais tarde.");
    }
  }
}
