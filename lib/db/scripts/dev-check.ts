import dotenv from 'dotenv';
import path from 'path';
import { sql } from '@vercel/postgres';

dotenv.config({ path: path.join(__dirname, '../../../.env.local') });

async function main() {
  const c = await sql`SELECT COUNT(*)::int as c, SUM(CASE WHEN search_vector IS NULL THEN 1 ELSE 0 END)::int as nulls FROM derived_content`;
  console.log('derived_content total/nulls:', c.rows[0]);
  const s = await sql`SELECT article_id, LEFT(plaintext, 80) as p, (search_vector IS NULL) as is_null FROM derived_content LIMIT 5`;
  console.log(s.rows);
}

main().catch((e) => { console.error(e); process.exit(1); });

