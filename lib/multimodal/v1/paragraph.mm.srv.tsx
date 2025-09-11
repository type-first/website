import React from 'react';
import { multimodal } from './multimodal.model';
import { MarkdownBlock } from './markdown-block.m.srv';

type ParagraphProps = {};

/**
 * Paragraph multimodal component - renders text paragraphs
 * Standard: HTML p element with styling
 * Markdown: Plain text with proper spacing via Block
 */
export const Paragraph = multimodal<ParagraphProps>({
  markdown: ({ children }) => (
    <MarkdownBlock modality="markdown">
      {children}
    </MarkdownBlock>
  )
})(({ children }) => (
  <p className="mb-6 text-gray-700 leading-relaxed">
    {children}
  </p>
));
