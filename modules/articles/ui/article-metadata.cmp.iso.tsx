import React from 'react';

interface ArticleMetadataProps {
  publishedAt: Date;
  className?: string;
}

export function ArticleMetadata({ publishedAt, className = '' }: ArticleMetadataProps) {
  return (
    <div className={`article-metadata ${className}`}>
      <time dateTime={publishedAt.toISOString()}>
        {publishedAt.toLocaleDateString()}
      </time>
    </div>
  );
}
