import dotenv from 'dotenv';
import path from 'path';
import { sql } from '@vercel/postgres';

dotenv.config({ path: path.join(__dirname, '../../../.env.local') });

async function main() {
  const res = await sql`UPDATE articles SET cover_image = NULL WHERE cover_image LIKE '/images/covers/%'`;
  console.log('Nullified local covers. Updated rows:', (res as any).rowCount);
}

main().catch((e) => { console.error(e); process.exit(1); });
