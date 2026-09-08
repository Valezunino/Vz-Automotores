import { requireAdmin } from '../../lib/auth.js';
import { allowMethods, cleanText, fail } from '../../lib/http.js';

export const config={api:{bodyParser:{sizeLimit:'6mb'}}};
export default async function handler(req,res){
  if(!allowMethods(req,res,['POST']))return;
  try{
    const auth=await requireAdmin(req,res);if(!auth)return;
    const match=String(req.body?.data||'').match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
    if(!match)return res.status(400).json({error:'Formato de imagen inválido.'});
    const bytes=Buffer.from(match[2],'base64');if(bytes.length>5*1024*1024)return res.status(413).json({error:'La imagen supera los 5 MB.'});
    const ext=match[1].split('/')[1].replace('jpeg','jpg'),base=cleanText(req.body?.name,80).replace(/[^a-zA-Z0-9._-]/g,'-')||'vehiculo';
    const path=`vehicles/${Date.now()}-${base}.${ext}`;
    const {error}=await auth.supabase.storage.from('vehicle-images').upload(path,bytes,{contentType:match[1],upsert:false,cacheControl:'31536000'});if(error)throw error;
    const {data}=auth.supabase.storage.from('vehicle-images').getPublicUrl(path);
    return res.status(201).json({url:data.publicUrl,path});
  }catch(error){return fail(res,error,'admin:upload')}
}
