/**
 * Core article models for different use cases
 */

import type { ComponentType } from 'react';

/**
 * Core article metadata
 */
export interface ArticleMetadata {
  id: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  readingTime?: string;
  slug: string;
  category?: string;
}

/**
 * Article model for browsing UI (client-side)
 * Contains metadata and mountable components but no full content
 */
export interface BrowsableArticle {
  metadata: ArticleMetadata;
  ui: {
    component: ComponentType<any>;
    previewComponent?: ComponentType<any>;
    cardComponent?: ComponentType<any>;
  };
  navigation: {
    href: string;
    label: string;
  }[];
  codeExplore?: {
    slug: string;
    name: string;
    description: string;
  };
}

/**
 * Article section for search functionality (backend)
 * Flat structure with embedded content and embeddings
 */
export interface SearchableArticleSection {
  // Section identification
  sectionId: string;
  sectionTitle: string;
  sectionType: 'metadata' | 'introduction' | 'section' | 'footer';
  sectionOrder: number;
  
  // Article context
  articleMetadata: ArticleMetadata;
  
  // Content for search (no code snippets)
  markdownContent: string;
  textContent: string; // plain text version for simple text search
  
  // Embeddings for vector search
  embedding?: {
    values: number[];
    dimension: number;
    model: string;
    createdAt: string;
  };
  
  // Additional metadata
  searchMetadata: {
    hasCodeSnippet: boolean;
    hasPractices: boolean;
    contentLength: number;
    estimatedTokens: number;
  };
}

/**
 * Full article model (server-side only)
 * Contains all content including code snippets
 */
export interface FullArticle {
  metadata: ArticleMetadata;
  content: {
    introduction: string;
    sections: ArticleSection[];
    footer: {
      title: string;
      content: string;
    };
  };
  ui: {
    component: ComponentType<any>;
  };
  embeddableChunks: EmbeddableChunk[];
  markdown: string; // Full markdown without code snippets
}

/**
 * Article section structure
 */
export interface ArticleSection {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  codeSnippet?: {
    language: string;
    filename: string;
    code: string;
  };
  practices?: Array<{
    title: string;
    description: string;
  }>;
}

/**
 * Embeddable chunk structure
 */
export interface EmbeddableChunk {
  id: string;
  type: 'metadata' | 'introduction' | 'section' | 'footer';
  title?: string;
  subtitle?: string;
  text: string;
  metadata: Record<string, any>;
}

/**
 * Registry configuration
 */
export interface ArticleRegistryConfig {
  baseUrl: string;
  contentPath: string;
  articlesPath: string;
}
