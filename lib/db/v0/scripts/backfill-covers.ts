import dotenv from 'dotenv';
import path from 'path';
import { sql } from '@vercel/postgres';

dotenv.config({ path: path.join(__dirname, '../../../.env.local') });

const coverBySlug: Record<string, string> = {
  'getting-started-nextjs-15-app-router': '/images/covers/nextjs.svg',
  'interactive-components-islands-architecture': '/images/covers/islands.svg',
  'advanced-typescript-patterns-react': '/images/covers/typescript.svg',
  'typescript-5-features-for-nextjs': '/images/covers/typescript.svg',
  'rag-101-postgres-pgvector': '/images/covers/rag.svg',
  'ai-driven-interfaces-react': '/images/covers/ai-ui.svg',
  'nextjs-server-actions-ai-streaming-validation': '/images/covers/server-actions.svg',
  'knowledge-curation-sources-to-collections': '/images/covers/curation.svg',
  'personalized-recommendations-hybrid-retrieval': '/images/covers/recommendations.svg',
};

async function main() {
  let updated = 0;
  for (const [slug, cover] of Object.entries(coverBySlug)) {
    const res = await sql`UPDATE articles SET cover_image = ${cover} WHERE slug = ${slug}`;
    if ((res as any).rowCount > 0) {
      updated += (res as any).rowCount;
      console.log(`Updated cover for ${slug} -> ${cover}`);
    }
  }
  console.log(`Done. Updated ${updated} articles.`);
}

main().catch((e) => { console.error(e); process.exit(1); });

