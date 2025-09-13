import React from 'react';
import { multimodal } from './multimodal-model';
import { MarkdownBlock } from './markdown-block.m.srv';
import { createIndent, escapeYMLString } from './yml-primitives';

type ListProps = {
  // No additional props beyond modality and children
};

type ListItemProps = {
  // No additional props beyond modality and children
};

/**
 * List multimodal component - renders an unordered list
 * Standard: HTML ul element
 * Markdown: Proper list formatting using MarkdownBlock
 * YML: Renders as a YML list with proper indentation
 */
export const List = multimodal<ListProps>({
  markdown: ({ children }) => (
    <MarkdownBlock spacing="normal" modality="markdown">
      {children}
    </MarkdownBlock>
  ),
  yml: ({ children, indentLevel = 0 }) => {
    const indent = createIndent(indentLevel);
    const childIndent = createIndent(indentLevel + 1);
    
    // Convert children to YML list format
    const childrenArray = React.Children.toArray(children);
    const items = childrenArray.map((child, index) => {
      if (React.isValidElement(child) && child.props) {
        // Pass down indentLevel + 1 for nested components
        const childProps = { ...child.props, indentLevel: indentLevel + 1, modality: 'yml' };
        const renderedChild = React.cloneElement(child, childProps);
        return `${childIndent}- ${escapeYMLString(String(renderedChild))}`;
      }
      return `${childIndent}- ${escapeYMLString(String(child))}`;
    });
    
    return `${indent}list:\n${items.join('\n')}`;
  }
})(({ children }) => (
  <ul>{children}</ul>
));

/**
 * OrderedList multimodal component - renders an ordered list
 * Standard: HTML ol element
 * Markdown: Numbered list formatting using MarkdownBlock
 * YML: Renders as a YML ordered list with proper indentation
 */
export const OrderedList = multimodal<ListProps>({
  markdown: ({ children }) => (
    <MarkdownBlock spacing="normal" modality="markdown">
      {children}
    </MarkdownBlock>
  ),
  yml: ({ children, indentLevel = 0 }) => {
    const indent = createIndent(indentLevel);
    const childIndent = createIndent(indentLevel + 1);
    
    // Convert children to YML ordered list format
    const childrenArray = React.Children.toArray(children);
    const items = childrenArray.map((child, index) => {
      if (React.isValidElement(child) && child.props) {
        // Pass down indentLevel + 1 for nested components
        const childProps = { ...child.props, indentLevel: indentLevel + 1, modality: 'yml' };
        const renderedChild = React.cloneElement(child, childProps);
        return `${childIndent}${index + 1}. ${escapeYMLString(String(renderedChild))}`;
      }
      return `${childIndent}${index + 1}. ${escapeYMLString(String(child))}`;
    });
    
    return `${indent}ordered_list:\n${items.join('\n')}`;
  }
})(({ children }) => (
  <ol>{children}</ol>
));

/**
 * ListItem multimodal component - renders a list item
 * Standard: HTML li element
 * Markdown: List item with proper bullet
 * YML: Renders as list item content (used within List context)
 */
export const ListItem = multimodal<ListItemProps>({
  markdown: ({ children }) => <>- {children}{'\n'}</>,
  yml: ({ children }) => escapeYMLString(String(children || ''))
})(({ children }) => (
  <li>{children}</li>
));
