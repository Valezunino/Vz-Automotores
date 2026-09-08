import submit from './submit.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const vehicle = String(req.body?.vehicle || '').trim();
  const year = Number(req.body?.year);
  const kilometers = Number(req.body?.km);
  const phone = String(req.body?.phone || '').trim();

  if (!vehicle || !phone || !Number.isInteger(year) || year < 1950 || year > new Date().getFullYear()+1 || !Number.isInteger(kilometers) || kilometers < 0) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  const [brand,...model] = vehicle.split(/\s+/);
  req.body = {type:'trade_in',brand,model:model.join(' ')||vehicle,year,kilometers,phone,
    name:phone.startsWith('DEMO')?'DEMO · Prueba formulario web':'Solicitud desde la web',
    notes:phone.startsWith('DEMO')?'DEMO VZ SEPTIEMBRE: prueba real de guardado del formulario.':'Solicitud de tasación recibida desde el sitio.'};
  return submit(req,res);
}
