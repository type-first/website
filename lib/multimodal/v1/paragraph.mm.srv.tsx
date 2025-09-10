import React from 'react';
import { multimodal } from './multimodal.model';

type ParagraphProps = {};

/**
 * Paragraph multimodal component - renders text paragraphs
 * Standard: HTML p element with styling
 * Markdown: Plain text with double newline
 */
export const Paragraph = multimodal<ParagraphProps>({
  markdown: ({ children }) => `${children}\n\n`
})(({ children }) => (
  <p className="mb-6 text-gray-700 leading-relaxed">
    {children}
  </p>
));
