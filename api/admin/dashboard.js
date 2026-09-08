import { requireAdmin } from '../../lib/auth.js';
import { allowMethods, fail } from '../../lib/http.js';

export default async function handler(req, res) {
  if (!allowMethods(req, res, ['GET'])) return;
  try {
    const auth = await requireAdmin(req, res); if (!auth) return;
    const { supabase } = auth;
    const [vehicles,leads,tradeIns,financing,settings,events] = await Promise.all([
      supabase.from('vehicles').select('*').order('created_at',{ascending:false}),
      supabase.from('leads').select('*,vehicles(brand,model)').order('created_at',{ascending:false}),
      supabase.from('trade_ins').select('*').order('created_at',{ascending:false}),
      supabase.from('financing_requests').select('*,vehicles(brand,model)').order('created_at',{ascending:false}),
      supabase.from('dealership_settings').select('*').eq('id',1).single(),
      supabase.from('activity_events').select('*').gte('created_at',new Date(Date.now()-30*86400000).toISOString()).order('created_at',{ascending:false})
    ]);
    for (const result of [vehicles,leads,tradeIns,financing,settings,events]) if (result.error) throw result.error;
    return res.status(200).json({ vehicles:vehicles.data,leads:leads.data,tradeIns:tradeIns.data,financing:financing.data,settings:settings.data,events:events.data,user:{email:auth.user.email,name:auth.user.user_metadata?.full_name||auth.user.email} });
  } catch (error) { return fail(res,error,'admin:dashboard'); }
}
