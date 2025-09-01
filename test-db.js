// Test script to verify @vercel/postgres connection through WebSocket proxy
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

// Import our database client
const { neonConfig } = require("@neondatabase/serverless");

// Configure Neon for local development
if (process.env.VERCEL_ENV === "development") {
  console.log('Configuring Neon for development...');
  neonConfig.wsProxy = (host) => {
    const proxy = `${host}:5433/v1`;
    console.log(`WebSocket proxy: ${host} -> ${proxy}`);
    return proxy;
  };
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
  console.log('Neon configuration applied');
}

const { sql } = require("@vercel/postgres");

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Environment:', process.env.VERCEL_ENV);
    console.log('Database URL:', process.env.POSTGRES_URL);
    
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
    articles.rows.forEach(article => {
      console.log(`- ${article.title} (${article.slug}) - ${article.status}`);
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testConnection();
