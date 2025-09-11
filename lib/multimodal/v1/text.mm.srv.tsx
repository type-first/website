import React from 'react';
import { multimodal } from './multimodal.model';

type TextProps = {};

/**
 * Text multimodal component - renders inline text
 * Standard: HTML span element
 * Markdown: Returns text content directly
 */
export const Text = multimodal<TextProps>({
  markdown: ({ children }) => children
})(({ children }) => (
  <span>
    {children}
  </span>
));
