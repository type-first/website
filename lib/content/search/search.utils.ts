/**
 * Pure Search Utility Functions
 * Mathematical and algorithmic functions used by search
 */

// --- Vector Math Utilities ---

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(vector1: number[], vector2: number[]): number {
  if (vector1.length !== vector2.length) {
    throw new Error('Vectors must have the same length');
  }

  const dotProduct = vector1.reduce((sum, a, i) => sum + a * vector2[i], 0);
  const magnitude1 = Math.sqrt(vector1.reduce((sum, a) => sum + a * a, 0));
  const magnitude2 = Math.sqrt(vector2.reduce((sum, a) => sum + a * a, 0));

  if (magnitude1 === 0 || magnitude2 === 0) return 0;

  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Convert text to word frequency vector using a vocabulary
 */
export function textToVector(text: string, vocabulary: string[]): number[] {
  const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  return vocabulary.map(word => words.filter(w => w === word).length);
}

/**
 * Create vocabulary from multiple texts
 */
export function createVocabulary(...texts: string[]): string[] {
  const allWords = texts
    .flatMap(text => text.toLowerCase().split(/\s+/))
    .filter(word => word.length > 2);
  
  return Array.from(new Set(allWords));
}

/**
 * Calculate cosine similarity between two text strings using word vectors
 */
export function textCosineSimilarity(text1: string, text2: string): number {
  const vocabulary = createVocabulary(text1, text2);
  const vector1 = textToVector(text1, vocabulary);
  const vector2 = textToVector(text2, vocabulary);
  
  return cosineSimilarity(vector1, vector2);
}

// --- Text Search Utilities ---

/**
 * Normalize text for search (lowercase, remove extra spaces)
 */
export function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Extract search terms from query
 */
export function extractSearchTerms(query: string): string[] {
  return normalizeText(query)
    .split(/\s+/)
    .filter(term => term.length > 0);
}

/**
 * Count occurrences of a word in text
 */
export function countWordOccurrences(text: string, word: string): number {
  const normalizedText = normalizeText(text);
  const normalizedWord = normalizeText(word);
  
  // Use word boundaries to match whole words only
  const regex = new RegExp(`\\b${normalizedWord}\\b`, 'g');
  const matches = normalizedText.match(regex);
  
  return matches ? matches.length : 0;
}

/**
 * Calculate text similarity score based on word matches
 */
export function calculateTextScore(
  content: string,
  label: string,
  targetName: string,
  queryTerms: string[]
): number {
  let score = 0;
  
  queryTerms.forEach(term => {
    // Label matches get highest weight
    score += countWordOccurrences(label, term) * 10;
    
    // Target name matches get medium weight  
    score += countWordOccurrences(targetName, term) * 5;
    
    // Content matches get base weight
    score += countWordOccurrences(content, term) * 1;
  });
  
  return score;
}

// --- Array Utilities ---

/**
 * Sort array by score in descending order
 */
export function sortByScore<T extends { score: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.score - a.score);
}

/**
 * Sort array by similarity in descending order
 */
export function sortBySimilarity<T extends { similarity: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.similarity - a.similarity);
}

/**
 * Filter array by minimum score
 */
export function filterByMinScore<T extends { score: number }>(
  items: T[], 
  minScore: number
): T[] {
  return items.filter(item => item.score >= minScore);
}

/**
 * Filter array by minimum similarity
 */
export function filterByMinSimilarity<T extends { similarity: number }>(
  items: T[], 
  threshold: number
): T[] {
  return items.filter(item => item.similarity >= threshold);
}

/**
 * Limit array to maximum number of items
 */
export function limitResults<T>(items: T[], limit: number): T[] {
  return items.slice(0, limit);
}

// --- Search Result Utilities ---

/**
 * Combine and normalize scores from different search methods
 */
export function combineScores(
  textScore: number,
  vectorSimilarity: number,
  textWeight: number = 0.6,
  vectorWeight: number = 0.4
): number {
  // Normalize text score to 0-1 range (assuming max reasonable score is 100)
  const normalizedTextScore = Math.min(textScore / 100, 1);
  
  // Vector similarity is already 0-1
  const normalizedVectorScore = vectorSimilarity;
  
  return (normalizedTextScore * textWeight) + (normalizedVectorScore * vectorWeight);
}

/**
 * Deduplicate search results by chunk ID
 */
export function deduplicateResults<T extends { chunk: { id: string } }>(
  results: T[]
): T[] {
  const seen = new Set<string>();
  return results.filter(result => {
    if (seen.has(result.chunk.id)) {
      return false;
    }
    seen.add(result.chunk.id);
    return true;
  });
}
