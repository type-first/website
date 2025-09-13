import React from 'react';
import { multimodal } from './multimodal-model';

type ContainerProps = {};

/**
 * Container multimodal component - renders content containers
 * Standard: HTML div with margin
 * Markdown: Returns children with spacing
 */
export const Container = multimodal<ContainerProps>({
  markdown: ({ children }) => children
})(({ children }) => (
  <div className="mb-4">
    {children}
  </div>
));
