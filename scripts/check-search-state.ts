#!/usr/bin/env npx tsx

/**
 * Check current search database state and show the difference
 */

import { sql } from '@vercel/postgres';
import { semanticArticleCompiler } from '../lib/article-compiler/semantic-compiler';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function checkSearchState() {
  console.log('🔍 CHECKING CURRENT SEARCH DATABASE STATE\n');
  
  try {
    // Check if database is accessible
    await sql`SELECT 1`;
    console.log('✅ Database connection successful\n');
    
    // Check current compiled_articles state
    console.log('📊 CURRENT DATABASE STATE:');
    const currentData = await sql`
      SELECT slug, word_count, LENGTH(plain_text) as text_length,
        LEFT(plain_text, 100) as sample_text
      FROM compiled_articles 
      ORDER BY word_count DESC
      LIMIT 5
    `;
    
    if (currentData.rows?.length === 0) {
      console.log('❌ compiled_articles table is EMPTY');
      console.log('   This explains why search isn\'t working well!\n');
    } else {
      console.log('Current articles in database:');
      for (const row of currentData.rows || []) {
        console.log(`  - ${row.slug}: ${row.word_count} words, ${row.text_length} chars`);
        console.log(`    Sample: "${row.sample_text}..."`);
      }
    }
    
    // Show what our semantic compiler would produce
    console.log('\n🚀 WHAT OUR SEMANTIC COMPILER PRODUCES:');
    try {
      const semanticResult = await semanticArticleCompiler.compileArticle('ai-driven-interfaces-react');
      console.log(`  - ${semanticResult.slug}: ${semanticResult.wordCount} words, ${semanticResult.plainText.length} chars`);
      console.log(`    Sample: "${semanticResult.plainText.substring(0, 100)}..."`);
      
      // Calculate improvement
      const avgCurrentWords = currentData.rows?.length > 0 
        ? Math.round(currentData.rows.reduce((sum: number, row: any) => sum + (row.word_count || 0), 0) / currentData.rows.length)
        : 0;
        
      if (avgCurrentWords > 0) {
        const improvement = Math.round((semanticResult.wordCount / avgCurrentWords) * 100);
        console.log(`\n💡 IMPROVEMENT: ${improvement}% more words per article!`);
      }
      
    } catch (error) {
      console.log('❌ Could not test semantic compilation:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    console.log('\n🔧 TO SEE THE DIFFERENCE:');
    console.log('1. Run: npx tsx scripts/populate-compiled-articles.ts');
    console.log('2. This will populate the database with our improved semantic extraction');
    console.log('3. Then test search again to see dramatically better results!');
    
  } catch (error) {
    if (error instanceof Error && error.message?.includes('missing_connection_string')) {
      console.log('❌ NO DATABASE CONNECTION');
      console.log('   POSTGRES_URL not found in environment');
      console.log('\n💡 The search interface is probably using fallback/mock data');
      console.log('   That\'s why you\'re not seeing the improvement yet!\n');
      
      console.log('🔧 TO FIX THIS:');
      console.log('1. Set up a database and add POSTGRES_URL to .env.local');
      console.log('2. Run database migrations');
      console.log('3. Populate with our semantic compilation');
      console.log('4. Then you\'ll see the dramatic search improvement!');
      
      // Show what the improvement would be
      console.log('\n🚀 SEMANTIC COMPILATION PREVIEW:');
      try {
        const result = await semanticArticleCompiler.compileArticle('ai-driven-interfaces-react');
        console.log(`✅ Our semantic approach extracts ${result.wordCount} words vs ~6 words before`);
        console.log(`   That's a ${Math.round((result.wordCount - 6) / 6 * 100)}% improvement!`);
      } catch (compileError) {
        console.log('❌ Could not test semantic compilation');
      }
    } else {
      console.error('❌ Database check failed:', error);
    }
  }
}

// Run the check
if (require.main === module) {
  checkSearchState()
    .then(() => {
      console.log('\n✅ Database state check completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Check failed:', error);
      process.exit(1);
    });
}

export { checkSearchState };
