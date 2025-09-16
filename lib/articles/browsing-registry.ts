/**
 * Article browsing registry
 * Client-side safe registry with metadata and UI components only
 * No full article content to keep bundle size small
 */

import type { BrowsableArticle } from './models/browsable-article.model';
import { defaultArticleBrowsingUI } from './components';

/**
 * Registry for browsable articles (client-side)
 * Contains only metadata and mountable components
 */
class ArticleBrowsingRegistry {
  private articles = new Map<string, BrowsableArticle>();

  /**
   * Register an article for browsing
   */
  register(article: BrowsableArticle): void {
    this.articles.set(article.metadata.slug, article);
  }

  /**
   * Get all articles for browsing
   */
  getAll(): BrowsableArticle[] {
    return Array.from(this.articles.values());
  }

  /**
   * Get article by slug
   */
  getBySlug(slug: string): BrowsableArticle | undefined {
    return this.articles.get(slug);
  }

  /**
   * Get articles by tag
   */
  getByTag(tag: string): BrowsableArticle[] {
    return this.getAll().filter(article => 
      article.metadata.tags.includes(tag)
    );
  }

  /**
   * Get articles by author
   */
  getByAuthor(author: string): BrowsableArticle[] {
    return this.getAll().filter(article => 
      article.metadata.author === author
    );
  }

  /**
   * Get articles by category
   */
  getByCategory(category: string): BrowsableArticle[] {
    return this.getAll().filter(article => 
      article.metadata.category === category
    );
  }

  /**
   * Search articles by title/description
   */
  search(query: string): BrowsableArticle[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getAll().filter(article => 
      article.metadata.title.toLowerCase().includes(lowercaseQuery) ||
      article.metadata.description.toLowerCase().includes(lowercaseQuery) ||
      article.metadata.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  /**
   * Get all unique tags
   */
  getAllTags(): string[] {
    const tags = new Set<string>();
    this.getAll().forEach(article => {
      article.metadata.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }

  /**
   * Get all unique authors
   */
  getAllAuthors(): string[] {
    const authors = new Set<string>();
    this.getAll().forEach(article => {
      authors.add(article.metadata.author);
    });
    return Array.from(authors).sort();
  }

  /**
   * Get all unique categories
   */
  getAllCategories(): string[] {
    const categories = new Set<string>();
    this.getAll().forEach(article => {
      if (article.metadata.category) {
        categories.add(article.metadata.category);
      }
    });
    return Array.from(categories).sort();
  }
}

// Export singleton instance
export const articleBrowsingRegistry = new ArticleBrowsingRegistry();

// Helper function to create browsable article
export function createBrowsableArticle(config: {
  metadata: BrowsableArticle['metadata'];
  ui: BrowsableArticle['ui'];
  navigation?: BrowsableArticle['navigation'];
  codeExplore?: BrowsableArticle['codeExplore'];
}): BrowsableArticle {
  return {
    metadata: config.metadata,
    ui: {
      component: config.ui.component,
      previewComponent: config.ui.previewComponent || defaultArticleBrowsingUI.ArticlePreview,
      cardComponent: config.ui.cardComponent || defaultArticleBrowsingUI.ArticleCard,
    },
    navigation: config.navigation || [
      { href: "/", label: "Home" },
      { href: "/articles", label: "Articles" },
    ],
    codeExplore: config.codeExplore,
  };
}
