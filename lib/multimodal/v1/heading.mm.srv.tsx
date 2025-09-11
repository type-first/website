import React from 'react';
import { multimodal } from './multimodal.model';
import { MarkdownBlock } from './markdown-block.m.srv';

type HeadingProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
};

/**
 * Heading multimodal component - renders headings at different levels
 * Standard: HTML heading elements with styling
 * Markdown: Markdown heading syntax with proper spacing via Block
 */
export const Heading = multimodal<HeadingProps>({
  markdown: ({ level, children }) => (
    <MarkdownBlock modality="markdown">
      <><>{'#'.repeat(level)}</> <>{children}</></>
    </MarkdownBlock>
  )
})(({ level, children }) => {
  const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  const sizeClasses = {
    1: 'text-4xl font-bold',
    2: 'text-3xl font-semibold', 
    3: 'text-2xl font-semibold',
    4: 'text-xl font-semibold',
    5: 'text-lg font-medium',
    6: 'text-base font-medium'
  };
  
  return React.createElement(
    HeadingTag,
    { className: `${sizeClasses[level]} text-gray-900 mb-4` },
    children
  );
});
