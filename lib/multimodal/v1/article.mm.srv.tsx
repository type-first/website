import React from 'react';
import { multimodal } from './multimodal.model';

type ArticleProps = {};

/**
 * Multimodal Article component
 * - Standard mode: Renders as an HTML article element with default styling
 * - Markdown mode: Renders children in a fragment with spacing
 */
export const Article = multimodal<ArticleProps>({
  markdown: ({ children }) => children
})(({ children }) => (
  <article className="max-w-4xl mx-auto px-6 py-12">
    {children}
  </article>
));

export default Article;
