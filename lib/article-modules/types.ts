import { ComponentType } from 'react';

// Core section types for module-based articles
export interface TextSection {
  type: 'text';
  content: string;
  id?: string;
}

export interface CodeSection {
  type: 'code';
  content: string;
  language: string;
  filename?: string;
  id?: string;
}

export interface QuoteSection {
  type: 'quote';
  content: string;
  author?: string;
  source?: string;
  id?: string;
}

export interface IslandSection {
  type: 'island';
  component: ComponentType<any>;
  props?: Record<string, any>;
  textAlt: string; // For SEO/RAG contexts
  id?: string;
}

export type Section = TextSection | CodeSection | QuoteSection | IslandSection;

// Article metadata interface
export interface ArticleMetadata {
  title: string;
  description?: string;
  tags: string[];
  publishedAt?: Date;
  updatedAt?: Date;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  coverImage?: string;
  author?: string;
}

// Complete article module interface
export interface ArticleModule {
  metadata: ArticleMetadata;
  sections: Section[];
  
  // Optional exports for different contexts
  getPlainText?: () => string;
  getMarkdown?: () => string;
  getOutline?: () => Array<{ level: number; title: string; id: string }>;
  getSearchableContent?: () => string;
  
  // For SEO and static generation
  generateMetadata?: () => any;
  getJsonLd?: () => any;
}

// Registry entry
export interface ArticleRegistryEntry {
  slug: string;
  filePath: string;
  metadata: ArticleMetadata;
  module: () => Promise<ArticleModule>;
}

// Export for dynamic imports
export type ArticleModuleExport = {
  default: ArticleModule;
};
