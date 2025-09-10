import React from 'react';
import { multimodal } from './multimodal.model';

type ArticleProps = {};

/**
 * Multimodal Article component
 * - Standard mode: Renders as an HTML article element with default styling
 * - Markdown mode: Renders children directly (they handle their own markdown rendering)
 */
export const Article = multimodal<ArticleProps>({
  markdown: ({ children }) => `${children}\n\n`
})(({ children }) => (
  <article className="max-w-4xl mx-auto px-6 py-12">
    {children}
  </article>
));

export default Article;
