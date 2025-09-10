#!/usr/bin/env npx tsx

/**
 * Script to populate compiled_articles table using semantic compilation
 * 
 * This script uses our semantic compiler to extract rich text content
 * and populate the database table that the search system uses.
 */

import { semanticArticleCompiler } from '../lib/article-compiler/semantic-compiler';
import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function populateCompiledArticles() {
  console.log('🔄 Populating compiled_articles table with semantic compilation...\n');
  
  try {
    // Test database connection
    console.log('Testing database connection...');
    await sql`SELECT 1`;
    console.log('✅ Database connected successfully');
    
    // Compile articles using semantic approach
    console.log('\n📝 Compiling articles...');
    const compiledArticles = await semanticArticleCompiler.compileAllArticles();
    
    if (compiledArticles.length === 0) {
      console.log('❌ No articles found to process');
      return;
    }
    
    console.log(`\n🔄 Inserting ${compiledArticles.length} articles into database...`);
    
    // Clear existing data
    await sql`DELETE FROM compiled_articles`;
    console.log('✅ Cleared existing compiled articles');
    
    // Insert compiled articles
    for (const article of compiledArticles) {
      try {
        await sql`
          INSERT INTO compiled_articles (
            slug, 
            metadata, 
            plain_text, 
            markdown, 
            html, 
            outline, 
            word_count, 
            reading_time,
            last_compiled
          ) VALUES (
            ${article.slug},
            ${JSON.stringify(article.metadata)},
            ${article.plainText},
            ${article.markdown},
            ${article.html},
            ${JSON.stringify(article.outline)},
            ${article.wordCount},
            ${article.readingTime},
            ${article.lastCompiled.toISOString()}
          )
          ON CONFLICT (slug) DO UPDATE SET
            metadata = EXCLUDED.metadata,
            plain_text = EXCLUDED.plain_text,
            markdown = EXCLUDED.markdown,
            html = EXCLUDED.html,
            outline = EXCLUDED.outline,
            word_count = EXCLUDED.word_count,
            reading_time = EXCLUDED.reading_time,
            last_compiled = EXCLUDED.last_compiled
        `;
        
        console.log(`  ✅ ${article.slug}: ${article.wordCount} words`);
        
      } catch (error) {
        console.error(`  ❌ ${article.slug}: Failed to insert -`, error);
      }
    }
    
    console.log('\n📊 Database Population Summary:');
    const totalWords = compiledArticles.reduce((sum, article) => sum + article.wordCount, 0);
    const avgWordsPerArticle = Math.round(totalWords / compiledArticles.length);
    
    console.log(`  Total articles: ${compiledArticles.length}`);
    console.log(`  Total words: ${totalWords}`);
    console.log(`  Average words per article: ${avgWordsPerArticle}`);
    
    // Test search functionality
    console.log('\n🔍 Testing search functionality...');
    const searchResults = await sql`
      SELECT slug, word_count, 
        ts_headline('english', plain_text, plainto_tsquery('english', 'AI'), 
          'MaxWords=10, MinWords=5') as snippet
      FROM compiled_articles 
      WHERE to_tsvector('english', plain_text) @@ plainto_tsquery('english', 'AI')
      ORDER BY ts_rank(to_tsvector('english', plain_text), plainto_tsquery('english', 'AI')) DESC
      LIMIT 3
    `;
    
    console.log('Search results for "AI":');
    for (const row of searchResults.rows || []) {
      console.log(`  - ${row.slug}: ${row.word_count} words`);
      console.log(`    "${row.snippet}"`);
    }
    
    console.log('\n✅ Compiled articles table populated successfully!');
    
  } catch (error) {
    if (error instanceof Error && error.message?.includes('missing_connection_string')) {
      console.error('❌ Database connection failed: No POSTGRES_URL found in environment');
      console.log('\n💡 To fix this:');
      console.log('1. Add POSTGRES_URL to your .env.local file');
      console.log('2. Or run this script in an environment with database access');
    } else {
      console.error('❌ Failed to populate compiled articles:', error);
    }
    throw error;
  }
}

// Run the script
if (require.main === module) {
  populateCompiledArticles()
    .then(() => {
      console.log('\n🎉 Database population completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Database population failed:', error);
      process.exit(1);
    });
}

export { populateCompiledArticles };
