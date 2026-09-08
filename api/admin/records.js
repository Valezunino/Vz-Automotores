import { requireAdmin } from '../../lib/auth.js';
import { allowMethods, cleanText, fail } from '../../lib/http.js';

const allowed={leads:['Nueva','Contactado','Visita agendada','Cerrada'],trade_ins:['Pendiente','Evaluación','Tasado','Aceptado','Rechazado'],financing_requests:['Pendiente','Evaluación','Aprobada','Rechazada']};
export default async function handler(req,res){
  if(!allowMethods(req,res,['PATCH']))return;
  try{
    const auth=await requireAdmin(req,res);if(!auth)return;
    const table=cleanText(req.body?.table,40),id=req.body?.id,status=cleanText(req.body?.status,40);
    if(!allowed[table]?.includes(status))return res.status(400).json({error:'Estado inválido.'});
    const extra=table==='leads'?{assigned_to:cleanText(req.body?.assigned_to,120)||auth.user.email}:{};
    const {data,error}=await auth.supabase.from(table).update({status,...extra,updated_at:new Date().toISOString()}).eq('id',id).select().single();if(error)throw error;
    return res.status(200).json({record:data});
  }catch(error){return fail(res,error,'admin:records')}
}
