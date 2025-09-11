// Article component exports - non-JSX version for TypeScript compatibility
import React from 'react';

// Simple placeholder implementations without JSX to avoid TypeScript errors
export const ModalityProvider = ({ children }: { children: React.ReactNode }) => children;

export const Heading = ({ children, level = 1 }: { children: React.ReactNode; level?: number }) => 
  React.createElement(`h${level}`, {}, children);

export const Paragraph = ({ children }: { children: React.ReactNode }) => 
  React.createElement('p', {}, children);

export const Text = ({ children, bold = false, italic = false }: { children: React.ReactNode; bold?: boolean; italic?: boolean }) => 
  React.createElement('span', { style: { fontWeight: bold ? 'bold' : 'normal', fontStyle: italic ? 'italic' : 'normal' } }, children);

export const List = ({ children, ordered = false }: { children: React.ReactNode; ordered?: boolean }) => 
  React.createElement(ordered ? 'ol' : 'ul', {}, children);

export const ListItem = ({ children }: { children: React.ReactNode }) => 
  React.createElement('li', {}, children);

export const Code = ({ children, language = 'text', lang, filename }: { children: React.ReactNode; language?: string; lang?: string; filename?: string }) => {
  const actualLanguage = lang || language;
  return React.createElement('div', {}, [
    filename && React.createElement('div', { 
      style: { 
        backgroundColor: '#f3f4f6', 
        padding: '0.5rem 1rem', 
        fontSize: '0.875rem', 
        color: '#6b7280',
        borderBottom: '1px solid #d1d5db',
        borderTopLeftRadius: '0.5rem',
        borderTopRightRadius: '0.5rem'
      } 
    }, filename),
    React.createElement('pre', {}, React.createElement('code', { className: `language-${actualLanguage}` }, children))
  ]);
};

export const InlineCode = ({ children }: { children: React.ReactNode }) => 
  React.createElement('code', {}, children);

export const Link = ({ children, href }: { children: React.ReactNode; href: string }) => 
  React.createElement('a', { href }, children);

export const BlockQuote = ({ children, author, source }: { children: React.ReactNode; author?: string; source?: string }) => 
  React.createElement('blockquote', {}, [
    children,
    author && React.createElement('footer', { style: { fontSize: '0.875rem', marginTop: '0.5rem', color: '#6b7280' } }, 
      `— ${author}${source ? `, ${source}` : ''}`
    )
  ]);
