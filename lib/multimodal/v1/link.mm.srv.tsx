import React from 'react';
import NextLink from 'next/link';
import { multimodal } from './multimodal.model';

type LinkProps = {
  href: string;
  className?: string;
};

/**
 * Link multimodal component - renders semantic links
 * Standard: Next.js Link with styling
 * Markdown: Simple markdown link syntax
 */
export const Link = multimodal<LinkProps>({
  markdown: ({ href, children }) => `[${children}](${href})`
})(({ href, children, className }) => (
  <NextLink 
    href={href} 
    className={`text-blue-600 hover:text-blue-800 transition-colors ${className || ''}`}
  >
    {children}
  </NextLink>
));
