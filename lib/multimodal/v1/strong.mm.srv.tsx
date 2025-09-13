import React from 'react';
import { multimodal } from './multimodal-model';
import { createIndent, escapeYMLString } from './yml-primitives';

type StrongProps = {};

/**
 * Strong multimodal component - renders bold/emphasized text
 * Standard: HTML strong element
 * Markdown: Returns text wrapped in **bold** markers
 * YML: Renders as a strong text object
 */
export const Strong = multimodal<StrongProps>({
  markdown: ({ children }) => `**${children}**`,
  yml: ({ children, indentLevel = 0 }) => {
    const indent = createIndent(indentLevel);
    const childIndent = createIndent(indentLevel + 1);
    return `${indent}strong:
${childIndent}text: ${escapeYMLString(String(children || ''))}`;
  }
})(({ children }) => (
  <strong>
    {children}
  </strong>
));
