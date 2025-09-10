import React from 'react';
import { multimodal } from './multimodal.model';

type NavigationProps = {};

/**
 * Navigation multimodal component - renders navigation structure
 * Standard: nav element with styling
 * Markdown: Simple navigation links
 */
export const Navigation = multimodal<NavigationProps>({
  markdown: ({ children }) => `${children}\n\n`
})(({ children }) => (
  <nav className="mb-8">
    {children}
  </nav>
));
