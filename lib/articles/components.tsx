/**
 * Article metadata components for browsing and search UIs
 */

import React from 'react';
import Link from 'next/link';
import type { ArticleMetadata } from './models';

/**
 * Article card component for browsing grids
 */
export function ArticleCard({ 
  metadata, 
  href 
}: { 
  metadata: ArticleMetadata; 
  href: string; 
}) {
  return (
    <Link href={href} className="group block">
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <time dateTime={metadata.publishedAt}>
                {new Date(metadata.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              {metadata.readingTime && (
                <>
                  <span>•</span>
                  <span>{metadata.readingTime}</span>
                </>
              )}
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {metadata.title}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {metadata.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {metadata.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                >
                  {tag}
                </span>
              ))}
              {metadata.tags.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{metadata.tags.length - 3} more
                </span>
              )}
            </div>
            
            <span className="text-sm text-gray-500 dark:text-gray-400">
              by {metadata.author}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

/**
 * Compact article list item for search results
 */
export function ArticleListItem({ 
  metadata, 
  href,
  snippet
}: { 
  metadata: ArticleMetadata; 
  href: string;
  snippet?: string;
}) {
  return (
    <Link href={href} className="group block">
      <article className="py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
              {metadata.title}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
              {snippet || metadata.description}
            </p>
            
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <time dateTime={metadata.publishedAt}>
                {new Date(metadata.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </time>
              
              <span>by {metadata.author}</span>
              
              {metadata.readingTime && (
                <>
                  <span>•</span>
                  <span>{metadata.readingTime}</span>
                </>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {metadata.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

/**
 * Article preview component for featured content
 */
export function ArticlePreview({ 
  metadata, 
  href 
}: { 
  metadata: ArticleMetadata; 
  href: string; 
}) {
  return (
    <Link href={href} className="group block">
      <article className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 transition-all hover:shadow-lg">
        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 mb-3">
          <time dateTime={metadata.publishedAt}>
            {new Date(metadata.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          {metadata.readingTime && (
            <>
              <span>•</span>
              <span>{metadata.readingTime}</span>
            </>
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {metadata.title}
        </h2>
        
        <p className="text-gray-700 dark:text-gray-300 mb-6 line-clamp-3">
          {metadata.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {metadata.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/60 text-blue-700 dark:bg-gray-700/60 dark:text-blue-300"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            by {metadata.author}
          </span>
        </div>
      </article>
    </Link>
  );
}

/**
 * Article metadata badge for inline display
 */
export function ArticleBadge({ 
  metadata 
}: { 
  metadata: Pick<ArticleMetadata, 'publishedAt' | 'readingTime' | 'author'>;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
      <time dateTime={metadata.publishedAt}>
        {new Date(metadata.publishedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
      </time>
      
      <span>by {metadata.author}</span>
      
      {metadata.readingTime && (
        <>
          <span>•</span>
          <span>{metadata.readingTime}</span>
        </>
      )}
    </div>
  );
}
