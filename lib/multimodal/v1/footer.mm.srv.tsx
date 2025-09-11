import React from 'react';
import { multimodal } from './multimodal.model';
import { MarkdownBlock } from './markdown-block.m.srv';

type FooterProps = {};

/**
 * Footer multimodal component - renders article footer
 * Standard: HTML footer element with styling
 * Markdown: Footer section with separator using MarkdownBlock
 */
export const Footer = multimodal<FooterProps>({
  markdown: ({ children }) => (
    <MarkdownBlock modality="markdown">
      <>---</>
      <>{'\n\n'}</>
      <>{children}</>
      <>{'\n\n'}</>
    </MarkdownBlock>
  )
})(({ children }) => (
  <footer className="mt-16 pt-8 border-t border-gray-200">
    {children}
  </footer>
));
