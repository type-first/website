import React from 'react';
import { multimodal } from './multimodal.model';

type StrongProps = {};

/**
 * Strong multimodal component - renders bold/emphasized text
 * Standard: HTML strong element
 * Markdown: Returns text wrapped in **bold** markers
 */
export const Strong = multimodal<StrongProps>({
  markdown: ({ children }) => `**${children}**`
})(({ children }) => (
  <strong>
    {children}
  </strong>
));
