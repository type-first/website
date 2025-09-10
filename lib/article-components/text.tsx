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

interface TextProps {
  children: ReactNode;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
}

export function Text({ children, bold, italic, code }: TextProps) {
  const modality = useModality();
  
  if (modality === 'markdown') {
    let text = extractTextContent(children);
    if (bold) text = `**${text}**`;
    if (italic) text = `*${text}*`;
    if (code) text = `\`${text}\``;
    return text as any;
  }
  
  // Standard React/HTML
  let className = '';
  if (bold) className += 'font-bold ';
  if (italic) className += 'italic ';
  if (code) className += 'font-mono bg-gray-100 px-1 py-0.5 rounded text-sm ';
  
  return <span className={className.trim()}>{children}</span>;
}

interface ParagraphProps {
  children: ReactNode;
}

export function Paragraph({ children }: ParagraphProps) {
  const modality = useModality();
  
  if (modality === 'markdown') {
    const text = extractTextContent(children);
    return `${text}\n\n` as any;
  }
  
  return <p className="mb-6 text-gray-700 leading-relaxed">{children}</p>;
}

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
}

export function Heading({ level, children }: HeadingProps) {
  const modality = useModality();
  
  if (modality === 'markdown') {
    const hashes = '#'.repeat(level);
    const text = extractTextContent(children);
    return `${hashes} ${text}\n\n` as any;
  }
  
  // Standard React/HTML
  const sizeClasses = {
    1: 'text-4xl font-bold mb-8',
    2: 'text-3xl font-bold mb-6 mt-12',
    3: 'text-2xl font-semibold mb-4 mt-8',
    4: 'text-xl font-semibold mb-3 mt-6',
    5: 'text-lg font-semibold mb-2 mt-4',
    6: 'text-base font-semibold mb-2 mt-4'
  };
  
  switch (level) {
    case 1: return <h1 className={sizeClasses[1]}>{children}</h1>;
    case 2: return <h2 className={sizeClasses[2]}>{children}</h2>;
    case 3: return <h3 className={sizeClasses[3]}>{children}</h3>;
    case 4: return <h4 className={sizeClasses[4]}>{children}</h4>;
    case 5: return <h5 className={sizeClasses[5]}>{children}</h5>;
    case 6: return <h6 className={sizeClasses[6]}>{children}</h6>;
    default: return <h1 className={sizeClasses[1]}>{children}</h1>;
  }
}

interface LinkProps {
  href: string;
  children: ReactNode;
}

export function Link({ href, children }: LinkProps) {
  const modality = useModality();
  
  if (modality === 'markdown') {
    const text = extractTextContent(children);
    return `[${text}](${href})` as any;
  }
  
  return (
    <a 
      href={href} 
      className="text-blue-600 hover:text-blue-800 underline"
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  );
}

interface CodeProps {
  children: ReactNode;
  language?: string;
  filename?: string;
}

export function Code({ children, language, filename }: CodeProps) {
  const modality = useModality();
  
  if (modality === 'markdown') {
    const text = extractTextContent(children);
    const lang = language || '';
    const filenameComment = filename ? ` title="${filename}"` : '';
    return `\`\`\`${lang}${filenameComment}\n${text}\n\`\`\`\n\n` as any;
  }
  
  return (
    <div className="mb-6">
      {filename && (
        <div className="bg-gray-800 text-gray-200 px-4 py-2 text-sm font-mono rounded-t-lg">
          {filename}
        </div>
      )}
      <pre className={`bg-gray-900 text-gray-100 p-4 overflow-x-auto ${filename ? 'rounded-b-lg' : 'rounded-lg'}`}>
        <code className={language ? `language-${language}` : ''}>
          {children}
        </code>
      </pre>
    </div>
  );
}

interface InlineCodeProps {
  children: ReactNode;
}

export function InlineCode({ children }: InlineCodeProps) {
  const modality = useModality();
  
  if (modality === 'markdown') {
    const text = extractTextContent(children);
    return `\`${text}\`` as any;
  }
  
  return (
    <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-sm">
      {children}
    </code>
  );
}
