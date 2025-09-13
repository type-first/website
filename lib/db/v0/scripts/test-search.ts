import dotenv from 'dotenv';
import path from 'path';
import { sql } from '@vercel/postgres';
import { searchByText, searchByVector } from '@/lib/search/v0/search';

// Load env from project root .env.local
dotenv.config({ path: path.join(__dirname, '../../../.env.local') });

async function embedQuery(query: string): Promise<number[] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ input: query, model: 'text-embedding-3-small' }),
    });
    if (!res.ok) return null;
    const data: any = await res.json();
    const v = data?.data?.[0]?.embedding as number[] | undefined;
    return Array.isArray(v) ? v : null;
  } catch {
    return null;
  }
}

function truncate(s: string, n = 120): string { return s.length > n ? s.slice(0, n) + '…' : s; }

async function main() {
  const q = process.argv[2] || 'react';
  const limit = Math.max(1, Math.min(10, parseInt(process.argv[3] || '5', 10)));

  console.log(`\nTesting search with query="${q}" limit=${limit}`);

  // Basic counts
  const [{ rows: [{ c: pubs }] }, { rows: [{ c: dc }] }, { rows: [{ c: se }] }] = await Promise.all([
    sql`SELECT COUNT(*)::int as c FROM articles WHERE status = 'published'`,
    sql`SELECT COUNT(*)::int as c FROM derived_content`,
    sql`SELECT COUNT(*)::int as c FROM section_embeddings`,
  ]);

  console.log(`Published articles: ${pubs}, derived_content rows: ${dc}, section_embeddings rows: ${se}`);

  // Text search
  const text = await searchByText(q, limit);
  console.log(`\nText results (${text.length}):`);
  text.forEach((r: any, i: number) => {
    console.log(`  ${i + 1}. article=${r.articleId} score=${r.score.toFixed(3)} snippet=${truncate(r.snippet.replace(/\n/g, ' '))}`);
  });

  // Vector search
  const embedding = await embedQuery(q);
  if (!embedding) {
    console.warn('\n⚠️ No OPENAI_API_KEY or failed to embed query. Skipping vector test.');
    return;
  }

  const vector = await searchByVector(embedding, limit); // 0 threshold to always return top matches
  console.log(`\nVector results (${vector.length}):`);
  vector.forEach((r: any, i: number) => {
    console.log(`  ${i + 1}. article=${r.articleId} score=${r.score.toFixed(3)} section=${r.sectionIndex} snippet=${truncate(r.content.replace(/\n/g, ' '))}`);
  });

  console.log('\nDone');
}

main().catch((e) => { console.error(e); process.exit(1); });

