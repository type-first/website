import React from 'react';
import Link from 'next/link';
import { multimodal } from './multimodal-model';
import { MarkdownBlock } from './markdown-block.m.srv';
import { Rocket, ArrowUpRight } from 'lucide-react';

type CodeExploreProps = {
  slug: string;
  name?: string;
  description?: string;
};

const buildHref = (slug: string) => `/labs/type-explorer/${encodeURIComponent(slug)}`;

export const CodeExplore = multimodal<CodeExploreProps>({
  markdown: ({ slug, name, description }) => {
    const displayTitle = name ? `Try ${name} in Type Explorer` : 'Open in Type Explorer';
    const displayDescription = description || 'Explore and modify this scenario interactively with full types, autocomplete, and diagnostics.';
    
    return (
      <MarkdownBlock modality="markdown">
        <>[🚀 {displayTitle}]({buildHref(slug)})</>
        {'\n'}
        {displayDescription}
      </MarkdownBlock>
    );
  }
})(({ slug, name, description }) => {
  const href = buildHref(slug);
  const displayTitle = name ? `Try ${name} in Type Explorer` : 'Open in Type Explorer';
  const displayDescription = description || 'Explore and modify this scenario interactively with full types, autocomplete, and diagnostics.';
  
  return (
    <div className="my-6">
      <Link
        href={href}
        className="block rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-colors shadow-sm"
        aria-label={displayTitle}
      >
        <div className="p-4 sm:p-5 flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow">
              <Rocket className="h-5 w-5" strokeWidth={1.8} />
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                {displayTitle}
              </h3>
              <span className="inline-flex items-center text-xs sm:text-sm text-blue-700">
                <span className="hidden sm:inline">{href}</span>
                <ArrowUpRight className="w-4 h-4 ml-1" strokeWidth={1.8} />
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-1">
              {displayDescription}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
});
