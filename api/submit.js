import { getAdminClient } from '../lib/supabase.js';
import { allowMethods, cleanText, fail } from '../lib/http.js';

const tables = { lead:'leads', trade_in:'trade_ins', financing:'financing_requests', price_alert:'price_alerts', saved_search:'saved_searches' };
function payload(type, body) {
  if (type === 'lead') return { name:cleanText(body.name,100),phone:cleanText(body.phone,40),email:cleanText(body.email,160)||null,message:cleanText(body.message,1500),vehicle_id:body.vehicle_id||null,channel:cleanText(body.channel,40)||'Formulario web' };
  if (type === 'trade_in') return { name:cleanText(body.name,100)||null,phone:cleanText(body.phone,40),brand:cleanText(body.brand,80),model:cleanText(body.model,100),year:Number(body.year),kilometers:Number(body.kilometers),notes:cleanText(body.notes,1000)||null,images:Array.isArray(body.images)?body.images.slice(0,12):[] };
  if (type === 'financing') return { name:cleanText(body.name,100),phone:cleanText(body.phone,40),email:cleanText(body.email,160)||null,vehicle_id:body.vehicle_id||null,vehicle_value:Number(body.vehicle_value),deposit:Number(body.deposit),installments:Number(body.installments),estimated_payment:Number(body.estimated_payment)||null };
  if (type === 'price_alert') return { vehicle_id:body.vehicle_id,name:cleanText(body.name,100)||null,phone:cleanText(body.phone,40)||null,email:cleanText(body.email,160)||null };
  if (type === 'saved_search') return { name:cleanText(body.name,100)||null,phone:cleanText(body.phone,40)||null,email:cleanText(body.email,160)||null,filters:body.filters&&typeof body.filters==='object'?body.filters:{} };
  return null;
}
export default async function handler(req, res) {
  if (!allowMethods(req, res, ['POST'])) return;
  try {
    const type = cleanText(req.body?.type,30), table = tables[type], record = payload(type, req.body || {});
    if (!table || !record) return res.status(400).json({ error:'Tipo de solicitud inválido.' });
    if (!record.phone && !record.email) return res.status(400).json({ error:'Ingresá un teléfono o correo.' });
    const supabase = getAdminClient();
    const { data, error } = await supabase.from(table).insert(record).select('id').single();
    if (error) throw error;
    await supabase.from('activity_events').insert({ event_type:`new_${type}`,vehicle_id:record.vehicle_id||null,metadata:{ source:'website' } });
    return res.status(201).json({ ok:true,id:data.id });
  } catch (error) { return fail(res, error, 'submit'); }
}
