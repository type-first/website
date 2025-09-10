#!/usr/bin/env npx tsx

/**
 * Generate embeddings for articles using semantic compilation
 * 
 * This script uses our new semantic article compiler to extract clean text
 * content and generate proper embeddings for search functionality.
 */

import { semanticArticleCompiler } from '../lib/article-compiler/semantic-compiler';
import { createContentPipeline, MockEmbeddingService } from '../lib/content/derivation';
import { Article } from '../lib/schemas/article';

async function generateSemanticEmbeddings() {
  console.log('🔄 Generating embeddings with semantic compilation...\n');
  
  try {
    // Compile all articles using semantic approach
    const compiledArticles = await semanticArticleCompiler.compileAllArticles();
    
    if (compiledArticles.length === 0) {
      console.log('❌ No articles found to process');
      return;
    }
    
    console.log(`\n📊 Compilation Summary:`);
    compiledArticles.forEach(article => {
      console.log(`  - ${article.slug}: ${article.wordCount} words (${article.readingTime} min)`);
    });
    
    // Initialize content pipeline with mock embedding service
    const contentPipeline = createContentPipeline();
    const embeddingService = new MockEmbeddingService();
    
    console.log('\n🧠 Generating embeddings...');
    
    // Process each compiled article
    for (const compiled of compiledArticles) {
      try {
        // Convert compiled article to Article format for content pipeline
        const article: Article = {
          id: compiled.slug, // Using slug as temporary ID
          title: compiled.metadata.title,
          slug: compiled.slug,
          description: compiled.metadata.description,
          content: [
            {
              id: 'main-content',
              type: 'text',
              content: compiled.markdown,
            }
          ],
          tags: compiled.metadata.tags,
          status: 'published' as const,
          publishedAt: compiled.metadata.publishedAt,
          authorId: compiled.metadata.author || 'system',
          coverImage: compiled.metadata.coverImage,
          seoTitle: compiled.metadata.seoTitle,
          seoDescription: compiled.metadata.seoDescription,
          canonicalUrl: undefined,
          createdAt: new Date(),
          updatedAt: compiled.lastCompiled,
        };
        
        // Generate embeddings
        await contentPipeline.deriveContent(article, {
          generateEmbeddings: true,
          embeddingService: embeddingService
        });
        
        console.log(`  ✅ ${compiled.slug}: Generated embeddings for ${compiled.wordCount} words`);
        
      } catch (error) {
        console.error(`  ❌ ${compiled.slug}: Failed to generate embeddings -`, error);
      }
    }
    
    console.log('\n🎉 Embedding generation completed!');
    
    // Show total stats
    const totalWords = compiledArticles.reduce((sum, article) => sum + article.wordCount, 0);
    const avgWordsPerArticle = Math.round(totalWords / compiledArticles.length);
    
    console.log(`\n📈 Final Statistics:`);
    console.log(`  Total articles: ${compiledArticles.length}`);
    console.log(`  Total words extracted: ${totalWords}`);
    console.log(`  Average words per article: ${avgWordsPerArticle}`);
    console.log(`  Estimated reading time: ${Math.ceil(totalWords / 200)} minutes`);
    
  } catch (error) {
    console.error('❌ Embedding generation failed:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  generateSemanticEmbeddings()
    .then(() => {
      console.log('\n✅ All embeddings generated successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Embedding generation failed:', error);
      process.exit(1);
    });
}

export { generateSemanticEmbeddings };
