import React from 'react';

interface ArticleHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function ArticleHeader({ children, className = '' }: ArticleHeaderProps) {
  return <div className={`article-header ${className}`}>{children}</div>;
}
