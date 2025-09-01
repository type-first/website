import { z } from 'zod';

// Base section types
export const TextSectionSchema = z.object({
  type: z.literal('text'),
  content: z.string(),
  id: z.string().optional(),
});

export const QuoteSectionSchema = z.object({
  type: z.literal('quote'),
  content: z.string(),
  author: z.string().optional(),
  source: z.string().optional(),
  id: z.string().optional(),
});

export const CodeSectionSchema = z.object({
  type: z.literal('code'),
  content: z.string(),
  language: z.string(),
  filename: z.string().optional(),
  id: z.string().optional(),
});

export const IslandSectionSchema = z.object({
  type: z.literal('island'),
  component: z.string(),
  props: z.record(z.any()).optional(),
  textAlt: z.string(), // Required for SEO/embeddings
  id: z.string().optional(),
});

export const SectionSchema = z.discriminatedUnion('type', [
  TextSectionSchema,
  QuoteSectionSchema,
  CodeSectionSchema,
  IslandSectionSchema,
]);

// Article status enum
export const ArticleStatusSchema = z.enum(['draft', 'published', 'archived']);

// Main article schema
export const ArticleSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().max(300).optional(),
  content: z.array(SectionSchema),
  tags: z.array(z.string()),
  status: ArticleStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  publishedAt: z.date().optional(),
  authorId: z.string().optional(),
  coverImage: z.string().url().optional(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  canonicalUrl: z.string().url().optional(),
});

// Derived content schema
export const DerivedContentSchema = z.object({
  articleId: z.string().uuid(),
  markdown: z.string(),
  plaintext: z.string(),
  outline: z.array(z.object({
    level: z.number(),
    title: z.string(),
    id: z.string(),
  })),
  searchVector: z.string().optional(), // Serialized vector
  updatedAt: z.date(),
});

// Section embedding schema
export const SectionEmbeddingSchema = z.object({
  id: z.string().uuid(),
  articleId: z.string().uuid(),
  sectionIndex: z.number(),
  content: z.string(),
  embedding: z.array(z.number()), // Vector embedding
  createdAt: z.date(),
});

// Type exports
export type Article = z.infer<typeof ArticleSchema>;
export type ArticleStatus = z.infer<typeof ArticleStatusSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type TextSection = z.infer<typeof TextSectionSchema>;
export type QuoteSection = z.infer<typeof QuoteSectionSchema>;
export type CodeSection = z.infer<typeof CodeSectionSchema>;
export type IslandSection = z.infer<typeof IslandSectionSchema>;
export type DerivedContent = z.infer<typeof DerivedContentSchema>;
export type SectionEmbedding = z.infer<typeof SectionEmbeddingSchema>;

// Article metadata for listings
export const ArticleMetadataSchema = ArticleSchema.pick({
  id: true,
  title: true,
  slug: true,
  description: true,
  tags: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
  coverImage: true,
});

export type ArticleMetadata = z.infer<typeof ArticleMetadataSchema>;

// Search result schema
export const SearchResultSchema = z.object({
  article: ArticleMetadataSchema,
  snippet: z.string(),
  score: z.number(),
  matchType: z.enum(['text', 'vector']),
});

export type SearchResult = z.infer<typeof SearchResultSchema>;

// API response schemas
export const ArticleListResponseSchema = z.object({
  articles: z.array(ArticleMetadataSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export type ArticleListResponse = z.infer<typeof ArticleListResponseSchema>;
