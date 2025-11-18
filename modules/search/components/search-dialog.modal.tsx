'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import type { HybridSearchResult } from '@/lib/content/search/search.model';

interface SearchResponse {
  query: string;
  results: HybridSearchResult[];
  totalResults: number;
  searchType: string;
  meta?: {
    textWeight?: number;
    vectorWeight?: number;
    total: number;
  };
}

export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<HybridSearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  const fetchResults = useMemo(() => {
    let ctrl: AbortController | null = null;
    return async (q: string) => {
      ctrl?.abort();
      ctrl = new AbortController();
      setLoading(true);
      try {
        const res = await fetch(`/api/search/hybrid?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        if (!res.ok) return;
        const data: SearchResponse = await res.json();
        setResults(data.results || []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
  }, []);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setQuery(q);
    if (q.trim().length === 0) {
      setResults([]);
      return;
    }
    void fetchResults(q);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-x-0 top-20 mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
          <Search className="w-5 h-5 text-gray-500" strokeWidth={1.8} />
          <input
            ref={inputRef}
            value={query}
            onChange={onChange}
            placeholder="Search articles..."
            className="w-full outline-none text-sm py-2"
          />
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Esc</button>
        </div>
        <div className="max-h-[60vh] overflow-auto divide-y">
          {loading && (
            <div className="px-4 py-3 text-sm text-gray-500">Searching…</div>
          )}
          {!loading && results.length === 0 && query.trim() !== '' && (
            <div className="px-4 py-3 text-sm text-gray-500">No results</div>
          )}
          {results.map((result, idx) => {
            // Determine the link URL based on content kind
            const getContentUrl = (kind: string, slug: string) => {
              switch (kind) {
                case 'article':
                  return `/article/${slug}`;
                case 'lab':
                  return `/labs/${slug}`;
                case 'scenario':
                  return `/typescape/${slug}`;
                case 'doc-library':
                  return `/docs/${slug}`;
                default:
                  console.warn(`Unknown content kind: ${kind}`);
                  return `/article/${slug}`; // fallback
              }
            };
            
            const linkUrl = getContentUrl(result.chunk.target.kind, result.chunk.target.slug);
            
            // Get similarity for vector results
            const similarity = result.type === 'vector' 
              ? result.similarity 
              : result.type === 'merged' && result.vector 
                ? result.vector.similarity 
                : null;

            return (
              <Link 
                key={`${result.chunk.id}-${idx}`} 
                href={linkUrl} 
                onClick={onClose} 
                className="block px-4 py-3 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                      {result.chunk.target.name}
                    </h4>
                    <div className="text-xs text-blue-600 mt-0.5">
                      {result.chunk.label}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded ${
                      result.type === 'text' ? 'text-green-700 bg-green-100' : 
                      result.type === 'vector' ? 'text-purple-700 bg-purple-100' : 
                      'text-blue-700 bg-blue-100'
                    }`}>
                      {result.type}
                    </span>
                    {similarity && (
                      <span className="text-[10px] text-gray-500">
                        {(similarity * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-1 text-sm text-gray-600 line-clamp-3">
                  {result.chunk.text.substring(0, 150)}
                  {result.chunk.text.length > 150 ? '...' : ''}
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <div className="flex gap-2">
                    {result.chunk.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">
                    {result.chunk.target.kind === 'article' && 'author' in result.chunk.target ? 
                      (result.chunk.target as any).author.name : 
                      (() => {
                        switch (result.chunk.target.kind) {
                          case 'article': return 'Article';
                          case 'lab': return 'Lab';
                          case 'scenario': return 'Scenario';
                          case 'doc-library': return 'Documentation';
                          default: return result.chunk.target.kind;
                        }
                      })()}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
