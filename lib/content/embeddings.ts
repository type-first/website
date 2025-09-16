/**
 * Embedding utilities for content chunks
 * Based on loadEmbeddings function from goal.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'yaml'
import type { 
  GenericContentChunk, 
  GenericEmbeddedContentChunk, 
  ContentChunk, 
  EmbeddedContentChunk,
  ContentKind 
} from './content.model'

// --- embedding loading

export const loadEmbeddings = async (
  chunks: readonly GenericContentChunk[]
): Promise<GenericEmbeddedContentChunk[]> => {
  return Promise.all(
    chunks.map(async chunk => {
      try {
        const ymlFp = path.resolve(chunk.vectorFp)
        
        if (!fs.existsSync(ymlFp)) {
          console.warn(`Embedding file not found: ${ymlFp}`)
          throw new Error(`Embedding file not found: ${ymlFp}`)
        }
        
        const text = fs.readFileSync(ymlFp, 'utf-8')
        const data = yaml.parse(text) as { embedding: number[] }
        
        if (!data.embedding || !Array.isArray(data.embedding)) {
          throw new Error(`Invalid embedding data in ${ymlFp}`)
        }
        
        return { ...chunk, embedding: data.embedding }
      } catch (error) {
        console.error(`Failed to load embedding for chunk ${chunk.label}:`, error)
        throw error
      }
    })
  )
}

export const loadSingleEmbedding = async (
  chunk: GenericContentChunk
): Promise<GenericEmbeddedContentChunk> => {
  const results = await loadEmbeddings([chunk])
  return results[0]
}

export const loadTypedEmbeddings = async <Kind extends ContentKind>(
  chunks: readonly ContentChunk<Kind>[]
): Promise<EmbeddedContentChunk<Kind>[]> => {
  const embedded = await loadEmbeddings(chunks)
  return embedded as EmbeddedContentChunk<Kind>[]
}

// --- embedding validation

export const validateEmbedding = (embedding: number[]): boolean => {
  return (
    Array.isArray(embedding) &&
    embedding.length > 0 &&
    embedding.every(value => typeof value === 'number' && !isNaN(value))
  )
}

export const validateEmbeddedChunk = (
  chunk: GenericEmbeddedContentChunk
): boolean => {
  return (
    'embedding' in chunk &&
    validateEmbedding(chunk.embedding)
  )
}

// --- embedding utilities

export const getEmbeddingDimension = (chunk: GenericEmbeddedContentChunk): number => {
  return chunk.embedding.length
}

export const normalizeEmbedding = (embedding: number[]): number[] => {
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
  return magnitude === 0 ? embedding : embedding.map(val => val / magnitude)
}

export const cosineSimilarity = (a: number[], b: number[]): number => {
  if (a.length !== b.length) {
    throw new Error('Embedding vectors must have the same dimension')
  }
  
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0
  }
  
  return dotProduct / (magnitudeA * magnitudeB)
}

// --- file path utilities

export const resolveVectorPath = (basePath: string, filename: string): string => {
  return path.resolve(basePath, filename)
}

export const createVectorFileName = (chunkId: string): string => {
  return `${chunkId}.vector.yml`
}
