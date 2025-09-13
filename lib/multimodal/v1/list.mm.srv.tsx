import React from 'react';
import { multimodal } from './multimodal-model';
import { MarkdownBlock } from './markdown-block.m.srv';

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
 */
export const List = multimodal<ListProps>({
  markdown: ({ children }) => (
    <MarkdownBlock spacing="normal" modality="markdown">
      {children}
    </MarkdownBlock>
  )
})(({ children }) => (
  <ul>{children}</ul>
));

/**
 * OrderedList multimodal component - renders an ordered list
 * Standard: HTML ol element
 * Markdown: Numbered list formatting using MarkdownBlock
 */
export const OrderedList = multimodal<ListProps>({
  markdown: ({ children }) => (
    <MarkdownBlock spacing="normal" modality="markdown">
      {children}
    </MarkdownBlock>
  )
})(({ children }) => (
  <ol>{children}</ol>
));

/**
 * ListItem multimodal component - renders a list item
 * Standard: HTML li element
 * Markdown: List item with proper bullet
 */
export const ListItem = multimodal<ListItemProps>({
  markdown: ({ children }) => <>- {children}{'\n'}</>
})(({ children }) => (
  <li>{children}</li>
));
