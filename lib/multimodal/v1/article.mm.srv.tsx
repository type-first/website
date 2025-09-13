import React from 'react';
import { multimodal } from './multimodal-model';
import { createIndent } from './yml-primitives';

type ArticleProps = {};

/**
 * Multimodal Article component
 * - Standard mode: Renders as an HTML article element with default styling
 * - Markdown mode: Renders children in a fragment with spacing
 * - YML mode: Renders as an article object with nested content
 */
export const Article = multimodal<ArticleProps>({
  markdown: ({ children }) => children,
  yml: ({ children, indentLevel = 0 }) => {
    const indent = createIndent(indentLevel);
    const childIndent = createIndent(indentLevel + 1);
    
    // Render children with increased indentation
    const processChildren = (children: any): string => {
      if (React.isValidElement(children) && children.props) {
        const childProps = { ...children.props, indentLevel: indentLevel + 1, modality: 'yml' };
        return String(React.cloneElement(children, childProps));
      }
      return String(children || '');
    };
    
    let content = '';
    if (Array.isArray(children)) {
      content = children.map(processChildren).join('\n');
    } else {
      content = processChildren(children);
    }
    
    return `${indent}article:
${content.split('\n').map(line => `${childIndent}${line}`).join('\n')}`;
  }
})(({ children }) => (
  <article className="max-w-4xl mx-auto px-6 py-12">
    {children}
  </article>
));

export default Article;
