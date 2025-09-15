import React from 'react';

interface CodeProps {
  children: React.ReactNode;
  className?: string;
  language?: string;
}

export function Code({ children, className = '', language }: CodeProps) {
  return (
    <pre className={className}>
      <code className={language ? `language-${language}` : ''}>
        {children}
      </code>
    </pre>
  );
}
