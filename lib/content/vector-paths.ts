/**
 * Vector path utilities for content chunks
 * Centralizes vector file path resolution and management
 */

import path from 'path'

/**
 * Create a vector file path for a given content directory and filename
 * Uses relative paths to avoid build-time path resolution issues
 */
export function createVectorPath(contentDir: string, filename: string): string {
  // Use relative path from project root to avoid __dirname issues in builds
  return path.join(contentDir, 'vectors', filename + '.yml')
}

/**
 * Create vector path for article chunks
 */
export function createArticleVectorPath(articleSlug: string, filename: string): string {
  return createVectorPath(`content/articles/${articleSlug}`, filename)
}

/**
 * Create vector path for lab chunks
 */
export function createLabVectorPath(labSlug: string, filename: string): string {
  return createVectorPath(`content/labs/${labSlug}`, filename)
}

/**
 * Resolve vector path to absolute path for file system operations
 * Handles build-time path transformation issues
 */
export function resolveVectorPath(vectorPath: string): string {
  // Handle build-time transformation where __dirname becomes /ROOT/
  if (vectorPath.startsWith('/ROOT/')) {
    return vectorPath.replace('/ROOT/', process.cwd() + '/')
  }
  
  // Handle relative paths
  if (!path.isAbsolute(vectorPath)) {
    return path.resolve(process.cwd(), vectorPath)
  }
  
  return vectorPath
}
