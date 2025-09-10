import { ArticleMetadata } from '@/lib/article-compiler/types';
import { ARTICLE_TAGS } from '@/lib/article-compiler/tags';

export const metadata: ArticleMetadata = {
  title: "Module-Based Articles: A New Approach to Content Management",
  description: "Exploring how treating articles as TypeScript modules provides better type safety, performance, and developer experience compared to traditional CMS approaches.",
  tags: [
    ARTICLE_TAGS.TYPESCRIPT,
    ARTICLE_TAGS.NEXTJS,
    ARTICLE_TAGS.ARCHITECTURE,
    ARTICLE_TAGS.GUIDE,
  ],
  publishedAt: new Date('2024-01-20T10:00:00Z'),
  updatedAt: new Date('2024-01-20T10:00:00Z'),
  seoTitle: "Module-Based Articles - TypeScript Content Management System",
  seoDescription: "Learn how to build a type-safe, flexible content system using TypeScript modules instead of traditional database-driven CMS approaches.",
  author: "Your Name",
  coverImage: "/images/covers/module-based-articles.jpg",
};

// Optional: Custom summary generation
export function generateSummary(): string {
  return "This article explores a novel approach to content management where articles are defined as TypeScript modules rather than database documents, providing enhanced type safety, better performance, and superior developer experience.";
}

// Optional: Custom search keywords
export function getKeywords(): string[] {
  return [
    'typescript articles',
    'module-based cms',
    'type-safe content',
    'nextjs articles',
    'content compilation',
    'article modules',
  ];
}
