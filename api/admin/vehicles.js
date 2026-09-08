import { requireAdmin } from '../../lib/auth.js';
import { allowMethods, cleanText, fail } from '../../lib/http.js';

function record(body) {
  return { brand:cleanText(body.brand,80),model:cleanText(body.model,100),year:Number(body.year),kilometers:Number(body.kilometers),fuel:cleanText(body.fuel,40),transmission:cleanText(body.transmission,40),category:cleanText(body.category,50),price:Number(body.price),status:cleanText(body.status,40),color:cleanText(body.color,50)||null,engine:cleanText(body.engine,100)||null,description:cleanText(body.description,3000)||null,equipment:Array.isArray(body.equipment)?body.equipment.slice(0,60):[],images:Array.isArray(body.images)?body.images.slice(0,20):[],featured:Boolean(body.featured),published:body.published!==false,updated_at:new Date().toISOString() };
}
export default async function handler(req,res) {
  if (!allowMethods(req,res,['POST','PUT','DELETE'])) return;
  try {
    const auth=await requireAdmin(req,res); if(!auth)return;
    const { supabase }=auth;
    if (req.method !== 'DELETE') {
      const value = record(req.body || {});
      if (!value.brand || !value.model || !Number.isInteger(value.year) || value.year < 1950 || value.year > 2100 || !Number.isSafeInteger(value.kilometers) || value.kilometers < 0 || !Number.isSafeInteger(value.price) || value.price < 0 || !['Disponible','Reservado','Vendido','Próximo ingreso'].includes(value.status)) return res.status(400).json({error:'Revisá marca, modelo, año, kilómetros, precio y estado.'});
      if (value.images.some(url => typeof url !== 'string' || !(/^https:\/\//.test(url) || /^\/?assets\/[\w.-]+$/.test(url)))) return res.status(400).json({error:'Una foto tiene una dirección inválida.'});
      if (value.equipment.some(item => typeof item !== 'string' || item.length > 200)) return res.status(400).json({error:'Equipamiento inválido.'});
    }
    if(req.method==='POST'){
      const value=record(req.body||{});
      if(!value.brand||!value.model||!value.year)return res.status(400).json({error:'Completá marca, modelo y año.'});
      const {data,error}=await supabase.from('vehicles').insert(value).select().single();if(error)throw error;
      await supabase.from('activity_events').insert({event_type:'vehicle_created',vehicle_id:data.id,metadata:{by:auth.user.email}});
      return res.status(201).json({vehicle:data});
    }
    const id=req.body?.id;if(!id)return res.status(400).json({error:'Falta el vehículo.'});
    if(req.method==='PUT'){
      const {data,error}=await supabase.from('vehicles').update(record(req.body)).eq('id',id).select().single();if(error)throw error;
      await supabase.from('activity_events').insert({event_type:'vehicle_updated',vehicle_id:id,metadata:{by:auth.user.email}});
      return res.status(200).json({vehicle:data});
    }
    const {error}=await supabase.from('vehicles').delete().eq('id',id);if(error)throw error;
    await supabase.from('activity_events').insert({event_type:'vehicle_deleted',metadata:{vehicle_id:id,by:auth.user.email}});
    return res.status(200).json({ok:true});
  }catch(error){return fail(res,error,'admin:vehicles')}
}
