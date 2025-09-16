/**
 * Article search registry
 * Backend-focused registry with flattened sections for search functionality
 * No UI components, includes embeddings and search-optimized content
 */

import type { SearchableArticleSection, ArticleMetadata, EmbeddableChunk } from './models';

/**
 * Registry for searchable article sections (backend)
 * Flat structure with embedded content and embeddings
 */
class ArticleSearchRegistry {
  private sections = new Map<string, SearchableArticleSection>();
  private sectionsByArticle = new Map<string, string[]>();

  /**
   * Register article sections for search
   */
  registerArticleSections(
    articleMetadata: ArticleMetadata,
    embeddableChunks: EmbeddableChunk[],
    markdownContent: string,
    embeddings?: Array<{
      values: number[];
      dimension: number;
      model: string;
      createdAt: string;
    }>
  ): void {
    const sectionIds: string[] = [];

    embeddableChunks.forEach((chunk, index) => {
      const sectionKey = `${articleMetadata.slug}:${chunk.id}`;
      
      // Convert markdown to plain text (simple implementation)
      const textContent = chunk.text
        .replace(/#{1,6}\s+/g, '') // Remove headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1') // Remove italic
        .replace(/`(.*?)`/g, '$1') // Remove inline code
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
        .replace(/\n+/g, ' ') // Replace newlines with spaces
        .trim();

      const section: SearchableArticleSection = {
        sectionId: sectionKey,
        sectionTitle: chunk.title || chunk.type,
        sectionType: chunk.type,
        sectionOrder: index,
        articleMetadata,
        markdownContent: chunk.text,
        textContent,
        embedding: embeddings?.[index],
        searchMetadata: {
          hasCodeSnippet: 'codeSnippet' in chunk.metadata,
          hasPractices: 'practices' in chunk.metadata,
          contentLength: chunk.text.length,
          estimatedTokens: Math.ceil(chunk.text.length / 4),
        },
      };

      this.sections.set(sectionKey, section);
      sectionIds.push(sectionKey);
    });

    this.sectionsByArticle.set(articleMetadata.slug, sectionIds);
  }

  /**
   * Get all searchable sections
   */
  getAllSections(): SearchableArticleSection[] {
    return Array.from(this.sections.values());
  }

  /**
   * Get sections by article slug
   */
  getSectionsByArticle(articleSlug: string): SearchableArticleSection[] {
    const sectionIds = this.sectionsByArticle.get(articleSlug) || [];
    return sectionIds.map(id => this.sections.get(id)!).filter(Boolean);
  }

  /**
   * Get section by ID
   */
  getSectionById(sectionId: string): SearchableArticleSection | undefined {
    return this.sections.get(sectionId);
  }

  /**
   * Text search across all sections
   */
  textSearch(query: string, options: {
    limit?: number;
    articleSlug?: string;
    sectionType?: SearchableArticleSection['sectionType'];
  } = {}): SearchableArticleSection[] {
    const { limit = 10, articleSlug, sectionType } = options;
    const lowercaseQuery = query.toLowerCase();

    let sections = this.getAllSections();

    // Filter by article if specified
    if (articleSlug) {
      sections = this.getSectionsByArticle(articleSlug);
    }

    // Filter by section type if specified
    if (sectionType) {
      sections = sections.filter(section => section.sectionType === sectionType);
    }

    // Search in content
    const results = sections
      .filter(section =>
        section.textContent.toLowerCase().includes(lowercaseQuery) ||
        section.sectionTitle.toLowerCase().includes(lowercaseQuery) ||
        section.articleMetadata.title.toLowerCase().includes(lowercaseQuery) ||
        section.articleMetadata.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
      .sort((a, b) => {
        // Simple relevance scoring
        const aScore = this.calculateRelevanceScore(a, lowercaseQuery);
        const bScore = this.calculateRelevanceScore(b, lowercaseQuery);
        return bScore - aScore;
      })
      .slice(0, limit);

    return results;
  }

  /**
   * Vector search using embeddings
   */
  vectorSearch(
    queryEmbedding: number[],
    options: {
      limit?: number;
      threshold?: number;
      articleSlug?: string;
      sectionType?: SearchableArticleSection['sectionType'];
    } = {}
  ): Array<SearchableArticleSection & { similarity: number }> {
    const { limit = 10, threshold = 0.7, articleSlug, sectionType } = options;

    let sections = this.getAllSections().filter(section => section.embedding);

    // Filter by article if specified
    if (articleSlug) {
      sections = this.getSectionsByArticle(articleSlug).filter(section => section.embedding);
    }

    // Filter by section type if specified
    if (sectionType) {
      sections = sections.filter(section => section.sectionType === sectionType);
    }

    // Calculate similarities
    const results = sections
      .map(section => ({
        ...section,
        similarity: this.calculateCosineSimilarity(queryEmbedding, section.embedding!.values),
      }))
      .filter(result => result.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return results;
  }

  /**
   * Hybrid search combining text and vector search
   */
  hybridSearch(
    query: string,
    queryEmbedding?: number[],
    options: {
      limit?: number;
      textWeight?: number;
      vectorWeight?: number;
      threshold?: number;
      articleSlug?: string;
      sectionType?: SearchableArticleSection['sectionType'];
    } = {}
  ): Array<SearchableArticleSection & { score: number; textScore?: number; vectorScore?: number }> {
    const {
      limit = 10,
      textWeight = 0.5,
      vectorWeight = 0.5,
      threshold = 0.3,
      articleSlug,
      sectionType,
    } = options;

    // Get text search results
    const textResults = this.textSearch(query, { limit: limit * 2, articleSlug, sectionType });
    const textScores = new Map<string, number>();
    
    textResults.forEach((section, index) => {
      const score = Math.max(0, 1 - index / textResults.length);
      textScores.set(section.sectionId, score);
    });

    // Get vector search results if embedding provided
    let vectorScores = new Map<string, number>();
    if (queryEmbedding) {
      const vectorResults = this.vectorSearch(queryEmbedding, { limit: limit * 2, threshold: 0, articleSlug, sectionType });
      vectorResults.forEach(result => {
        vectorScores.set(result.sectionId, result.similarity);
      });
    }

    // Combine all sections that appear in either search
    const allSectionIds = new Set([
      ...textScores.keys(),
      ...vectorScores.keys(),
    ]);

    const hybridResults = Array.from(allSectionIds)
      .map(sectionId => {
        const section = this.sections.get(sectionId)!;
        const textScore = textScores.get(sectionId) || 0;
        const vectorScore = vectorScores.get(sectionId) || 0;
        const combinedScore = (textScore * textWeight) + (vectorScore * vectorWeight);

        return {
          ...section,
          score: combinedScore,
          textScore: textScore || undefined,
          vectorScore: vectorScore || undefined,
        };
      })
      .filter(result => result.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return hybridResults;
  }

  /**
   * Get sections with embeddings
   */
  getSectionsWithEmbeddings(): SearchableArticleSection[] {
    return this.getAllSections().filter(section => section.embedding);
  }

  /**
   * Get search statistics
   */
  getSearchStats(): {
    totalSections: number;
    sectionsWithEmbeddings: number;
    totalArticles: number;
    avgSectionLength: number;
    sectionTypeDistribution: Record<string, number>;
  } {
    const sections = this.getAllSections();
    const sectionTypeDistribution: Record<string, number> = {};

    sections.forEach(section => {
      sectionTypeDistribution[section.sectionType] = 
        (sectionTypeDistribution[section.sectionType] || 0) + 1;
    });

    return {
      totalSections: sections.length,
      sectionsWithEmbeddings: this.getSectionsWithEmbeddings().length,
      totalArticles: this.sectionsByArticle.size,
      avgSectionLength: sections.reduce((sum, s) => sum + s.searchMetadata.contentLength, 0) / sections.length,
      sectionTypeDistribution,
    };
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.sections.clear();
    this.sectionsByArticle.clear();
  }

  /**
   * Calculate relevance score for text search
   */
  private calculateRelevanceScore(section: SearchableArticleSection, query: string): number {
    let score = 0;
    const queryWords = query.toLowerCase().split(/\s+/);

    queryWords.forEach(word => {
      // Title matches are worth more
      if (section.sectionTitle.toLowerCase().includes(word)) score += 3;
      if (section.articleMetadata.title.toLowerCase().includes(word)) score += 2;
      
      // Content matches
      const contentMatches = (section.textContent.toLowerCase().match(new RegExp(word, 'g')) || []).length;
      score += contentMatches;

      // Tag matches
      if (section.articleMetadata.tags.some(tag => tag.toLowerCase().includes(word))) score += 2;
    });

    return score;
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
    if (vectorA.length !== vectorB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      normA += vectorA[i] * vectorA[i];
      normB += vectorB[i] * vectorB[i];
    }

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

// Export singleton instance
export const articleSearchRegistry = new ArticleSearchRegistry();
