'use client';

import { useState } from 'react';
import type { TextSearchResult, VectorSearchResult, HybridSearchResult } from '@/lib/content/search/search.model';

interface SearchResponse {
  query: string;
  results: (TextSearchResult | VectorSearchResult)[];
  total?: number;
  totalResults?: number;
  searchType: string;
  limit?: number;
  meta?: {
    total: number;
    query: string;
    searchType: string;
  };
}

export function SearchTestClient() {
  const [query, setQuery] = useState('');
  const [enableText, setEnableText] = useState(true);
  const [enableVector, setEnableVector] = useState(true);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      let endpoint = '';
      let searchParams = new URLSearchParams();
      searchParams.set('q', query.trim());
      searchParams.set('limit', '10');

      if (enableText && enableVector) {
        // For now, let's use text search since hybrid endpoint doesn't exist
        endpoint = `/api/search/text?${searchParams.toString()}`;
        
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Search failed');
        }

        const data: SearchResponse = await response.json();
        setResults(data);
        
      } else if (enableText) {
        // Text-only search
        endpoint = `/api/search/text?${searchParams.toString()}`;
        
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Search failed');
        }

        const data: SearchResponse = await response.json();
        setResults(data);
        
      } else if (enableVector) {
        // Vector search
        endpoint = `/api/search/vector`;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: query.trim(), limit: 10 }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Vector search failed');
        }

        const data: SearchResponse = await response.json();
        setResults(data);
        
      } else {
        setError('Please enable at least one search method.');
        setLoading(false);
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="search-query" className="block text-sm font-medium text-gray-700 mb-2">
              Search Query
            </label>
            <input
              id="search-query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your search query..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={enableText}
                onChange={(e) => setEnableText(e.target.checked)}
                className="mr-2 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Full-Text Search
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={enableVector}
                onChange={(e) => setEnableVector(e.target.checked)}
                className="mr-2 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Vector Search
              </span>
            </label>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Search Results
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Found {results.total || results.totalResults || results.results.length} results for "{results.query}"
                </p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {results.searchType}
                </div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {results.results.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No results found. Try a different query or search method.
              </div>
            ) : (
              results.results.map((result, index) => (
                <div key={`${result.chunk.target.slug}-${result.chunk.label}-${result.type}-${index}`} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          <a 
                            href={`/articles/${result.chunk.target.slug}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {result.chunk.target.name}
                          </a>
                        </h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          result.type === 'text' 
                            ? 'bg-blue-100 text-blue-800'
                            : result.type === 'vector'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {result.type === 'text' ? '📝 Text' : 
                           result.type === 'vector' ? '🔍 Vector' : 
                           '🔀 Hybrid'}
                        </span>
                      </div>
                      
                      <div className="mb-2">
                        <span className="text-sm font-medium text-blue-600">
                          Chunk: {result.chunk.label}
                        </span>
                      </div>
                      
                      <div className="text-gray-600 text-sm mb-2">
                        <p>{result.chunk.text.substring(0, 300)}{result.chunk.text.length > 300 ? '...' : ''}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Article: {result.chunk.target.name}</span>
                        <div className="flex gap-1">
                          {result.chunk.tags.slice(0, 3).map((tag: string) => (
                            <span 
                              key={tag}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        Score: {result.score.toFixed(2)}
                      </div>
                      {result.type === 'vector' && 'similarity' in result && (
                        <div className="text-xs text-gray-500">
                          Similarity: {(result.similarity * 100).toFixed(1)}%
                        </div>
                      )}
                      <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${Math.min(100, result.type === 'vector' && 'similarity' in result ? result.similarity * 100 : result.score * 10)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
