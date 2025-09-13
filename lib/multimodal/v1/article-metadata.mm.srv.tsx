import React from 'react';
import { multimodal } from './multimodal-model';
import { MarkdownBlock } from './markdown-block.m.srv';

type ArticleMetadataProps = {
  publishedAt: Date;
  updatedAt?: Date;
};

/**
 * ArticleMetadata multimodal component - renders article publication metadata
 * Standard: Styled metadata section with publication and update dates
 * Markdown: Simple text with publication info using MarkdownBlock
 */
export const ArticleMetadata = multimodal<ArticleMetadataProps>({
  markdown: ({ publishedAt, updatedAt }) => {
    const publishedText = `Published: ${publishedAt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}`;
    
    const updatedText = updatedAt && updatedAt > publishedAt 
      ? ` | Updated: ${updatedAt.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}`
      : '';
    
    return (
      <MarkdownBlock modality="markdown">
        <>*</>
        <>{publishedText}</>
        <>{updatedText}</>
        <>*</>
      </MarkdownBlock>
    );
  }
})(({ publishedAt, updatedAt }) => (
  <div className="flex items-center gap-4 text-sm text-gray-500">
    <time dateTime={publishedAt.toISOString()}>
      Published {publishedAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </time>
    
    {updatedAt && updatedAt > publishedAt && (
      <span>
        • Updated {updatedAt.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </span>
    )}
  </div>
));
