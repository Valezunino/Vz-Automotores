import { ensureSchema, getDatabase } from '../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const vehicle = String(req.body?.vehicle || '').trim();
  const year = Number(req.body?.year);
  const kilometers = Number(req.body?.km);
  const phone = String(req.body?.phone || '').trim();

  if (!vehicle || !phone || !Number.isInteger(year) || year < 1990 || year > 2026 || !Number.isFinite(kilometers) || kilometers < 0) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    const sql = getDatabase();
    await ensureSchema(sql);
    const result = await sql`INSERT INTO trade_ins (vehicle,year,kilometers,phone)
      VALUES (${vehicle},${year},${kilometers},${phone}) RETURNING id`;
    return res.status(201).json({ saved: true, id: result[0].id });
  } catch {
    return res.status(503).json({ error: 'No se pudo guardar la solicitud' });
  }
}
