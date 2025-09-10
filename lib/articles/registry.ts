/**
 * Module-based article registry
 * This file dynamically imports all module-based articles and exports their metadata
 */

import { ArticleMetadata } from '@/lib/article-compiler/types';

// Extended article metadata with slug for display purposes
export interface ArticleWithSlug extends ArticleMetadata {
  slug: string;
}

// Import article metadata from all module-based articles
export async function getAllArticles(): Promise<ArticleWithSlug[]> {
  const articles: ArticleWithSlug[] = [];

  try {
    // Import module-based-approach article
    const moduleBasedApproach = await import('@/app/articles/module-based-approach/page');
    articles.push({
      ...moduleBasedApproach.articleMetadata,
      slug: 'module-based-approach',
    });
  } catch (error) {
    console.warn('Failed to import module-based-approach:', error);
  }

  try {
    // Import getting-started-nextjs-15-app-router article
    const gettingStartedNextjs = await import('@/app/articles/getting-started-nextjs-15-app-router/page');
    articles.push({
      ...gettingStartedNextjs.articleMetadata,
      slug: 'getting-started-nextjs-15-app-router',
    });
  } catch (error) {
    console.warn('Failed to import getting-started-nextjs-15-app-router:', error);
  }

  try {
    // Import interactive-components-islands-architecture article
    const interactiveComponents = await import('@/app/articles/interactive-components-islands-architecture/page');
    articles.push({
      ...interactiveComponents.articleMetadata,
      slug: 'interactive-components-islands-architecture',
    });
  } catch (error) {
    console.warn('Failed to import interactive-components-islands-architecture:', error);
  }

  try {
    // Import advanced-typescript-patterns-react article
    const advancedTypescript = await import('@/app/articles/advanced-typescript-patterns-react/page');
    articles.push({
      ...advancedTypescript.articleMetadata,
      slug: 'advanced-typescript-patterns-react',
    });
  } catch (error) {
    console.warn('Failed to import advanced-typescript-patterns-react:', error);
  }

  try {
    // Import typescript-5-features-for-nextjs article
    const typescript5Features = await import('@/app/articles/typescript-5-features-for-nextjs/page');
    articles.push({
      ...typescript5Features.articleMetadata,
      slug: 'typescript-5-features-for-nextjs',
    });
  } catch (error) {
    console.warn('Failed to import typescript-5-features-for-nextjs:', error);
  }

  try {
    // Import rag-101-postgres-pgvector article
    const rag101 = await import('@/app/articles/rag-101-postgres-pgvector/page');
    articles.push({
      ...rag101.articleMetadata,
      slug: 'rag-101-postgres-pgvector',
    });
  } catch (error) {
    console.warn('Failed to import rag-101-postgres-pgvector:', error);
  }

  try {
    // Import typescript-generics-guide article (semantic components example)
    const typescriptGenerics = await import('@/app/articles/typescript-generics-guide/page');
    articles.push({
      ...typescriptGenerics.metadata,
      slug: 'typescript-generics-guide',
    });
  } catch (error) {
    console.warn('Failed to import typescript-generics-guide:', error);
  }

  try {
    // Import ai-driven-interfaces-react article
    const aiDrivenInterfaces = await import('@/app/articles/ai-driven-interfaces-react/page');
    articles.push({
      ...aiDrivenInterfaces.articleMetadata,
      slug: 'ai-driven-interfaces-react',
    });
  } catch (error) {
    console.warn('Failed to import ai-driven-interfaces-react:', error);
  }

  try {
    // Import nextjs-server-actions-ai-streaming-validation article
    const nextjsServerActions = await import('@/app/articles/nextjs-server-actions-ai-streaming-validation/page');
    articles.push({
      ...nextjsServerActions.articleMetadata,
      slug: 'nextjs-server-actions-ai-streaming-validation',
    });
  } catch (error) {
    console.warn('Failed to import nextjs-server-actions-ai-streaming-validation:', error);
  }

  try {
    // Import knowledge-curation-sources-to-collections article
    const knowledgeCuration = await import('@/app/articles/knowledge-curation-sources-to-collections/page');
    articles.push({
      ...knowledgeCuration.articleMetadata,
      slug: 'knowledge-curation-sources-to-collections',
    });
  } catch (error) {
    console.warn('Failed to import knowledge-curation-sources-to-collections:', error);
  }

  try {
    // Import personalized-recommendations-hybrid-retrieval article
    const personalizedRecommendations = await import('@/app/articles/personalized-recommendations-hybrid-retrieval/page');
    articles.push({
      ...personalizedRecommendations.articleMetadata,
      slug: 'personalized-recommendations-hybrid-retrieval',
    });
  } catch (error) {
    console.warn('Failed to import personalized-recommendations-hybrid-retrieval:', error);
  }

  // Sort by publishedAt date (newest first)
  return articles.sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return dateB - dateA;
  });
}

// Get all unique tags from module-based articles
export async function getAllTags(): Promise<string[]> {
  const articles = await getAllArticles();
  const allTags = articles.flatMap(article => article.tags);
  return [...new Set(allTags)].sort();
}

// Filter articles by tag
export async function getArticlesByTag(tag: string): Promise<ArticleWithSlug[]> {
  const articles = await getAllArticles();
  return articles.filter(article => 
    article.tags.some(articleTag => 
      articleTag.toLowerCase().includes(tag.toLowerCase())
    )
  );
}
