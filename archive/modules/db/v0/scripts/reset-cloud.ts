// moved to lib/db/scripts (TypeScript)
// Reset Neon/Vercel Postgres to the canonical schema state
import dotenv from 'dotenv';
import path from 'path';
import { sql } from '@vercel/postgres';

dotenv.config({ path: path.join(__dirname, '../../../.env.local') });

export async function resetCloud() {
  try {
    console.log('⚠️  Resetting cloud database (dropping conflicting tables)...');
    await sql`BEGIN`;

    // Drop legacy and canonical tables if they exist
    await sql`
      DROP TABLE IF EXISTS 
        derived_content,
        section_embeddings,
        article_embeddings,
        search_analytics,
        articles,
        migrations
      CASCADE
    `;

    // Drop functions if they exist
    await sql`DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE`;
    await sql`DROP FUNCTION IF EXISTS update_search_vector() CASCADE`;

    await sql`COMMIT`;
    console.log('✅ Cloud database reset complete');
  } catch (err: any) {
    try { await sql`ROLLBACK`; } catch {}
    console.error('❌ Reset failed:', err);
    process.exit(1);
  }
}

const invokedDirectly = process.argv[1]?.endsWith('reset-cloud.ts') || process.argv[1]?.endsWith('reset-cloud.js');
if (invokedDirectly) {
  resetCloud();
}
