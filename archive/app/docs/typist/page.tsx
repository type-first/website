import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { buildDocNavigation } from '@/lib/content/doc.model';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { Code } from '@/lib/content/ui/code.cmp.iso';
import { CodeExplorerLink } from '@/lib/content/ui/link.code-explorer.cmp.iso';
import { Calendar, User, Book, ExternalLink, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
                    Typist
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
                Toolkit for static analysis, symbolic testing, and phantom operations. Build type-safe applications with confidence using composable constraints and static proofs.
              </p>
              
              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" strokeWidth={1.8} />
                  santiago elustondo
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" strokeWidth={1.8} />
                  Updated {new Date('2025-11-15').toLocaleDateString()}
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

            <section className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Link 
                  href="/docs/typist/guide"
                  className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Interactive Guide</h3>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-gray-600">
                    Comprehensive step-by-step guide to mastering typist through practical examples.
                  </p>
                </Link>
                
                <Link 
                  href="/docs/typist/phantoms"
                  className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Phantom Types</h3>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-gray-600">
                    Create nominal types without runtime overhead using phantom type patterns.
                  </p>
                </Link>
              </div>
            </section>

            {/* Introduction Content */}
            <section className="mb-12">
              
              <h4 className="text-lg font-bold text-gray-900 mb-4">Show what your types are made of.</h4>

              <div className="mb-6">
                <p className="text-lg text-gray-600 mb-4">
                  <code>typist</code> is a minimal suite for compilable static proofs at the type level. 
                  It provides atomic type-level operators that let you encode assertions and validations with zero runtime overhead.
                </p>
                <p className="text-lg text-gray-600">
                  Whether you're building type-safe APIs, enforcing domain constraints, or creating 
                  self-documenting interfaces, <code>typist</code> gives you the tools to write highly expressive code 
                  that the TypeScript compiler can verify for correctness.
                </p>
              </div>

              <Code language="typescript">{`import { is_ } from '@typefirst/typist'
type Positive = '👍' | '👌' | '🎉' | '😊'
is_<Positive>('🎉') // ✓ 
// @ts-expect-error ✓
// 👎 is not assignable to Positive
is_<Positive>('👎') `}</Code>


            </section>
            
            {/* Guide Link Section */}
            <section className="mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Interactive Guide</h2>
                <p className="text-gray-600 mb-6">
                  Dive deeper into typist with our comprehensive step-by-step guide. Learn type assertions, 
                  relationship testing, property validation, and phantom types through practical examples.
                </p>
                <Link 
                  href="/docs/typist/guide"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                >
                  Start the Guide
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </section>

            {/* Core Concepts */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Functional Groups</h2>
              <p className="text-lg text-gray-600 mb-6">
                Typist is organized into functional groups - collections of related utilities that work together to provide complete type-level programming capabilities.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/docs/typist/assertions" className="group">
                  <div className="border border-gray-200 rounded-lg p-6 hover:border-green-300 hover:bg-green-50 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <span className="text-green-600 text-xl">✅</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Assertions</h3>
                    </div>
                    <p className="text-gray-600">
                      Compile-time type assertion utilities like <code>is_</code>, <code>extends_</code>, and <code>has_</code> for static validation and testing.
                    </p>
                  </div>
                </Link>
                
                <Link href="/docs/typist/comparators" className="group">
                  <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <span className="text-blue-600 text-xl">⚖️</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Comparators</h3>
                    </div>
                    <p className="text-gray-600">
                      Type-level comparison utilities like <code>$Equal</code> and <code>$Extends</code> that resolve to verdicts for decidable type evaluations.
                    </p>
                  </div>
                </Link>
                
                <Link href="/docs/typist/operators" className="group">
                  <div className="border border-gray-200 rounded-lg p-6 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <span className="text-purple-600 text-xl">🔧</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Operators</h3>
                    </div>
                    <p className="text-gray-600">
                      Core phantom value operators like <code>t_</code>, <code>assign_</code>, and <code>widen_</code> for type manipulation with zero runtime overhead.
                    </p>
                  </div>
                </Link>
                
                <Link href="/docs/typist/verdicts" className="group">
                  <div className="border border-gray-200 rounded-lg p-6 hover:border-yellow-300 hover:bg-yellow-50 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                        <span className="text-yellow-600 text-xl">📋</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Verdicts</h3>
                    </div>
                    <p className="text-gray-600">
                      Boolean-like types <code>$Yes</code> and <code>$No</code> that represent the results of type-level computations and comparisons.
                    </p>
                  </div>
                </Link>
              </div>
            </section>

            {/* Interactive Learning Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Interactive Learning</h2>
              <p className="text-gray-600 mb-6">
                Master typist concepts through hands-on practice with our interactive typescapes in the Type Explorer:
              </p>
              
              <div className="grid gap-4">
                <CodeExplorerLink
                  slug="typist-phantom-types-basics"
                  name="Phantom Types Basics"
                  description="Learn the fundamentals of phantom types and type-level programming with typist. Create phantom values and build branded types."
                />
                
                <CodeExplorerLink
                  slug="typist-type-comparisons"
                  name="Type Comparisons & Assertions"
                  description="Master type-level comparisons using is_, extends_, and has_. Learn to create compile-time assertions and property tests."
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