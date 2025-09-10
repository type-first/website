import { readdir, stat } from 'fs/promises';
import path from 'path';
import { ArticleModule, ArticleRegistryEntry, ArticleModuleExport } from './types';

class ArticleRegistry {
  private cache = new Map<string, ArticleModule>();
  private entries: ArticleRegistryEntry[] = [];
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    // Find all article modules
    const articlesDir = path.join(process.cwd(), 'articles');
    const articleFiles = await this.findArticleFiles(articlesDir);

    this.entries = await Promise.all(
      articleFiles.map(async (filePath: string) => {
        const relativePath = path.relative(process.cwd(), filePath);
        const slug = this.getSlugFromPath(relativePath);
        
        // Dynamic import to get metadata without loading the full module
        const moduleExport: ArticleModuleExport = await import(filePath);
        const module = moduleExport.default;

        return {
          slug,
          filePath: relativePath,
          metadata: module.metadata,
          module: () => import(filePath).then(m => m.default),
        };
      })
    );

    this.initialized = true;
  }

  private async findArticleFiles(dir: string): Promise<string[]> {
    try {
      const files: string[] = [];
      const entries = await readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          const subFiles = await this.findArticleFiles(fullPath);
          files.push(...subFiles);
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.js'))) {
          files.push(fullPath);
        }
      }

      return files;
    } catch (error) {
      // Directory doesn't exist yet
      return [];
    }
  }

  private getSlugFromPath(filePath: string): string {
    // Convert file path to slug: articles/getting-started/index.ts -> getting-started
    // Or: articles/nextjs-guide.ts -> nextjs-guide
    const withoutExtension = filePath.replace(/\.(ts|js)$/, '');
    const withoutArticlesPrefix = withoutExtension.replace(/^articles\//, '');
    const withoutIndex = withoutArticlesPrefix.replace(/\/index$/, '');
    return withoutIndex;
  }

  async getArticle(slug: string): Promise<ArticleModule | null> {
    await this.initialize();

    if (this.cache.has(slug)) {
      return this.cache.get(slug)!;
    }

    const entry = this.entries.find(e => e.slug === slug);
    if (!entry) return null;

    const module = await entry.module();
    this.cache.set(slug, module);
    return module;
  }

  async getAllArticles(): Promise<ArticleRegistryEntry[]> {
    await this.initialize();
    return [...this.entries];
  }

  async getPublishedArticles(): Promise<ArticleRegistryEntry[]> {
    const all = await this.getAllArticles();
    return all.filter(entry => {
      // In module system, we consider an article published if:
      // 1. It has a publishedAt date in the past, OR
      // 2. It doesn't have a publishedAt date (immediate publication)
      const { publishedAt } = entry.metadata;
      return !publishedAt || publishedAt <= new Date();
    });
  }

  async getArticlesByTag(tag: string): Promise<ArticleRegistryEntry[]> {
    const all = await this.getAllArticles();
    return all.filter(entry => 
      entry.metadata.tags.includes(tag)
    );
  }

  // Clear cache when in development
  clearCache() {
    this.cache.clear();
  }

  // Generate static paths for Next.js
  async getStaticPaths() {
    const published = await this.getPublishedArticles();
    return published.map(entry => ({
      params: { slug: entry.slug }
    }));
  }
}

// Singleton instance
export const articleRegistry = new ArticleRegistry();

// Utility functions
export async function getArticleBySlug(slug: string): Promise<ArticleModule | null> {
  return articleRegistry.getArticle(slug);
}

export async function getAllArticles(): Promise<ArticleRegistryEntry[]> {
  return articleRegistry.getAllArticles();
}

export async function getPublishedArticles(): Promise<ArticleRegistryEntry[]> {
  return articleRegistry.getPublishedArticles();
}
