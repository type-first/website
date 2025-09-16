/**
 * Article metadata components for browsing and search UIs
 */

import type { ComponentType } from 'react';
import type { ArticleMetadata } from './models';

/**
 * Article card component props
 */
export interface ArticleCardProps {
  metadata: ArticleMetadata;
  href: string;
  className?: string;
}

/**
 * Article preview component props
 */
export interface ArticlePreviewProps {
  metadata: ArticleMetadata;
  excerpt?: string;
  href: string;
  className?: string;
}

/**
 * Article list item component props
 */
export interface ArticleListItemProps {
  metadata: ArticleMetadata;
  href: string;
  showDescription?: boolean;
  className?: string;
}

/**
 * Search result component props
 */
export interface SearchResultProps {
  metadata: ArticleMetadata;
  sectionTitle?: string;
  excerpt: string;
  href: string;
  highlightQuery?: string;
  className?: string;
}

/**
 * Article metadata display component props
 */
export interface ArticleMetadataProps {
  metadata: ArticleMetadata;
  showTags?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  showReadingTime?: boolean;
  className?: string;
}

/**
 * Article tag component props
 */
export interface ArticleTagProps {
  tag: string;
  href?: string;
  onClick?: (tag: string) => void;
  className?: string;
}

/**
 * Article browsing UI components
 */
export interface ArticleBrowsingUI {
  // Card for grid layouts
  ArticleCard: ComponentType<ArticleCardProps>;
  
  // Preview for featured articles
  ArticlePreview: ComponentType<ArticlePreviewProps>;
  
  // List item for simple lists
  ArticleListItem: ComponentType<ArticleListItemProps>;
  
  // Search result for search pages
  SearchResult: ComponentType<SearchResultProps>;
  
  // Metadata display component
  ArticleMetadata: ComponentType<ArticleMetadataProps>;
  
  // Tag component
  ArticleTag: ComponentType<ArticleTagProps>;
}

/**
 * Default article browsing UI components
 * These would be implemented as actual React components
 */
export const defaultArticleBrowsingUI: ArticleBrowsingUI = {
  ArticleCard: ({ metadata, href, className = '' }) => {
    // This would be a real React component
    return null as any;
  },
  
  ArticlePreview: ({ metadata, excerpt, href, className = '' }) => {
    // This would be a real React component
    return null as any;
  },
  
  ArticleListItem: ({ metadata, href, showDescription = true, className = '' }) => {
    // This would be a real React component
    return null as any;
  },
  
  SearchResult: ({ metadata, sectionTitle, excerpt, href, highlightQuery, className = '' }) => {
    // This would be a real React component
    return null as any;
  },
  
  ArticleMetadata: ({ metadata, showTags = true, showAuthor = true, showDate = true, showReadingTime = true, className = '' }) => {
    // This would be a real React component
    return null as any;
  },
  
  ArticleTag: ({ tag, href, onClick, className = '' }) => {
    // This would be a real React component
    return null as any;
  },
};
