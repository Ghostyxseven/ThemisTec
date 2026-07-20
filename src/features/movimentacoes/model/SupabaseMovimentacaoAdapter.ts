import { supabaseClient } from "@/services/supabase/supabase.client";
import type { IMovimentacaoRepository } from "@/shared/interfaces/IMovimentacaoRepository";
import type { CreateMovimentacaoInput, Movimentacao } from "@/specs/schemas/movimentacao.schema";
type Row={id:string;user_id:string;processo_id:string;tipo:Movimentacao["tipo"];titulo:string;descricao:string|null;data_evento:string;responsavel:string;anexos:Movimentacao["anexos"]|null;criado_em:string;atualizado_em:string;origem_captura?:string;id_integracao?:string};
const map=(r:Row):Movimentacao=>({id:r.id,userId:r.user_id,processoId:r.processo_id,tipo:r.tipo,titulo:r.titulo,...(r.descricao?{descricao:r.descricao}:{}),dataEvento:r.data_evento,responsavel:r.responsavel,anexos:r.anexos??[],criadoEm:r.criado_em,atualizadoEm:r.atualizado_em,origemCaptura:(r.origem_captura as any)||'manual',...(r.id_integracao?{idIntegracao:r.id_integracao}:{})});
export class SupabaseMovimentacaoAdapter implements IMovimentacaoRepository{
 public async listar(userId:string,processoId:string):Promise<Movimentacao[]>{const{data,error}=await supabaseClient.from("movimentacoes").select("*").eq("user_id",userId).eq("processo_id",processoId).order("data_evento",{ascending:false});if(error)throw new Error("Erro ao carregar movimentações.");return(data as Row[]).map(map)}
 public async criar(userId:string,d:CreateMovimentacaoInput):Promise<Movimentacao>{const{data,error}=await supabaseClient.from("movimentacoes").insert({user_id:userId,processo_id:d.processoId,tipo:d.tipo,titulo:d.titulo,descricao:d.descricao??null,data_evento:d.dataEvento,responsavel:d.responsavel,anexos:[]}).select().single<Row>();if(error||!data)throw new Error("Erro ao criar movimentação.");return map(data)}
 public async excluir(userId:string,id:string):Promise<void>{const{error}=await supabaseClient.from("movimentacoes").delete().eq("id",id).eq("user_id",userId);if(error)throw new Error("Erro ao excluir movimentação.")}
}
