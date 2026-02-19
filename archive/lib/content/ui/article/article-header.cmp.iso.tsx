import React from 'react';

interface ArticleHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function ArticleHeader({ children, className = '' }: ArticleHeaderProps) {
  return (
    <header className={`border-b border-gray-200 pb-4 mb-6 ${className}`}>
      {children}
    </header>
  );
}
