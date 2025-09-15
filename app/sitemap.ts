import { MetadataRoute } from 'next';
import { listArticles } from '@/lib/db/v0/articles';

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
    const articles = await listArticles({ 
      status: 'published',
      limit: 10000 // Get all articles
    });

    // Article routes
    const articleRoutes: MetadataRoute.Sitemap = articles.map((article: any) => ({
      url: `${baseUrl}/article/${article.slug}`,
      lastModified: article.updatedAt,
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
