import React from 'react';
import { multimodal } from './multimodal-model';
import { createIndent } from './yml-primitives';

type SectionProps = {};

/**
 * Section multimodal component - renders content sections
 * Standard: HTML section element
 * Markdown: Returns children with section spacing
 * YML: Renders as a section object with nested content
 */
export const Section = multimodal<SectionProps>({
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
    
    return `${indent}section:
${childIndent}content: |
${content.split('\n').map(line => `${createIndent(indentLevel + 2)}${line}`).join('\n')}`;
  }
})(({ children }) => (
  <section>
    {children}
  </section>
));
