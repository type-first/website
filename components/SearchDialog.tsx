'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

type Result = {
  article: {
    id: string;
    title: string;
    slug: string;
    description?: string;
    coverImage?: string | null;
    tags: string[];
  };
  snippet: string;
  score: number;
  matchType: 'text' | 'vector';
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
            <Link key={`${r.article.id}-${idx}`} href={`/articles/${r.article.slug}`} onClick={onClose} className="block px-4 py-3 hover:bg-gray-50">
              <div className="flex items-center justify-between gap-4">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{r.article.title}</h4>
                <span className={`text-[10px] uppercase tracking-wide ${r.matchType === 'text' ? 'text-green-700 bg-green-100' : 'text-purple-700 bg-purple-100'} px-2 py-0.5 rounded`}>{r.matchType}</span>
              </div>
              <div className="mt-1 text-sm text-gray-600 line-clamp-3" dangerouslySetInnerHTML={{ __html: r.matchType === 'text' ? r.snippet : r.snippet.replace(/</g, '&lt;') }} />
              <div className="mt-1 flex gap-2">
                {r.article.tags.slice(0, 3).map((t) => (
                  <span key={t} className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{t}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
