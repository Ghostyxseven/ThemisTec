import { IClienteRepository } from "@/shared/interfaces/IClienteRepository";
import { CreateClienteInput, Cliente, ListClientesQuery, ClienteListResponse, UpdateClienteInput } from "@/specs/schemas/cliente.schema";
import { getFirestoreDb } from "./firebase.client";
import {
  collection,
  addDoc,
  Firestore,
  getDocs,
  query,
  where,
  doc as firestoreDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  getCountFromServer,
} from "firebase/firestore";

export class FirestoreClienteAdapter implements IClienteRepository {
  private db: Firestore;

  constructor() {
    this.db = getFirestoreDb();
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

  public async listar(params: ListClientesQuery, userId: string): Promise<ClienteListResponse> {
    try {
      const clientesRef = collection(this.db, "clientes");
      const q = query(clientesRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      let clientes: Cliente[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        clientes.push({
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
        });
      });

      // Ordenar por criadoEm desc
      clientes.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));

      // Filtrar por busca (search) caso seja fornecido
      if (params.search) {
        const termo = params.search.toLowerCase().trim();
        clientes = clientes.filter(
          (c) =>
            c.nome.toLowerCase().includes(termo) ||
            c.cpf.includes(termo.replace(/\D/g, ""))
        );
      }

      // Paginar
      const total = clientes.length;
      const limite = params.limit ?? 10;
      const pagina = params.page ?? 1;
      const totalPaginas = Math.ceil(total / limite) || 1;
      
      const inicio = (pagina - 1) * limite;
      const dadosPaginados = clientes.slice(inicio, inicio + limite);

      return {
        dados: dadosPaginados,
        paginacao: {
          pagina,
          limite,
          total,
          totalPaginas,
        },
      };
    } catch {
      throw new Error("Erro ao buscar a lista de clientes.");
    }
  }

  public async buscarPorId(id: string, userId: string): Promise<Cliente | null> {
    try {
      const docRef = firestoreDoc(this.db, "clientes", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      if (data["userId"] !== userId) {
        return null;
      }

      return {
        id: docSnap.id,
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
      throw new Error("Erro ao buscar cliente.");
    }
  }

  public async atualizar(id: string, dados: UpdateClienteInput, userId: string): Promise<Cliente> {
    const clienteExistente = await this.buscarPorId(id, userId);
    if (!clienteExistente) {
      throw new Error("Cliente não encontrado.");
    }

    const agora = new Date().toISOString();
    const dadosAtualizados = {
      ...dados,
      atualizadoEm: agora,
    };

    try {
      const docRef = firestoreDoc(this.db, "clientes", id);
      await updateDoc(docRef, dadosAtualizados);

      return {
        ...clienteExistente,
        ...dadosAtualizados,
      } as Cliente;
    } catch {
      throw new Error("Erro ao atualizar os dados do cliente.");
    }
  }

  public async excluir(id: string, userId: string): Promise<void> {
    const clienteExistente = await this.buscarPorId(id, userId);
    if (!clienteExistente) {
      throw new Error("Cliente não encontrado.");
    }

    try {
      const docRef = firestoreDoc(this.db, "clientes", id);
      await deleteDoc(docRef);
    } catch {
      throw new Error("Erro ao excluir o cliente.");
    }
  }

  public async contarClientes(userId: string): Promise<number> {
    try {
      const clientesRef = collection(this.db, "clientes");
      const q = query(clientesRef, where("userId", "==", userId));
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count;
    } catch {
      throw new Error("Erro ao contar clientes.");
    }
  }
}
