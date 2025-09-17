/**
 * Vector search functionality using cosine similarity
 */

import type { GenericContentChunk } from '../content.model';
import type { VectorSearchResult, VectorSearchOptions } from './search.model';
import { 
  textCosineSimilarity, 
  sortBySimilarity, 
  filterByMinSimilarity, 
  limitResults 
} from './search.utils';
import { loadEmbeddings, cosineSimilarity } from '../embeddings';
import { OpenAIEmbeddingProvider } from '../embeddings/providers/openai';

/**
 * Perform vector search using actual embedding vectors
 */
export async function vectorSearch(
  query: string,
  chunks: GenericContentChunk[],
  options: VectorSearchOptions = {}
): Promise<VectorSearchResult[]> {
  const { limit = 10, threshold = 0.1 } = options;
  
  try {
    // Generate query embedding
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      console.warn('OpenAI API key not configured, falling back to text search');
      return textBasedVectorSearch(query, chunks, options);
    }

    const embeddingProvider = new OpenAIEmbeddingProvider({ 
      apiKey: openaiApiKey 
    });
    
    const [queryEmbedding] = await embeddingProvider.generateEmbeddings([query]);
    
    // Load embeddings for chunks
    const embeddedChunks = await loadEmbeddings(chunks);
    
    // Calculate similarities
    const results: VectorSearchResult[] = embeddedChunks.map(chunk => {
      const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
      return {
        chunk,
        similarity,
        score: similarity,
        type: 'vector' as const,
      };
    });

    return limitResults(
      sortBySimilarity(
        filterByMinSimilarity(results, threshold)
      ),
      limit
    );
  } catch (error) {
    console.error('Embedding-based vector search failed:', error);
    // Fallback to text-based search
    return textBasedVectorSearch(query, chunks, options);
  }
}

/**
 * Fallback text-based vector search using word frequency vectors
 */
function textBasedVectorSearch(
  query: string,
  chunks: GenericContentChunk[],
  options: VectorSearchOptions = {}
): VectorSearchResult[] {
  const { limit = 10, threshold = 0.1 } = options;
  
  const results: VectorSearchResult[] = chunks.map(chunk => ({
    chunk,
    similarity: textCosineSimilarity(query, chunk.text),
    score: textCosineSimilarity(query, chunk.text), // For compatibility
    type: 'vector' as const,
  }));

  return limitResults(
    sortBySimilarity(
      filterByMinSimilarity(results, threshold)
    ),
    limit
  );
}

/**
 * Perform vector search using actual embedding vectors
 */
export async function vectorSearchWithEmbeddings(
  query: string,
  chunks: GenericContentChunk[],
  options: VectorSearchOptions = {}
): Promise<VectorSearchResult[]> {
  const { limit = 10, threshold = 0.05 } = options;
  
  try {
    // Generate query embedding
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      console.warn('OpenAI API key not configured, falling back to text search');
      return vectorSearch(query, chunks, options);
    }

    const embeddingProvider = new OpenAIEmbeddingProvider({ 
      apiKey: openaiApiKey 
    });
    
    const [queryEmbedding] = await embeddingProvider.generateEmbeddings([query]);
    
    // Load embeddings for chunks
    const embeddedChunks = await loadEmbeddings(chunks);
    
    // Calculate similarities
    const results: VectorSearchResult[] = embeddedChunks.map(chunk => {
      const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
      return {
        chunk,
        similarity,
        score: similarity,
        type: 'vector' as const,
      };
    });

    return limitResults(
      sortBySimilarity(
        filterByMinSimilarity(results, threshold)
      ),
      limit
    );
  } catch (error) {
    console.error('Embedding-based vector search failed:', error);
    // Fallback to text-based search
    return vectorSearch(query, chunks, options);
  }
}
