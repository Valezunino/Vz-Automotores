import { neon } from '@neondatabase/serverless';

export function getDatabase() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) {
    throw new Error('DATABASE_NOT_CONFIGURED');
  }
  return neon(url);
}

export async function ensureSchema(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY,
      brand TEXT NOT NULL,
      name TEXT NOT NULL,
      year INTEGER NOT NULL,
      km TEXT NOT NULL,
      fuel TEXT NOT NULL,
      gear TEXT NOT NULL,
      type TEXT NOT NULL,
      price BIGINT NOT NULL,
      status TEXT NOT NULL,
      image TEXT NOT NULL,
      color TEXT NOT NULL,
      engine TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS trade_ins (
      id BIGSERIAL PRIMARY KEY,
      vehicle TEXT NOT NULL,
      year INTEGER NOT NULL,
      kilometers INTEGER NOT NULL,
      phone TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}
