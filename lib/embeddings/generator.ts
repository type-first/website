/**
 * Embedding Generator
 * Main service for generating and managing content embeddings
 */

import { writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import yaml from 'yaml';
import type { 
  ArticleEmbedding, 
  ChunkEmbedding, 
  EmbeddingProvider,
  EmbeddingConfig 
} from './types';
import { ContentChunker, type ArticleContent } from './chunker';

export class EmbeddingGenerator {
  private provider: EmbeddingProvider;
  private chunker: ContentChunker;
  private config: EmbeddingConfig;

  constructor(provider: EmbeddingProvider, config: Partial<EmbeddingConfig> = {}) {
    this.provider = provider;
    this.config = {
      provider: 'openai',
      chunking: {
        maxTokensPerChunk: 512,
        overlapTokens: 50,
        preserveCodeBlocks: true,
      },
      ...config,
    };
    
    this.chunker = new ContentChunker({
      maxTokensPerChunk: this.config.chunking.maxTokensPerChunk,
      preserveCodeBlocks: this.config.chunking.preserveCodeBlocks,
    });
  }

  /**
   * Generate embeddings for an article
   */
  async generateArticleEmbeddings(
    articleId: string,
    content: ArticleContent
  ): Promise<ArticleEmbedding> {
    const startTime = Date.now();
    
    console.log(`🔄 Generating embeddings for article: ${articleId}`);
    
    // 1. Chunk the content
    const chunks = this.chunker.chunkArticle(articleId, content);
    console.log(`📝 Created ${chunks.length} chunks`);
    
    // 2. Extract text content for embedding
    const texts = chunks.map(chunk => chunk.content);
    
    // 3. Log estimated cost and tokens
    const totalTokens = chunks.reduce((sum, chunk) => sum + (chunk.tokenCount ?? 0), 0);
    console.log(`🔢 Total estimated tokens: ${totalTokens}`);
    
    if (this.provider.getProviderName() === 'openai' && 'estimateCost' in this.provider) {
      const estimatedCost = (this.provider as any).estimateCost(texts);
      console.log(`💰 Estimated cost: $${estimatedCost.toFixed(4)}`);
    }
    
    // 4. Generate embeddings
    console.log(`🤖 Generating embeddings using ${this.provider.getModelName()}...`);
    const embeddings = await this.provider.generateEmbeddings(texts);
    
    if (embeddings.length !== chunks.length) {
      throw new Error(`Embedding count mismatch: expected ${chunks.length}, got ${embeddings.length}`);
    }
    
    // 5. Combine chunks with embeddings
    const chunkEmbeddings: ChunkEmbedding[] = chunks.map((chunk, index) => ({
      chunk,
      embedding: {
        values: embeddings[index],
        dimension: this.provider.getDimension(),
        model: this.provider.getModelName(),
        createdAt: new Date().toISOString(),
      },
    }));
    
    const processingTime = Date.now() - startTime;
    
    const articleEmbedding: ArticleEmbedding = {
      articleId,
      title: content.metadata.title,
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
    
    console.log(`✅ Generated embeddings in ${processingTime}ms`);
    return articleEmbedding;
  }

  /**
   * Save embeddings to a YAML file
   */
  async saveEmbeddings(
    articleEmbedding: ArticleEmbedding,
    outputPath: string
  ): Promise<void> {
    try {
      // Create a simplified structure for YAML output
      const yamlData = {
        articleId: articleEmbedding.articleId,
        title: articleEmbedding.title,
        generatedAt: articleEmbedding.generatedAt,
        model: articleEmbedding.model,
        metadata: articleEmbedding.metadata,
        chunks: articleEmbedding.chunks.map(chunkEmbedding => ({
          chunk: {
            id: chunkEmbedding.chunk.id,
            type: chunkEmbedding.chunk.type,
            sectionId: chunkEmbedding.chunk.sectionId,
            sectionTitle: chunkEmbedding.chunk.sectionTitle,
            order: chunkEmbedding.chunk.order,
            tokenCount: chunkEmbedding.chunk.tokenCount,
            contentPreview: chunkEmbedding.chunk.content.slice(0, 100) + '...',
          },
          embedding: {
            dimension: chunkEmbedding.embedding.dimension,
            model: chunkEmbedding.embedding.model,
            createdAt: chunkEmbedding.embedding.createdAt,
            // Store actual embedding values in a separate field for readability
            values: chunkEmbedding.embedding.values,
          },
        })),
      };

      const yamlString = yaml.stringify(yamlData, {
        indent: 2,
        lineWidth: 0, // Disable line wrapping for long arrays
      });

      await writeFile(outputPath, yamlString, 'utf-8');
      console.log(`💾 Saved embeddings to: ${outputPath}`);
    } catch (error) {
      console.error('Error saving embeddings:', error);
      throw error;
    }
  }

  /**
   * Load embeddings from a YAML file
   */
  async loadEmbeddings(filePath: string): Promise<ArticleEmbedding | null> {
    try {
      if (!existsSync(filePath)) {
        return null;
      }

      const yamlContent = await readFile(filePath, 'utf-8');
      const data = yaml.parse(yamlContent);

      // Reconstruct the full ArticleEmbedding structure
      const articleEmbedding: ArticleEmbedding = {
        articleId: data.articleId,
        title: data.title,
        generatedAt: data.generatedAt,
        model: data.model,
        metadata: data.metadata,
        chunks: data.chunks.map((item: any) => ({
          chunk: {
            id: item.chunk.id,
            content: '', // Content is not stored in YAML, would need to be reconstructed
            type: item.chunk.type,
            sectionId: item.chunk.sectionId,
            sectionTitle: item.chunk.sectionTitle,
            order: item.chunk.order,
            tokenCount: item.chunk.tokenCount,
          },
          embedding: {
            values: item.embedding.values,
            dimension: item.embedding.dimension,
            model: item.embedding.model,
            createdAt: item.embedding.createdAt,
          },
        })),
      };

      return articleEmbedding;
    } catch (error) {
      console.error('Error loading embeddings:', error);
      return null;
    }
  }

  /**
   * Check if embeddings need to be regenerated
   */
  async shouldRegenerateEmbeddings(
    filePath: string,
    contentLastModified: Date
  ): Promise<boolean> {
    const existingEmbeddings = await this.loadEmbeddings(filePath);
    
    if (!existingEmbeddings) {
      return true; // No embeddings exist
    }

    const embeddingDate = new Date(existingEmbeddings.generatedAt);
    
    // Regenerate if content is newer than embeddings
    if (contentLastModified > embeddingDate) {
      return true;
    }

    // Regenerate if model has changed
    const currentModel = this.provider.getModelName();
    if (existingEmbeddings.model.name !== currentModel) {
      return true;
    }

    return false;
  }
}
