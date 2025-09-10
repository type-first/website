import React, { ReactNode } from 'react';
import { useModality } from './context';

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
}

export function Image({ src, alt, width, height, caption }: ImageProps) {
  const modality = useModality();
  
  if (modality === 'markdown') {
    const imageMarkdown = `![${alt}](${src})`;
    return (caption ? `${imageMarkdown}\n*${caption}*\n\n` : `${imageMarkdown}\n\n`) as any;
  }
  
  return (
    <figure className="mb-8">
      <img 
        src={src} 
        alt={alt} 
        width={width}
        height={height}
        className="w-full rounded-lg"
      />
      {caption && (
        <figcaption className="text-gray-600 text-sm mt-2 text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

interface BlockQuoteProps {
  children: ReactNode;
  author?: string;
  source?: string;
}

export function BlockQuote({ children, author, source }: BlockQuoteProps) {
  const modality = useModality();
  
  if (modality === 'markdown') {
    const quoteContent = `> ${children}`;
    const attribution = (author || source) ? `\n> \n> — ${author}${source ? ` (${source})` : ''}` : '';
    return `${quoteContent}${attribution}\n\n` as any;
  }
  
  return (
    <blockquote className="border-l-4 border-blue-500 pl-6 mb-8 italic text-gray-700">
      <div className="text-lg">{children}</div>
      {(author || source) && (
        <footer className="text-sm text-gray-500 mt-2 not-italic">
          {author && <cite>— {author}</cite>}
          {source && <span className="ml-2">({source})</span>}
        </footer>
      )}
    </blockquote>
  );
}
