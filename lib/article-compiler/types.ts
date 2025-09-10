// Article metadata that gets exported from article modules
export interface ArticleMetadata {
  title: string;
  description?: string;
  tags: string[];
  publishedAt?: Date;
  updatedAt?: Date;
  summary?: string;
  coverImage?: string;
  author?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
}

// Compiled article data for database storage
export interface CompiledArticle {
  slug: string;
  metadata: ArticleMetadata;
  html: string;          // Rendered HTML
  markdown: string;      // Converted to markdown for embeddings
  plainText: string;     // Stripped text for search
  outline: Array<{       // Table of contents
    level: number;
    title: string;
    id: string;
  }>;
  wordCount: number;
  readingTime: number;   // Estimated reading time in minutes
  lastCompiled: Date;
}

// What an article module should export
export interface ArticleExports {
  metadata: ArticleMetadata;
  
  // Optional exports for customization
  generateSummary?: () => string;
  getCustomPlainText?: () => string;
  getKeywords?: () => string[];
}
