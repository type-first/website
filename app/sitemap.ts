import { MetadataRoute } from 'next';
import { articlesMetaRegistry } from '@/content/articles/meta.registry';
import { docsMetaRegistry } from '@/content/docs/meta.registry';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com';
  
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  try {
    // Get all published articles
    const articles = articlesMetaRegistry;

    // Article routes
    const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
      url: `${baseUrl}/article/${article.slug}`,
      lastModified: new Date(article.publishedTs),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // Get all documentation libraries
    const docLibraries = docsMetaRegistry;
    
    // Documentation routes
    const docRoutes: MetadataRoute.Sitemap = [];
    
    docLibraries.forEach((library) => {
      // Library index page
      docRoutes.push({
        url: `${baseUrl}/docs/${library.slug}`,
        lastModified: new Date(library.updatedTs),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      });
      
      // Individual documentation pages
      const flattenPages = (pages: typeof library.pages): typeof library.pages => {
        const result: typeof library.pages = [];
        pages.forEach(page => {
          result.push(page);
          if (page.children) {
            result.push(...flattenPages(page.children));
          }
        });
        return result;
      };
      
      const allPages = flattenPages(library.pages);
      
      allPages.forEach((page) => {
        docRoutes.push({
          url: `${baseUrl}/docs/${library.slug}/${page.path.join('/')}`,
          lastModified: new Date(page.updatedTs),
          changeFrequency: 'weekly' as const,
          priority: 0.5,
        });
      });
    });

    return [...staticRoutes, ...articleRoutes, ...docRoutes];
  } catch (error) {
    // If database is not available, return just static routes
    console.warn('Database not available for sitemap generation:', 
      error instanceof Error ? error.message : String(error));
    return staticRoutes;
  }
}
