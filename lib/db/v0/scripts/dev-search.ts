import dotenv from 'dotenv';
import path from 'path';
import { sql } from '@vercel/postgres';

dotenv.config({ path: path.join(__dirname, '../../../.env.local') });

const q = process.argv[2] || 'next';

async function main() {
  const res = await sql`
    SELECT dc.article_id,
           ts_headline('english', dc.plaintext, plainto_tsquery('english', ${q}),
                      'StartSel=<mark>, StopSel=</mark>, MaxWords=50, MinWords=20') as snippet,
           ts_rank(dc.search_vector, plainto_tsquery('english', ${q})) as score
    FROM derived_content dc
    JOIN articles a ON dc.article_id = a.id
    WHERE a.status = 'published'
      AND dc.search_vector @@ plainto_tsquery('english', ${q})
    ORDER BY score DESC
    LIMIT 5
  `;
  console.log(res.rows);
}

main().catch((e) => { console.error(e); process.exit(1); });

