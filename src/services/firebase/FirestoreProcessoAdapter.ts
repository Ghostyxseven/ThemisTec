import { IProcessoRepository } from "@/shared/interfaces/IProcessoRepository";
import { CreateProcessoInput, Processo, ListProcessosQuery, ProcessoListResponse, TipoProcesso, StatusProcesso, StatusPagamento, Documento, UpdateProcessoInput } from "@/specs/schemas/processo.schema";
import { getFirebaseApp } from "./firebase.client";
import {
  getFirestore,
  collection,
  addDoc,
  Firestore,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
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
      valorHonorarios: dados.valorHonorarios ?? 0,
      statusPagamento: dados.statusPagamento ?? "PENDENTE",
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
          valorHonorarios: (data["valorHonorarios"] as number) || 0,
          statusPagamento: (data["statusPagamento"] as StatusPagamento) || "PENDENTE",
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

  public async buscarPorId(id: string, userId: string): Promise<Processo> {
    try {
      const docRef = doc(this.db, "processos", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Processo não encontrado.");
      }

      const data = docSnap.data();
      if (data["userId"] !== userId) {
        throw new Error("Acesso não autorizado a este processo.");
      }

      return {
        id: docSnap.id,
        numero: data["numero"] as string,
        tipo: data["tipo"] as TipoProcesso,
        status: data["status"] as StatusProcesso,
        descricao: data["descricao"] as string | undefined,
        clienteId: data["clienteId"] as string,
        clienteNome: data["clienteNome"] as string,
        dataAbertura: data["dataAbertura"] as string,
        valorHonorarios: (data["valorHonorarios"] as number) || 0,
        statusPagamento: (data["statusPagamento"] as StatusPagamento) || "PENDENTE",
        documentos: (data["documentos"] as Documento[] | undefined) || [],
        userId: data["userId"] as string,
        criadoEm: data["criadoEm"] as string,
        atualizadoEm: data["atualizadoEm"] as string,
      } as Processo;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Falha ao buscar detalhes do processo.");
    }
  }

  public async adicionarDocumento(processoId: string, documento: Documento, userId: string): Promise<void> {
    try {
      // Primeiro valida se o processo existe e pertence ao usuário
      await this.buscarPorId(processoId, userId);

      const docRef = doc(this.db, "processos", processoId);
      const agora = new Date().toISOString();

      await updateDoc(docRef, {
        documentos: arrayUnion(documento),
        atualizadoEm: agora,
      });
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Falha ao anexar documento ao processo.");
    }
  }

  public async atualizar(id: string, dados: UpdateProcessoInput, userId: string): Promise<Processo> {
    const processoExistente = await this.buscarPorId(id, userId);
    if (!processoExistente) {
      throw new Error("Processo não encontrado.");
    }

    const agora = new Date().toISOString();
    const dadosAtualizados = {
      ...dados,
      atualizadoEm: agora,
    };

    try {
      const docRef = doc(this.db, "processos", id);
      await updateDoc(docRef, dadosAtualizados);

      return {
        ...processoExistente,
        ...dadosAtualizados,
      } as Processo;
    } catch {
      throw new Error("Erro ao atualizar os dados do processo.");
    }
  }
}
