'use client';

import { highlightCode } from '@/lib/highlight';
import { useEffect, useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>('');

  useEffect(() => {
    const highlight = async () => {
      try {
        const html = await highlightCode(code, language);
        setHighlightedCode(html);
      } catch (error) {
        console.error('Failed to highlight code:', error);
        setHighlightedCode(`<pre><code>${code}</code></pre>`);
      }
    };

    highlight();
  }, [code, language]);

  if (!highlightedCode) {
    return (
      <div className="code-section my-6">
        {filename && (
          <div className="bg-gray-100 px-4 py-2 text-sm text-gray-600 border-b border-gray-300 rounded-t-lg">
            {filename}
          </div>
        )}
        <div className={`bg-gray-900 text-gray-100 p-4 ${filename ? 'rounded-t-none' : ''} rounded-lg overflow-x-auto`}>
          <pre><code>{code}</code></pre>
        </div>
      </div>
    );
  }

  return (
    <div className="code-section my-6">
      {filename && (
        <div className="bg-gray-100 px-4 py-2 text-sm text-gray-600 border-b border-gray-300 rounded-t-lg">
          {filename}
        </div>
      )}
      <div
        className={`${filename ? 'rounded-t-none' : ''} rounded-lg overflow-x-auto`}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </div>
  );
}
