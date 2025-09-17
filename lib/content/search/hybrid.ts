/**
 * Hybrid Search Implementation
 * Combines text and vector search results
 */

import type { GenericContentChunk } from '../content.model';
import type { HybridSearchOptions, HybridSearchResult, MergedSearchResult, TextSearchResult, VectorSearchResult } from './search.model';
import { textSearch } from './text';
import { vectorSearch } from './vector';

export async function hybridSearch(
  query: string,
  chunks: GenericContentChunk[],
  options: HybridSearchOptions = {}
): Promise<HybridSearchResult[]> {
  const {
    limit = 10,
    textWeight = 0.6,
    vectorWeight = 0.4,
    textMinScore = 0.1,
    vectorThreshold = 0.3,
  } = options;

  // Perform both searches in parallel
  const [textResults, vectorResults] = await Promise.all([
    Promise.resolve(textSearch(query, chunks, { minScore: textMinScore })),
    vectorSearch(query, chunks, { threshold: vectorThreshold })
  ]);

  // Create a map to track results by chunk ID
  const resultMap = new Map<string, {
    chunk: GenericContentChunk;
    textResult: TextSearchResult | null;
    vectorResult: VectorSearchResult | null;
  }>();

  // Add text results to the map
  textResults.forEach((result: TextSearchResult) => {
    const chunkId = result.chunk.id;
    if (!resultMap.has(chunkId)) {
      resultMap.set(chunkId, {
        chunk: result.chunk,
        textResult: result,
        vectorResult: null
      });
    } else {
      // This shouldn't happen with deduped results, but just in case
      const existing = resultMap.get(chunkId)!;
      existing.textResult = result;
    }
  });

  // Add vector results to the map
  vectorResults.forEach((result: VectorSearchResult) => {
    const chunkId = result.chunk.id;
    if (!resultMap.has(chunkId)) {
      resultMap.set(chunkId, {
        chunk: result.chunk,
        textResult: null,
        vectorResult: result
      });
    } else {
      // Merge with existing text result
      const existing = resultMap.get(chunkId)!;
      existing.vectorResult = result;
    }
  });

  // Convert map entries to final results
  const combinedResults: HybridSearchResult[] = Array.from(resultMap.values()).map(entry => {
    const { chunk, textResult, vectorResult } = entry;
    
    // If we have results from both methods, create a merged result
    if (textResult && vectorResult) {
      const combinedScore = (textResult.score * textWeight) + (vectorResult.similarity * vectorWeight);
      
      const mergedResult: MergedSearchResult = {
        chunk,
        score: combinedScore,
        text: textResult,
        vector: vectorResult,
        type: 'merged'
      };
      
      return mergedResult;
    }
    
    // If we only have text result, return it with adjusted weight
    if (textResult) {
      return {
        ...textResult,
        score: textResult.score * textWeight
      };
    }
    
    // If we only have vector result, return it with adjusted weight
    if (vectorResult) {
      return {
        ...vectorResult,
        score: vectorResult.similarity * vectorWeight
      };
    }
    
    // This shouldn't happen, but TypeScript needs it
    throw new Error('Invalid result state: no text or vector result found');
  });

  // Sort by combined score and limit
  return combinedResults
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
