import React from 'react';
import { MarkdownModalComponent } from './multimodal-model';

type MarkdownBlockProps = {
  spacing?: 'none' | 'tight' | 'normal' | 'loose';
};

/**
 * MarkdownBlock markdown component - handles spacing for block-level content in markdown
 * This is a markdown-only component for consistent spacing
 */
export const MarkdownBlock: MarkdownModalComponent<MarkdownBlockProps> = ({ children, spacing = 'normal' }) => {
  const spacingMap = {
    none: '',
    tight: '\n',
    normal: '\n\n',
    loose: '\n\n\n'
  };
  
  return (
    <>
      {children}
      {spacingMap[spacing]}
    </>
  );
};
