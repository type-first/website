import React from 'react';
import { multimodal } from './multimodal.model';

type HeaderProps = {};

/**
 * Multimodal Header component
 * - Standard mode: Renders as an HTML header element with bottom margin
 * - Markdown mode: Renders children directly (they handle their own markdown rendering)
 */
export const Header = multimodal<HeaderProps>({
  markdown: ({ children }) => `${children}\n\n`
})(({ children }) => (
  <header className="mb-12">
    {children}
  </header>
));

export default Header;
