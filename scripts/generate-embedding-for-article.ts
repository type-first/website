#!/usr/bin/env ts-node

/**
 * Script to generate embeddings for a specific article
 * Usage: npx ts-node scripts/generate-embedding-for-article.ts <article-slug>
 */

import path from 'path';
import { EmbeddingGenerator } from '../lib/embeddings/embedding-generator';

async function main() {
  const articleSlug = process.argv[2];
  
  if (!articleSlug) {
    console.error('Usage: npx ts-node scripts/generate-embedding-for-article.ts <article-slug>');
    console.error('Example: npx ts-node scripts/generate-embedding-for-article.ts advanced-typescript-patterns-react');
    process.exit(1);
  }

  // Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY environment variable is required');
    process.exit(1);
  }

  try {
    const articlePath = path.join(process.cwd(), 'content', 'articles', articleSlug);
    
    // Import the article content data
    const contentDataModule = await import(`${articlePath}/data.ts`);
    const contentData = contentDataModule.articleContentData;
    
    if (!contentData) {
      console.error(`Error: Could not find articleContentData in ${articlePath}/data.ts`);
      process.exit(1);
    }

    const generator = new EmbeddingGenerator();
    
    // Check if regeneration is needed
    const needsRegeneration = await generator.needsRegeneration(contentData, articlePath);
    
    if (!needsRegeneration) {
      console.log('Embeddings are up to date, skipping generation');
      return;
    }

    console.log(`Generating embeddings for article: ${articleSlug}`);
    console.log(`Article path: ${articlePath}`);
    console.log(`Title: ${contentData.metadata.title}`);
    
    // Generate embeddings
    const result = await generator.generateForArticle(contentData, articlePath, articleSlug);
    
    console.log('\n✅ Embedding generation completed successfully!');
    console.log(`📊 Generated ${result.chunks.length} chunk embeddings`);
    console.log(`🕐 Processing time: ${result.metadata.processingTimeMs}ms`);
    console.log(`📝 Total tokens: ${result.metadata.totalTokens}`);
    console.log(`💾 Saved to: ${articlePath}/data.embedding.generated.yml`);
    
  } catch (error) {
    console.error('Error generating embeddings:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
