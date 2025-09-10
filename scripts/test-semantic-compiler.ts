#!/usr/bin/env npx tsx

/**
 * Test script for the new semantic article compiler
 * 
 * This script tests our semantic component-based compilation approach
 * to verify we can extract rich text content from articles.
 */

import { semanticArticleCompiler } from '../lib/article-compiler/semantic-compiler';

async function testSemanticCompilation() {
  console.log('🔄 Testing semantic article compilation...\n');
  
  try {
    // Test compiling our sample article
    const article = await semanticArticleCompiler.compileArticle('ai-driven-interfaces-react');
    
    console.log('=== COMPILATION RESULTS ===');
    console.log(`Slug: ${article.slug}`);
    console.log(`Title: ${article.metadata.title}`);
    console.log(`Word Count: ${article.wordCount}`);
    console.log(`Reading Time: ${article.readingTime} minutes`);
    console.log(`Outline Sections: ${article.outline.length}`);
    
    console.log('\n=== PLAIN TEXT PREVIEW ===');
    console.log(article.plainText.substring(0, 500) + '...');
    
    console.log('\n=== MARKDOWN PREVIEW ===');
    console.log(article.markdown.substring(0, 500) + '...');
    
    console.log('\n=== OUTLINE ===');
    article.outline.forEach(item => {
      const indent = '  '.repeat(item.level - 1);
      console.log(`${indent}- ${item.title} (${item.id})`);
    });
    
    console.log('\n✅ Semantic compilation successful!');
    
    return article;
  } catch (error) {
    console.error('❌ Compilation failed:', error);
    throw error;
  }
}

// Run the test
if (require.main === module) {
  testSemanticCompilation()
    .then(() => {
      console.log('\n🎉 Test completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test failed:', error);
      process.exit(1);
    });
}

export { testSemanticCompilation };
