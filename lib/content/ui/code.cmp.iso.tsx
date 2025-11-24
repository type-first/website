import React from 'react';
import { Copy } from 'lucide-react';
import { codeToHtml } from 'shiki';

interface CodeProps {
  children: React.ReactNode;
  className?: string;
  language?: string;
  title?: string;
}

export async function Code({ children, className = '', language, title }: CodeProps) {
  const code = String(children).trim();
  
  // Apply syntax highlighting if language is specified
  let highlightedCode = code;
  if (language) {
    try {
      highlightedCode = await codeToHtml(code, {
        lang: language,
        theme: 'github-dark',
        
      });
    } catch (error) {
      // Fallback to plain code if highlighting fails
      console.warn(`Failed to highlight code with language: ${language}`, error);
    }
  }

  return (
    <div className={`not-prose mb-6 rounded overflow-hidden ${className}`}>
      {(title || language) && (
        <div style={{ backgroundColor:'#24292e' }} className="text-gray-300 px-4 py-2 text-sm font-medium flex items-center justify-between">
          <span>{title || (language ? language.toUpperCase() : 'CODE')}</span>
          <button className="text-gray-400 hover:text-gray-200 transition-colors">
            <Copy className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>
      )}
      {language ? (
        <div style={{ backgroundColor:'#24292e' }} className={`overflow-x-auto p-2`}
             dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      ) : (
        <pre style={{ backgroundColor:'#24292e' }} className={` text-gray-100 p-2 overflow-x-auto text-sm leading-relaxed`}>
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
