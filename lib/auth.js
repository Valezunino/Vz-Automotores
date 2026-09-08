import { getAdminClient } from './supabase.js';

function bearer(req) {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : '';
}

export async function requireAdmin(req, res) {
  const token = bearer(req);
  if (!token) {
    res.status(401).json({ error: 'Debés iniciar sesión.' });
    return null;
  }
  const supabase = getAdminClient();
  const { data, error } = await supabase.auth.getUser(token);
  const email = data?.user?.email?.toLowerCase();
  const allowlist = (process.env.ADMIN_EMAILS || '').split(',').map(value => value.trim().toLowerCase()).filter(Boolean);
  let permitted = !error && email && allowlist.includes(email);
  if (!error && email && !permitted) {
    const { data: administrator, error: lookupError } = await supabase.from('administrators').select('email').eq('email', email).maybeSingle();
    permitted = !lookupError && Boolean(administrator);
  }
  if (error || !email || !data.user.email_confirmed_at || !permitted) {
    res.status(403).json({ error: 'Esta cuenta no tiene acceso administrativo.' });
    return null;
  }
  return { user: data.user, supabase };
}
