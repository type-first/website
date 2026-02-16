import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { buildDocNavigation } from '@/lib/content/doc.model';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { Code } from '@/lib/content/ui/code.cmp.iso';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata() {
  return {
    title: 'Comparators - Typist API Reference',
    description: 'Type-level comparison utilities that resolve to verdicts - $Equal, $Extends for decidable type evaluations.',
  };
}

export default function ComparatorsApiPage() {
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
              <Link 
                href="/docs/typist"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Typist Documentation
              </Link>
              
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl font-bold text-gray-900">
                  Comparators
                </h1>
                <span className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full font-medium">
                  Functional Group
                </span>
              </div>
              
              <p className="text-xl text-gray-600 mb-6">
                Type-level comparison utilities that evaluate relationships between types and resolve to verdicts. 
                Build sophisticated type-level logic with zero runtime overhead through structured comparison results.
              </p>
            </header>

            <Code language="typescript">{`
type StringsEqual = $Equal<string, string>
yes_<StringsEqual>() // ✓

type NumberExtendsAny = $Extends<number, any>  
yes_<NumberExtendsAny>() // ✓ - number extends any

type StringsNotEqual = $Equal<string, number>
no_<StringsNotEqual>() // ✓ - string ≠ number
`}</Code>

            <div className="flex gap-4 mt-4 mb-6">
              <Link 
                href="/typescape/typist-intro"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔭 Explore in Typist Introduction Typescape
              </Link>
            </div>

            {/* Introductory Exposition */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              
              <div className="prose prose-lg text-gray-700 max-w-none space-y-6">
                <p>
                  The <strong>Comparators</strong> functional group provides type-level comparison 
                  utilities that evaluate relationships between types and resolve to verdict types. 
                  These are pure compile-time operations that enable sophisticated type-level logic and validation.
                </p>

                <p>
                  Comparators work by using TypeScript's conditional type system to test relationships 
                  and return structured verdict types (<code>$Yes</code> or <code>$No</code>) that encode 
                  both the result and debugging information. All comparators follow consistent design principles: 
                  they use conditional type evaluation for reliable results, produce structured verdicts with 
                  embedded error information, and integrate seamlessly with assertion functions for complete type-level testing.
                </p>

                <p>
                  Whether you're building type-safe APIs, validating complex data structures, or creating 
                  utility types that need relationship testing, comparators provide the foundation for 
                  decidable type-level logic. Multiple comparisons can be composed together to build 
                  complex validation chains and sophisticated type-level algorithms.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Verdict Resolution Pattern</h3>

                <p>
                  All comparators resolve to verdict types that can be tested with assertion functions, 
                  creating a complete type-level testing ecosystem. Successful comparisons return <code>$Yes</code>, 
                  while failures return <code>$No</code> with structured error information including the reason 
                  for failure and contextual type information for debugging.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Integration with Assertions</h3>

                <p>
                  Comparators work hand-in-hand with assertion functions to provide complete validation coverage. 
                  Use <code>yes_</code> to assert successful comparisons, <code>no_</code> to verify expected failures, 
                  and <code>decidable_</code> to ensure comparisons produce definitive results. This enables both 
                  positive and negative testing patterns for comprehensive type validation.
                </p>
              </div>
            </section>

            {/* Examples Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Examples</h2>
              
              <div className="space-y-10">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Basic Type Equality Testing</h3>
                  <p className="text-gray-600 mb-4">
                    The foundation of type comparison - testing whether two types are structurally identical. 
                    Use <code>$Equal</code> for strict bidirectional equality testing and leverage verdict assertions 
                    to validate both successful matches and expected differences.
                  </p>
                  <Code language="typescript">{`type SameTypes = $Equal<string, string>
yes_<SameTypes>() // ✓ - strings are equal

type DifferentTypes = $Equal<string, number>
no_<DifferentTypes>() // ✓ - string ≠ number

type UnionEquality = $Equal<'a' | 'b', 'b' | 'a'>
yes_<UnionEquality>() // ✓ - union order doesn't matter

type StrictCheck = $Equal<string, string | number>
no_<StrictCheck>() // ✓ - string ≠ union (strict equality)`}</Code>
                  <div className="mt-4">
                    <Link 
                      href="/typescape/typist-intro"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      🔭 Explore in Typist Introduction Typescape
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Subtype Relationship Testing</h3>
                  <p className="text-gray-600 mb-4">
                    Verify type hierarchies and assignability relationships using <code>$Extends</code>. 
                    This is essential for testing that more specific types can be safely used where 
                    broader types are expected, enabling polymorphism and type narrowing validation.
                  </p>
                  <Code language="typescript">{`type LiteralExtendsString = $Extends<'hello', string>
yes_<LiteralExtendsString>() // ✓ - literal extends string

type StringExtendsAny = $Extends<string, any>
yes_<StringExtendsAny>() // ✓ - everything extends any

type NumberExtendsString = $Extends<number, string>
no_<NumberExtendsString>() // ✓ - number doesn't extend string

type UnionSubset = $Extends<'red', 'red' | 'blue' | 'green'>
yes_<UnionSubset>() // ✓ - member extends union`}</Code>
                  <div className="mt-4">
                    <Link 
                      href="/typescape/typist-intro"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      🔭 Explore in Typist Introduction Typescape
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Complex Type Validation Chains</h3>
                  <p className="text-gray-600 mb-4">
                    Build sophisticated validation logic by composing multiple comparators together. 
                    This pattern enables complex type-level algorithms where multiple relationships 
                    need to be verified simultaneously for complete validation coverage.
                  </p>
                  <Code language="typescript">{`// Multi-level validation
type Animal = { name: string }
type Dog = Animal & { breed: string }
type Poodle = Dog & { size: 'standard' | 'miniature' | 'toy' }

yes_<$Extends<Dog, Animal>>() // ✓ - hierarchy validation
yes_<$Extends<Poodle, Dog>>() // ✓ - inheritance chain
no_<$Equal<Dog, Animal>>() // ✓ - not the same despite extension

// Union relationship testing
type PrimaryColors = 'red' | 'blue' | 'yellow'
type WarmColors = 'red' | 'orange' | 'yellow'
no_<$Equal<PrimaryColors, WarmColors>>() // ✓ - different unions
yes_<$Extends<'red', PrimaryColors>>() // ✓ - member validation`}</Code>
                  <div className="mt-4">
                    <Link 
                      href="/typescape/typist-intro"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      🔭 Explore in Typist Introduction Typescape
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Canonical API List */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">API Reference</h2>
              
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <code>$Equal&lt;T1, T2&gt;</code>
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Tests bidirectional type equality by checking structural identity between types. 
                    This is the strictest comparison, ensuring both types have identical structure.
                  </p>
                  <Code language="typescript">{`yes_<$Equal<string, string>>() // ✓ - identical types
yes_<$Equal<'a' | 'b', 'b' | 'a'>>() // ✓ - union order irrelevant
no_<$Equal<string, string | number>>() // ✓ - strict equality fails
no_<$Equal<{ a: 1 }, { a: 1; b?: 2 }>>() // ✓ - different structures

type Check1 = $Equal<42, number>
// @ts-expect-error ✓
yes_<Check1>() // literal ≠ primitive type
no_<Check1>() // ✓ - correctly identifies difference`}</Code>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <code>$Extends&lt;T1, T2&gt;</code>
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Tests whether T1 extends T2 (T1 is assignable to T2). This is unidirectional 
                    subtype testing that validates inheritance and assignability relationships.
                  </p>
                  <Code language="typescript">{`yes_<$Extends<'hello', string>>() // ✓ - literal extends primitive
yes_<$Extends<number, any>>() // ✓ - everything extends any
yes_<$Extends<never, string>>() // ✓ - never extends everything
no_<$Extends<string, number>>() // ✓ - no relationship

type Dog = { name: string; breed: string }
type Animal = { name: string }
yes_<$Extends<Dog, Animal>>() // ✓ - more specific extends general
// @ts-expect-error ✓
yes_<$Extends<Animal, Dog>>() // would fail - missing properties
no_<$Extends<Animal, Dog>>() // ✓ - correctly identifies non-extension`}</Code>
                </div>
              </div>
            </section>

            {/* Related Functional Groups */}
            <section className="mb-12">
              <p className="text-lg text-gray-600 mb-6">
                Explore other typist functional groups that complement comparators in building comprehensive type-safe applications.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/docs/typist/assertions" className="group">
                  <div className="border border-gray-200 rounded-lg p-6 hover:border-green-300 hover:bg-green-50 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <span className="text-green-600 text-xl">✅</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Assertions</h3>
                    </div>
                    <p className="text-gray-600">
                      Type assertion utilities like <code>is_</code> and <code>yes_</code> that test comparator results and validate type relationships.
                    </p>
                  </div>
                </Link>

                <Link href="/docs/typist/verdicts" className="group">
                  <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <span className="text-blue-600 text-xl">⚖️</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Verdicts</h3>
                    </div>
                    <p className="text-gray-600">
                      Boolean-like types (<code>$Yes</code>, <code>$No</code>) that represent the results of comparator evaluations.
                    </p>
                  </div>
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
