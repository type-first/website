import React, { cache } from 'react';
import { codeToTokens, type BundledLanguage } from 'shiki';
import { getShikiTheme, type ColorMode } from '@/lib/codeTheme';
import { multimodal } from './multimodal.model';
import { MarkdownBlock } from './markdown-block.m.srv';

type CodeProps = {
  language: string;
  filename?: string;
};

// Cached token function for consistent rendering
const getCachedTokens = cache(async (code: string, lang: string, mode: ColorMode) => {
  try {
    return await codeToTokens(code, {
      lang: normalizeLang(lang),
      theme: getShikiTheme(mode),
    });
  } catch (error) {
    console.warn('Failed to highlight code:', error);
    return null;
  }
});

// Map our article languages to Shiki language IDs
function normalizeLang(lang?: string): BundledLanguage {
  if (!lang) return 'markdown';
  const l = lang.toLowerCase();
  switch (l) {
    case 'ts':
    case 'typescript':
      return 'typescript';
    case 'tsx':
      return 'tsx';
    case 'js':
    case 'javascript':
      return 'javascript';
    case 'jsx':
      return 'jsx';
    case 'bash':
    case 'sh':
    case 'shell':
      return 'bash';
    case 'json':
      return 'json';
    case 'sql':
      return 'sql';
    case 'yaml':
    case 'yml':
      return 'yaml';
    case 'txt':
    case 'text':
      return 'markdown';
    default:
      return 'markdown';
  }
}

// Server-side highlighted code component with caching
async function HighlightedCode({ 
  code, 
  lang, 
  mode = 'light', 
  className = '' 
}: {
  code: string;
  lang?: string;
  mode?: ColorMode;
  className?: string;
}) {
  const tokens = await getCachedTokens(code, lang || '', mode);

  // Fallback for errors
  if (!tokens) {
    return (
      <pre className={`bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto ${className}`}>
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <pre 
      className={`rounded-lg overflow-x-auto ${className}`}
      style={{ 
        backgroundColor: tokens.bg,
        color: tokens.fg,
      }}
    >
      <code className="block p-4">
        {tokens.tokens.map((line: any[], lineIndex: number) => (
          <div key={lineIndex}>
            {line.map((token: any, tokenIndex: number) => (
              <span
                key={tokenIndex}
                style={{ color: token.color }}
              >
                {token.content}
              </span>
            ))}
            {lineIndex < tokens.tokens.length - 1 && '\n'}
          </div>
        ))}
      </code>
    </pre>
  );
}

/**
 * Code multimodal component - renders code blocks with syntax highlighting
 * Standard: Server-side syntax highlighted code block using Shiki
 * Markdown: Fenced code block with language using MarkdownBlock
 */
export const Code = multimodal<CodeProps>({
  markdown: ({ language, children }) => (
    <MarkdownBlock modality="markdown">
      <>```{language}</>
      <>{'\n'}</>
      <>{children}</>
      <>{'\n'}</>
      <>```</>
    </MarkdownBlock>
  )
})(async ({ language, filename, children }) => {
  const codeString = typeof children === 'string' ? children : String(children);

  return (
    <div className="code-section my-6">
      {filename && (
        <div className="bg-gray-100 px-4 py-2 text-sm text-gray-600 border-b border-gray-300 rounded-t-lg">
          {filename}
        </div>
      )}
      <HighlightedCode
        code={codeString}
        lang={language}
        mode="light"
        className={filename ? 'rounded-t-none' : ''}
      />
    </div>
  );
});
