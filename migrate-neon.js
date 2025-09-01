// migrate-neon.js - Database migration for Neon PostgreSQL
require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function runMigrations() {
  try {
    console.log('🚀 Starting database migration on Neon...');
    
    // Enable pgvector extension
    console.log('📦 Installing pgvector extension...');
    await sql`CREATE EXTENSION IF NOT EXISTS vector`;
    
    // Create migration tracking table
    console.log('📋 Creating migration tracking table...');
    await sql`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Check if migrations already ran
    const existingMigrations = await sql`SELECT filename FROM migrations`;
    const executedMigrations = new Set(existingMigrations.rows.map(r => r.filename));
    
    // Migration 1: Create articles table
    if (!executedMigrations.has('001_create_articles_table.sql')) {
      console.log('📄 Running migration: Create articles table...');
      
      await sql`
        CREATE TABLE articles (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          excerpt TEXT,
          content TEXT NOT NULL,
          author VARCHAR(100),
          published_date DATE,
          tags TEXT[],
          featured_image VARCHAR(500),
          read_time_minutes INTEGER,
          word_count INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      await sql`
        INSERT INTO migrations (filename) VALUES ('001_create_articles_table.sql')
      `;
      console.log('✅ Articles table created');
    }
    
    // Migration 2: Create article embeddings table
    if (!executedMigrations.has('002_create_article_embeddings.sql')) {
      console.log('📄 Running migration: Create article embeddings...');
      
      await sql`
        CREATE TABLE article_embeddings (
          id SERIAL PRIMARY KEY,
          article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
          chunk_index INTEGER NOT NULL,
          content TEXT NOT NULL,
          embedding vector(1536),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      await sql`
        CREATE INDEX idx_article_embeddings_article_id ON article_embeddings(article_id)
      `;
      
      await sql`
        CREATE INDEX idx_article_embeddings_embedding ON article_embeddings 
        USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)
      `;
      
      await sql`
        INSERT INTO migrations (filename) VALUES ('002_create_article_embeddings.sql')
      `;
      console.log('✅ Article embeddings table created');
    }
    
    // Migration 3: Create search analytics table
    if (!executedMigrations.has('003_create_search_analytics.sql')) {
      console.log('📄 Running migration: Create search analytics...');
      
      await sql`
        CREATE TABLE search_analytics (
          id SERIAL PRIMARY KEY,
          query TEXT NOT NULL,
          search_type VARCHAR(20) NOT NULL CHECK (search_type IN ('text', 'vector', 'hybrid')),
          results_count INTEGER NOT NULL,
          execution_time_ms INTEGER,
          user_ip INET,
          user_agent TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      await sql`
        CREATE INDEX idx_search_analytics_created_at ON search_analytics(created_at)
      `;
      
      await sql`
        CREATE INDEX idx_search_analytics_search_type ON search_analytics(search_type)
      `;
      
      await sql`
        INSERT INTO migrations (filename) VALUES ('003_create_search_analytics.sql')
      `;
      console.log('✅ Search analytics table created');
    }
    
    console.log('🎉 All migrations completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
