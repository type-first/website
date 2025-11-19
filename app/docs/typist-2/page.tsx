import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { buildDocNavigation } from '@/lib/content/doc.model';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { Code } from '@/lib/content/ui/code.cmp.iso';
import { CodeExplorerLink } from '@/lib/content/ui/link.code-explorer.cmp.iso';
import { Calendar, User, Book, ExternalLink, Package, ArrowRight, Zap, CheckCircle, Bug, Layers, RefreshCw, Target } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata() {
  return {
    title: 'Typist - Type-Level Programming Toolkit',
    description: 'Comprehensive type-level programming toolkit for TypeScript. Build static proofs, assertions, and phantom types with zero runtime overhead.',
  };
}

export default function TypistNewHomePage() {
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
              Typist Toolkit
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
                  <img 
                    src={library.coverImgUrl} 
                    alt={library.name}
                    className="w-full h-32 object-contain p-4"
                  />
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {library.name}
                  </h1>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
                      v{library.version}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600 text-sm">@typefirst/typist</span>
                  </div>
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
                  Updated {new Date('2025-11-18').toLocaleDateString()}
                </div>
                {library.version && (
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" strokeWidth={1.8} />
                    v{library.version}
                  </div>
                )}
              </div>
            </header>

            {/* Quick Start */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Installation
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <Code language="bash">npm install @typefirst/typist</Code>
              </div>
            </section>

            {/* What is Typist */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Show what your types are made of.
              </h2>
              <div className="prose prose-gray max-w-none mb-6">
                <p className="text-lg text-gray-700">
                  typist is a minimal suite for compilable static proofs at the type level. It provides atomic type-level 
                  operators that let you encode assertions and validations with zero runtime overhead.
                </p>
                <p className="text-gray-700">
                  Whether you're building type-safe APIs, enforcing domain constraints, or creating self-documenting 
                  interfaces, typist gives you the tools to write highly expressive code that the TypeScript compiler can 
                  verify for correctness.
                </p>
              </div>

              {/* Code Example */}
              <div className="bg-gray-900 text-gray-100 rounded-lg p-6 mb-6">
                <Code language="typescript">{`import { is_, extends_, yes_, no_, $Equal, $Extends, test_ } from '@typefirst/typist'
type Positive = number
type UserID = string & { readonly brand: 'UserID' }

// Create phantom types
const userId = is_<UserID>('user123')
const isPositive = is_<Positive>(42)

// Verify phantom types are distinct  
no_<$Equal<UserID, string>>()  // ✓ Different types
yes_<$Extends<UserID, string>>()  // ✓ Runtime compatible`}</Code>
              </div>
            </section>

            {/* Functional Groups */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Functional Groups</h2>
              <p className="text-gray-600 mb-8">
                Typist is organized into focused functional groups, each providing specific capabilities for 
                type-level programming. These groups work together to enable comprehensive type system development.
              </p>
              
              <div className="grid gap-6">
                <Link href="/docs/typist/operators" className="group block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <RefreshCw className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Operators</h3>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                      </div>
                      <p className="text-gray-600 mb-3">
                        Core phantom value operators for creating, transforming, and composing types. 
                        Includes `t_`, `assign_`, `widen_`, `specify_`, and `intersect_` utilities.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">Foundation</span>
                        <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded">Zero-cost</span>
                        <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">Compositional</span>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/docs/typist/phantoms" className="group block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-emerald-100 rounded-lg">
                      <Zap className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Phantoms</h3>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                      </div>
                      <p className="text-gray-600 mb-3">
                        Phantom types and zero-cost abstractions for type-level programming. 
                        Build branded types, state machines, and symbolic computation systems.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded">Nominal typing</span>
                        <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">State machines</span>
                        <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded">Domain modeling</span>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/docs/typist/assertions" className="group block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Assertions</h3>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                      </div>
                      <p className="text-gray-600 mb-3">
                        Type assertion utilities for static validation and testing. 
                        Includes `is_`, `extends_`, `has_`, and verdict assertion functions.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">Validation</span>
                        <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">Testing</span>
                        <span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded">Debugging</span>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/docs/typist/blocks" className="group block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Layers className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Blocks</h3>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                      </div>
                      <p className="text-gray-600 mb-3">
                        Test organization and scoping utilities for building comprehensive type-level test suites. 
                        Includes `test_`, `example_`, and `proof_` block functions.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">Organization</span>
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded">Scoping</span>
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">Test harness</span>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/docs/typist/verdicts" className="group block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Target className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Verdicts</h3>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                      </div>
                      <p className="text-gray-600 mb-3">
                        Structured type comparison results and conditional logic system. 
                        Includes `$Yes`, `$No`, `$Maybe` verdict types and related utilities.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded">Comparison</span>
                        <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded">Conditional</span>
                        <span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded">Error handling</span>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/docs/typist/comparators" className="group block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Bug className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Comparators</h3>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                      </div>
                      <p className="text-gray-600 mb-3">
                        Type comparison operators that return structured verdicts. 
                        Core comparators `$Equal` and `$Extends` for relationship testing.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">Equality</span>
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">Subtyping</span>
                        <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">Relationships</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </section>

            {/* Interactive Learning */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Interactive Learning Typescapes</h2>
              <p className="text-gray-600 mb-8">
                Master typist concepts through hands-on practice with our interactive typescapes. Each typescape 
                provides a complete TypeScript environment with guided examples and real-world patterns.
              </p>
              
              <div className="grid gap-6">
                <CodeExplorerLink
                  slug="typist-phantom-types-basics"
                  name="Phantom Types Basics"
                  description="Learn the fundamentals of phantom types and type-level programming with typist. Create phantom values, build branded types, and understand zero-cost abstractions."
                  className="p-6"
                />
                
                <CodeExplorerLink
                  slug="typist-type-comparisons"
                  name="Type Comparisons & Verdicts"
                  description="Master type-level comparisons using $Equal, $Extends, and the verdict system. Learn to create compile-time assertions and conditional type logic."
                  className="p-6"
                />
                
                <CodeExplorerLink
                  slug="typist-advanced-patterns"
                  name="Advanced Type-Level Patterns"
                  description="Explore advanced type-level programming patterns. Build complex type computations, state machines, recursive types, and compile-time proofs."
                  className="p-6"
                />

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    💡 Learning Path Recommendation
                  </h3>
                  <p className="text-blue-800 mb-4">
                    Start with "Phantom Types Basics" to understand core concepts, then progress to 
                    "Type Comparisons" for assertion patterns, and finally tackle "Advanced Patterns" 
                    for sophisticated type-level programming techniques.
                  </p>
                  <p className="text-blue-700 text-sm">
                    Each typescape includes guided exercises, real-world examples, and interactive 
                    TypeScript environments where you can experiment with typist patterns.
                  </p>
                </div>
              </div>
            </section>

            {/* Quick Start */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start Guide</h2>
              <p className="text-gray-600 mb-6">
                Get started with typist in minutes. Follow these essential patterns to begin building 
                type-safe applications with compile-time validation.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
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
                    Jump into typist with practical examples and learn core concepts through hands-on coding.
                  </p>
                </Link>
              </div>
            </section>

            {/* Resources */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Resources & Community</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ExternalLink className="h-6 w-6 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">GitHub Repository</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Explore the source code, contribute to the project, and report issues or feature requests.
                  </p>
                  <a 
                    href={library.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View on GitHub →
                  </a>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="h-6 w-6 text-red-600" />
                    <h3 className="text-lg font-semibold text-gray-900">NPM Package</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Install typist from npm and view package details, version history, and dependencies.
                  </p>
                  <a 
                    href={`https://www.npmjs.com/package/${library.npmPackage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    View on NPM →
                  </a>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Book className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Documentation</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Comprehensive API reference, guides, and examples for all typist functional groups.
                  </p>
                  <Link 
                    href="/docs/typist/introduction" 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read the docs →
                  </Link>
                </div>
              </div>
            </section>

            {/* Metadata */}
            <section>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" strokeWidth={1.8} />
                    {library.author.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" strokeWidth={1.8} />
                    Updated {new Date('2025-11-18').toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" strokeWidth={1.8} />
                    v{library.version}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}