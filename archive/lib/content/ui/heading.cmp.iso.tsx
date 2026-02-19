import React from 'react';

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

export function Heading({ level, children, className = '' }: HeadingProps) {
  const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  
  const baseClasses = {
    1: 'text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight',
    2: 'text-3xl md:text-4xl font-bold text-gray-900 mb-6 mt-8 leading-tight border-b border-gray-200 pb-3',
    3: 'text-2xl md:text-3xl font-semibold text-gray-900 mb-4 mt-6 leading-tight',
    4: 'text-xl md:text-2xl font-semibold text-gray-900 mb-3 mt-5 leading-tight',
    5: 'text-lg md:text-xl font-semibold text-gray-900 mb-2 mt-4 leading-tight',
    6: 'text-base md:text-lg font-semibold text-gray-900 mb-2 mt-3 leading-tight'
  };
  
  return (
    <HeadingTag className={`${baseClasses[level]} ${className}`}>
      {children}
    </HeadingTag>
  );
}
