/**
 * Search Models and Types
 * All search-related types, interfaces, and pure data structures
 */

import type { GenericContentChunk, GenericEmbeddedContentChunk } from '../content.model';

// --- Base Search Interfaces ---

export interface SearchOptions {
  limit?: number;
  threshold?: number;
}

export interface TextSearchOptions extends SearchOptions {
  minScore?: number;
}

export interface VectorSearchOptions extends SearchOptions {
  threshold?: number;
}

export interface HybridSearchOptions extends SearchOptions {
  textWeight?: number;
  vectorWeight?: number;
  textMinScore?: number;
  vectorThreshold?: number;
}

// --- Search Result Types ---

export interface SearchResult<T = GenericContentChunk> {
  chunk: T;
  score: number;
}

export interface TextSearchResult {
  chunk: GenericContentChunk;
  score: number;
  type: 'text';
}

export interface VectorSearchResult {
  chunk: GenericContentChunk;
  score: number;
  similarity: number;
  type: 'vector';
}

// Hybrid search result is a discriminated union of text and vector results
export type HybridSearchResult = TextSearchResult | VectorSearchResult;

// --- Search Parameters ---

export interface SearchQuery {
  text: string;
  embedding?: number[];
  filters?: {
    tags?: string[];
    contentKind?: string[];
    minLength?: number;
    maxLength?: number;
  };
}

// --- Search Configuration ---

export interface SearchConfig {
  text: TextSearchOptions;
  vector: VectorSearchOptions;
  hybrid: HybridSearchOptions;
}

export const DEFAULT_SEARCH_CONFIG: SearchConfig = {
  text: {
    limit: 10,
    minScore: 1,
  },
  vector: {
    limit: 10,
    threshold: 0.1,
  },
  hybrid: {
    limit: 10,
    textWeight: 0.6,
    vectorWeight: 0.4,
    textMinScore: 1,
    vectorThreshold: 0.1,
  },
};

// --- Type Guards ---

export const isTextSearchResult = (result: SearchResult): result is TextSearchResult => {
  return 'type' in result && result.type === 'text';
};

export const isVectorSearchResult = (result: SearchResult): result is VectorSearchResult => {
  return 'type' in result && result.type === 'vector';
};

export const isHybridSearchResult = (result: SearchResult): result is HybridSearchResult => {
  return isTextSearchResult(result) || isVectorSearchResult(result);
};
