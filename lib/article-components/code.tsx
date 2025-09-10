import { ReactNode } from 'react';
import { useRenderModality } from './context';

interface CodeProps {
  children: ReactNode;
  lang?: string;
  filename?: string;
}

export function Code({ children, lang, filename }: CodeProps) {
  const { modality } = useRenderModality();
  
  switch (modality) {
    case 'html':
      return (
        <div className="mb-8">
          {filename && (
            <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-mono rounded-t-lg">
              {filename}
            </div>
          )}
          <pre className={`bg-gray-900 text-gray-100 p-4 overflow-x-auto ${filename ? 'rounded-b-lg' : 'rounded-lg'}`}>
            <code className={lang ? `language-${lang}` : ''}>{children}</code>
          </pre>
        </div>
      );
      
    case 'markdown':
      const codeBlock = `\`\`\`${lang || ''}\n${children}\n\`\`\`\n\n`;
      return (filename ? `${filename}:\n${codeBlock}` : codeBlock) as any;
      
    case 'plaintext':
      const plainBlock = `${children}\n\n`;
      return (filename ? `${filename}:\n${plainBlock}` : plainBlock) as any;
      
    case 'json':
      return {
        type: 'code',
        content: children,
        language: lang,
        filename
      } as any;
      
    default:
      return children;
  }
}

interface InlineCodeProps {
  children: ReactNode;
}

export function InlineCode({ children }: InlineCodeProps) {
  const { modality } = useRenderModality();
  
  switch (modality) {
    case 'html':
      return <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">{children}</code>;
      
    case 'markdown':
      return `\`${children}\`` as any;
      
    case 'plaintext':
      return children as any;
      
    case 'json':
      return {
        type: 'inlineCode',
        content: children
      } as any;
      
    default:
      return children;
  }
}
