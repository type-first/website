import React from 'react';

interface ArticleProps {
  children: React.ReactNode;
  className?: string;
}

export function Article({ children, className = '' }: ArticleProps) {
  return (
    <article className={className}>
      {children}
    </article>
  );
}
