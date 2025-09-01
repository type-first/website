import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com';
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!isProduction) {
    // Block all crawlers in non-production environments
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/articles?*', // Disallow paginated article pages with query params
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
