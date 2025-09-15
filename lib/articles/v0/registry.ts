// Re-export from root registry and add missing types/functions
import { 
  articlesRegistry, 
  getPublishedArticles, 
  getArticleBySlug,
  ArticleRegistryEntry 
} from '@/content/registries/articles.registry';

export type ArticleWithSlug = ArticleRegistryEntry;

export function getAllArticles(): ArticleWithSlug[] {
  return getPublishedArticles();
}

export { getArticleBySlug };
export type { ArticleRegistryEntry };
