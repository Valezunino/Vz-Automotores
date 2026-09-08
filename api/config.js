import { getPublicConfig } from '../lib/supabase.js';
import { allowMethods } from '../lib/http.js';

export default function handler(req, res) {
  if (!allowMethods(req, res, ['GET'])) return;
  try {
    const config = getPublicConfig();
    return res.status(200).json({ ...config, siteUrl: process.env.PUBLIC_SITE_URL || 'https://vz-automotores.vercel.app' });
  } catch {
    return res.status(503).json({ error: 'Configuración pendiente.' });
  }
}
