export function allowMethods(req, res, methods) {
  if (methods.includes(req.method)) return true;
  res.setHeader('Allow', methods.join(', '));
  res.status(405).json({ error: 'Método no permitido.' });
  return false;
}

export function cleanText(value, max = 500) {
  return String(value ?? '').trim().slice(0, max);
}

export function fail(res, error, label) {
  console.error(`[${label}]`, error);
  const missing = String(error?.message || '').startsWith('MISSING_');
  return res.status(missing ? 503 : 500).json({ error: missing ? 'Servicio pendiente de configuración.' : 'No pudimos completar la operación.' });
}
