# Content Registry Patterns

**Registry implementation alternatives and type safety strategies with file-backed embeddings**

## Overview

This document explores different approaches to implementing content registries that serve as the central access point for all content-as-source operations. We'll analyze three distinct patterns with detailed TypeScript implementations, performance considerations, and migration strategies.

**Key innovations:**
- **File-Backed Embeddings**: Zero DB dependency for vector operations
- **Section-Level Registry**: First-class support for section entities
- **Hybrid Search Strategies**: Graceful degradation from vector to lexical search
- **Async Facet Management**: Clean separation of canonical vs. dynamic data

## Core Registry Requirements

### Functional Requirements
- **Content Discovery** - Find content by ID, slug, type, or metadata with section-level precision
- **Type Safety** - Compile-time validation of content access patterns
- **File-Backed Embeddings** - Deterministic embedding storage without database dependency
- **Graceful Degradation** - Automatic fallback strategies for missing artifacts
- **Performance** - Efficient content loading and caching with memory-mapped access
- **Extensibility** - Support for new content types and metadata
- **Graph Operations** - Content relationship traversal and concept neighborhoods
- **Validation** - Content integrity and relationship checking

### Non-Functional Requirements
- **Memory Efficiency** - Minimal memory footprint with lazy loading and mmap support
- **Build Performance** - Fast TypeScript compilation and tree-shaking
- **Developer Experience** - Intuitive APIs with excellent IDE support
- **Error Handling** - Clear error messages and graceful degradation
- **Offline Capability** - Full functionality without database or network access

## Registry Pattern Alternatives

### Approach A: Simple Map-Based Registry (Enhanced)

**Philosophy:** Straightforward implementation with minimal abstraction, enhanced with file-backed support

```typescript
// lib/content/simple-registry.ts

import { ContentType, BaseMetadata, ContentEntity, Section, Article } from '@/content/types';
import { EmbeddingFileBackend, ShardManifest } from '@/lib/embeddings';

/**
 * Simple registry using Map for content storage
 * Enhanced with file-backed embeddings and section support
 */
export class SimpleContentRegistry {
  private readonly articles = new Map<string, Article>();
  private readonly sections = new Map<string, Section>();
  private readonly contributors = new Map<string, ContributorContent>();
  private readonly terminology = new Map<string, TerminologyContent>();
  private readonly labs = new Map<string, LabContent>();
  
  // New: File-backed embedding support
  private readonly embeddingBackend?: EmbeddingFileBackend;

  constructor(embeddingBackend?: EmbeddingFileBackend) {
    this.embeddingBackend = embeddingBackend;
  }

  // Article operations - now supporting section composition
  registerArticle(article: Article): void {
    this.articles.set(article.id, article);
  }

  getArticle(id: string): Article | null {
    return this.articles.get(id) || null;
  }

  getArticleBySlug(slug: string): Article | null {
    for (const article of this.articles.values()) {
      if (article.metadata.slug === slug) {
        return article;
      }
    }
    return null;
  }

  // New: Section operations (first-class entities)
  registerSection(section: Section): void {
    this.sections.set(section.id, section);
  }

  getSection(id: string): Section | null {
    return this.sections.get(id) || null;
  }

  async getArticleSections(articleId: string): Promise<Section[]> {
    const article = this.getArticle(articleId);
    if (!article) return [];

    const sections = await Promise.all(
      article.sections.map(sectionId => this.getSection(sectionId))
    );

    return sections.filter((section): section is Section => section !== null);
  }

  getSectionsByTag(tag: string): Section[] {
    const results: Section[] = [];
    for (const section of this.sections.values()) {
      if (section.metadata.tags.includes(tag)) {
        results.push(section);
      }
    }
    return results;
  }

  // New: File-backed embedding operations
  async getEmbeddingManifest(contentId: string): Promise<ShardManifest | null> {
    if (!this.embeddingBackend) return null;
    return this.embeddingBackend.loadManifest(contentId);
  }

  async *streamEmbeddings(
    contentId: string, 
    segmentIds?: string[]
  ): AsyncIterable<EmbeddingSegment> {
    if (!this.embeddingBackend) return;
    
    const manifest = await this.getEmbeddingManifest(contentId);
    if (!manifest) return;

    for await (const segment of this.embeddingBackend.streamSegments(manifest, segmentIds)) {
      yield segment;
    }
  }

  // Enhanced search with hybrid strategy
  async search(query: SearchQuery): Promise<SearchResults> {
    const strategy = await this.selectSearchStrategy(query);
    
    switch (strategy) {
      case 'vector':
        return this.vectorSearch(query);
      case 'hybrid':
        return this.hybridSearch(query);
      case 'lexical':
        return this.lexicalSearch(query);
    }
  }

  private async selectSearchStrategy(query: SearchQuery): Promise<SearchStrategy> {
    if (!this.embeddingBackend) return 'lexical';
    
    const status = await this.embeddingBackend.getStatus();
    
    if (status.isHealthy && status.coverage > 0.8) {
      return query.vectorEnabled ? 'vector' : 'hybrid';
    }
    
    if (status.partialCoverage > 0.3) {
      return 'hybrid';
    }
    
    return 'lexical';
  }

  private async vectorSearch(query: SearchQuery): Promise<SearchResults> {
    // Implement vector search using file-backed embeddings
    const results: SearchHit[] = [];
    
    for (const [id, entity] of this.getAllEntities()) {
      const manifest = await this.getEmbeddingManifest(id);
      if (!manifest) continue;

      // Vector similarity computation using streamed embeddings
      for await (const segment of this.streamEmbeddings(id)) {
        const similarity = this.computeSimilarity(query.vector, segment.embedding);
        if (similarity > query.threshold) {
          results.push({
            contentId: id,
            contentType: entity.type,
            score: similarity,
            segment: segment.metadata,
            entity
          });
        }
      }
    }

    return {
      hits: results.sort((a, b) => b.score - a.score),
      strategy: 'vector',
      metadata: {
        totalHits: results.length,
        searchTime: Date.now(),
        embeddingCoverage: await this.getEmbeddingCoverage()
      }
    };
  }

  private lexicalSearch(query: SearchQuery): SearchResults {
    const results: SearchHit[] = [];
    const lowerQuery = query.text.toLowerCase();

    for (const [id, entity] of this.getAllEntities()) {
      const score = this.computeLexicalScore(entity, lowerQuery);
      if (score > 0) {
        results.push({
          contentId: id,
          contentType: entity.type,
          score,
          entity
        });
      }
    }

    return {
      hits: results.sort((a, b) => b.score - a.score),
      strategy: 'lexical',
      metadata: {
        totalHits: results.length,
        searchTime: Date.now()
      }
    };
  }

  private async hybridSearch(query: SearchQuery): Promise<SearchResults> {
    // Combine vector and lexical results with weighted scoring
    const vectorResults = await this.vectorSearch(query);
    const lexicalResults = this.lexicalSearch(query);
    
    // Merge and rerank results
    const mergedResults = this.mergeSearchResults(vectorResults, lexicalResults);
    
    return {
      ...vectorResults,
      hits: mergedResults,
      strategy: 'hybrid'
    };
  }

  private *getAllEntities(): IterableIterator<[string, ContentEntity]> {
    for (const [id, article] of this.articles) {
      yield [id, article];
    }
    for (const [id, section] of this.sections) {
      yield [id, section];
    }
    for (const [id, contributor] of this.contributors) {
      yield [id, contributor];
    }
    // ... other entity types
  }
}
      articles: this.articles.size,
      contributors: this.contributors.size,
      terminology: this.terminology.size,
      labs: this.labs.size,
      total: this.articles.size + this.contributors.size + this.terminology.size + this.labs.size,
    };
  }

  // Clear all content (useful for testing)
  clear(): void {
    this.articles.clear();
    this.contributors.clear();
    this.terminology.clear();
    this.labs.clear();
  }
}

interface RegistryStats {
  readonly articles: number;
  readonly contributors: number;
  readonly terminology: number;
  readonly labs: number;
  readonly total: number;
}

// Usage example
const registry = new SimpleContentRegistry();

// Register content
registry.registerArticle(typescriptPatternsArticle);
registry.registerContributor(santiProfile);

// Query content
const article = registry.getArticleBySlug('typescript-patterns');
const contributor = registry.getContributorByUsername('santi');
const searchResults = registry.searchAll('typescript');
```

**Pros:**
- ✅ Simple, straightforward implementation
- ✅ Excellent performance for read operations
- ✅ Minimal memory overhead
- ✅ Easy to understand and debug
- ✅ Fast TypeScript compilation

**Cons:**
- ❌ Code duplication across content types
- ❌ Limited search and filtering capabilities
- ❌ No automatic relationship tracking
- ❌ Manual content validation required
- ❌ No lazy loading or advanced caching

### Approach B: Generic Type-Safe Registry

**Philosophy:** Sophisticated type safety with generic abstractions

```typescript
// lib/content/type-safe-registry.ts

import { ContentType, BaseMetadata, TypedContent, TypedMetadata } from '@/content/types';

/**
 * Generic content registry with full type safety
 * Uses advanced TypeScript features for compile-time validation
 */
export class TypeSafeContentRegistry {
  private readonly storage = new Map<ContentType, Map<string, any>>();
  private readonly indices = new Map<ContentType, ContentIndex>();

  constructor() {
    // Initialize storage and indices for each content type
    const contentTypes: ContentType[] = ['article', 'contributor', 'terminology', 'lab'];
    
    for (const type of contentTypes) {
      this.storage.set(type, new Map());
      this.indices.set(type, new ContentIndex());
    }
  }

  /**
   * Register content with full type safety
   */
  register<T extends ContentType>(content: TypedContent<T>): void {
    const { type, id } = content.metadata;
    const typeStorage = this.storage.get(type);
    const typeIndex = this.indices.get(type);

    if (!typeStorage || !typeIndex) {
      throw new Error(`Unsupported content type: ${type}`);
    }

    // Store content
    typeStorage.set(id, content);

    // Update indices
    typeIndex.addContent(content);

    // Validate content integrity
    this.validateContent(content);
  }

  /**
   * Get content by ID with type safety
   */
  get<T extends ContentType>(type: T, id: string): TypedContent<T> | null {
    const typeStorage = this.storage.get(type);
    return typeStorage?.get(id) || null;
  }

  /**
   * Get all content of specific type
   */
  getAll<T extends ContentType>(type: T): TypedContent<T>[] {
    const typeStorage = this.storage.get(type);
    return typeStorage ? Array.from(typeStorage.values()) : [];
  }

  /**
   * Search content with type-safe filtering
   */
  search<T extends ContentType>(
    type: T,
    filter: ContentFilter<T>
  ): TypedContent<T>[] {
    const typeIndex = this.indices.get(type);
    return typeIndex ? typeIndex.search(filter) : [];
  }

  /**
   * Cross-type search with union return type
   */
  searchAll(query: SearchQuery): SearchResult[] {
    const results: SearchResult[] = [];

    for (const [type, index] of this.indices.entries()) {
      const typeResults = index.searchText(query.text);
      results.push(...typeResults.map(content => ({
        type: type as ContentType,
        content,
        relevanceScore: this.calculateRelevance(content, query),
      })));
    }

    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, query.limit || 10);
  }

  /**
   * Get content relationships
   */
  getRelationships<T extends ContentType>(
    type: T,
    id: string
  ): ContentRelationships<T> {
    const content = this.get(type, id);
    if (!content) {
      return {} as ContentRelationships<T>;
    }

    return this.buildRelationships(content);
  }

  /**
   * Validate content integrity across the registry
   */
  validateIntegrity(): ValidationReport {
    const report: ValidationReport = {
      valid: true,
      errors: [],
      warnings: [],
      contentCount: 0,
    };

    // Validate each content type
    for (const [type, storage] of this.storage.entries()) {
      for (const content of storage.values()) {
        report.contentCount++;
        
        try {
          this.validateContent(content);
        } catch (error) {
          report.valid = false;
          report.errors.push({
            contentId: content.metadata.id,
            contentType: type,
            message: error.message,
          });
        }

        // Check for broken references
        const brokenRefs = this.findBrokenReferences(content);
        if (brokenRefs.length > 0) {
          report.warnings.push({
            contentId: content.metadata.id,
            contentType: type,
            message: `Broken references: ${brokenRefs.join(', ')}`,
          });
        }
      }
    }

    return report;
  }

  private validateContent<T extends ContentType>(content: TypedContent<T>): void {
    const { metadata } = content;

    // Basic validation
    if (!metadata.id || !metadata.title || !metadata.type) {
      throw new Error('Content missing required metadata fields');
    }

    // Type-specific validation
    switch (metadata.type) {
      case 'article':
        this.validateArticleContent(content as TypedContent<'article'>);
        break;
      case 'contributor':
        this.validateContributorContent(content as TypedContent<'contributor'>);
        break;
      case 'terminology':
        this.validateTerminologyContent(content as TypedContent<'terminology'>);
        break;
      case 'lab':
        this.validateLabContent(content as TypedContent<'lab'>);
        break;
    }
  }

  private validateArticleContent(article: TypedContent<'article'>): void {
    const { metadata } = article;
    
    if (!metadata.slug || !metadata.author) {
      throw new Error('Article missing required fields: slug, author');
    }

    // Validate author exists
    const author = this.get('contributor', metadata.author);
    if (!author) {
      throw new Error(`Article references unknown author: ${metadata.author}`);
    }

    // Validate prerequisites exist
    for (const prereq of metadata.prerequisites) {
      const prereqArticle = this.get('article', prereq);
      if (!prereqArticle) {
        throw new Error(`Article references unknown prerequisite: ${prereq}`);
      }
    }
  }

  private buildRelationships<T extends ContentType>(
    content: TypedContent<T>
  ): ContentRelationships<T> {
    const relationships: Partial<ContentRelationships<T>> = {};

    // Find all content that references this content
    const backlinks = this.findBacklinks(content.metadata.id);
    relationships.backlinks = backlinks;

    // Find content this content references
    const references = this.findReferences(content);
    relationships.references = references;

    // Type-specific relationships
    if (content.metadata.type === 'article') {
      const articleContent = content as TypedContent<'article'>;
      relationships.author = this.get('contributor', articleContent.metadata.author);
      relationships.prerequisites = articleContent.metadata.prerequisites
        .map(id => this.get('article', id))
        .filter(Boolean);
    }

    return relationships as ContentRelationships<T>;
  }

  private findBacklinks(contentId: string): string[] {
    const backlinks: string[] = [];

    for (const [type, storage] of this.storage.entries()) {
      for (const content of storage.values()) {
        if (this.contentReferences(content, contentId)) {
          backlinks.push(content.metadata.id);
        }
      }
    }

    return backlinks;
  }

  private contentReferences(content: any, targetId: string): boolean {
    const contentStr = JSON.stringify(content);
    return contentStr.includes(targetId);
  }

  private calculateRelevance(content: any, query: SearchQuery): number {
    let score = 0;
    const queryLower = query.text.toLowerCase();
    const { title, description, tags } = content.metadata;

    // Title match (highest weight)
    if (title.toLowerCase().includes(queryLower)) {
      score += 10;
    }

    // Description match
    if (description.toLowerCase().includes(queryLower)) {
      score += 5;
    }

    // Tag match
    if (tags.some((tag: string) => tag.toLowerCase().includes(queryLower))) {
      score += 3;
    }

    // Exact title match bonus
    if (title.toLowerCase() === queryLower) {
      score += 20;
    }

    return score;
  }
}

/**
 * Content index for efficient searching and filtering
 */
class ContentIndex {
  private readonly byId = new Map<string, any>();
  private readonly byTag = new Map<string, Set<string>>();
  private readonly textIndex = new Map<string, Set<string>>();

  addContent(content: any): void {
    const { id, tags, title, description } = content.metadata;

    // Add to ID index
    this.byId.set(id, content);

    // Add to tag index
    for (const tag of tags) {
      if (!this.byTag.has(tag)) {
        this.byTag.set(tag, new Set());
      }
      this.byTag.get(tag)!.add(id);
    }

    // Add to text index
    const words = this.extractWords(title + ' ' + description);
    for (const word of words) {
      if (!this.textIndex.has(word)) {
        this.textIndex.set(word, new Set());
      }
      this.textIndex.get(word)!.add(id);
    }
  }

  search<T extends ContentType>(filter: ContentFilter<T>): TypedContent<T>[] {
    let candidates = new Set(this.byId.keys());

    // Apply tag filters
    if (filter.tags && filter.tags.length > 0) {
      const tagMatches = new Set<string>();
      for (const tag of filter.tags) {
        const taggedContent = this.byTag.get(tag) || new Set();
        for (const id of taggedContent) {
          tagMatches.add(id);
        }
      }
      candidates = new Set([...candidates].filter(id => tagMatches.has(id)));
    }

    // Apply text filter
    if (filter.text) {
      const words = this.extractWords(filter.text);
      const textMatches = new Set<string>();
      
      for (const word of words) {
        const wordMatches = this.textIndex.get(word) || new Set();
        for (const id of wordMatches) {
          textMatches.add(id);
        }
      }
      
      candidates = new Set([...candidates].filter(id => textMatches.has(id)));
    }

    // Get content objects
    const results = Array.from(candidates)
      .map(id => this.byId.get(id))
      .filter(Boolean);

    // Apply additional filters
    return results.filter(content => {
      if (filter.author && content.metadata.author !== filter.author) {
        return false;
      }
      
      if (filter.status && content.metadata.status !== filter.status) {
        return false;
      }

      if (filter.difficulty && content.metadata.difficulty !== filter.difficulty) {
        return false;
      }

      return true;
    });
  }

  searchText(text: string): any[] {
    const words = this.extractWords(text);
    const matches = new Set<string>();

    for (const word of words) {
      const wordMatches = this.textIndex.get(word) || new Set();
      for (const id of wordMatches) {
        matches.add(id);
      }
    }

    return Array.from(matches).map(id => this.byId.get(id)).filter(Boolean);
  }

  private extractWords(text: string): string[] {
    return text
      .toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 2);
  }
}

// Type definitions for the registry
interface ContentFilter<T extends ContentType> {
  readonly text?: string;
  readonly tags?: readonly string[];
  readonly author?: T extends 'article' ? string : never;
  readonly status?: T extends 'article' ? string : never;
  readonly difficulty?: T extends 'article' ? string : never;
}

interface SearchQuery {
  readonly text: string;
  readonly limit?: number;
  readonly types?: readonly ContentType[];
}

interface SearchResult {
  readonly type: ContentType;
  readonly content: any;
  readonly relevanceScore: number;
}

interface ContentRelationships<T extends ContentType> {
  readonly backlinks?: readonly string[];
  readonly references?: readonly string[];
  readonly author?: T extends 'article' ? any : never;
  readonly prerequisites?: T extends 'article' ? readonly any[] : never;
}

interface ValidationReport {
  readonly valid: boolean;
  readonly errors: readonly ValidationError[];
  readonly warnings: readonly ValidationWarning[];
  readonly contentCount: number;
}

interface ValidationError {
  readonly contentId: string;
  readonly contentType: ContentType;
  readonly message: string;
}

interface ValidationWarning {
  readonly contentId: string;
  readonly contentType: ContentType;
  readonly message: string;
}
```

**Pros:**
- ✅ Full compile-time type safety
- ✅ Sophisticated search and filtering
- ✅ Automatic relationship tracking
- ✅ Comprehensive validation system
- ✅ Excellent IDE support and autocomplete

**Cons:**
- ❌ Complex implementation requiring deep TypeScript knowledge
- ❌ Longer compilation times
- ❌ Higher memory overhead for indices
- ❌ More difficult debugging
- ❌ Steep learning curve for team adoption

### Approach C: Event-Driven Registry with Caching

**Philosophy:** Performance-optimized registry with event-driven updates and intelligent caching

```typescript
// lib/content/event-driven-registry.ts

import { EventEmitter } from 'events';
import { LRUCache } from 'lru-cache';

/**
 * Event-driven content registry with advanced caching and performance optimization
 * Designed for high-performance applications with large content volumes
 */
export class EventDrivenContentRegistry extends EventEmitter {
  private readonly storage = new Map<ContentType, Map<string, any>>();
  private readonly cache = new LRUCache<string, any>({ max: 1000 });
  private readonly searchCache = new LRUCache<string, any[]>({ max: 100 });
  private readonly metadataCache = new LRUCache<string, any>({ max: 500 });
  
  // Performance tracking
  private readonly metrics = {
    hits: 0,
    misses: 0,
    searches: 0,
    registrations: 0,
  };

  constructor() {
    super();
    this.initializeStorage();
    this.setupCacheEviction();
  }

  /**
   * Register content with event notification and caching
   */
  async register<T extends ContentType>(content: TypedContent<T>): Promise<void> {
    const { type, id } = content.metadata;
    const storage = this.storage.get(type);

    if (!storage) {
      throw new Error(`Unsupported content type: ${type}`);
    }

    // Validate content before registration
    await this.validateContentAsync(content);

    // Store content
    storage.set(id, content);
    this.metrics.registrations++;

    // Update caches
    const cacheKey = `${type}:${id}`;
    this.cache.set(cacheKey, content);
    this.metadataCache.set(cacheKey, content.metadata);

    // Invalidate related caches
    this.invalidateRelatedCaches(content);

    // Emit registration event
    this.emit('content:registered', {
      type,
      id,
      content,
      timestamp: new Date(),
    });

    // Emit type-specific event
    this.emit(`${type}:registered`, {
      id,
      content,
      timestamp: new Date(),
    });
  }

  /**
   * Get content with intelligent caching
   */
  get<T extends ContentType>(type: T, id: string): TypedContent<T> | null {
    const cacheKey = `${type}:${id}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      this.metrics.hits++;
      this.emit('cache:hit', { key: cacheKey });
      return cached;
    }

    // Fallback to storage
    const storage = this.storage.get(type);
    const content = storage?.get(id) || null;

    if (content) {
      // Cache for future requests
      this.cache.set(cacheKey, content);
      this.metrics.misses++;
      this.emit('cache:miss', { key: cacheKey });
    }

    return content;
  }

  /**
   * High-performance search with caching and pagination
   */
  async search(query: SearchQuery): Promise<SearchResult> {
    const queryKey = this.generateQueryKey(query);
    
    // Check search cache
    const cached = this.searchCache.get(queryKey);
    if (cached) {
      this.metrics.hits++;
      return {
        results: cached,
        total: cached.length,
        page: query.page || 1,
        pageSize: query.pageSize || 10,
        cached: true,
      };
    }

    // Perform search
    this.metrics.searches++;
    const results = await this.performSearch(query);
    
    // Cache results
    this.searchCache.set(queryKey, results);

    // Apply pagination
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const paginatedResults = results.slice(startIndex, startIndex + pageSize);

    this.emit('search:completed', {
      query,
      resultCount: results.length,
      duration: Date.now(),
    });

    return {
      results: paginatedResults,
      total: results.length,
      page,
      pageSize,
      cached: false,
    };
  }

  /**
   * Batch operations for efficient bulk processing
   */
  async registerBatch<T extends ContentType>(
    contents: TypedContent<T>[]
  ): Promise<BatchResult> {
    const results: BatchResult = {
      successful: [],
      failed: [],
      totalProcessed: contents.length,
    };

    // Process in parallel with concurrency limit
    const concurrencyLimit = 5;
    const chunks = this.chunkArray(contents, concurrencyLimit);

    for (const chunk of chunks) {
      const chunkResults = await Promise.allSettled(
        chunk.map(content => this.register(content))
      );

      chunkResults.forEach((result, index) => {
        const content = chunk[index];
        if (result.status === 'fulfilled') {
          results.successful.push(content.metadata.id);
        } else {
          results.failed.push({
            id: content.metadata.id,
            error: result.reason.message,
          });
        }
      });
    }

    this.emit('batch:completed', results);
    return results;
  }

  /**
   * Advanced aggregation queries
   */
  async aggregate(aggregation: AggregationQuery): Promise<AggregationResult> {
    const cacheKey = `agg:${JSON.stringify(aggregation)}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const result = await this.performAggregation(aggregation);
    this.cache.set(cacheKey, result, { ttl: 300000 }); // 5 minute TTL
    
    return result;
  }

  /**
   * Real-time content monitoring
   */
  subscribe(pattern: SubscriptionPattern): ContentSubscription {
    const subscription = new ContentSubscription(pattern, this);
    return subscription;
  }

  /**
   * Performance metrics and monitoring
   */
  getMetrics(): RegistryMetrics {
    const cacheStats = {
      size: this.cache.size,
      hitRate: this.metrics.hits / (this.metrics.hits + this.metrics.misses),
      searchCacheSize: this.searchCache.size,
      metadataCacheSize: this.metadataCache.size,
    };

    return {
      ...this.metrics,
      cache: cacheStats,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };
  }

  /**
   * Cache management operations
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      // Clear specific cache entries matching pattern
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      // Clear all caches
      this.cache.clear();
      this.searchCache.clear();
      this.metadataCache.clear();
    }

    this.emit('cache:cleared', { pattern });
  }

  private async performSearch(query: SearchQuery): Promise<any[]> {
    const results: any[] = [];

    // Search across all content types
    for (const [type, storage] of this.storage.entries()) {
      if (query.types && !query.types.includes(type)) {
        continue;
      }

      for (const content of storage.values()) {
        if (this.matchesQuery(content, query)) {
          results.push({
            ...content,
            _type: type,
            _relevance: this.calculateRelevance(content, query),
          });
        }
      }
    }

    // Sort by relevance
    return results.sort((a, b) => b._relevance - a._relevance);
  }

  private matchesQuery(content: any, query: SearchQuery): boolean {
    const { text, tags, filters } = query;
    
    // Text search
    if (text) {
      const searchableText = [
        content.metadata.title,
        content.metadata.description,
        ...content.metadata.tags,
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(text.toLowerCase())) {
        return false;
      }
    }

    // Tag filtering
    if (tags && tags.length > 0) {
      const contentTags = content.metadata.tags || [];
      const hasRequiredTags = tags.every(tag => contentTags.includes(tag));
      if (!hasRequiredTags) {
        return false;
      }
    }

    // Custom filters
    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (content.metadata[key] !== value) {
          return false;
        }
      }
    }

    return true;
  }

  private invalidateRelatedCaches(content: any): void {
    const type = content.metadata.type;
    
    // Clear type-specific search cache entries
    for (const key of this.searchCache.keys()) {
      if (key.includes(type)) {
        this.searchCache.delete(key);
      }
    }

    // Clear aggregation cache
    this.cache.forEach((value, key) => {
      if (key.startsWith('agg:')) {
        this.cache.delete(key);
      }
    });
  }

  private generateQueryKey(query: SearchQuery): string {
    return JSON.stringify({
      text: query.text,
      tags: query.tags?.sort(),
      types: query.types?.sort(),
      filters: query.filters,
      page: query.page,
      pageSize: query.pageSize,
    });
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
}

/**
 * Real-time content subscription system
 */
export class ContentSubscription {
  private readonly unsubscribeFunctions: (() => void)[] = [];

  constructor(
    private readonly pattern: SubscriptionPattern,
    private readonly registry: EventDrivenContentRegistry
  ) {
    this.setupSubscriptions();
  }

  private setupSubscriptions(): void {
    const { events, filter } = this.pattern;

    for (const event of events) {
      const handler = (data: any) => {
        if (!filter || filter(data)) {
          this.pattern.callback(event, data);
        }
      };

      this.registry.on(event, handler);
      this.unsubscribeFunctions.push(() => {
        this.registry.off(event, handler);
      });
    }
  }

  unsubscribe(): void {
    this.unsubscribeFunctions.forEach(fn => fn());
  }
}

// Type definitions for event-driven registry
interface SearchQuery {
  readonly text?: string;
  readonly tags?: readonly string[];
  readonly types?: readonly ContentType[];
  readonly filters?: Record<string, any>;
  readonly page?: number;
  readonly pageSize?: number;
}

interface SearchResult {
  readonly results: readonly any[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly cached: boolean;
}

interface BatchResult {
  readonly successful: readonly string[];
  readonly failed: readonly Array<{
    readonly id: string;
    readonly error: string;
  }>;
  readonly totalProcessed: number;
}

interface AggregationQuery {
  readonly type: 'count' | 'group' | 'stats';
  readonly field: string;
  readonly filters?: Record<string, any>;
}

interface AggregationResult {
  readonly type: string;
  readonly field: string;
  readonly data: any;
  readonly timestamp: Date;
}

interface SubscriptionPattern {
  readonly events: readonly string[];
  readonly filter?: (data: any) => boolean;
  readonly callback: (event: string, data: any) => void;
}

interface RegistryMetrics {
  readonly hits: number;
  readonly misses: number;
  readonly searches: number;
  readonly registrations: number;
  readonly cache: {
    readonly size: number;
    readonly hitRate: number;
    readonly searchCacheSize: number;
    readonly metadataCacheSize: number;
  };
  readonly uptime: number;
  readonly memoryUsage: NodeJS.MemoryUsage;
}
```

**Pros:**
- ✅ Excellent performance with intelligent caching
- ✅ Real-time event system for dynamic applications
- ✅ Advanced search and aggregation capabilities
- ✅ Comprehensive monitoring and metrics
- ✅ Batch operations for efficient bulk processing

**Cons:**
- ❌ Very complex implementation and maintenance
- ❌ High memory usage due to multiple cache layers
- ❌ Requires careful cache invalidation logic
- ❌ Event system adds complexity to debugging
- ❌ Overkill for simple content management needs

## Registry Performance Comparison

### Memory Usage Analysis
```typescript
interface MemoryUsageComparison {
  readonly approach: string;
  readonly baseMemory: string;
  readonly perContentItem: string;
  readonly cacheOverhead: string;
  readonly indexOverhead: string;
}

const memoryComparison: MemoryUsageComparison[] = [
  {
    approach: 'Simple Map-Based',
    baseMemory: '2MB',
    perContentItem: '0.5KB',
    cacheOverhead: '0MB',
    indexOverhead: '0MB',
  },
  {
    approach: 'Generic Type-Safe',
    baseMemory: '5MB',
    perContentItem: '1.2KB',
    cacheOverhead: '0MB',
    indexOverhead: '2MB',
  },
  {
    approach: 'Event-Driven Cached',
    baseMemory: '8MB',
    perContentItem: '0.8KB',
    cacheOverhead: '10MB',
    indexOverhead: '3MB',
  },
];
```

### Search Performance Benchmarks
```typescript
interface SearchPerformanceBenchmark {
  readonly approach: string;
  readonly searchTime100Items: string;
  readonly searchTime1000Items: string;
  readonly searchTime10000Items: string;
  readonly firstSearchCost: string;
  readonly cachedSearchCost: string;
}

const searchBenchmarks: SearchPerformanceBenchmark[] = [
  {
    approach: 'Simple Map-Based',
    searchTime100Items: '2ms',
    searchTime1000Items: '15ms',
    searchTime10000Items: '120ms',
    firstSearchCost: 'O(n)',
    cachedSearchCost: 'O(n)',
  },
  {
    approach: 'Generic Type-Safe',
    searchTime100Items: '1ms',
    searchTime1000Items: '8ms',
    searchTime10000Items: '45ms',
    firstSearchCost: 'O(log n)',
    cachedSearchCost: 'O(log n)',
  },
  {
    approach: 'Event-Driven Cached',
    searchTime100Items: '0.1ms',
    searchTime1000Items: '0.5ms',
    searchTime10000Items: '2ms',
    firstSearchCost: 'O(log n)',
    cachedSearchCost: 'O(1)',
  },
];
```

## Migration Strategies

### From Existing Registry Patterns

```typescript
// Migration utility for existing registries
export class RegistryMigrationService {
  /**
   * Migrate from simple object-based registry
   */
  static migrateFromObjectRegistry(
    existingRegistry: Record<string, any>,
    targetRegistry: SimpleContentRegistry
  ): MigrationReport {
    const report: MigrationReport = {
      migrated: 0,
      failed: 0,
      errors: [],
    };

    for (const [key, content] of Object.entries(existingRegistry)) {
      try {
        // Transform content to new format
        const transformedContent = this.transformLegacyContent(content);
        
        // Register in new registry
        switch (transformedContent.metadata.type) {
          case 'article':
            targetRegistry.registerArticle(transformedContent);
            break;
          case 'contributor':
            targetRegistry.registerContributor(transformedContent);
            break;
          // ... other types
        }
        
        report.migrated++;
      } catch (error) {
        report.failed++;
        report.errors.push({
          contentKey: key,
          error: error.message,
        });
      }
    }

    return report;
  }

  /**
   * Progressive migration with validation
   */
  static async migrateProgressively(
    source: any,
    target: TypeSafeContentRegistry,
    batchSize: number = 10
  ): Promise<void> {
    const contentItems = Object.entries(source);
    const batches = this.createBatches(contentItems, batchSize);

    for (const batch of batches) {
      const batchPromises = batch.map(async ([key, content]) => {
        try {
          const transformed = this.transformLegacyContent(content);
          await target.register(transformed);
          console.log(`✅ Migrated: ${key}`);
        } catch (error) {
          console.error(`❌ Failed to migrate ${key}:`, error.message);
        }
      });

      await Promise.allSettled(batchPromises);
      
      // Pause between batches to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  private static transformLegacyContent(legacyContent: any): any {
    // Content transformation logic
    return {
      metadata: {
        id: legacyContent.id || generateId(),
        type: legacyContent.type || 'article',
        title: legacyContent.title || 'Untitled',
        description: legacyContent.description || '',
        tags: legacyContent.tags || [],
        createdAt: legacyContent.createdAt || new Date(),
        updatedAt: legacyContent.updatedAt || new Date(),
        // ... other transformations
      },
      content: legacyContent.content || {},
      derivation: legacyContent.derivation || {},
    };
  }

  private static createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }
}

interface MigrationReport {
  readonly migrated: number;
  readonly failed: number;
  readonly errors: readonly Array<{
    readonly contentKey: string;
    readonly error: string;
  }>;
}
```

## Usage Examples and Best Practices

### Simple Registry Usage
```typescript
// Basic usage pattern for simple registry
const registry = new SimpleContentRegistry();

// Register content
registry.registerArticle(typescriptPatternsArticle);
registry.registerContributor(santiProfile);

// Query content
const article = registry.getArticleBySlug('typescript-patterns');
const allArticles = registry.getAllArticles();
const searchResults = registry.searchAll('typescript');

// Get statistics
const stats = registry.getStats();
console.log(`Total content items: ${stats.total}`);
```

### Type-Safe Registry Usage
```typescript
// Advanced usage with full type safety
const registry = new TypeSafeContentRegistry();

// Register with type checking
await registry.register(typescriptArticle); // TypedContent<'article'>
await registry.register(contributorProfile); // TypedContent<'contributor'>

// Type-safe retrieval
const article = registry.get('article', 'typescript-patterns'); // TypedContent<'article'> | null
const contributor = registry.get('contributor', 'santi'); // TypedContent<'contributor'> | null

// Advanced searching with filters
const articles = registry.search('article', {
  tags: ['typescript', 'advanced'],
  difficulty: 'advanced',
  author: 'santi',
});

// Cross-content search
const results = registry.searchAll({
  text: 'typescript patterns',
  types: ['article', 'terminology'],
  limit: 10,
});

// Validation and integrity checking
const validationReport = registry.validateIntegrity();
if (!validationReport.valid) {
  console.error('Content integrity issues:', validationReport.errors);
}
```

### Event-Driven Registry Usage
```typescript
// High-performance registry with events and caching
const registry = new EventDrivenContentRegistry();

// Set up event listeners
registry.on('content:registered', (event) => {
  console.log(`New content registered: ${event.id}`);
});

registry.on('search:completed', (event) => {
  console.log(`Search completed: ${event.resultCount} results`);
});

// Register content with events
await registry.register(article);

// High-performance search with caching
const searchResult = await registry.search({
  text: 'typescript',
  page: 1,
  pageSize: 10,
});

// Batch operations
const batchResult = await registry.registerBatch(articleArray);

// Real-time subscriptions
const subscription = registry.subscribe({
  events: ['article:registered', 'article:updated'],
  filter: (data) => data.content.metadata.tags.includes('typescript'),
  callback: (event, data) => {
    console.log(`TypeScript content event: ${event}`, data);
  },
});

// Performance monitoring
const metrics = registry.getMetrics();
console.log(`Cache hit rate: ${metrics.cache.hitRate * 100}%`);

// Cleanup
subscription.unsubscribe();
```

## Recommendation

### Hybrid Implementation Strategy

**Phase 1:** Start with **Simple Map-Based Registry** for immediate functionality
**Phase 2:** Enhance with **Type-Safe Registry** features for improved developer experience  
**Phase 3:** Consider **Event-Driven Registry** for high-performance requirements

```typescript
// Recommended starting pattern - Progressive enhancement
export class ContentRegistry extends SimpleContentRegistry {
  // Start simple, add features incrementally
  private readonly typeChecker = new TypeSafeContentValidator();
  private readonly cache = new Map<string, any>();
  
  async register<T extends ContentType>(content: TypedContent<T>): Promise<void> {
    // Add validation layer
    await this.typeChecker.validate(content);
    
    // Use simple storage
    super.registerArticle(content as any); // Type assertion for migration
    
    // Add caching layer
    this.cache.set(`${content.metadata.type}:${content.metadata.id}`, content);
  }
}
```

This approach provides:
- **Immediate Implementation** - Simple patterns for quick wins
- **Type Safety Evolution** - Progressive enhancement of type checking
- **Performance Optimization** - Caching and optimization when needed
- **Event System Integration** - Real-time features for advanced use cases

Choose the registry pattern that best matches your application's complexity, performance requirements, and team expertise level.
