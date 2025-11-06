import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { buildDocNavigation } from '@/lib/content/doc.model';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { Code } from '@/lib/content/ui/code.cmp.iso';
import { CodeExplorerLink } from '@/lib/content/ui/link.code-explorer.cmp.iso';
import { Calendar, User, Book, ExternalLink, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Intro } from '@/content/docs/typist/body';
import { phantomValuesSnippet } from '@/content/docs/typist/snippets/phantom-values';

export async function generateMetadata() {
  const library = getDocLibraryBySlug('typist');
  
  return {
    title: `${library?.name} Documentation`,
    description: library?.description,
  };
}

export default function TypistOverviewPage() {
  const library = getDocLibraryBySlug('typist');
  
  if (!library) {
    notFound();
  }

  const navigationPages = buildDocNavigation(library.pages);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              {library.name}
            </h3>
            <DocSidebar 
              librarySlug={library.slug} 
              pages={navigationPages}
            />
          </div>
        </aside>

        {/* Main content */}
        <main className="lg:col-span-3">
          <div className="max-w-4xl">
            {/* Header */}
            <header className="mb-8">
              {library.coverImgUrl && (
                <div className="mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
                  <div className="relative w-full" style={{ aspectRatio: '2539 / 771' }}>
                    <img 
                      src={library.coverImgUrl} 
                      alt={library.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {library.logoUrl ? (
                    <img 
                      src={library.logoUrl} 
                      alt={`${library.name} logo`}
                      className="h-8 w-8 flex-shrink-0 rounded-md"
                    />
                  ) : (
                    <Book className="h-8 w-8 text-blue-600" strokeWidth={1.8} />
                  )}
                  <h1 className="text-4xl font-bold text-gray-900">
                    {library.name}
                  </h1>
                </div>
                
                <div className="flex gap-3">
                  {library.githubUrl && (
                    <a 
                      href={library.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
                      GitHub
                    </a>
                  )}
                  {library.npmPackage && (
                    <a 
                      href={`https://www.npmjs.com/package/${library.npmPackage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      <Package className="h-4 w-4" strokeWidth={1.8} />
                      npm
                    </a>
                  )}
                </div>
              </div>
              
              <p className="text-xl text-gray-600 mb-6">
                {library.description}
              </p>
              
              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" strokeWidth={1.8} />
                  {library.author.name}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" strokeWidth={1.8} />
                  Updated {new Date(library.updatedTs).toLocaleDateString()}
                </div>
                {library.version && (
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" strokeWidth={1.8} />
                    v{library.version}
                  </div>
                )}
              </div>
              
              {/* Tags */}
              {library.tags && library.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {library.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Quick Start Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Started</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Link 
                  href="/docs/typist/installation"
                  className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Installation</h3>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-gray-600">
                    Install and configure typist in your TypeScript project with our step-by-step guide.
                  </p>
                </Link>
                
                <Link 
                  href="/docs/typist/quick-start"
                  className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Quick Start</h3>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-gray-600">
                    Jump into typist with practical examples and learn the core concepts through hands-on coding.
                  </p>
                </Link>
              </div>
            </section>

            {/* Introduction Content */}
            <section className="prose prose-lg max-w-none mb-12">
              <h2>What is Typist?</h2>
              <Intro />
              
              <h3>Key Benefits</h3>
              <ul>
                <li><strong>Compile-time Safety</strong> - Catch errors before they reach production</li>
                <li><strong>Zero Runtime Cost</strong> - All type operations happen at build time</li>
                <li><strong>Expressive APIs</strong> - Build self-documenting interfaces with rich type information</li>
                <li><strong>Developer Experience</strong> - Clear error messages and excellent IDE integration</li>
              </ul>
            </section>

            {/* Example Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Example</h2>
              <p className="text-gray-600 mb-6">
                Here's a quick taste of what typist can do. This example shows how to create phantom types 
                for type-safe domain modeling:
              </p>
              
              <Code language="typescript">{phantomValuesSnippet}</Code>
            </section>

            {/* Core Concepts */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Core Concepts</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link 
                  href="/docs/typist/phantom-types"
                  className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Phantom Types</h3>
                  <p className="text-gray-600">
                    Create nominal types without runtime overhead for safer domain modeling.
                  </p>
                </Link>
                
                <div className="block p-6 bg-gray-50 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Verdict System</h3>
                  <p className="text-gray-600">
                    Compile-time validation with rich error reporting. <span className="text-sm text-gray-500">(Coming soon)</span>
                  </p>
                </div>
                
                <div className="block p-6 bg-gray-50 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Type Operators</h3>
                  <p className="text-gray-600">
                    Utilities for type-level comparisons and transformations. <span className="text-sm text-gray-500">(Coming soon)</span>
                  </p>
                </div>
                
                <div className="block p-6 bg-gray-50 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Type Assertions</h3>
                  <p className="text-gray-600">
                    Static assertions for comprehensive type testing. <span className="text-sm text-gray-500">(Coming soon)</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Interactive Learning Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Interactive Learning</h2>
              <p className="text-gray-600 mb-6">
                Master typist concepts through hands-on practice with our interactive scenarios in the Type Explorer:
              </p>
              
              <div className="grid gap-4">
                <CodeExplorerLink
                  slug="typist-phantom-types-basics"
                  name="Phantom Types Basics"
                  description="Learn the fundamentals of phantom types and type-level programming with typist. Create phantom values and build branded types."
                />
                
                <CodeExplorerLink
                  slug="typist-type-comparisons"
                  name="Type Comparisons & Verdicts"
                  description="Master type-level comparisons using $Equal, $Extends, and the verdict system. Learn to create compile-time assertions."
                />
                
                <CodeExplorerLink
                  slug="typist-advanced-patterns"
                  name="Advanced Type-Level Patterns"
                  description="Explore advanced type-level programming patterns. Build complex type computations, state machines, and compile-time proofs."
                />
              </div>
            </section>

            {/* Navigation to all pages */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Documentation</h2>
              
              <div className="space-y-4">
                {navigationPages.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/docs/typist/${page.slug}`}
                    className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{page.title}</h3>
                        <p className="text-gray-600">{page.description}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}