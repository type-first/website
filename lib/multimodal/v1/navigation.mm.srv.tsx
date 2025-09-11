import React from 'react';
import { multimodal } from './multimodal.model';
import { MarkdownBlock } from './markdown-block.m.srv';

type NavigationProps = {};

/**
 * Navigation multimodal component - renders navigation structure
 * Standard: nav element with styling
 * Markdown: Navigation links with proper spacing via Block
 */
export const Navigation = multimodal<NavigationProps>({
  markdown: ({ children }) => (
    <MarkdownBlock modality="markdown">
      {children}
    </MarkdownBlock>
  )
})(({ children }) => (
  <nav className="mb-8">
    {children}
  </nav>
));
