'use client';

import { useState } from 'react';
import type { TextSearchResult, VectorSearchResult, HybridSearchResult, MergedSearchResult } from '@/lib/content/search/search.model';

interface SearchResponse {
  query: string;
  results: (TextSearchResult | VectorSearchResult | MergedSearchResult)[];
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

function SearchResultCard({ result, index }: { result: HybridSearchResult; index: number }) {
  const [expanded, setExpanded] = useState(false);
  
  const getResultTypeInfo = () => {
    switch (result.type) {
      case 'text':
        return {
          badge: '📝 Text Only',
          bgColor: 'bg-blue-100 text-blue-800',
          description: 'Found via keyword/text search'
        };
      case 'vector':
        return {
          badge: '🔍 Vector Only', 
          bgColor: 'bg-purple-100 text-purple-800',
          description: 'Found via semantic/embedding search'
        };
      case 'merged':
        return {
          badge: '🔀 Merged Result',
          bgColor: 'bg-green-100 text-green-800',
          description: 'Found via both text and vector search'
        };
      default:
        return {
          badge: '❓ Unknown',
          bgColor: 'bg-gray-100 text-gray-800',
          description: 'Unknown search method'
        };
    }
  };

  const typeInfo = getResultTypeInfo();
  const isLab = result.chunk.target.kind === 'lab';
  const targetUrl = isLab ? `/labs/${result.chunk.target.slug}` : `/articles/${result.chunk.target.slug}`;

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.bgColor}`}>
              {typeInfo.badge}
            </span>
            <span className="text-xs text-gray-500">{typeInfo.description}</span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            <a 
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              {result.chunk.target.name}
              <span className="text-sm">↗</span>
            </a>
          </h3>
          
          <div className="text-sm font-medium text-blue-600 mb-2">
            📄 {result.chunk.label}
          </div>
        </div>
        
        {/* Score Section */}
        <div className="text-right ml-4">
          <div className="text-lg font-bold text-gray-900">
            {result.score.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">Combined Score</div>
          
          {/* Score Breakdown for Merged Results */}
          {result.type === 'merged' && (
            <div className="mt-2 space-y-1">
              {result.text && (
                <div className="text-xs">
                  <span className="text-blue-600">Text: {result.text.score.toFixed(1)}</span>
                </div>
              )}
              {result.vector && (
                <div className="text-xs">
                  <span className="text-purple-600">Vector: {(result.vector.similarity * 100).toFixed(1)}%</span>
                </div>
              )}
            </div>
          )}
          
          {/* Individual Result Scores */}
          {result.type === 'text' && (
            <div className="text-xs text-gray-500 mt-1">
              Text Score: {result.score.toFixed(1)}
            </div>
          )}
          
          {result.type === 'vector' && 'similarity' in result && (
            <div className="text-xs text-gray-500 mt-1">
              Similarity: {(result.similarity * 100).toFixed(1)}%
            </div>
          )}
        </div>
      </div>

      {/* Content Preview */}
      <div className="mb-4">
        <p className="text-gray-700 text-sm leading-relaxed">
          {expanded 
            ? result.chunk.text 
            : `${result.chunk.text.substring(0, 200)}${result.chunk.text.length > 200 ? '...' : ''}`
          }
        </p>
        
        {result.chunk.text.length > 200 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 hover:text-blue-800 text-xs mt-2 font-medium"
          >
            {expanded ? 'Show Less' : 'Show Full Content'}
          </button>
        )}
      </div>

      {/* Metadata */}
      <div className="space-y-3">
        {/* Target Information */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs font-medium text-gray-700 mb-2">Target Information</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-medium">Type:</span> {result.chunk.target.kind === 'lab' ? '🧪 Lab' : '📖 Article'}
            </div>
            <div>
              <span className="font-medium">Slug:</span> <code className="bg-white px-1 rounded">{result.chunk.target.slug}</code>
            </div>
            {result.chunk.target.kind === 'article' && 'author' in result.chunk.target && (
              <div>
                <span className="font-medium">Author:</span> {(result.chunk.target as any).author.name}
              </div>
            )}
            {result.chunk.target.kind === 'article' && 'publishedTs' in result.chunk.target && (
              <div>
                <span className="font-medium">Published:</span> {new Date((result.chunk.target as any).publishedTs).toLocaleDateString()}
              </div>
            )}
          </div>
          
          {result.chunk.target.blurb && (
            <div className="mt-2">
              <div className="text-xs font-medium text-gray-700 mb-1">Description:</div>
              <p className="text-xs text-gray-600">{result.chunk.target.blurb}</p>
            </div>
          )}
        </div>

        {/* Chunk Details */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {result.chunk.tags.slice(0, 6).map((tag: string) => (
              <span 
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
              >
                {tag}
              </span>
            ))}
            {result.chunk.tags.length > 6 && (
              <span className="text-xs text-gray-500">+{result.chunk.tags.length - 6} more</span>
            )}
          </div>
          
          <div className="text-xs text-gray-500">
            Chunk ID: <code className="bg-gray-100 px-1 rounded">{result.chunk.id}</code>
          </div>
        </div>

        {/* Search Method Details */}
        {result.type === 'merged' && (
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xs font-medium text-green-800 mb-2">Search Method Analysis</div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {result.text && (
                <div className="bg-white rounded p-2">
                  <div className="font-medium text-blue-700 mb-1">📝 Text Search</div>
                  <div>Score: {result.text.score.toFixed(2)}</div>
                  <div className="text-gray-600">Keyword matching</div>
                </div>
              )}
              {result.vector && (
                <div className="bg-white rounded p-2">
                  <div className="font-medium text-purple-700 mb-1">🔍 Vector Search</div>
                  <div>Similarity: {(result.vector.similarity * 100).toFixed(1)}%</div>
                  <div className="text-gray-600">Semantic matching</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
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
        // Hybrid search - combine both text and vector results
        endpoint = `/api/search/hybrid?${searchParams.toString()}`;
        
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Hybrid search failed');
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
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Advanced Search Test Lab</h1>
        <p className="text-gray-600">
          Test our hybrid search system that combines text-based keyword matching with semantic vector search.
        </p>
      </div>

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
        <div className="space-y-6">
          {/* Results Header */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">Search Results</h2>
              <div className="text-sm text-gray-600">
                {results.results.length} of {results.meta?.total || results.total || 0} results
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Query:</span> "{results.query}"
              </div>
              <div>
                <span className="font-medium">Method:</span> {results.searchType}
              </div>
              {results.limit && (
                <div>
                  <span className="font-medium">Limit:</span> {results.limit}
                </div>
              )}
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            {results.results.length > 0 ? (
              results.results.map((result, index) => (
                <SearchResultCard 
                  key={`${result.chunk.id}-${index}`} 
                  result={result as HybridSearchResult} 
                  index={index} 
                />
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">🔍</div>
                <div className="text-lg font-medium mb-2">No results found</div>
                <div className="text-sm">Try adjusting your search query or method</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
