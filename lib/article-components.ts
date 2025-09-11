// Article component exports - non-JSX version for TypeScript compatibility
import React from 'react';

// Simple placeholder implementations without JSX to avoid TypeScript errors
export const ModalityProvider = ({ children }: { children: React.ReactNode }) => children;

export const Heading = ({ children, level = 1 }: { children: React.ReactNode; level?: number }) => 
  React.createElement(`h${level}`, {}, children);

export const Paragraph = ({ children }: { children: React.ReactNode }) => 
  React.createElement('p', {}, children);

export const Text = ({ children }: { children: React.ReactNode }) => 
  React.createElement('span', {}, children);

export const List = ({ children, ordered = false }: { children: React.ReactNode; ordered?: boolean }) => 
  React.createElement(ordered ? 'ol' : 'ul', {}, children);

export const ListItem = ({ children }: { children: React.ReactNode }) => 
  React.createElement('li', {}, children);

export const Code = ({ children, language = 'text' }: { children: React.ReactNode; language?: string }) => 
  React.createElement('pre', {}, React.createElement('code', { className: `language-${language}` }, children));

export const InlineCode = ({ children }: { children: React.ReactNode }) => 
  React.createElement('code', {}, children);

export const Link = ({ children, href }: { children: React.ReactNode; href: string }) => 
  React.createElement('a', { href }, children);

export const BlockQuote = ({ children }: { children: React.ReactNode }) => 
  React.createElement('blockquote', {}, children);
