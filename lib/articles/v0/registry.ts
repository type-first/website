// Re-export from root registry and add missing types/functions
import { 
  articlesRegistry, 
  getPublishedArticles, 
  getArticleBySlug,
  ArticleRegistryEntry 
} from '@/registry.articles';

export type ArticleWithSlug = ArticleRegistryEntry;

export function getAllArticles(): ArticleWithSlug[] {
  return getPublishedArticles();
}

export { getArticleBySlug };
export type { ArticleRegistryEntry };
