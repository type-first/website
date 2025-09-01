// Test script to verify @vercel/postgres connection through WebSocket proxy
import { sql } from './lib/db/index.js';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic query
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
    console.log('✅ Connection successful!');
    console.log('Current time:', result[0].current_time);
    console.log('PostgreSQL version:', result[0].pg_version);
    
    // Test articles query
    const articles = await sql`
      SELECT id, title, slug, status, created_at 
      FROM articles 
      ORDER BY created_at DESC 
      LIMIT 5
    `;
    console.log(`\n✅ Found ${articles.length} articles:`);
    articles.forEach(article => {
      console.log(`- ${article.title} (${article.slug}) - ${article.status}`);
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testConnection();
