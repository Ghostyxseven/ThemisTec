import { IProcessoRepository } from "@/shared/interfaces/IProcessoRepository";
import { CreateProcessoInput, Processo, ListProcessosQuery, ProcessoListResponse, TipoProcesso, StatusProcesso, Documento } from "@/specs/schemas/processo.schema";
import { getFirebaseApp } from "./firebase.client";
import {
  getFirestore,
  collection,
  addDoc,
  Firestore,
  getDocs,
  query,
  where,
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

  public async listar(params: ListProcessosQuery, userId: string): Promise<ProcessoListResponse> {
    try {
      const processosRef = collection(this.db, "processos");
      const q = query(processosRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      let processos: Processo[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        processos.push({
          id: docSnap.id,
          numero: data["numero"] as string,
          tipo: data["tipo"] as TipoProcesso,
          status: data["status"] as StatusProcesso,
          descricao: data["descricao"] as string | undefined,
          clienteId: data["clienteId"] as string,
          clienteNome: data["clienteNome"] as string,
          dataAbertura: data["dataAbertura"] as string,
          documentos: (data["documentos"] as Documento[] | undefined) || [],
          userId: data["userId"] as string,
          criadoEm: data["criadoEm"] as string,
          atualizadoEm: data["atualizadoEm"] as string,
        });
      });

      // Filtrar por clienteId se fornecido
      if (params.clienteId) {
        processos = processos.filter((p) => p.clienteId === params.clienteId);
      }

      // Filtrar por status se fornecido
      if (params.status) {
        processos = processos.filter((p) => p.status === params.status);
      }

      // Ordenar por criadoEm desc
      processos.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));

      // Paginar
      const total = processos.length;
      const limite = params.limit ?? 10;
      const pagina = params.page ?? 1;
      const totalPaginas = Math.ceil(total / limite) || 1;
      
      const inicio = (pagina - 1) * limite;
      const dadosPaginados = processos.slice(inicio, inicio + limite);

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
      throw new Error("Erro ao buscar a lista de processos.");
    }
  }
}
