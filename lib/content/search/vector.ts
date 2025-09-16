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

/**
 * Perform vector search on content chunks using text-based cosine similarity
 */
export function vectorSearch(
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
export function vectorSearchWithEmbeddings(
  queryEmbedding: number[],
  chunks: GenericContentChunk[],
  options: VectorSearchOptions = {}
): VectorSearchResult[] {
  const { limit = 10, threshold = 0.1 } = options;
  
  // This would be used when we have actual embeddings
  // For now, it's a placeholder that would need embedding data
  throw new Error('Embedding-based vector search not yet implemented. Use vectorSearch() instead.');
}
