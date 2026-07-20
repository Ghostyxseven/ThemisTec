import { supabaseClient } from "@/services/supabase/supabase.client";
import type { IBuscaRepository } from "@/shared/interfaces/IBuscaRepository";
import type { ResultadoBusca } from "@/specs/schemas/busca.schema";
export class SupabaseBuscaAdapter implements IBuscaRepository{public async buscar(termo:string):Promise<ResultadoBusca[]>{if(termo.trim().length<2)return[];const response=await supabaseClient.rpc("buscar_global",{termo:termo.trim()});if(response.error)throw new Error("Erro na busca global.");return(response.data??[])as ResultadoBusca[]}}
