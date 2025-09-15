/**
 * Embeddings Types
 * Type definitions for content embeddings and chunking
 */

export interface ContentChunk {
  /** Unique identifier for the chunk */
  id: string;
  /** The text content of the chunk */
  content: string;
  /** Type of content chunk */
  type: 'metadata' | 'introduction' | 'section' | 'code' | 'footer';
  /** Section ID if this is a section chunk */
  sectionId?: string;
  /** Section title if this is a section chunk */
  sectionTitle?: string;
  /** Order/index of this chunk within the article */
  order: number;
  /** Token count estimate for the chunk */
  tokenCount?: number;
}

export interface EmbeddingVector {
  /** The embedding vector values */
  values: number[];
  /** Dimension of the embedding */
  dimension: number;
  /** Model used to generate the embedding */
  model: string;
  /** When the embedding was generated */
  createdAt: string;
}

export interface ChunkEmbedding {
  /** The content chunk */
  chunk: ContentChunk;
  /** The embedding vector for this chunk */
  embedding: EmbeddingVector;
}

export interface ArticleEmbedding {
  /** Article identifier/slug */
  articleId: string;
  /** Article title */
  title: string;
  /** When the embeddings were generated */
  generatedAt: string;
  /** Model configuration used */
  model: {
    name: string;
    provider: string;
    dimension: number;
  };
  /** All chunk embeddings for this article */
  chunks: ChunkEmbedding[];
  /** Metadata about the embedding process */
  metadata: {
    totalChunks: number;
    totalTokens: number;
    processingTimeMs: number;
  };
}

export interface EmbeddingConfig {
  /** OpenAI API configuration */
  openai?: {
    apiKey: string;
    model: string;
    maxTokens: number;
  };
  /** Alternative embedding providers */
  provider: 'openai' | 'anthropic' | 'local';
  /** Chunking configuration */
  chunking: {
    maxTokensPerChunk: number;
    overlapTokens: number;
    preserveCodeBlocks: boolean;
  };
}

export interface EmbeddingProvider {
  /** Generate embeddings for a list of text chunks */
  generateEmbeddings(texts: string[]): Promise<number[][]>;
  /** Get the dimension of embeddings from this provider */
  getDimension(): number;
  /** Get the model name */
  getModelName(): string;
  /** Get the provider name */
  getProviderName(): string;
}
