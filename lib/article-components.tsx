// Article component exports
import React from 'react';

export const ModalityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};

export const Heading: React.FC<{ children: React.ReactNode; level?: number }> = ({ children, level = 1 }) => {
  switch (level) {
    case 1: return <h1>{children}</h1>;
    case 2: return <h2>{children}</h2>;
    case 3: return <h3>{children}</h3>;
    case 4: return <h4>{children}</h4>;
    case 5: return <h5>{children}</h5>;
    case 6: return <h6>{children}</h6>;
    default: return <h1>{children}</h1>;
  }
};

export const Paragraph: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <p>{children}</p>;
};

export const Text: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <span>{children}</span>;
};

export const List: React.FC<{ children: React.ReactNode; ordered?: boolean }> = ({ children, ordered = false }) => {
  const Tag = ordered ? 'ol' : 'ul';
  return <Tag>{children}</Tag>;
};

export const ListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <li>{children}</li>;
};

export const Code: React.FC<{ children: React.ReactNode; language?: string }> = ({ children, language = 'text' }) => {
  return <pre><code className={`language-${language}`}>{children}</code></pre>;
};

export const InlineCode: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <code>{children}</code>;
};

export const Link: React.FC<{ children: React.ReactNode; href: string }> = ({ children, href }) => {
  return <a href={href}>{children}</a>;
};

export const BlockQuote: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <blockquote>{children}</blockquote>;
};
