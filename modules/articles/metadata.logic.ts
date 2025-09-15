/**
 * Article Metadata Logic
 * Utilities for converting article metadata to Next.js metadata format
 */

import { Metadata } from 'next';

export interface ArticleMetadata {
  title: string;
  description: string;
  tags: string[];
  publishedAt: Date;
  updatedAt?: Date;
  author: string;
  readingTime: string;
  coverImage?: string;
}

export interface ArticleMetadataOptions {
  siteName?: string;
  baseUrl?: string;
  authorTwitter?: string;
}

/**
 * Converts article metadata to Next.js Metadata format
 * @param articleMetadata - The article metadata object
 * @param options - Additional options for metadata generation
 * @returns Next.js Metadata object
 */
export function generateArticleMetadata(
  articleMetadata: ArticleMetadata,
  options: ArticleMetadataOptions = {}
): Metadata {
  const {
    siteName = 'Type-First',
    baseUrl = 'https://type-first.com',
    authorTwitter
  } = options;

  const {
    title,
    description,
    tags,
    publishedAt,
    updatedAt,
    coverImage,
    author
  } = articleMetadata;

  const fullTitle = `${title} | ${siteName}`;
  const images = coverImage ? [coverImage] : [];
  const publishedTime = publishedAt?.toISOString();
  const modifiedTime = updatedAt?.toISOString();

  return {
    title: fullTitle,
    description,
    authors: [{ name: author }],
    keywords: tags,
    openGraph: {
      title,
      description,
      type: 'article',
      siteName,
      publishedTime,
      modifiedTime,
      tags,
      images: images.map(image => ({
        url: image.startsWith('http') ? image : `${baseUrl}${image}`,
        alt: title
      })),
      authors: [author],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
      creator: authorTwitter,
    },
    other: {
      ...(publishedTime && { 'article:published_time': publishedTime }),
      ...(modifiedTime && { 'article:modified_time': modifiedTime }),
      'article:author': author,
      'article:section': tags[0] || 'Technology',
      'article:tag': tags.join(', '),
    }
  };
}

/**
 * Quick helper for standard Type-First article metadata
 * @param articleMetadata - The article metadata object
 * @returns Next.js Metadata object with Type-First defaults
 */
export function generateTypeFirstArticleMetadata(articleMetadata: ArticleMetadata): Metadata {
  return generateArticleMetadata(articleMetadata, {
    siteName: 'Type-First',
    baseUrl: 'https://type-first.com',
    authorTwitter: '@typefirst'
  });
}
