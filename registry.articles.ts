/**
 * Article Registry
 * Central registry for all articles in the application
 */

import { articleMetadata as advancedTypescriptPatternsReactMeta } from './articles/advanced-typescript-patterns-react/meta';

export interface ArticleRegistryEntry {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  publishedAt: Date;
  updatedAt?: Date;
  author: string;
  readingTime: string;
  coverImage?: string;
  status: 'published' | 'draft';
  seoTitle?: string;
  seoDescription?: string;
}

// Registry of all articles
export const articlesRegistry: ArticleRegistryEntry[] = [
  {
    slug: 'advanced-typescript-patterns-react',
    title: advancedTypescriptPatternsReactMeta.title,
    description: advancedTypescriptPatternsReactMeta.description,
    tags: advancedTypescriptPatternsReactMeta.tags,
    publishedAt: advancedTypescriptPatternsReactMeta.publishedAt,
    updatedAt: advancedTypescriptPatternsReactMeta.updatedAt,
    author: advancedTypescriptPatternsReactMeta.author,
    readingTime: advancedTypescriptPatternsReactMeta.readingTime,
    coverImage: advancedTypescriptPatternsReactMeta.coverImage,
    status: 'published',
  },
];

// Helper functions
export function getArticleBySlug(slug: string): ArticleRegistryEntry | undefined {
  return articlesRegistry.find(article => article.slug === slug);
}

export function getPublishedArticles(): ArticleRegistryEntry[] {
  return articlesRegistry.filter(article => article.status === 'published');
}

export function getArticlesByTag(tag: string): ArticleRegistryEntry[] {
  return articlesRegistry.filter(article => 
    article.status === 'published' && article.tags.includes(tag)
  );
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  articlesRegistry.forEach(article => {
    if (article.status === 'published') {
      article.tags.forEach(tag => tags.add(tag));
    }
  });
  return Array.from(tags).sort();
}

export interface ListArticlesOptions {
  status?: 'published' | 'draft';
  limit?: number;
  offset?: number;
  tags?: string[];
}

export function listArticles(options: ListArticlesOptions = {}) {
  const {
    status = 'published',
    limit,
    offset = 0,
    tags,
  } = options;

  // Filter articles
  let filteredArticles = articlesRegistry.filter(article => article.status === status);
  
  if (tags && tags.length > 0) {
    filteredArticles = filteredArticles.filter(article =>
      tags.some(tag => article.tags.includes(tag))
    );
  }

  // Sort by publication date (newest first)
  filteredArticles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  const total = filteredArticles.length;
  
  // Apply pagination
  if (limit !== undefined) {
    filteredArticles = filteredArticles.slice(offset, offset + limit);
  }

  return {
    articles: filteredArticles,
    total,
  };
}