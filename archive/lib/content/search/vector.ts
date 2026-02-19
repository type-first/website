/**
 * Vector search functionality using cosine similarity
 */

import type { GenericContentChunk } from '../content.model';
import type { VectorSearchResult, VectorSearchOptions } from './search.model';
import { 
  sortBySimilarity, 
  filterByMinSimilarity, 
  limitResults 
} from './search.utils';
import { loadEmbeddings, cosineSimilarity } from '../embeddings';
import { OpenAIEmbeddingProvider } from '../embeddings/providers/openai';

/**
 * Perform vector search using actual embedding vectors only
 * Returns empty array if no embeddings are available
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
      console.warn('OpenAI API key not configured - vector search unavailable');
      return [];
    }

    const embeddingProvider = new OpenAIEmbeddingProvider({ 
      apiKey: openaiApiKey 
    });
    
    const [queryEmbedding] = await embeddingProvider.generateEmbeddings([query]);
    
    // Only load embeddings for chunks that actually have embedding files
    // This will filter out chunks without embeddings
    const embeddedChunks = await loadEmbeddingsWithFilter(chunks);
    
    if (embeddedChunks.length === 0) {
      console.log('No chunks with embeddings found for vector search');
      return [];
    }
    
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
    console.error('Vector search failed:', error);
    return [];
  }
}

/**
 * Load embeddings only for chunks that have embedding files
 * Silently filters out chunks without embeddings instead of throwing errors
 */
async function loadEmbeddingsWithFilter(chunks: GenericContentChunk[]) {
  const embeddedChunks = [];
  
  for (const chunk of chunks) {
    try {
      const embeddedChunk = await loadEmbeddings([chunk]);
      embeddedChunks.push(embeddedChunk[0]);
    } catch (error) {
      // Silently skip chunks without embeddings
      console.log(`Skipping chunk ${chunk.id} - no embedding file found`);
    }
  }
  
  return embeddedChunks;
}

/**
 * For backwards compatibility - use the main vectorSearch function
 * @deprecated Use vectorSearch directly
 */
export const vectorSearchWithEmbeddings = vectorSearch;
