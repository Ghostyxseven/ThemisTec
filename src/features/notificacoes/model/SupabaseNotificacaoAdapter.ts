import { supabaseClient } from "@/services/supabase/supabase.client";
import type { INotificacaoRepository } from "@/shared/interfaces/INotificacaoRepository";
import type { Notificacao } from "@/specs/schemas/notificacao.schema";
type Row={id:string;user_id:string;titulo:string;mensagem:string;prioridade:Notificacao["prioridade"];origem:string;destino_url:string|null;lida_em:string|null;chave_idempotencia:string;criado_em:string};
const map=(r:Row):Notificacao=>({id:r.id,userId:r.user_id,titulo:r.titulo,mensagem:r.mensagem,prioridade:r.prioridade,origem:r.origem,...(r.destino_url?{destinoUrl:r.destino_url}:{}),...(r.lida_em?{lidaEm:r.lida_em}:{}),chaveIdempotencia:r.chave_idempotencia,criadoEm:r.criado_em});
export class SupabaseNotificacaoAdapter implements INotificacaoRepository{
 public async listar(userId:string):Promise<Notificacao[]>{const{data,error}=await supabaseClient.from("notificacoes").select("*").eq("user_id",userId).order("criado_em",{ascending:false}).limit(50);if(error)throw new Error("Erro ao carregar notificações.");return(data as Row[]).map(map)}
 public async contarNaoLidas(userId:string):Promise<number>{const{count,error}=await supabaseClient.from("notificacoes").select("id",{count:"exact",head:true}).eq("user_id",userId).is("lida_em",null);if(error)throw new Error("Erro ao contar notificações.");return count??0}
 public async marcarLida(userId:string,id:string):Promise<void>{const{error}=await supabaseClient.from("notificacoes").update({lida_em:new Date().toISOString()}).eq("id",id).eq("user_id",userId);if(error)throw new Error("Erro ao marcar notificação.")}
 public async marcarTodasLidas(userId:string):Promise<void>{const{error}=await supabaseClient.from("notificacoes").update({lida_em:new Date().toISOString()}).eq("user_id",userId).is("lida_em",null);if(error)throw new Error("Erro ao atualizar notificações.")}
}
