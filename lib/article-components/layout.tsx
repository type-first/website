import React, { ReactNode } from 'react';
import { useModality } from './simple-context';

// Helper function to extract text content from ReactNode
function extractTextContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  
  if (React.isValidElement(node)) {
    // If it's a React element, try to extract text from its children
    return extractTextContent((node.props as any).children);
  }
  
  if (Array.isArray(node)) {
    return node.map(extractTextContent).join('');
  }
  
  return '';
}

interface CalloutProps {
  children: ReactNode;
  type?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
}

export function Callout({ children, type = 'info', title }: CalloutProps) {
  const modality = useModality();
  
  if (modality === 'markdown') {
    const prefix = type === 'warning' ? '⚠️' : type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    const text = extractTextContent(children);
    return `${prefix} ${title ? `**${title}**: ` : ''}${text}\n\n` as any;
  }
  
  const typeColors = {
    info: 'border-blue-200 bg-blue-50 text-blue-800',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    success: 'border-green-200 bg-green-50 text-green-800',
    error: 'border-red-200 bg-red-50 text-red-800'
  };
  
  return (
    <div className={`p-4 rounded-lg border-l-4 mb-6 ${typeColors[type]}`}>
      {title && <div className="font-semibold mb-2">{title}</div>}
      <div>{children}</div>
    </div>
  );
}

interface SeparatorProps {
  spacing?: 'small' | 'medium' | 'large';
}

export function Separator({ spacing = 'medium' }: SeparatorProps) {
  const modality = useModality();
  
  if (modality === 'markdown') {
    return '\n---\n\n' as any;
  }
  
  const spacingClasses = {
    small: 'my-4',
    medium: 'my-8',
    large: 'my-12'
  };
  
  return <hr className={`border-gray-200 ${spacingClasses[spacing]}`} />;
}

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export function Section({ children, className }: SectionProps) {
  const modality = useModality();
  
  if (modality === 'markdown') {
    const text = extractTextContent(children);
    return `${text}\n\n` as any;
  }
  
  return <section className={className}>{children}</section>;
}

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  const modality = useModality();
  
  if (modality === 'markdown') {
    const text = extractTextContent(children);
    return `${text}\n\n` as any;
  }
  
  return <div className={className}>{children}</div>;
}

interface FooterProps {
  children: ReactNode;
}

export function Footer({ children }: FooterProps) {
  const modality = useModality();
  
  if (modality === 'markdown') {
    const text = extractTextContent(children);
    return `---\n${text}\n` as any;
  }
  
  return <footer className="border-t border-gray-200 pt-8">{children}</footer>;
}

interface HeaderProps {
  children: ReactNode;
}

export function Header({ children }: HeaderProps) {
  const modality = useModality();
  
  if (modality === 'markdown') {
    const text = extractTextContent(children);
    return `${text}\n\n` as any;
  }
  
  return <header className="mb-12">{children}</header>;
}

interface ArticleProps {
  children: ReactNode;
}

export function Article({ children }: ArticleProps) {
  const modality = useModality();
  
  if (modality === 'markdown') {
    const text = extractTextContent(children);
    return text as any;
  }
  
  return <article className="max-w-4xl mx-auto px-6 py-12">{children}</article>;
}

interface NavigationProps {
  children: ReactNode;
}

export function Navigation({ children }: NavigationProps) {
  const modality = useModality();
  
  if (modality === 'markdown') {
    const text = extractTextContent(children);
    return `${text}\n\n` as any;
  }
  
  return <nav className="mb-6">{children}</nav>;
}
