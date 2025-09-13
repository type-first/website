import React from 'react';
import { multimodal } from './multimodal-model';
import { createIndent } from './yml-primitives';

type ContainerProps = {};

/**
 * Container multimodal component - renders content containers
 * Standard: HTML div with margin
 * Markdown: Returns children with spacing
 * YML: Renders as a container object with nested content
 */
export const Container = multimodal<ContainerProps>({
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
    
    return `${indent}container:
${content.split('\n').map(line => `${childIndent}${line}`).join('\n')}`;
  }
})(({ children }) => (
  <div className="mb-4">
    {children}
  </div>
));
