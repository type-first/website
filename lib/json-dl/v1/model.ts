import type { 
  Article, 
  BreadcrumbList, 
  Organization, 
  WebSite, 
  Person,
  ImageObject,
  WebPage,
  SearchAction,
  EntryPoint,
  ListItem,
  Thing
} from 'schema-dts';

// Helper types that include @context for JSON-LD
export type WithContext<T> = T & {
  '@context': 'https://schema.org';
};

export interface JsonLdData<T = Thing | WithContext<Thing>> {
  data: T;
}

/**
 * Helper function to create Article JSON-LD structure
 */
export function createArticleJsonLd({
  title,
  description,
  author,
  publishedAt,
  updatedAt,
  coverImage,
  tags,
  url,
  siteName = 'Our Blog',
  siteUrl = 'https://yoursite.com',
  logoUrl = 'https://yoursite.com/logo.png'
}: {
  title: string;
  description: string;
  author?: string;
  publishedAt?: Date;
  updatedAt?: Date;
  coverImage?: string;
  tags?: string[];
  url?: string;
  siteName?: string;
  siteUrl?: string;
  logoUrl?: string;
}): Article {
  return {
    '@type': 'Article',
    headline: title,
    description: description,
    image: coverImage,
    datePublished: publishedAt?.toISOString(),
    dateModified: updatedAt?.toISOString(),
    url: url,
    author: {
      '@type': 'Person',
      name: author || 'Unknown Author',
    } as Person,
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: logoUrl,
      } as ImageObject,
    } as Organization,
    keywords: tags?.join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url || siteUrl,
    } as WebPage,
  };
}

/**
 * Helper function to create BreadcrumbList JSON-LD structure
 */
export function createBreadcrumbJsonLd(breadcrumbs: Array<{ name: string; url: string }>): BreadcrumbList {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    } as ListItem)),
  };
}

/**
 * Helper function to create Organization JSON-LD structure
 */
export function createOrganizationJsonLd({
  name,
  url,
  logoUrl,
  description,
  socialLinks = []
}: {
  name: string;
  url: string;
  logoUrl: string;
  description?: string;
  socialLinks?: string[];
}): Organization {
  return {
    '@type': 'Organization',
    name: name,
    url: url,
    logo: {
      '@type': 'ImageObject',
      url: logoUrl,
    } as ImageObject,
    description: description,
    sameAs: socialLinks,
  };
}

/**
 * Helper function to create WebSite JSON-LD structure
 */
export function createWebSiteJsonLd({
  name,
  url,
  description,
  searchUrl
}: {
  name: string;
  url: string;
  description?: string;
  searchUrl?: string;
}): WebSite {
  const baseData = {
    '@type': 'WebSite',
    name: name,
    url: url,
    description: description,
  } as const;

  if (searchUrl) {
    return {
      ...baseData,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${searchUrl}?q={search_term_string}`,
        } as EntryPoint,
        'query-input': 'required name=search_term_string',
      } as SearchAction,
    };
  }

  return baseData;
}

/**
 * Pre-configured data constructors for common use cases
 */
export const JsonLdData = {
  Article: (metadata: {
    title: string;
    description: string;
    author?: string;
    publishedAt?: Date;
    updatedAt?: Date;
    coverImage?: string;
    tags?: string[];
  }, options?: {
    url?: string;
    siteName?: string;
    siteUrl?: string;
    logoUrl?: string;
  }) => createArticleJsonLd({
    ...metadata,
    ...options
  }),

  Breadcrumbs: (breadcrumbs: Array<{ name: string; url: string }>) => 
    createBreadcrumbJsonLd(breadcrumbs),

  Organization: (organization: {
    name: string;
    url: string;
    logoUrl: string;
    description?: string;
    socialLinks?: string[];
  }) => createOrganizationJsonLd(organization),

  WebSite: (website: {
    name: string;
    url: string;
    description?: string;
    searchUrl?: string;
  }) => createWebSiteJsonLd(website),
};
