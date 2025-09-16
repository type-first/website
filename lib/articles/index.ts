/**
 * Main article system exports
 * Provides access to models and components
 * Registries are now in /registries directory
 */

// Core models and types
export * from './models';

// Metadata components for UI
export * from './components';

// Legacy class-based registries (deprecated - use /registries instead)
export { articleBrowsingRegistry, createBrowsableArticle } from './browsing-registry';
export { articleSearchRegistry } from './search-registry';

import type { 
  BrowsableArticle, 
  SearchableArticleSection, 
  FullArticle,
  ArticleMetadata,
  EmbeddableChunk 
} from './models';
import { articleBrowsingRegistry } from './browsing-registry';
import { articleSearchRegistry } from './search-registry';

/**
 * Unified article registry manager
 */
export class ArticleRegistryManager {
  /**
   * Register a full article for both browsing and search
   */
  async registerFullArticle(fullArticle: FullArticle): Promise<void> {
    // Register for browsing (client-safe)
    const browsableArticle: BrowsableArticle = {
      metadata: fullArticle.metadata,
      ui: {
        component: fullArticle.ui.component,
        // You can add preview and card components here
      },
      navigation: [
        { href: "/", label: "Home" },
        { href: "/articles", label: "Articles" },
        { href: "/community", label: "Community" },
      ],
    };

    articleBrowsingRegistry.register(browsableArticle);

    // Register for search (with embeddings if available)
    const embeddings = await this.loadEmbeddings(fullArticle.metadata.slug);
    
    articleSearchRegistry.registerArticleSections(
      fullArticle.metadata,
      fullArticle.embeddableChunks,
      fullArticle.markdown,
      embeddings
    );
  }

  /**
   * Register article for browsing only
   */
  registerForBrowsing(browsableArticle: BrowsableArticle): void {
    articleBrowsingRegistry.register(browsableArticle);
  }

  /**
   * Register article sections for search only
   */
  registerForSearch(
    articleMetadata: ArticleMetadata,
    embeddableChunks: EmbeddableChunk[],
    markdownContent: string,
    embeddings?: Array<{
      values: number[];
      dimension: number;
      model: string;
      createdAt: string;
    }>
  ): void {
    articleSearchRegistry.registerArticleSections(
      articleMetadata,
      embeddableChunks,
      markdownContent,
      embeddings
    );
  }

  /**
   * Load embeddings for an article
   */
  private async loadEmbeddings(articleSlug: string): Promise<Array<{
    values: number[];
    dimension: number;
    model: string;
    createdAt: string;
  }> | undefined> {
    try {
      // This would load from the generated embedding file
      const path = `../content/articles/${articleSlug}/data.embedding.generated.yml`;
      // Implementation would depend on your file loading strategy
      return undefined; // Placeholder
    } catch (error) {
      console.warn(`Could not load embeddings for article: ${articleSlug}`, error);
      return undefined;
    }
  }

  /**
   * Get browsing registry
   */
  getBrowsingRegistry() {
    return articleBrowsingRegistry;
  }

  /**
   * Get search registry
   */
  getSearchRegistry() {
    return articleSearchRegistry;
  }

  /**
   * Clear all registries
   */
  clear(): void {
    articleSearchRegistry.clear();
    // Note: browsing registry doesn't have a clear method since it's for client-side
  }
}

// Export singleton instance
export const articleRegistryManager = new ArticleRegistryManager();
