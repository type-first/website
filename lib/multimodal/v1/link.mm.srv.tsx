import React from 'react';
import NextLink from 'next/link';
import { multimodal } from './multimodal-model';
import { createIndent, escapeYMLString } from './yml-primitives';

type LinkProps = {
  href: string;
  className?: string;
};

/**
 * Link multimodal component - renders semantic links
 * Standard: Next.js Link with styling
 * Markdown: Simple markdown link syntax using fragments
 * YML: Renders as a link object with text and href
 */
export const Link = multimodal<LinkProps>({
  markdown: ({ href, children }) => (
    <>
      <>[</>
      <>{children}</>
      <>](</>
      <>{href}</>
      <>)</>
    </>
  ),
  yml: ({ href, children, indentLevel = 0 }) => {
    const indent = createIndent(indentLevel);
    const childIndent = createIndent(indentLevel + 1);
    return `${indent}link:
${childIndent}text: ${escapeYMLString(String(children || ''))}
${childIndent}href: ${escapeYMLString(href)}`;
  }
})(({ href, children, className }) => (
  <NextLink 
    href={href} 
    className={`text-blue-600 hover:text-blue-800 transition-colors ${className || ''}`}
  >
    {children}
  </NextLink>
));
