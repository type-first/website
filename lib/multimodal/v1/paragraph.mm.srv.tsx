import React from 'react';
import { multimodal } from './multimodal-model';
import { MarkdownBlock } from './markdown-block.m.srv';
import { createIndent, escapeYMLString } from './yml-primitives';

type ParagraphProps = {};

/**
 * Paragraph multimodal component - renders text paragraphs
 * Standard: HTML p element with styling
 * Markdown: Plain text with proper spacing via Block
 * YML: Renders as a paragraph object with text content
 */
export const Paragraph = multimodal<ParagraphProps>({
  markdown: ({ children }) => (
    <MarkdownBlock modality="markdown">
      {children}
    </MarkdownBlock>
  ),
  yml: ({ children, indentLevel = 0 }) => {
    const indent = createIndent(indentLevel);
    const childIndent = createIndent(indentLevel + 1);
    return `${indent}paragraph:
${childIndent}text: ${escapeYMLString(String(children || ''))}`;
  }
})(({ children }) => (
  <p className="mb-6 text-gray-700 leading-relaxed">
    {children}
  </p>
));
