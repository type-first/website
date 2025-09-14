# RAG Integration & Semantic Search

**Comprehensive integration of content-as-source with Retrieval-Augmented Generation and semantic search capabilities**

## RAG Integration Overview

Your content-as-source architecture creates an ideal foundation for sophisticated RAG (Retrieval-Augmented Generation) systems. With canonical content authored in multimodal components and systematic derivation pipelines, you can build a robust knowledge base that serves both human readers and AI systems.

### RAG Architecture Benefits

**Content-as-Source RAG Advantages:**
1. **Canonical Knowledge Base** - Single source of truth for all information
2. **Section-Level Granularity** - Precise context retrieval for specific topics
3. **Type-Safe Metadata** - Rich structured data for enhanced retrieval
4. **Multi-Modal Context** - Code examples, explanations, and interactive elements
5. **Version-Controlled Knowledge** - Git-based versioning of knowledge base
6. **Automatic Index Updates** - Content changes automatically propagate to embeddings

## Vector Store Architecture

### Enhanced Embedding Strategy

```typescript
// lib/ai/enhanced-embedding-service.ts
import { openai } from '@/lib/ai/openai-client';
import { ContentSection, MultimodalContent } from '@/content/types';

export interface EnhancedEmbedding {
  id: string;
  contentId: string;
  sectionId?: string;
  vector: number[];
  metadata: EmbeddingMetadata;
  content: {
    title: string;
    text: string;
    code?: string[];
    tags: string[];
    context: string;
  };
}

export interface EmbeddingMetadata {
  contentType: 'article' | 'section' | 'code-snippet' | 'terminology' | 'lab';
  source: string;
  hierarchy: {
    article?: string;
    section?: string;
    subsection?: string;
  };
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  technologies: string[];
  concepts: string[];
  lastUpdated: Date;
  version: string;
}

export class EnhancedEmbeddingService {
  constructor(
    private openaiClient: typeof openai,
    private vectorStore: VectorStore
  ) {}

  async generateContentEmbeddings<T>(content: MultimodalContent<T>): Promise<EnhancedEmbedding[]> {
    const embeddings: EnhancedEmbedding[] = [];
    
    // Generate full article embedding for high-level queries
    const articleEmbedding = await this.generateArticleEmbedding(content);
    embeddings.push(articleEmbedding);
    
    // Generate section-level embeddings for precise retrieval
    for (const section of content.sections) {
      const sectionEmbeddings = await this.generateSectionEmbeddings(content, section);
      embeddings.push(...sectionEmbeddings);
    }
    
    return embeddings;
  }

  private async generateArticleEmbedding<T>(content: MultimodalContent<T>): Promise<EnhancedEmbedding> {
    const articleText = await this.prepareArticleText(content);
    const vector = await this.generateEmbedding(articleText);
    
    return {
      id: `article:${content.metadata.id}`,
      contentId: content.metadata.id,
      vector,
      metadata: this.createArticleMetadata(content),
      content: {
        title: content.metadata.title,
        text: articleText,
        tags: content.metadata.tags,
        context: 'full-article'
      }
    };
  }

  private async generateSectionEmbeddings<T>(
    content: MultimodalContent<T>, 
    section: ContentSection
  ): Promise<EnhancedEmbedding[]> {
    const embeddings: EnhancedEmbedding[] = [];
    
    // Generate main section embedding
    const sectionText = await this.prepareSectionText(section);
    const sectionVector = await this.generateEmbedding(sectionText);
    
    embeddings.push({
      id: `section:${content.metadata.id}:${section.id}`,
      contentId: content.metadata.id,
      sectionId: section.id,
      vector: sectionVector,
      metadata: this.createSectionMetadata(content, section),
      content: {
        title: section.title,
        text: sectionText,
        tags: section.tags || [],
        context: `article:${content.metadata.title} > section:${section.title}`
      }
    });

    // Extract and embed code snippets separately for code-specific queries
    const codeSnippets = await this.extractCodeSnippets(section);
    for (const snippet of codeSnippets) {
      const codeEmbedding = await this.generateCodeEmbedding(content, section, snippet);
      embeddings.push(codeEmbedding);
    }

    return embeddings;
  }

  private async generateCodeEmbedding<T>(
    content: MultimodalContent<T>, 
    section: ContentSection, 
    snippet: CodeSnippet
  ): Promise<EnhancedEmbedding> {
    // Combine code with its explanation for better context
    const codeContext = `
${snippet.title || 'Code Example'}

${snippet.description || ''}

\`\`\`${snippet.language}
${snippet.code}
\`\`\`

${snippet.explanation || ''}
`.trim();

    const vector = await this.generateEmbedding(codeContext);
    
    return {
      id: `code:${content.metadata.id}:${section.id}:${snippet.id}`,
      contentId: content.metadata.id,
      sectionId: section.id,
      vector,
      metadata: {
        ...this.createSectionMetadata(content, section),
        contentType: 'code-snippet'
      },
      content: {
        title: snippet.title || `${section.title} - Code Example`,
        text: codeContext,
        code: [snippet.code],
        tags: [...(section.tags || []), snippet.language, 'code-example'],
        context: `article:${content.metadata.title} > section:${section.title} > code:${snippet.title}`
      }
    };
  }

  private async prepareArticleText<T>(content: MultimodalContent<T>): Promise<string> {
    const sections = await Promise.all(
      content.sections.map(section => this.prepareSectionText(section))
    );
    
    return [
      `Title: ${content.metadata.title}`,
      `Description: ${content.metadata.description}`,
      `Tags: ${content.metadata.tags.join(', ')}`,
      '',
      ...sections
    ].join('\n');
  }

  private async prepareSectionText(section: ContentSection): Promise<string> {
    try {
      // Use the content derivation system to get clean text
      const component = new section.component({});
      if ('renderToPlainText' in component) {
        return await component.renderToPlainText({
          target: 'plaintext',
          options: { includeMetadata: false }
        });
      }
      
      // Fallback to section title if rendering fails
      return section.title;
    } catch (error) {
      console.error(`Error preparing text for section ${section.id}:`, error);
      return section.title;
    }
  }

  private async extractCodeSnippets(section: ContentSection): Promise<CodeSnippet[]> {
    // This would analyze the section component to extract code blocks
    // For now, return empty array - would need proper implementation
    return [];
  }

  private createArticleMetadata<T>(content: MultimodalContent<T>): EmbeddingMetadata {
    const metadata = content.metadata;
    
    return {
      contentType: 'article',
      source: 'slug' in metadata ? `/article/${(metadata as any).slug}` : `/content/${metadata.id}`,
      hierarchy: {
        article: metadata.title
      },
      difficulty: 'difficulty' in metadata ? (metadata as any).difficulty : undefined,
      technologies: this.extractTechnologies(metadata.tags),
      concepts: this.extractConcepts(metadata.tags),
      lastUpdated: metadata.updatedAt,
      version: '1.0' // Could be git hash
    };
  }

  private createSectionMetadata<T>(content: MultimodalContent<T>, section: ContentSection): EmbeddingMetadata {
    return {
      ...this.createArticleMetadata(content),
      contentType: 'section',
      hierarchy: {
        article: content.metadata.title,
        section: section.title
      }
    };
  }

  private extractTechnologies(tags: string[]): string[] {
    const techKeywords = [
      'typescript', 'javascript', 'react', 'next.js', 'node.js', 
      'python', 'rust', 'go', 'java', 'c++', 'html', 'css'
    ];
    
    return tags.filter(tag => 
      techKeywords.some(tech => tag.toLowerCase().includes(tech.toLowerCase()))
    );
  }

  private extractConcepts(tags: string[]): string[] {
    const conceptKeywords = [
      'pattern', 'architecture', 'design', 'algorithm', 'data-structure',
      'performance', 'testing', 'security', 'accessibility'
    ];
    
    return tags.filter(tag =>
      conceptKeywords.some(concept => tag.toLowerCase().includes(concept.toLowerCase()))
    );
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openaiClient.embeddings.create({
        model: 'text-embedding-3-large',
        input: text,
        dimensions: 1536
      });
      
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }
}

interface CodeSnippet {
  id: string;
  title?: string;
  description?: string;
  code: string;
  language: string;
  explanation?: string;
}
```

### Vector Store Implementation

```typescript
// lib/ai/vector-store.ts
import { EnhancedEmbedding } from './enhanced-embedding-service';

export interface VectorQueryResult {
  embedding: EnhancedEmbedding;
  similarity: number;
  relevantContext: string;
}

export interface VectorQuery {
  query: string;
  filters?: {
    contentType?: string[];
    technologies?: string[];
    difficulty?: string[];
    minSimilarity?: number;
  };
  limit?: number;
  includeMetadata?: boolean;
}

export class VectorStore {
  constructor(
    private database: any, // Your database connection
    private embeddingService: EnhancedEmbeddingService
  ) {}

  async storeEmbeddings(embeddings: EnhancedEmbedding[]): Promise<void> {
    for (const embedding of embeddings) {
      await this.database.query(`
        INSERT INTO content_embeddings (
          id, content_id, section_id, vector, metadata, content, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
        ON CONFLICT (id) DO UPDATE SET
          vector = EXCLUDED.vector,
          metadata = EXCLUDED.metadata,
          content = EXCLUDED.content,
          updated_at = NOW()
      `, [
        embedding.id,
        embedding.contentId,
        embedding.sectionId,
        JSON.stringify(embedding.vector),
        JSON.stringify(embedding.metadata),
        JSON.stringify(embedding.content)
      ]);
    }
  }

  async similaritySearch(query: VectorQuery): Promise<VectorQueryResult[]> {
    // Generate query embedding
    const queryVector = await this.embeddingService.generateEmbedding(query.query);
    
    // Build SQL query with filters
    const conditions = ['1=1'];
    const params = [JSON.stringify(queryVector)];
    let paramIndex = 2;

    if (query.filters?.contentType) {
      conditions.push(`metadata->>'contentType' = ANY($${paramIndex})`);
      params.push(query.filters.contentType);
      paramIndex++;
    }

    if (query.filters?.technologies) {
      conditions.push(`metadata->'technologies' ?| $${paramIndex}`);
      params.push(query.filters.technologies);
      paramIndex++;
    }

    if (query.filters?.difficulty) {
      conditions.push(`metadata->>'difficulty' = ANY($${paramIndex})`);
      params.push(query.filters.difficulty);
      paramIndex++;
    }

    const minSimilarity = query.filters?.minSimilarity || 0.7;
    const limit = query.limit || 10;

    const sqlQuery = `
      SELECT 
        id, content_id, section_id, metadata, content,
        1 - (vector <=> $1::vector) AS similarity
      FROM content_embeddings
      WHERE ${conditions.join(' AND ')}
        AND 1 - (vector <=> $1::vector) > ${minSimilarity}
      ORDER BY vector <=> $1::vector
      LIMIT ${limit}
    `;

    const result = await this.database.query(sqlQuery, params);
    
    return result.rows.map(row => ({
      embedding: {
        id: row.id,
        contentId: row.content_id,
        sectionId: row.section_id,
        vector: [], // Don't return vector for efficiency
        metadata: JSON.parse(row.metadata),
        content: JSON.parse(row.content)
      },
      similarity: row.similarity,
      relevantContext: this.generateRelevantContext(JSON.parse(row.content), query.query)
    }));
  }

  async hybridSearch(query: VectorQuery & { textQuery?: string }): Promise<VectorQueryResult[]> {
    // Combine vector similarity with full-text search
    const vectorResults = await this.similaritySearch(query);
    
    if (query.textQuery) {
      // Also perform traditional text search
      const textResults = await this.fullTextSearch(query.textQuery, query.filters);
      
      // Merge and re-rank results
      return this.mergeSearchResults(vectorResults, textResults);
    }
    
    return vectorResults;
  }

  private async fullTextSearch(
    textQuery: string, 
    filters?: VectorQuery['filters']
  ): Promise<VectorQueryResult[]> {
    const conditions = ['content_text @@ plainto_tsquery($1)'];
    const params = [textQuery];
    let paramIndex = 2;

    if (filters?.contentType) {
      conditions.push(`metadata->>'contentType' = ANY($${paramIndex})`);
      params.push(filters.contentType);
      paramIndex++;
    }

    const sqlQuery = `
      SELECT 
        id, content_id, section_id, metadata, content,
        ts_rank(content_text, plainto_tsquery($1)) as rank
      FROM content_embeddings
      WHERE ${conditions.join(' AND ')}
      ORDER BY rank DESC
      LIMIT 20
    `;

    const result = await this.database.query(sqlQuery, params);
    
    return result.rows.map(row => ({
      embedding: {
        id: row.id,
        contentId: row.content_id,
        sectionId: row.section_id,
        vector: [],
        metadata: JSON.parse(row.metadata),
        content: JSON.parse(row.content)
      },
      similarity: row.rank,
      relevantContext: row.content.text.substring(0, 500)
    }));
  }

  private mergeSearchResults(
    vectorResults: VectorQueryResult[], 
    textResults: VectorQueryResult[]
  ): VectorQueryResult[] {
    const resultMap = new Map<string, VectorQueryResult>();
    
    // Add vector results with higher weight
    vectorResults.forEach(result => {
      resultMap.set(result.embedding.id, {
        ...result,
        similarity: result.similarity * 0.7 // Weight vector similarity
      });
    });
    
    // Add or boost text results
    textResults.forEach(result => {
      const existing = resultMap.get(result.embedding.id);
      if (existing) {
        // Boost existing result
        existing.similarity = Math.max(existing.similarity, result.similarity * 0.3);
      } else {
        // Add new result with lower weight
        resultMap.set(result.embedding.id, {
          ...result,
          similarity: result.similarity * 0.3
        });
      }
    });
    
    return Array.from(resultMap.values())
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10);
  }

  private generateRelevantContext(content: any, query: string): string {
    const text = content.text;
    const queryTerms = query.toLowerCase().split(' ');
    
    // Find the best matching paragraph
    const paragraphs = text.split('\n\n');
    let bestMatch = '';
    let bestScore = 0;
    
    for (const paragraph of paragraphs) {
      const score = queryTerms.reduce((acc, term) => {
        return acc + (paragraph.toLowerCase().includes(term) ? 1 : 0);
      }, 0);
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = paragraph;
      }
    }
    
    return bestMatch || text.substring(0, 300);
  }
}
```

## RAG-Enabled Chat Integration

### Enhanced Chat Assistant

```typescript
// lib/ai/rag-chat-service.ts
import { VectorStore, VectorQuery } from './vector-store';
import { openai } from './openai-client';

export interface RAGChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources?: {
    title: string;
    url: string;
    snippet: string;
    similarity: number;
  }[];
}

export interface RAGChatOptions {
  maxContextLength: number;
  minSimilarity: number;
  maxSources: number;
  includeCodeExamples: boolean;
  preferredDifficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export class RAGChatService {
  constructor(
    private vectorStore: VectorStore,
    private openaiClient: typeof openai
  ) {}

  async generateResponse(
    query: string, 
    conversationHistory: RAGChatMessage[],
    options: RAGChatOptions = {
      maxContextLength: 4000,
      minSimilarity: 0.7,
      maxSources: 5,
      includeCodeExamples: true
    }
  ): Promise<RAGChatMessage> {
    // Retrieve relevant context from vector store
    const context = await this.retrieveRelevantContext(query, options);
    
    // Build system prompt with context
    const systemPrompt = this.buildSystemPrompt(context, options);
    
    // Build conversation with context
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user' as const, content: query }
    ];

    // Generate response
    const response = await this.openaiClient.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      temperature: 0.7,
      max_tokens: 1000
    });

    const assistantMessage = response.choices[0].message.content || '';
    
    return {
      role: 'assistant',
      content: assistantMessage,
      sources: this.formatSources(context)
    };
  }

  private async retrieveRelevantContext(
    query: string, 
    options: RAGChatOptions
  ): Promise<any[]> {
    const vectorQuery: VectorQuery = {
      query,
      filters: {
        minSimilarity: options.minSimilarity,
        ...(options.preferredDifficulty && {
          difficulty: [options.preferredDifficulty]
        })
      },
      limit: options.maxSources,
      includeMetadata: true
    };

    // If code examples are preferred, boost code snippet results
    if (options.includeCodeExamples) {
      const codeQuery = {
        ...vectorQuery,
        filters: {
          ...vectorQuery.filters,
          contentType: ['code-snippet', 'section']
        }
      };
      
      const codeResults = await this.vectorStore.similaritySearch(codeQuery);
      const generalResults = await this.vectorStore.similaritySearch(vectorQuery);
      
      // Merge and deduplicate
      const allResults = [...codeResults, ...generalResults];
      const uniqueResults = this.deduplicateResults(allResults);
      
      return uniqueResults.slice(0, options.maxSources);
    }

    const results = await this.vectorStore.similaritySearch(vectorQuery);
    return results;
  }

  private buildSystemPrompt(context: any[], options: RAGChatOptions): string {
    const contextText = context
      .map(item => {
        const source = item.embedding.content;
        return `
## ${source.title}
${source.text}
${source.code ? '\n```\n' + source.code.join('\n') + '\n```' : ''}
        `.trim();
      })
      .join('\n\n---\n\n');

    return `
You are a helpful TypeScript and React programming assistant. You have access to a curated knowledge base of articles, tutorials, and code examples.

Use the following context to answer the user's question. If the context doesn't contain enough information, say so clearly and offer to help with what you can provide.

Guidelines:
- Be precise and accurate
- Include code examples when relevant
- Explain concepts clearly
- Reference the source material when helpful
- If multiple approaches exist, explain the trade-offs

Context from knowledge base:
${contextText}

Remember to be helpful, accurate, and cite your sources when appropriate.
    `.trim();
  }

  private formatSources(context: any[]): RAGChatMessage['sources'] {
    return context.map(item => {
      const embedding = item.embedding;
      const source = embedding.metadata.source;
      
      return {
        title: embedding.content.title,
        url: source,
        snippet: item.relevantContext,
        similarity: item.similarity
      };
    });
  }

  private deduplicateResults(results: any[]): any[] {
    const seen = new Set<string>();
    return results.filter(result => {
      const key = result.embedding.contentId + (result.embedding.sectionId || '');
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}
```

### Content-Aware Search Enhancement

```typescript
// lib/search/content-aware-search.ts
import { VectorStore } from '@/lib/ai/vector-store';
import { contentRegistry } from '@/content/registry';

export interface ContentAwareSearchResult {
  type: 'article' | 'section' | 'terminology' | 'lab' | 'contributor';
  id: string;
  title: string;
  description: string;
  url: string;
  snippet: string;
  score: number;
  metadata: {
    difficulty?: string;
    technologies: string[];
    tags: string[];
    lastUpdated: Date;
  };
  relatedContent: {
    id: string;
    title: string;
    type: string;
    similarity: number;
  }[];
}

export class ContentAwareSearchService {
  constructor(
    private vectorStore: VectorStore,
    private registry: typeof contentRegistry
  ) {}

  async search(query: string, options: {
    types?: string[];
    technologies?: string[];
    difficulty?: string;
    limit?: number;
    includeRelated?: boolean;
  } = {}): Promise<ContentAwareSearchResult[]> {
    const {
      types = ['article', 'section', 'terminology', 'lab'],
      limit = 20,
      includeRelated = true
    } = options;

    // Perform vector search
    const vectorResults = await this.vectorStore.hybridSearch({
      query,
      textQuery: query,
      filters: {
        contentType: types,
        technologies: options.technologies,
        difficulty: options.difficulty ? [options.difficulty] : undefined,
        minSimilarity: 0.6
      },
      limit
    });

    // Enhance results with registry data and related content
    const enhancedResults: ContentAwareSearchResult[] = [];

    for (const result of vectorResults) {
      const enhanced = await this.enhanceSearchResult(result, includeRelated);
      if (enhanced) {
        enhancedResults.push(enhanced);
      }
    }

    // Sort by relevance score
    return enhancedResults.sort((a, b) => b.score - a.score);
  }

  private async enhanceSearchResult(
    result: any, 
    includeRelated: boolean
  ): Promise<ContentAwareSearchResult | null> {
    const embedding = result.embedding;
    const metadata = embedding.metadata;
    
    // Get content from registry for additional metadata
    let registryContent = null;
    if (metadata.contentType === 'article' || metadata.contentType === 'section') {
      registryContent = this.registry.articles.get(embedding.contentId);
    } else if (metadata.contentType === 'terminology') {
      registryContent = this.registry.terminology.get(embedding.contentId);
    } else if (metadata.contentType === 'lab') {
      registryContent = this.registry.labs.get(embedding.contentId);
    }

    if (!registryContent) {
      return null;
    }

    // Find related content
    const relatedContent = includeRelated 
      ? await this.findRelatedContent(embedding, registryContent)
      : [];

    return {
      type: this.mapContentType(metadata.contentType),
      id: embedding.contentId,
      title: embedding.content.title,
      description: registryContent.metadata.description,
      url: metadata.source,
      snippet: result.relevantContext,
      score: result.similarity,
      metadata: {
        difficulty: metadata.difficulty,
        technologies: metadata.technologies,
        tags: registryContent.metadata.tags,
        lastUpdated: metadata.lastUpdated
      },
      relatedContent
    };
  }

  private async findRelatedContent(embedding: any, content: any): Promise<any[]> {
    // Find content with similar tags
    const similarTags = content.metadata.tags;
    const relatedByTags = this.findContentByTags(similarTags, embedding.contentId);
    
    // Find content with similar embeddings
    const relatedByEmbedding = await this.findSimilarContent(embedding, 3);
    
    // Merge and deduplicate
    const allRelated = [...relatedByTags, ...relatedByEmbedding];
    const unique = this.deduplicateById(allRelated);
    
    return unique.slice(0, 3);
  }

  private findContentByTags(tags: string[], excludeId: string): any[] {
    const related: any[] = [];
    
    // Search articles
    for (const tag of tags) {
      const articles = this.registry.articles.getByTag(tag);
      articles.forEach(article => {
        if (article.metadata.id !== excludeId) {
          related.push({
            id: article.metadata.id,
            title: article.metadata.title,
            type: 'article',
            similarity: 0.8 // Tag-based similarity
          });
        }
      });
    }
    
    // Search terminology
    for (const tag of tags) {
      const terms = this.registry.terminology.getByTag(tag);
      terms.forEach(term => {
        if (term.metadata.id !== excludeId) {
          related.push({
            id: term.metadata.id,
            title: term.metadata.title,
            type: 'terminology',
            similarity: 0.7
          });
        }
      });
    }
    
    return related;
  }

  private async findSimilarContent(embedding: any, limit: number): Promise<any[]> {
    // This would use the vector store to find similar embeddings
    // For now, return empty array
    return [];
  }

  private mapContentType(contentType: string): ContentAwareSearchResult['type'] {
    switch (contentType) {
      case 'article':
      case 'section':
        return 'article';
      case 'terminology':
        return 'terminology';
      case 'lab':
        return 'lab';
      case 'contributor':
        return 'contributor';
      default:
        return 'article';
    }
  }

  private deduplicateById(items: any[]): any[] {
    const seen = new Set<string>();
    return items.filter(item => {
      if (seen.has(item.id)) {
        return false;
      }
      seen.add(item.id);
      return true;
    });
  }
}
```

This comprehensive RAG integration transforms your content-as-source architecture into a powerful knowledge system that can serve both traditional search and AI-powered assistance, with precise retrieval capabilities at the section level and sophisticated context understanding.
