// moved to lib/db/scripts (TypeScript)
// Test script to verify @vercel/postgres connection (Neon cloud)
import path from 'path';
import dotenv from 'dotenv';
import { sql } from '@vercel/postgres';

// Load environment variables from project root
dotenv.config({ path: path.join(__dirname, '../../../.env.local') });

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Environment:', process.env.NODE_ENV || process.env.VERCEL_ENV);
    console.log('Database URL host:', (() => { try { return new URL(process.env.POSTGRES_URL || '').host; } catch { return 'invalid'; } })());
    
    // Test basic query
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
    console.log('✅ Connection successful!');
    console.log('Current time:', result.rows[0].current_time);
    console.log('PostgreSQL version:', result.rows[0].pg_version);
    
    // Test articles query
    const articles = await sql`
      SELECT id, title, slug, status, created_at 
      FROM articles 
      ORDER BY created_at DESC 
      LIMIT 5
    `;
    console.log(`\n✅ Found ${articles.rows.length} articles:`);
    articles.rows.forEach((article: any) => {
      console.log(`- ${article.title} (${article.slug}) - ${article.status}`);
    });
    
  } catch (error: any) {
    console.error('❌ Database connection failed:', error);
  }
}

testConnection();
