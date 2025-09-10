import { SearchTestClient } from './search-test-client';

export default function SearchTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Testing Lab
          </h1>
          <p className="text-gray-600">
            Test and compare different search methods: full-text search, vector similarity, and hybrid approaches.
          </p>
        </div>
        
        <SearchTestClient />
      </div>
    </div>
  );
}
