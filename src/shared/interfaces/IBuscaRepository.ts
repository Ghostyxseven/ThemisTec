import type { ResultadoBusca } from "@/specs/schemas/busca.schema";
export interface IBuscaRepository { buscar(termo: string): Promise<ResultadoBusca[]> }
