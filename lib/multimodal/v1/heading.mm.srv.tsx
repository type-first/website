import React from 'react';
import { multimodal } from './multimodal.model';

type HeadingProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
};

/**
 * Heading multimodal component - renders semantic headings
 * Standard: Appropriate h1-h6 element with styling
 * Markdown: Markdown heading syntax (# ## ### etc.)
 */
export const Heading = multimodal<HeadingProps>({
  markdown: ({ level, children }) => {
    const hashes = '#'.repeat(level);
    return `${hashes} ${children}\n\n`;
  }
})(({ level, children }) => {
  const sizeClasses = {
    1: 'text-4xl font-bold mb-8',
    2: 'text-3xl font-bold mb-6 mt-12',
    3: 'text-2xl font-semibold mb-4 mt-8',
    4: 'text-xl font-semibold mb-3 mt-6',
    5: 'text-lg font-semibold mb-2 mt-4',
    6: 'text-base font-semibold mb-2 mt-4'
  };

  const tagName = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  
  return React.createElement(
    tagName,
    { className: sizeClasses[level] },
    children
  );
});
