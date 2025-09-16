/**
 * Embedding Types for Content System
 */

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

export interface EmbeddingData {
  id: string;
  label: string;
  tags: string[];
  textLength: number;
  embedding: number[];
  model: string;
  generatedAt: string;
  target: {
    kind: string;
    slug: string;
    name: string;
  };
}
