import { requireAdmin } from '../../lib/auth.js';
import { allowMethods, cleanText, fail } from '../../lib/http.js';

export default async function handler(req,res){
  if(!allowMethods(req,res,['PUT']))return;
  try{
    const auth=await requireAdmin(req,res);if(!auth)return;
    const b=req.body||{},value={business_name:cleanText(b.business_name,120),city:cleanText(b.city,120),address:cleanText(b.address,200)||null,phone:cleanText(b.phone,40),whatsapp:cleanText(b.whatsapp,40),email:cleanText(b.email,160)||null,hours:cleanText(b.hours,500)||null,instagram:cleanText(b.instagram,160)||null,show_prices:Boolean(b.show_prices),show_sold:Boolean(b.show_sold),updated_at:new Date().toISOString()};
    const {data,error}=await auth.supabase.from('dealership_settings').upsert({id:1,...value}).select().single();if(error)throw error;
    return res.status(200).json({settings:data});
  }catch(error){return fail(res,error,'admin:settings')}
}
