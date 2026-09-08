import { getAdminClient, isSupabaseConfigured } from '../lib/supabase.js';
import { allowMethods, fail } from '../lib/http.js';

const fallback = [
  { id:'demo-1',brand:'Toyota',model:'Corolla XEI',name:'Corolla XEI',year:2023,kilometers:28000,km:'28.000 km',fuel:'Nafta',transmission:'Automático',gear:'Automático',category:'Sedán',type:'Sedán',price:34500000,status:'Disponible',images:['assets/toyota-corolla-xei.webp'],image:'assets/toyota-corolla-xei.webp',color:'Gris grafito',engine:'2.0L · 170 CV',featured:true },
  { id:'demo-2',brand:'Volkswagen',model:'Taos Comfortline',name:'Taos Comfortline',year:2022,kilometers:41500,km:'41.500 km',fuel:'Nafta',transmission:'Automático',gear:'Automático',category:'SUV',type:'SUV',price:42900000,status:'Reservado',images:['assets/volkswagen-taos.webp'],image:'assets/volkswagen-taos.webp',color:'Negro',engine:'1.4 TSI · 150 CV',featured:true },
  { id:'demo-3',brand:'Chevrolet',model:'Tracker Premier',name:'Tracker Premier',year:2024,kilometers:12800,km:'12.800 km',fuel:'Nafta',transmission:'Automático',gear:'Automático',category:'SUV',type:'SUV',price:39700000,status:'Disponible',images:['assets/chevrolet-tracker.webp'],image:'assets/chevrolet-tracker.webp',color:'Rojo',engine:'1.2 Turbo · 132 CV',featured:true },
  { id:'demo-4',brand:'Ford',model:'Focus Titanium',name:'Focus Titanium',year:2019,kilometers:67000,km:'67.000 km',fuel:'Nafta',transmission:'Automático',gear:'Automático',category:'Hatchback',type:'Hatchback',price:24800000,status:'Disponible',images:['assets/ford-focus.webp'],image:'assets/ford-focus.webp',color:'Blanco',engine:'2.0L · 170 CV',featured:false },
  { id:'demo-5',brand:'Volkswagen',model:'Golf Highline',name:'Golf Highline',year:2020,kilometers:53400,km:'53.400 km',fuel:'Nafta',transmission:'Automático',gear:'Automático',category:'Hatchback',type:'Hatchback',price:28600000,status:'Vendido',images:['assets/volkswagen-golf.webp'],image:'assets/volkswagen-golf.webp',color:'Blanco',engine:'1.4 TSI · 150 CV',featured:false },
  { id:'demo-6',brand:'Toyota',model:'Corolla Cross XEI',name:'Corolla Cross XEI',year:2023,kilometers:31200,km:'31.200 km',fuel:'Híbrido',transmission:'Automático',gear:'Automático',category:'SUV',type:'SUV',price:46800000,status:'Próximo ingreso',images:['assets/toyota-corolla-cross.webp'],image:'assets/toyota-corolla-cross.webp',color:'Blanco',engine:'1.8 Hybrid · 122 CV',featured:false }
];

function present(vehicle) {
  const image = vehicle.images?.[0] || 'assets/toyota-corolla-xei.webp';
  return { ...vehicle, name: vehicle.model, km: `${Number(vehicle.kilometers || 0).toLocaleString('es-AR')} km`, gear: vehicle.transmission, type: vehicle.category, image };
}

export default async function handler(req, res) {
  if (!allowMethods(req, res, ['GET'])) return;
  if (!isSupabaseConfigured()) return res.status(200).json({ vehicles: fallback, mode: 'demo' });
  try {
    const supabase = getAdminClient();
    let query = supabase.from('vehicles').select('*').eq('published', true).order('featured', { ascending: false }).order('created_at', { ascending: false });
    if (req.query?.status) query = query.eq('status', req.query.status);
    const { data, error } = await query;
    if (error) throw error;
    return res.status(200).json({ vehicles: data.map(present), mode: 'live' });
  } catch (error) { return fail(res, error, 'vehicles:get'); }
}
