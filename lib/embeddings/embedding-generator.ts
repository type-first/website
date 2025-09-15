/**
 * Main embedding generator for content
 */

import { writeFile } from 'fs/promises';
import path from 'path';
import yaml from 'yaml';
import { ContentChunker } from './content-chunker';
import { OpenAIEmbeddingProvider } from './providers/openai';
import type { ArticleEmbedding, ContentChunk, ChunkEmbedding } from './types';

export class EmbeddingGenerator {
  private chunker: ContentChunker;
  private provider: OpenAIEmbeddingProvider;

  constructor() {
    this.chunker = new ContentChunker();
    this.provider = new OpenAIEmbeddingProvider({
      apiKey: process.env.OPENAI_API_KEY || '',
      model: 'text-embedding-3-small',
    });
  }

  /**
   * Generate embeddings for article content
   */
  async generateForArticle(
    contentData: any,
    articlePath: string,
    articleSlug: string
  ): Promise<ArticleEmbedding> {
    console.log(`Generating embeddings for article: ${articleSlug}`);

    const startTime = Date.now();

    // Chunk the content by sections
    const chunks = this.chunker.chunkBySections(contentData.sections);

    console.log(`Created ${chunks.length} chunks from sections`);

    // Extract text content for embedding generation
    const texts = chunks.map((chunk: ContentChunk) => `${chunk.sectionTitle || ''}\n${chunk.content}`);

    // Generate embeddings for all chunks
    const embeddings = await this.provider.generateEmbeddings(texts);

    console.log(`Generated ${embeddings.length} embeddings`);

    // Combine chunks with their embeddings
    const chunkEmbeddings: ChunkEmbedding[] = chunks.map((chunk: ContentChunk, index: number) => ({
      chunk,
      embedding: {
        values: embeddings[index],
        dimension: this.provider.getDimension(),
        model: this.provider.getModelName(),
        createdAt: new Date().toISOString(),
      },
    }));

    const processingTime = Date.now() - startTime;
    const totalTokens = chunks.reduce((sum: number, chunk: ContentChunk) => sum + (chunk.tokenCount || 0), 0);

    const articleEmbedding: ArticleEmbedding = {
      articleId: articleSlug,
      title: contentData.metadata.title,
      generatedAt: new Date().toISOString(),
      model: {
        name: this.provider.getModelName(),
        provider: this.provider.getProviderName(),
        dimension: this.provider.getDimension(),
      },
      chunks: chunkEmbeddings,
      metadata: {
        totalChunks: chunks.length,
        totalTokens,
        processingTimeMs: processingTime,
      },
    };

    // Save to file
    await this.saveEmbeddingData(articleEmbedding, articlePath);

    return articleEmbedding;
  }

  /**
   * Save embedding data to YAML file
   */
  private async saveEmbeddingData(
    data: ArticleEmbedding,
    articlePath: string
  ): Promise<void> {
    const outputPath = path.join(articlePath, 'data.embedding.generated.yml');
    
    const yamlContent = yaml.stringify(data, {
      lineWidth: 0, // Prevent line wrapping
      blockQuote: 'literal', // Use literal block style for long strings
    });

    await writeFile(outputPath, yamlContent, 'utf8');
    console.log(`Saved embedding data to: ${outputPath}`);
  }

  /**
   * Load existing embedding data from file
   */
  async loadEmbeddingData(articlePath: string): Promise<ArticleEmbedding | null> {
    try {
      const filePath = path.join(articlePath, 'data.embedding.generated.yml');
      const fileContent = await import('fs/promises').then(fs => fs.readFile(filePath, 'utf8'));
      return yaml.parse(fileContent) as ArticleEmbedding;
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        return null; // File doesn't exist
      }
      throw error;
    }
  }

  /**
   * Check if embeddings need to be regenerated
   */
  async needsRegeneration(
    contentData: any,
    articlePath: string
  ): Promise<boolean> {
    const existingData = await this.loadEmbeddingData(articlePath);
    
    if (!existingData) {
      return true; // No existing embeddings
    }

    // Check if content has been updated since last generation
    const contentUpdatedAt = new Date(contentData.metadata.updatedAt);
    const embeddingsGeneratedAt = new Date(existingData.generatedAt);

    return contentUpdatedAt > embeddingsGeneratedAt;
  }
}
