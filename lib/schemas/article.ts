export type ArticleStatus = 'draft' | 'published' | 'archived';

export interface Section {
  id?: string;
  type: string;
  content: any;
  metadata?: any;
  component?: string;
  author?: string;
  language?: string;
  textAlt?: string;
  source?: string;
  filename?: string;
}

export interface DerivedContent {
  id?: string;
  articleId: string;
  markdown: string;
  plaintext: string;
  outline: { level: number; title: string; id: string; }[];
  wordCount: number;
  readingTime: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SectionEmbedding {
  id?: string;
  articleId: string;
  sectionIndex: number;
  content: string;
  embedding: number[];
  createdAt?: Date;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: Section[];
  tags: string[];
  status: ArticleStatus;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  authorId?: string;
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
}
