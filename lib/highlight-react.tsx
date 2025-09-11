import React from 'react';
import { codeToTokens, type BundledLanguage } from 'shiki';
import { getShikiTheme, type ColorMode } from './codeTheme';

// Map our article languages to Shiki language IDs
function normalizeLang(lang?: string): BundledLanguage {
  if (!lang) return 'txt';
  const l = lang.toLowerCase();
  switch (l) {
    case 'ts':
    case 'typescript':
      return 'ts';
    case 'tsx':
      return 'tsx';
    case 'js':
    case 'javascript':
      return 'js';
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
      return 'txt';
    default:
      return 'txt';
  }
}

export interface HighlightedCodeProps {
  code: string;
  lang?: string;
  mode?: ColorMode;
  className?: string;
}

export async function getHighlightedTokens(
  code: string,
  lang?: string,
  mode: ColorMode = 'light'
) {
  try {
    const tokens = await codeToTokens(code, {
      lang: normalizeLang(lang),
      theme: getShikiTheme(mode),
    });
    return tokens;
  } catch (error) {
    console.warn('Failed to tokenize code:', error);
    return null;
  }
}

export function HighlightedCode({ 
  code, 
  lang, 
  mode = 'light', 
  className = '' 
}: HighlightedCodeProps) {
  const [tokens, setTokens] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isCancelled = false;
    
    const highlight = async () => {
      try {
        const result = await getHighlightedTokens(code, lang, mode);
        if (!isCancelled) {
          setTokens(result);
          setIsLoading(false);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Failed to highlight code:', error);
          setTokens(null);
          setIsLoading(false);
        }
      }
    };

    highlight();

    return () => {
      isCancelled = true;
    };
  }, [code, lang, mode]);

  if (isLoading) {
    return (
      <pre className={`bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto ${className}`}>
        <code>{code}</code>
      </pre>
    );
  }

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
