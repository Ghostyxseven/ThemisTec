import { IClienteRepository } from "@/shared/interfaces/IClienteRepository";
import { CreateClienteInput, Cliente, ListClientesQuery, ClienteListResponse } from "@/specs/schemas/cliente.schema";
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
}
