import { Suspense } from 'react';
import Link from 'next/link';
import { listDocLibraries } from '@/lib/content/docs.registry.logic';
import { DocLibraryCard } from '@/lib/content/ui/doc/doc-library-card.cmp.iso';
import { Book, Layers } from 'lucide-react';

export async function generateMetadata() {
  return {
    title: 'Documentation Libraries',
    description: 'Browse our comprehensive documentation libraries and guides.',
  };
}

function DocLibrariesGrid() {
  const { libraries, total } = listDocLibraries();

  if (libraries.length === 0) {
    return (
      <div className="text-center py-12">
        <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" strokeWidth={1.5} />
        <p className="text-gray-500 text-lg">No documentation libraries available yet.</p>
        <p className="text-gray-400 mt-2">Check back soon for comprehensive guides and references.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {libraries.map((library) => (
        <DocLibraryCard key={library.slug} library={library} />
      ))}
    </div>
  );
}

function DocLibrariesSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-200 animate-pulse h-48" />
          <div className="p-6">
            <div className="flex gap-2 mb-3">
              <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
            </div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-full mb-4 animate-pulse" />
            <div className="flex gap-2 mb-4">
              <div className="h-5 bg-gray-200 rounded-full w-16 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded-full w-20 animate-pulse" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function DocsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Layers className="h-8 w-8 text-blue-600" strokeWidth={1.8} />
          <h1 className="text-4xl font-bold text-gray-900">
            Documentation
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl">
          Explore our comprehensive documentation libraries. Each library contains 
          detailed guides, API references, and examples to help you get started quickly.
        </p>
      </header>

      <Suspense fallback={<DocLibrariesSkeleton />}>
        <DocLibrariesGrid />
      </Suspense>
    </div>
  );
}