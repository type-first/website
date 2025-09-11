import React from 'react';
import { multimodal } from './multimodal.model';

type ArticleHeaderProps = {};

/**
 * ArticleHeader multimodal component - renders article header content
 * Standard: Section with bottom margin
 * Markdown: Returns children directly (no special formatting)
 */
export const ArticleHeader = multimodal<ArticleHeaderProps>({
  markdown: ({ children }) => children
})(({ children }) => (
  <section className="mb-6">
    {children}
  </section>
));
