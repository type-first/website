'use client';

import { useState } from 'react';

interface SearchResult {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  coverImage: string;
  score?: number;
  type: 'vector' | 'text';
  snippet?: string;
}

export default function SearchTestPage() {
  const [query, setQuery] = useState('');
  const [enableFuzzy, setEnableFuzzy] = useState(true);
  const [enableVector, setEnableVector] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchPromises: Promise<Response>[] = [];

      // Add text search if enabled
      if (enableFuzzy) {
        searchPromises.push(
          fetch(`/api/search/text?q=${encodeURIComponent(query)}`)
        );
      }

      // Add vector search if enabled (using hybrid endpoint for simplicity)
      if (enableVector) {
        searchPromises.push(
          fetch(`/api/search/hybrid?q=${encodeURIComponent(query)}`)
        );
      }

      if (searchPromises.length === 0) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      const responses = await Promise.all(searchPromises);
      const allResults: SearchResult[] = [];

      let responseIndex = 0;

      // Process text search results
      if (enableFuzzy && responses[responseIndex]) {
        try {
          const textData = await responses[responseIndex].json();
          if (textData.results) {
            allResults.push(...textData.results.map((r: any) => ({
              slug: r.article.slug,
              title: r.article.title,
              description: r.article.description,
              tags: r.article.tags,
              coverImage: r.article.coverImage,
              score: r.score,
              type: 'text' as const,
              snippet: r.snippet
            })));
          }
        } catch (err) {
          console.error('Text search error:', err);
        }
        responseIndex++;
      }

      // Process vector search results (from hybrid endpoint)
      if (enableVector && responses[responseIndex]) {
        try {
          const vectorData = await responses[responseIndex].json();
          if (vectorData.results) {
            allResults.push(...vectorData.results.map((r: any) => ({
              slug: r.article.slug,
              title: r.article.title,
              description: r.article.description,
              tags: r.article.tags,
              coverImage: r.article.coverImage,
              score: r.score,
              type: 'vector' as const,
              snippet: r.snippet
            })));
          }
        } catch (err) {
          console.error('Vector search error:', err);
        }
      }

      // Remove duplicates (prefer vector results)
      const uniqueResults = allResults.reduce((acc, result) => {
        const existing = acc.find(r => r.slug === result.slug);
        if (!existing) {
          acc.push(result);
        } else if (result.type === 'vector' && existing.type === 'text') {
          // Replace text result with vector result
          const index = acc.indexOf(existing);
          acc[index] = result;
        }
        return acc;
      }, [] as SearchResult[]);

      // Sort by score (higher is better)
      uniqueResults.sort((a, b) => (b.score || 0) - (a.score || 0));

      setResults(uniqueResults);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Search Testing Dashboard</h1>
      
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">How to Test:</h2>
        <ul className="space-y-1 text-sm">
          <li>• Enter a search query and select search types to enable</li>
          <li>• <strong>Text Search:</strong> Fuzzy matching on article content and metadata</li>
          <li>• <strong>Vector Search:</strong> Semantic similarity using OpenAI embeddings</li>
          <li>• Results are labeled by type and scored for relevance</li>
          <li>• Duplicates are merged (vector results preferred)</li>
        </ul>
      </div>

      {/* Search Interface */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">🔍 Search Interface</h2>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Query
            </label>
            <input
              id="search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., TypeScript patterns, AI recommendations, Next.js..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Search Options */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={enableFuzzy}
                onChange={(e) => setEnableFuzzy(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Enable Text Search (Fuzzy)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={enableVector}
                onChange={(e) => setEnableVector(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Enable Vector Search (Semantic)</span>
            </label>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            📊 Search Results ({results.length})
          </h2>
          
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={`${result.slug}-${result.type}`}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        result.type === 'vector'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {result.type === 'vector' ? '🧠 Vector' : '🔤 Text'}
                    </span>
                    {result.score && (
                      <span className="text-xs text-gray-500">
                        Score: {result.score.toFixed(3)}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">#{index + 1}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">
                  <a
                    href={`/articles/${result.slug}`}
                    target="_blank"
                    className="hover:text-blue-600 hover:underline"
                  >
                    {result.title}
                  </a>
                </h3>
                
                <p className="text-sm text-gray-600 mb-2">
                  {result.description}
                </p>

                {result.snippet && (
                  <div className="text-xs text-gray-500 bg-gray-50 rounded p-2 mb-2">
                    <strong>Snippet:</strong> {result.snippet}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-1">
                  {result.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="mt-2 text-xs text-gray-400">
                  Slug: {result.slug}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!isLoading && query && results.length === 0 && !error && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-600">No results found for "{query}"</p>
          <p className="text-sm text-gray-500 mt-1">
            Try different keywords or enable both search types
          </p>
        </div>
      )}

      {/* Debug Info */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="text-sm font-semibold mb-2">🔧 Debug Info</h3>
        <div className="text-xs text-gray-600 space-y-1">
          <div>Query: "{query}"</div>
          <div>Text Search: {enableFuzzy ? 'Enabled' : 'Disabled'}</div>
          <div>Vector Search: {enableVector ? 'Enabled' : 'Disabled'}</div>
          <div>Results: {results.length}</div>
          <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
        </div>
      </div>
    </div>
  );
}
