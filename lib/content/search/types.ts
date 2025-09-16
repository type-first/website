/**
 * Search result types
 */

import type { GenericContentChunk } from '../content.model';

export interface VectorSearchResult {
  chunk: GenericContentChunk;
  similarity: number;
}
