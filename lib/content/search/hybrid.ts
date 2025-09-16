/**
 * Hybrid Search Implementation
 * Combines text and vector search results
 */

import type { GenericContentChunk } from '../content.model';
import type { HybridSearchOptions, HybridSearchResult } from './search.model';
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

  // Combine and deduplicate results while preserving their original types
  const seenChunkIds = new Set<string>();
  const combinedResults: HybridSearchResult[] = [];

  // Add text results first (higher weight)
  textResults.forEach(result => {
    if (!seenChunkIds.has(result.chunk.id)) {
      combinedResults.push({
        ...result,
        score: result.score * textWeight
      });
      seenChunkIds.add(result.chunk.id);
    }
  });

  // Add vector results that aren't already included
  vectorResults.forEach(result => {
    if (!seenChunkIds.has(result.chunk.id)) {
      combinedResults.push({
        ...result,
        score: result.similarity * vectorWeight
      });
      seenChunkIds.add(result.chunk.id);
    }
  });

  // Sort by weighted score and limit
  return combinedResults
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
