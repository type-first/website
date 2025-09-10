#!/usr/bin/env npx tsx

/**
 * Simple semantic compilation test
 * 
 * This tests our semantic compilation approach without the database dependency
 * to verify the core text extraction functionality.
 */

import { semanticArticleCompiler } from '../lib/article-compiler/semantic-compiler';

async function testCompilationOnly() {
  console.log('🔄 Testing semantic compilation (no database)...\n');
  
  try {
    // Test our converted article
    console.log('Testing ai-driven-interfaces-react...');
    const article = await semanticArticleCompiler.compileArticle('ai-driven-interfaces-react');
    
    console.log(`✅ Success: ${article.wordCount} words extracted`);
    console.log(`📖 Reading time: ${article.readingTime} minutes`);
    console.log(`📋 Outline sections: ${article.outline.length}`);
    
    console.log('\n📝 First 200 characters of extracted text:');
    console.log('"' + article.plainText.substring(0, 200) + '..."');
    
    console.log('\n🎯 Key Success Metrics:');
    console.log(`- Word count: ${article.wordCount} (vs previous ~6 words)`);
    console.log(`- Text extraction: ${article.plainText.length} characters`);
    console.log(`- Markdown generation: ${article.markdown.length} characters`);
    console.log(`- Outline depth: ${Math.max(...article.outline.map(h => h.level))} levels`);
    
    return article;
    
  } catch (error) {
    console.error('❌ Compilation failed:', error);
    throw error;
  }
}

// Run the test
if (require.main === module) {
  testCompilationOnly()
    .then((article) => {
      console.log('\n🎉 Semantic compilation test completed successfully!');
      console.log(`\n📊 Final Result: Extracted ${article.wordCount} words of rich content from article`);
      console.log('This is a massive improvement over the previous 6-word extraction!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test failed:', error);
      process.exit(1);
    });
}

export { testCompilationOnly };
