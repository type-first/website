/**
 * Hybrid search functionality that combines text and vector search
 */

import type { GenericContentChunk } from '../content.model';
import type { HybridSearchResult, HybridSearchOptions } from './search.model';
import { textSearch } from './text';
import { vectorSearch } from './vector';
import { 
  combineScores, 
  deduplicateResults, 
  sortByScore, 
  limitResults 
} from './search.utils';

/**
 * Perform hybrid search combining text and vector search
 */
export function hybridSearch(
  query: string,
  chunks: GenericContentChunk[],
  options: HybridSearchOptions = {}
): HybridSearchResult[] {
  const {
    limit = 10,
    textWeight = 0.6,
    vectorWeight = 0.4,
    textMinScore = 1,
    vectorThreshold = 0.1,
  } = options;

  // Perform both searches
  const textResults = textSearch(query, chunks, { 
    limit: limit * 2, 
    minScore: textMinScore 
  });
  
  const vectorResults = vectorSearch(query, chunks, { 
    limit: limit * 2, 
    threshold: vectorThreshold 
  });

  // Combine results, merging duplicates
  const combinedResults = new Map<string, HybridSearchResult>();

  // Add text results
  textResults.forEach(result => {
    const chunkId = result.chunk.id;
    combinedResults.set(chunkId, {
      chunk: result.chunk,
      score: result.score,
      type: 'text',
      textScore: result.score,
    });
  });

  // Add vector results or enhance existing ones
  vectorResults.forEach(result => {
    const chunkId = result.chunk.id;
    
    if (combinedResults.has(chunkId)) {
      // Enhance existing result with vector data
      const existing = combinedResults.get(chunkId)!;
      existing.score = combineScores(
        existing.textScore || 0,
        result.similarity,
        textWeight,
        vectorWeight
      );
      existing.type = 'hybrid';
      existing.vectorScore = Math.round(result.similarity * 100);
      existing.similarity = result.similarity;
    } else {
      // Add as new vector result
      combinedResults.set(chunkId, {
        chunk: result.chunk,
        score: result.similarity * vectorWeight,
        type: 'vector',
        vectorScore: Math.round(result.similarity * 100),
        similarity: result.similarity,
      });
    }
  });

  // Return sorted and limited results
  const allResults = Array.from(combinedResults.values());
  
  return limitResults(
    sortByScore(allResults),
    limit
  );
}
