/**
 * Content Search Service
 * Main service for coordinating all search functionality
 */

import type { GenericContentChunk } from './content.model';
import { 
  textSearch,
  vectorSearch, 
  hybridSearch,
  type TextSearchOptions,
  type VectorSearchOptions, 
  type HybridSearchOptions,
  type TextSearchResult,
  type VectorSearchResult,
  type HybridSearchResult,
  type SearchConfig,
  DEFAULT_SEARCH_CONFIG
} from './search';

// --- search result types

export interface SearchResult<T = GenericContentChunk> {
  chunk: T
  score: number
}

export interface VectorSearchResult<T = GenericEmbeddedContentChunk> {
  chunk: T
  similarity: number
}

export interface TextSearchResult<T = GenericContentChunk> {
  chunk: T
  score: number
}

export interface HybridSearchResult<T = GenericEmbeddedContentChunk> {
  chunk: T
  score: number
  type: 'text' | 'vector'
  textScore?: number
  vectorScore?: number
  similarity?: number
}

// --- vector search

/**
 * Calculate text-based cosine similarity (fallback when no embeddings)
 */
export function calculateTextCosineSimilarity(text1: string, text2: string): number {
  // Convert texts to word frequency vectors
  const words1 = text1.toLowerCase().split(/\s+/).filter(word => word.length > 2)
  const words2 = text2.toLowerCase().split(/\s+/).filter(word => word.length > 2)
  
  // Create vocabulary (unique words from both texts)
  const vocabulary = new Set([...words1, ...words2])
  
  // Create frequency vectors
  const vector1 = Array.from(vocabulary).map(word => 
    words1.filter(w => w === word).length
  )
  const vector2 = Array.from(vocabulary).map(word => 
    words2.filter(w => w === word).length
  )
  
  return cosineSimilarity(vector1, vector2)
}

/**
 * Convert query text to embedding vector (placeholder - would use real embedding API)
 */
async function queryToEmbedding(query: string): Promise<number[]> {
  // TODO: Implement actual embedding generation for queries
  // For now, return a dummy vector - this would call OpenAI/etc in production
  return new Array(1536).fill(0).map(() => Math.random() - 0.5)
}

/**
 * Perform vector search on embedded content chunks
 */
export async function vectorSearch<T extends GenericEmbeddedContentChunk>(
  query: string,
  chunks: readonly T[],
  options: {
    limit?: number
    threshold?: number
    useTextFallback?: boolean
  } = {}
): Promise<VectorSearchResult<T>[]> {
  const { limit = 10, threshold = 0.1, useTextFallback = true } = options
  
  // Get query embedding (in production, this would call an embedding API)
  let queryEmbedding: number[]
  try {
    queryEmbedding = await queryToEmbedding(query)
  } catch (error) {
    if (useTextFallback) {
      // Fall back to text-based similarity
      return chunks
        .map(chunk => ({
          chunk,
          similarity: calculateTextCosineSimilarity(query, chunk.text)
        }))
        .filter(result => result.similarity >= threshold)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit)
    }
    throw error
  }
  
  return chunks
    .map(chunk => ({
      chunk,
      similarity: cosineSimilarity(queryEmbedding, chunk.embedding)
    }))
    .filter(result => result.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
}

/**
 * Synchronous vector search using text-based cosine similarity
 */
export function vectorSearchSync<T extends GenericContentChunk>(
  query: string,
  chunks: readonly T[],
  options: {
    limit?: number
    threshold?: number
  } = {}
): VectorSearchResult<T>[] {
  const { limit = 10, threshold = 0.1 } = options
  
  return chunks
    .map(chunk => ({
      chunk,
      similarity: calculateTextCosineSimilarity(query, chunk.text)
    }))
    .filter(result => result.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
}

// --- text search

/**
 * Perform text search on content chunks using exact word matching
 */
export function textSearch<T extends GenericContentChunk>(
  query: string,
  chunks: readonly T[],
  options: {
    limit?: number
    minScore?: number
  } = {}
): TextSearchResult<T>[] {
  const { limit = 10, minScore = 1 } = options
  
  const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 0)
  
  return chunks
    .map(chunk => {
      const content = chunk.text.toLowerCase()
      const label = chunk.label.toLowerCase()
      const targetName = chunk.target.name.toLowerCase()
      
      let score = 0
      queryWords.forEach(word => {
        // Chunk label matches get highest score
        if (label.includes(word)) score += 15
        // Target name matches get high score  
        if (targetName.includes(word)) score += 10
        // Content matches
        const contentMatches = (content.match(new RegExp(word, 'g')) || []).length
        score += contentMatches * 2
        // Tag matches
        if (chunk.tags.some(tag => tag.toLowerCase().includes(word))) {
          score += 8
        }
      })

      return { chunk, score }
    })
    .filter(result => result.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

// --- hybrid search

/**
 * Perform hybrid search combining text and vector search
 */
export async function hybridSearch<T extends GenericEmbeddedContentChunk>(
  query: string,
  chunks: readonly T[],
  options: {
    limit?: number
    textWeight?: number
    vectorWeight?: number
    textMinScore?: number
    vectorThreshold?: number
  } = {}
): Promise<HybridSearchResult<T>[]> {
  const {
    limit = 10,
    textWeight = 0.3,
    vectorWeight = 0.7,
    textMinScore = 1,
    vectorThreshold = 0.1,
  } = options

  // Perform both searches
  const textResults = textSearch(query, chunks, { 
    limit: limit * 2, 
    minScore: textMinScore 
  })
  
  const vectorResults = await vectorSearch(query, chunks, { 
    limit: limit * 2, 
    threshold: vectorThreshold 
  })

  // Combine results, marking each with its search type
  const combinedResults = new Map<string, HybridSearchResult<T>>()

  // Add text results
  textResults.forEach(({ chunk, score }) => {
    const chunkId = `${chunk.target.slug}:${chunk.label}`
    const normalizedScore = score / 100 // Normalize to 0-1
    combinedResults.set(chunkId, {
      chunk,
      score: normalizedScore * textWeight,
      type: 'text',
      textScore: score,
    })
  })

  // Add vector results
  vectorResults.forEach(({ chunk, similarity }) => {
    const chunkId = `${chunk.target.slug}:${chunk.label}`
    const vectorScore = Math.round(similarity * 100)
    
    if (combinedResults.has(chunkId)) {
      // If we already have this chunk from text search, combine scores
      // but keep it as a text result (since text found it first)
      const existing = combinedResults.get(chunkId)!
      existing.score += similarity * vectorWeight
      existing.vectorScore = vectorScore
      existing.similarity = similarity
    } else {
      // Add as new vector result
      combinedResults.set(chunkId, {
        chunk,
        score: similarity * vectorWeight,
        type: 'vector',
        vectorScore: vectorScore,
        similarity,
      })
    }
  })

  // Return sorted results
  return Array.from(combinedResults.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/**
 * Synchronous hybrid search using text-based similarity
 */
export function hybridSearchSync<T extends GenericContentChunk>(
  query: string,
  chunks: readonly T[],
  options: {
    limit?: number
    textWeight?: number
    vectorWeight?: number
    textMinScore?: number
    vectorThreshold?: number
  } = {}
): HybridSearchResult<T>[] {
  const {
    limit = 10,
    textWeight = 0.3,
    vectorWeight = 0.7,
    textMinScore = 1,
    vectorThreshold = 0.1,
  } = options

  // Perform both searches
  const textResults = textSearch(query, chunks, { 
    limit: limit * 2, 
    minScore: textMinScore 
  })
  
  const vectorResults = vectorSearchSync(query, chunks, { 
    limit: limit * 2, 
    threshold: vectorThreshold 
  })

  // Combine results the same way as async version
  const combinedResults = new Map<string, HybridSearchResult<T>>()

  textResults.forEach(({ chunk, score }) => {
    const chunkId = `${chunk.target.slug}:${chunk.label}`
    const normalizedScore = score / 100
    combinedResults.set(chunkId, {
      chunk,
      score: normalizedScore * textWeight,
      type: 'text',
      textScore: score,
    })
  })

  vectorResults.forEach(({ chunk, similarity }) => {
    const chunkId = `${chunk.target.slug}:${chunk.label}`
    const vectorScore = Math.round(similarity * 100)
    
    if (combinedResults.has(chunkId)) {
      const existing = combinedResults.get(chunkId)!
      existing.score += similarity * vectorWeight
      existing.vectorScore = vectorScore
      existing.similarity = similarity
    } else {
      combinedResults.set(chunkId, {
        chunk,
        score: similarity * vectorWeight,
        type: 'vector',
        vectorScore: vectorScore,
        similarity,
      })
    }
  })

  return Array.from(combinedResults.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
