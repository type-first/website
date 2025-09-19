import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`max-w-4xl mx-auto px-6 ${className}`}>
      <article className="prose prose-lg prose-gray max-w-none prose-headings:mb-4 prose-p:mb-3 prose-pre:mb-4">
        {children}
      </article>
    </div>
  );
}
