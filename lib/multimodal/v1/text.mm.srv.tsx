import React from 'react';
import { multimodal } from './multimodal-model';
import { escapeYMLString } from './yml-primitives';

type TextProps = {};

/**
 * Text multimodal component - renders inline text
 * Standard: HTML span element
 * Markdown: Returns text content directly
 * YML: Returns escaped YML string
 */
export const Text = multimodal<TextProps>({
  markdown: ({ children }) => children,
  yml: ({ children }) => escapeYMLString(String(children || ''))
})(({ children }) => (
  <span>
    {children}
  </span>
));
