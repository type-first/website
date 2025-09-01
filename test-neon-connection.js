// test-neon-connection.js - Test connection to Neon database
require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function testConnection() {
  try {
    console.log('Testing connection to Neon database...');
    console.log('POSTGRES_URL exists:', !!process.env.POSTGRES_URL);
    console.log('POSTGRES_URL value:', process.env.POSTGRES_URL ? 'Set' : 'Not set');
    
    // Test basic connection
    const result = await sql`SELECT current_database(), version()`;
    
    console.log('✅ Connection successful!');
    console.log('Database:', result.rows[0].current_database);
    console.log('Version:', result.rows[0].version);
    
    // Test if our tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log('Existing tables:', tables.rows.map(r => r.table_name));
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
