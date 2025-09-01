// test-articles.js - Test articles functionality
require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function testArticles() {
  try {
    console.log('Testing direct SQL query...');
    
    // Test basic connection
    const testResult = await sql`SELECT 1 as test`;
    console.log('✅ Database connection works:', testResult.rows[0]);
    
    // Test articles query
    const articlesResult = await sql`
      SELECT id, title, slug, excerpt as description, tags, 
             'published' as status, created_at, updated_at, 
             published_date as published_at, featured_image as cover_image
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
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Error details:', error);
  }
}

testArticles();
