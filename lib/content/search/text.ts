/**
 * Text search functionality using exact word matching
 */

import type { GenericContentChunk } from '../content.model';
import type { TextSearchResult, TextSearchOptions } from './search.model';
import { 
  extractSearchTerms, 
  calculateTextScore, 
  sortByScore, 
  filterByMinScore, 
  limitResults 
} from './search.utils';

/**
 * Perform text search on content chunks using exact word matching
 */
export function textSearch(
  query: string,
  chunks: GenericContentChunk[],
  options: TextSearchOptions = {}
): TextSearchResult[] {
  const { limit = 10, minScore = 1 } = options;
  
  const queryTerms = extractSearchTerms(query);
  
  const results: TextSearchResult[] = chunks.map(chunk => {
    const score = calculateTextScore(
      chunk.text,
      chunk.label,
      chunk.target.name,
      queryTerms
    );
    
    // Add tag matching bonus
    let tagBonus = 0;
    queryTerms.forEach(term => {
      if (chunk.tags.some(tag => tag.toLowerCase().includes(term.toLowerCase()))) {
        tagBonus += 8;
      }
    });

    return {
      chunk,
      score: score + tagBonus,
      type: 'text' as const,
    };
  });

  return limitResults(
    sortByScore(
      filterByMinScore(results, minScore)
    ),
    limit
  );
}
