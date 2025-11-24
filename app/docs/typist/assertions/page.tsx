import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { buildDocNavigation } from '@/lib/content/doc.model';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { Code } from '@/lib/content/ui/code.cmp.iso';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata() {
  return {
    title: 'Assertions - Typist API Reference',
    description: 'Comprehensive reference for the Assertions functional group in typist - static type-level assertion kit for testing and debugging.',
  };
}

export default function AssertionsApiPage() {
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
                  Assertions
                </h1>
                <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full font-medium">
                  Functional Group
                </span>
              </div>
              
              <p className="text-xl text-gray-600 mb-6">
                Compile-time type assertion utilities for static validation, testing, and proof construction. 
                Build type-safe applications with zero runtime overhead through TypeScript's type system.
              </p>
            </header>

                            <Code language="typescript">{`
type Positive = '👍' | '👌' | '🎉' | '😊'
is_<Positive>('🎉') // ✓
// @ts-expect-error ✓
is_<Positive>('👎') // type '👎' is not assignable to type 'Positive'
`}</Code>

                <div className="flex gap-4 mt-4 mb-6">
                  <Link 
                    href="/typescape/typist-intro"
                    className="inline-flex items-center font-semibold px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    🔭 Explore in Typist Introduction Typescape
                  </Link>
                </div>

            {/* Introductory Exposition */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              
              <div className="prose prose-lg text-gray-700 max-w-none space-y-6">
                <p>
                  The <strong>Assertions</strong> functional group provides compile-time type checking 
                  utilities with zero runtime overhead. These functions test type relationships, validate 
                  assignability, and verify structural constraints entirely through TypeScript's type system.
                </p>

                <p>
                  Assertions work by leveraging TypeScript's constraint system to trigger compilation errors when 
                  invalid type relationships are tested. They accept values for type extraction or phantom 
                  parameters created with <code>t_&lt;Type&gt;()</code> for pure type-level operations. 
                  All functions follow consistent design principles: they use generic constraints to enforce 
                  valid relationships at compile time, have empty implementations for zero runtime overhead, 
                  and work seamlessly with TypeScript's type narrowing in conditional blocks.
                </p>

                <p>
                  Whether you're building domain models with user hierarchies, validating API contracts, 
                  or creating type-safe utility functions, assertions provide compile-time guarantees that 
                  your type relationships are correct before your code ever runs. Multiple assertions can 
                  be composed in sequence to build complex type proofs and validate sophisticated domain logic.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Type-Level and Value-Level Flexibility</h3>

                <p>
                  Assertions work seamlessly with both concrete values and phantom types. Use <code>typeof </code> 
                  to extract types from runtime values, or <code>t_&lt;Type&gt;()</code> to create phantom values 
                  for pure type-level testing. This flexible approach means you can use any identifier (const, type, interface) 
                  as either a type argument <code>&lt;T&gt;</code> or function parameter, mixing and matching value-level 
                  and type-level inputs as needed. See the interactive examples in our typescape scenarios:
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Negative Testing with @ts-expect-error</h3>

                <p>
                  A crucial aspect of type-safe development is validating that invalid operations correctly fail. 
                  TypeScript's <code>@ts-expect-error</code> directive allows you to write negative tests that verify 
                  compilation errors occur when they should. This enables comprehensive testing of type constraints 
                  and ensures your type system correctly rejects invalid states, providing complete validation 
                  coverage for both positive and negative cases.
                </p>
              </div>
            </section>

                        {/* Examples Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Examples</h2>
              
              <div className="space-y-10">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Basic Type Testing</h3>
                  <p className="text-gray-600 mb-4">
                    The foundation of typist assertions - testing whether values belong to specific types. 
                    Use <code>is_</code> for direct assignability testing and leverage <code>@ts-expect-error</code> 
                    to validate that invalid assignments correctly fail at compile time.
                  </p>
                  <Code language="typescript">{`type Positive = '👍' | '👌' | '🎉' | '😊'
is_<Positive>('🎉') // ✓
// @ts-expect-error ✓
is_<Positive>('👎')

const smile = '😊'
is_<Positive>(smile) // ✓
is_<string>(smile) // ✓
// @ts-expect-error ✓
is_<'🎉'>(smile)`}</Code>
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Type Relationship Testing</h3>
                  <p className="text-gray-600 mb-4">
                    Verify type hierarchies and subtype relationships using <code>extends_</code>. 
                    This pattern is essential for testing that more specific types properly extend 
                    their broader counterparts, enabling safe type narrowing and polymorphism.
                  </p>
                  <Code language="typescript">{`extends_<PositiveReaction, Reaction>() // ✓
// @ts-expect-error ✓
// type 'Reaction' does not satisfy the constraint 'Positive'
extends_<Reaction, PositiveReaction>()`}</Code>
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Object Structure Validation</h3>
                  <p className="text-gray-600 mb-4">
                    Test object shapes and property existence with <code>has_</code>. This pattern is 
                    crucial for domain modeling where you need to ensure objects contain specific 
                    properties with correct types, especially in user systems and data validation.
                  </p>
                  <Code language="typescript">{`// @ts-expect-error ✓
// property 'premiumSince' missing in type 'RegularUser'
has_<'premiumSince', Date>(alice)`}</Code>
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Control Flow with Type Guards</h3>
                  <p className="text-gray-600 mb-4">
                    Combine assertions with TypeScript's control flow analysis to validate types within 
                    conditional branches. This pattern enables sophisticated domain logic where different 
                    code paths have different type guarantees based on runtime conditions.
                  </p>
                  <Code language="typescript">{`if (isPremiumFeedback(feedback0)) 
{ extends_<ExclusiveReaction, typeof feedback0.reaction>()
  is_<PremiumUser>(feedback0.user)
  has_<'premiumSince'>(feedback0.user) } 
else 
{ // @ts-expect-error - only premium users can use exclusive reactions
  extends_<ExclusiveReaction, typeof feedback0.reaction>()
  is_<RegularUser>(feedback0.user) }`}</Code>
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Phantom Type Conversions</h3>
                  <p className="text-gray-600 mb-4">
                    Bridge the gap between runtime values and compile-time types using <code>typeof</code> 
                    and <code>t_</code>. This pattern provides maximum flexibility, allowing you to test 
                    types extracted from runtime values or create phantom values for pure type-level testing.
                  </p>
                  <Code language="typescript">{`const hands = ['👍','👎','👌'] as const
const hand = random(hands)
is_<typeof hands[number]>(hand) // ✓ - it could be any hand type (union)
is_<typeof hand>('👍') // ✓ - one possible hand
is_<Reaction>(hand) // ✓ - hands are reactions
extends_(hand, t_<Reaction>()) // ✓ - use t_ to use pure type as value argument
extends_<typeof hand, Reaction>() // ✓ - use typeof to use value's type as type argument`}</Code>
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
                    <code>is_&lt;T&gt;(x: T): void</code>
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Core type assertion function. Tests that a value is assignable to type T. 
                    Provides immediate compile-time feedback if the assignment is invalid.
                  </p>
                  <Code language="typescript">{`export const is_ 
  = <T>(x:T) => {}
is_<string>('hello') // ✓
is_<number>(42) // ✓`}</Code>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <code>assignable_&lt;T&gt;(x: T): void</code>
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Alias for <code>is_</code>. Provides identical functionality with more explicit naming 
                    that emphasizes the assignability testing aspect.
                  </p>
                  <Code language="typescript">{`export const assignable_ = is_
assignable_<'red' | 'blue'>('red') // ✓`}</Code>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <code>has_&lt;P, V&gt;(x: &#123;[k in P]: V&#125;): void</code>
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Verifies that an object has a property <code>P</code> with value type <code>V</code>. 
                    Uses mapped types to enforce property existence and type constraints simultaneously.
                  </p>
                  <Code language="typescript">{`export const has_ 
  = <const P extends string, const V = any>(x: { [k in P]: V }) => {}
const user = { name: 'alice', age: 30 }
has_<'name', string>(user) // ✓
has_<'age', number>(user) // ✓`}</Code>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <code>extends_&lt;E extends T, T&gt;(y?: E, x?: T): void</code>
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Tests subtype relationships by constraining <code>E</code> to extend <code>T</code>. 
                    Can be used with phantom parameters or with actual runtime values for type extraction.
                  </p>
                  <Code language="typescript">{`export const extends_ 
  = <E extends T,T>(y?:E, x?:T) => {}
type Animal = { name: string }
type Dog = Animal & { breed: string }
extends_<Dog, Animal>() // ✓`}</Code>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <code>instance_&lt;T&gt;(x?: InstanceType&lt;T&gt;): void</code>
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Verifies constructor/class instance relationships. Tests that a value is an instance 
                    of a class or constructor function type.
                  </p>
                  <Code language="typescript">{`export const instance_ 
  = <T extends abstract new (...args:any[]) => any>(x?:InstanceType<T>) => {}
class User { constructor(public name: string) {} }
const alice = new User('alice')
instance_<typeof User>(alice) // ✓`}</Code>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <code>never_&lt;T extends never&gt;(x?: T): never</code>
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Asserts type impossibility by constraining the type parameter to <code>never</code>. 
                    Useful for proving that certain type combinations are invalid or unreachable.
                  </p>
                  <Code language="typescript">{`export const never_ 
  = <T extends never>(x?: T): never => x as never
type Impossible = string & number
never_<Impossible>() // ✓ - string & number is never`}</Code>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <code>yes_&lt;T extends $Yes&gt;(t?: T): true</code>
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Asserts positive verdicts from comparator types. Used to verify that type 
                    comparisons resolve to <code>$Yes</code>, indicating successful matches.
                  </p>
                  <Code language="typescript">{`export const yes_ 
  = <T extends $Yes>(t?:T) => true
type AreEqual = $Equal<string, string>
yes_<AreEqual>() // ✓ - strings are equal`}</Code>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <code>no_&lt;T extends $No&lt;any, any&gt;&gt;(t?: T): void</code>
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Asserts negative verdicts from comparator types. Used to verify that type 
                    comparisons correctly fail and produce <code>$No</code> verdicts.
                  </p>
                  <Code language="typescript">{`export const no_ 
  = <T extends $No<any, any>>(t?:T) => {}
type AreNotEqual = $Equal<string, number>
no_<AreNotEqual>() // ✓ - string ≠ number`}</Code>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <code>decidable_&lt;T extends $Maybe&gt;(t?: T): void</code>
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Asserts that a type comparison is decidable (either <code>$Yes</code> or <code>$No</code>). 
                    Used to verify that comparisons don't produce undefined or ambiguous results.
                  </p>
                  <Code language="typescript">{`export const decidable_ 
  = <T extends $Maybe>(t?:T) => {}
type ComparisonResult = $Equal<string, string>
decidable_<ComparisonResult>() // ✓ - $Yes or $No`}</Code>
                </div>
              </div>
            </section>

            {/* Related Functional Groups */}
            <section className="mb-12">
              
              <p className="text-lg text-gray-600 mb-6">
                Explore other typist functional groups that complement assertions in building comprehensive type-safe applications.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/docs/typist/comparators" className="group">
                  <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <span className="text-blue-600 text-xl">⚖️</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Comparators</h3>
                    </div>
                    <p className="text-gray-600">
                      Type-level comparison utilities like <code>$Equal</code> and <code>$Extends</code> that resolve to verdicts for decidable type evaluations.
                    </p>
                  </div>
                </Link>

                <Link href="/docs/typist/verdicts" className="group">
                  <div className="border border-gray-200 rounded-lg p-6 hover:border-green-300 hover:bg-green-50 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <span className="text-green-600 text-xl">✅</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Verdicts</h3>
                    </div>
                    <p className="text-gray-600">
                      Boolean-like types (<code>$Yes</code>, <code>$No</code>) that represent the results of type-level computations and comparisons.
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