// moved to lib/db/scripts (TypeScript)
// test-articles - Test articles functionality
import dotenv from 'dotenv';
import path from 'path';
import { sql } from '@vercel/postgres';

dotenv.config({ path: path.join(__dirname, '../../../.env.local') });

async function testArticles() {
  try {
    console.log('Testing direct SQL query...');
    
    // Test basic connection
    const testResult = await sql`SELECT 1 as test`;
    console.log('✅ Database connection works:', testResult.rows[0]);
    
    // Test articles query
    const articlesResult = await sql`
      SELECT id, title, slug, description, tags, status, created_at, updated_at, published_at, cover_image
      FROM articles 
      ORDER BY created_at DESC
      LIMIT 5
    `;
    
    console.log('✅ Articles query works!');
    console.log('Articles found:', articlesResult.rows.length);
    console.log('First article:', articlesResult.rows[0]);
    
    // Test count query
    const countResult = await sql`SELECT COUNT(*) as count FROM articles`;
    console.log('Total articles:', countResult.rows[0].count);
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('Error details:', error);
  }
}

testArticles();
