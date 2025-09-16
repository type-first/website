import { MetadataRoute } from 'next';
import { articlesMetaRegistry } from '@/content/articles/meta.registry';

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

    return [...staticRoutes, ...articleRoutes];
  } catch (error) {
    // If database is not available, return just static routes
    console.warn('Database not available for sitemap generation:', 
      error instanceof Error ? error.message : String(error));
    return staticRoutes;
  }
}
