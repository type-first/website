'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

type Result = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  publishedAt: string;
  readingTime: string;
  score: number;
  type: 'text' | 'vector' | 'hybrid';
  sectionId: string;
  sectionTitle: string;
  sectionType: string;
  snippet: string;
  similarity?: number;
  textScore?: number;
  vectorScore?: number;
};

export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
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
        const data = await res.json();
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
          {results.map((r, idx) => (
            <Link key={`${r.sectionId}-${idx}`} href={`/articles/${r.slug}`} onClick={onClose} className="block px-4 py-3 hover:bg-gray-50">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{r.title}</h4>
                  <div className="text-xs text-blue-600 mt-0.5">
                    {r.sectionTitle} ({r.sectionType})
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded ${
                    r.type === 'text' ? 'text-green-700 bg-green-100' : 
                    r.type === 'vector' ? 'text-purple-700 bg-purple-100' : 
                    'text-blue-700 bg-blue-100'
                  }`}>
                    {r.type}
                  </span>
                  {r.similarity && (
                    <span className="text-[10px] text-gray-500">
                      {(r.similarity * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-1 text-sm text-gray-600 line-clamp-3">
                {r.snippet}
              </div>
              <div className="mt-1 flex items-center justify-between">
                <div className="flex gap-2">
                  {r.tags.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  {r.readingTime} • {r.author}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
