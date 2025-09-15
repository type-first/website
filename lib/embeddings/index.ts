/**
 * Embeddings Module
 * Main exports for the embeddings system
 */

export { EmbeddingGenerator } from './embedding-generator';
export { ContentChunker } from './content-chunker';
export { OpenAIEmbeddingProvider } from './providers/openai';

export type {
  ContentChunk,
  EmbeddingVector,
  ChunkEmbedding,
  ArticleEmbedding,
  EmbeddingConfig,
  EmbeddingProvider,
} from './types';
