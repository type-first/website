import React from 'react';
import type { Thing } from 'schema-dts';
import { 
  WithContext, 
  JsonLdData, 
  createArticleJsonLd, 
  createBreadcrumbJsonLd, 
  createOrganizationJsonLd, 
  createWebSiteJsonLd 
} from '@/lib/json-dl/v0/model';
import { Modality, multimodal } from './multimodal-model';

type JsonLdProps = { data: Thing };

/**
 * Multimodal server component for rendering JSON-LD structured data
 * This component outputs structured data that search engines can understand
 * In markdown mode, it renders nothing (since JSON-LD doesn't make sense in markdown)
 * In standard mode, it renders the JSON-LD script tag with @context automatically added
 */
export const JsonLd = multimodal<JsonLdProps>({
  markdown: () => ''
})(({ data }) => {
  // Always add @context to make it valid JSON-LD
  const jsonLdData: WithContext<Thing> = Object.assign(
    { '@context': 'https://schema.org' as const },
    data
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData, null, 2) }}
    />
  );
});

/**
 * Pre-configured JsonLd React components for common use cases
 * These components automatically handle modality - they won't render in markdown mode
 */
export const JsonLdComponents = {
  Article: multimodal<{
    metadata: {
      title: string;
      description: string;
      author?: string;
      publishedAt?: Date;
      updatedAt?: Date;
      coverImage?: string;
      tags?: string[];
    };
    url?: string;
    siteName?: string;
    siteUrl?: string;
    logoUrl?: string;
  }>({
    markdown: () => ''
  })(({ metadata, url, siteName, siteUrl, logoUrl }) => (
    <JsonLd 
      data={createArticleJsonLd({
        ...metadata,
        url,
        siteName,
        siteUrl,
        logoUrl
      })} 
      modality={null}
    />
  )),

  Breadcrumbs: multimodal<{ 
    breadcrumbs: Array<{ name: string; url: string }>;
  }>({
    markdown: () => ''
  })(({ breadcrumbs }) => (
    <JsonLd data={createBreadcrumbJsonLd(breadcrumbs)} modality={null} />
  )),

  Organization: multimodal<{ 
    organization: {
      name: string;
      url: string;
      logoUrl: string;
      description?: string;
      socialLinks?: string[];
    };
  }>({
    markdown: () => ''
  })(({ organization }) => (
    <JsonLd data={createOrganizationJsonLd(organization)} modality={null} />
  )),

  WebSite: multimodal<{ 
    website: {
      name: string;
      url: string;
      description?: string;
      searchUrl?: string;
    };
  }>({
    markdown: () => ''
  })(({ website }) => (
    <JsonLd data={createWebSiteJsonLd(website)} modality={null} />
  )),
};

export default JsonLd;
