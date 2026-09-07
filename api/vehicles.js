import { ensureSchema, getDatabase } from '../lib/db.js';

const seed = [
  [1,'Toyota','Corolla XEI',2023,'28.000 km','Nafta','Automático','Sedán',34500000,'Nuevo ingreso','hero-showroom.png','Gris grafito','2.0L · 170 CV'],
  [2,'Volkswagen','Taos Comfortline',2022,'41.500 km','Nafta','Automático','SUV',42900000,'Destacado','suv-white.png','Blanco','1.4 TSI · 150 CV'],
  [3,'Chevrolet','Tracker Premier',2024,'12.800 km','Nafta','Automático','SUV',39700000,'Oportunidad','suv-white.png','Blanco perlado','1.2 Turbo · 132 CV'],
  [4,'Ford','Focus Titanium',2019,'67.000 km','Nafta','Automático','Hatchback',24800000,'Disponible','hatch-blue.png','Azul profundo','2.0L · 170 CV'],
  [5,'Volkswagen','Golf Highline',2020,'53.400 km','Nafta','Automático','Hatchback',28600000,'Financiación','hatch-blue.png','Azul metálico','1.4 TSI · 150 CV'],
  [6,'Toyota','Corolla Cross XEI',2023,'31.200 km','Híbrido','Automático','SUV',46800000,'Próximo ingreso','suv-white.png','Blanco','1.8 Hybrid · 122 CV']
];

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' });

  try {
    const sql = getDatabase();
    await ensureSchema(sql);
    const existing = await sql`SELECT COUNT(*)::int AS total FROM vehicles`;
    if (existing[0].total === 0) {
      for (const v of seed) {
        await sql`INSERT INTO vehicles (id,brand,name,year,km,fuel,gear,type,price,status,image,color,engine)
          VALUES (${v[0]},${v[1]},${v[2]},${v[3]},${v[4]},${v[5]},${v[6]},${v[7]},${v[8]},${v[9]},${v[10]},${v[11]},${v[12]})
          ON CONFLICT (id) DO NOTHING`;
      }
    }
    const vehicles = await sql`SELECT id,brand,name,year,km,fuel,gear,type,price::int,status,image,color,engine FROM vehicles ORDER BY id`;
    return res.status(200).json({ vehicles, database: 'connected' });
  } catch (error) {
    const code = error.message === 'DATABASE_NOT_CONFIGURED' ? 'not_configured' : 'unavailable';
    return res.status(503).json({ error: code });
  }
}
