import { supabaseClient } from "@/services/supabase/supabase.client";
import type { IEventoRepository } from "@/shared/interfaces/IEventoRepository";
import type { CreateEventoInput, EventoAgenda } from "@/specs/schemas/evento.schema";
type Row = { id:string;user_id:string;titulo:string;tipo:EventoAgenda["tipo"];inicio:string;fim:string|null;descricao:string|null;processo_id:string|null;cliente_id:string|null;lembrete_minutos:number|null;status:EventoAgenda["status"];criado_em:string;atualizado_em:string };
const map=(r:Row):EventoAgenda=>({id:r.id,userId:r.user_id,titulo:r.titulo,tipo:r.tipo,inicio:r.inicio,...(r.fim?{fim:r.fim}:{}),...(r.descricao?{descricao:r.descricao}:{}),...(r.processo_id?{processoId:r.processo_id}:{}),...(r.cliente_id?{clienteId:r.cliente_id}:{}),...(r.lembrete_minutos!==null?{lembreteMinutos:r.lembrete_minutos}:{}),status:r.status,criadoEm:r.criado_em,atualizadoEm:r.atualizado_em});
export class SupabaseEventoAdapter implements IEventoRepository {
  async listar(userId:string,inicio:string,fim:string):Promise<EventoAgenda[]>{const {data,error}=await supabaseClient.from("eventos_agenda").select("*").eq("user_id",userId).gte("inicio",inicio).lte("inicio",fim).order("inicio");if(error)throw new Error("Erro ao carregar agenda.");return (data as Row[]).map(map)}
  async criar(userId:string,d:CreateEventoInput):Promise<EventoAgenda>{const {data,error}=await supabaseClient.from("eventos_agenda").insert({user_id:userId,titulo:d.titulo,tipo:d.tipo,inicio:d.inicio,fim:d.fim??null,descricao:d.descricao??null,processo_id:d.processoId??null,cliente_id:d.clienteId??null,lembrete_minutos:d.lembreteMinutos??null}).select().single<Row>();if(error||!data)throw new Error("Erro ao criar evento.");return map(data)}
  async concluir(userId:string,id:string):Promise<void>{const {error}=await supabaseClient.from("eventos_agenda").update({status:"CONCLUIDO"}).eq("id",id).eq("user_id",userId);if(error)throw new Error("Erro ao concluir evento.")}
  async excluir(userId:string,id:string):Promise<void>{const {error}=await supabaseClient.from("eventos_agenda").delete().eq("id",id).eq("user_id",userId);if(error)throw new Error("Erro ao excluir evento.")}
}
