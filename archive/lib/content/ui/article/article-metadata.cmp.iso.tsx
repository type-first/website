import React from 'react';
import { Calendar, User } from 'lucide-react';

interface ArticleMetadataProps {
  publishedAt: Date;
  author?: string;
  readTime?: string;
  className?: string;
}

export function ArticleMetadata({ 
  publishedAt, 
  author = 'Type-First Team',
  readTime = '8 min read',
  className = '' 
}: ArticleMetadataProps) {
  return (
    <div className={`flex items-center gap-6 text-sm text-gray-500 mt-4 ${className}`}>
      <div className="flex items-center gap-2">
        <User className="h-4 w-4" strokeWidth={1.8} />
        <span>{author}</span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4" strokeWidth={1.8} />
        <time dateTime={publishedAt.toISOString()}>
          {publishedAt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
      </div>
      <span>•</span>
      <span>{readTime}</span>
    </div>
  );
}
