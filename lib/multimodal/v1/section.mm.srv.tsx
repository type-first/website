import React from 'react';
import { multimodal } from './multimodal-model';

type SectionProps = {};

/**
 * Section multimodal component - renders content sections
 * Standard: HTML section element
 * Markdown: Returns children with section spacing
 */
export const Section = multimodal<SectionProps>({
  markdown: ({ children }) => children
})(({ children }) => (
  <section>
    {children}
  </section>
));
