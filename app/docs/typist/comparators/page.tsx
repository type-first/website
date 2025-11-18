import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { buildDocNavigation } from '@/lib/content/doc.model';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { Code } from '@/lib/content/ui/code.cmp.iso';
import { ArrowLeft, Scale, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
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
                Type-level comparison utilities for testing type relationships and producing 
                decidable verdicts. Build complex type-level logic with zero runtime overhead.
              </p>
            </header>

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
                  both the result and debugging information for failed comparisons.
                </p>

                <p>
                  Whether you're validating type-level algorithms, testing complex generic constraints, 
                  or building type-safe APIs with runtime guarantees, comparators provide the foundation 
                  for decidable type evaluation with comprehensive error reporting.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Verdict Resolution Pattern</h3>

                <p>
                  All comparators follow a consistent pattern of resolving to verdict types that 
                  can be tested with assertion functions, creating a complete type-level testing ecosystem:
                </p>

                <Code language="typescript">{`// Comparator resolves to verdict
type IsEqual = $Equal<string, string>        // → $Yes
type IsNotEqual = $Equal<string, number>     // → $No<'not-equal', [string, number]>

// Test verdicts with assertions  
yes_<IsEqual>()        // ✓ Compiles - equality confirmed
no_<IsNotEqual>()      // ✓ Compiles - inequality confirmed

// Chain with other type operations
type StringOrNumber = string | number
yes_<$Extends<string, StringOrNumber>>()    // ✓ string extends union`}</Code>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Core Patterns</h3>

                <p>
                  All comparator functions follow consistent design principles for maximum reliability and debuggability:
                </p>

                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Conditional type evaluation</strong> using TypeScript's advanced type system features</li>
                  <li><strong>Structured verdicts</strong> with <code>$Yes</code> for success and <code>$No&lt;reason, context&gt;</code> for failures</li>
                  <li><strong>Error information</strong> embedded in verdict types for debugging type-level logic</li>
                  <li><strong>Composable design</strong> allowing complex type-level algorithms and validations</li>
                  <li><strong>Integration with assertions</strong> for complete type-level testing workflows</li>
                  <li><strong>Zero runtime cost</strong> with all behavior happening at the type level</li>
                </ul>
              </div>
            </section>

            {/* Canonical API List */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">API Reference</h2>
              
              <div className="space-y-8">
                {/* Equality Comparison */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Scale className="h-6 w-6 text-blue-600" />
                    Equality Comparison
                  </h3>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      <code>$Equal&lt;T1, T2&gt;</code>
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Tests bidirectional type equality by checking that T1 extends T2 and T2 extends T1. 
                      This ensures structural identity between types and is the strictest comparison available.
                    </p>
                    <Code language="typescript">{`export type $Equal<T1, T2> = 
  (<T>() => T extends T1 ? 1 : 2) extends (<T>() => T extends T2 ? 1 : 2)
    ? $Yes 
    : $No<'not-equal', [T1, T2]>`}</Code>
                    <div className="mt-2 text-sm text-gray-500">
                      <strong>Returns:</strong> <code>$Yes</code> if types are structurally identical, <code>$No&lt;'not-equal', [T1, T2]&gt;</code> otherwise
                      <br />
                      <strong>Usage:</strong> Type identity verification, exact match testing, symmetrical comparison
                      <br />
                      <strong>Example:</strong> <code>$Equal&lt;string, string&gt;</code> resolves to <code>$Yes</code>
                    </div>
                  </div>
                </div>

                {/* Extension Comparison */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    Extension Comparison
                  </h3>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      <code>$Extends&lt;L, R&gt;</code>
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Tests unidirectional subtype relationship by checking if L extends R. 
                      Used for inheritance validation, assignability testing, and subtype verification.
                      This is the fundamental building block for type hierarchy validation.
                    </p>
                    <Code language="typescript">{`export type $Extends<L, R> =
  L extends R ? $Yes 
  : $No<'does-not-extend', [L, R]>`}</Code>
                    <div className="mt-2 text-sm text-gray-500">
                      <strong>Parameters:</strong> <code>L</code> (left/sub type), <code>R</code> (right/super type)
                      <br />
                      <strong>Returns:</strong> <code>$Yes</code> if L extends R, <code>$No&lt;'does-not-extend', [L, R]&gt;</code> otherwise
                      <br />
                      <strong>Usage:</strong> Subtype testing, inheritance verification, assignability checking
                      <br />
                      <strong>Example:</strong> <code>$Extends&lt;'hello', string&gt;</code> resolves to <code>$Yes</code>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Key Patterns Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Patterns</h2>
              
              <div className="space-y-10">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Basic Type Identity Testing</h3>
                  <p className="text-gray-600 mb-4">
                    Use <code>$Equal</code> to verify that two types are structurally identical. This is essential 
                    for validating API contracts, testing type-level algorithms, and ensuring exact type matches 
                    where assignability isn't sufficient.
                  </p>
                  <Code language="typescript">{`// From typist-type-comparisons typescape - exact type matching
type StringEqualsString = $Equal<string, string>        // → $Yes (identical types)
type StringEqualsNumber = $Equal<string, number>        // → $No (different types)
type UnionOrderMatters = $Equal<string | number, number | string>  // → $Yes (order irrelevant)

// Testing with assertions
yes_<$Equal<string, string>>()                          // ✓ Pass - types are equal
no_<$Equal<string, number>>()                           // ✓ Pass - types are different

// API contract validation
interface UserResponse { id: number; name: string; email: string }
type ResponseIdType = UserResponse['id']
yes_<$Equal<ResponseIdType, number>>()                  // ✓ Verify id is number type`}</Code>
                  <div className="mt-4">
                    <Link 
                      href="/typescape/typist-type-comparisons"
                      className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      ⚖️ Explore in Type Comparisons Typescape
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Subtype Relationship Validation</h3>
                  <p className="text-gray-600 mb-4">
                    Use <code>$Extends</code> to test inheritance hierarchies and assignability relationships. 
                    This pattern is crucial for validating that more specific types correctly extend their 
                    broader counterparts, enabling type-safe polymorphism and generic constraints.
                  </p>
                  <Code language="typescript">{`// From typist-type-comparisons typescape - hierarchy testing
type StringExtendsAny = $Extends<string, any>           // → $Yes (string is assignable to any)
type NumberExtendsString = $Extends<number, string>     // → $No (unrelated types)
type LiteralExtendsBase = $Extends<'hello', string>     // → $Yes (literal extends base type)

// Union and intersection testing
type StringExtendsUnion = $Extends<string, string | number>     // → $Yes 
type UnionExtendsString = $Extends<string | number, string>     // → $No

// Object inheritance validation
interface BaseEntity { id: string; createdAt: Date }
interface User extends BaseEntity { name: string; email: string }
yes_<$Extends<User, BaseEntity>>()                      // ✓ User properly extends BaseEntity`}</Code>
                  <div className="mt-4">
                    <Link 
                      href="/typescape/typist-type-comparisons"
                      className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      ⚖️ Explore in Type Comparisons Typescape
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Utility Type Transformation Validation</h3>
                  <p className="text-gray-600 mb-4">
                    Validate the behavior of utility types like <code>Partial</code>, <code>Pick</code>, 
                    and <code>Omit</code> using comparators. This pattern ensures that type transformations 
                    behave correctly and helps debug complex mapped type operations.
                  </p>
                  <Code language="typescript">{`// From typist-type-comparisons typescape - utility type validation
interface UserBase { name: string; email: string; age?: number }
type PartialUser = Partial<UserBase>
type PickedUser = Pick<UserBase, 'name' | 'email'>

// Test transformation relationships
type UserExtendsPartial = $Extends<UserBase, PartialUser>       // → $No (original has required props)
type PartialExtendsUser = $Extends<PartialUser, UserBase>       // → $No (partial has all optional)
type UserExtendsPicked = $Extends<UserBase, PickedUser>         // → $Yes (has all picked properties)
type PickedExtendsUser = $Extends<PickedUser, UserBase>         // → $No (missing properties)

// Validate utility type correctness  
yes_<$Extends<UserBase, PickedUser>>()                          // ✓ Original extends picked subset
no_<$Extends<PickedUser, UserBase>>()                           // ✓ Subset doesn't extend original`}</Code>
                  <div className="mt-4">
                    <Link 
                      href="/typescape/typist-type-comparisons"
                      className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      ⚖️ Explore in Type Comparisons Typescape
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Tuple Algorithm Verification</h3>
                  <p className="text-gray-600 mb-4">
                    Validate complex type-level algorithms involving tuple manipulation, union distribution, 
                    and recursive type operations. This advanced pattern ensures that sophisticated type 
                    computations produce the expected results across different input scenarios.
                  </p>
                  <Code language="typescript">{`// From typist-tuple-manipulation typescape - algorithm validation
type Join<T extends readonly any[], S extends string> = 
  T extends readonly [infer First, ...infer Rest]
    ? Rest extends readonly []
      ? \`\${First & string}\`
      : \`\${First & string}\${S}\${Join<Rest, S>}\`
    : ''

// Test tuple joining algorithm
type JoinResult = Join<['a', 'b', 'c'], '-'>             // → 'a-b-c'
yes_<$Equal<JoinResult, 'a-b-c'>>()                      // ✓ Algorithm works correctly

// Test edge cases  
yes_<$Equal<Join<[], '-'>, ''>>()                        // ✓ Empty tuple handling
yes_<$Equal<Join<['single'], '|'>, 'single'>>()          // ✓ Single element handling

// Validate union explosion algorithm
type ExplodeUnion<U> = U extends any ? [U] : never
type Exploded = ExplodeUnion<'a' | 'b' | 'c'>           // → ['a'] | ['b'] | ['c']
yes_<$Extends<['a'], Exploded>>()                        // ✓ Each member properly exploded`}</Code>
                  <div className="mt-4">
                    <Link 
                      href="/typescape/typist-tuple-manipulation"
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      🧮 Explore in Tuple Manipulation Typescape
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Object Manipulation Result Testing</h3>
                  <p className="text-gray-600 mb-4">
                    Verify that object transformation functions like omit, pick, and merge produce objects 
                    with the correct types. This pattern is essential for building type-safe utility 
                    libraries that manipulate object shapes while preserving type information.
                  </p>
                  <Code language="typescript">{`// From typist-omit-utilities typescape - transformation testing
const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}

// Test omit function type behavior
const original = { a: 1, b: 2, c: 3 }
const result = omit(original, ['a', 'c'])

// Verify result type is correct
yes_<$Equal<typeof result, { b: 2 }>>()                 // ✓ Correct omitted type
yes_<$Extends<typeof result, { b: number }>>()          // ✓ Has required properties
no_<$Extends<typeof result, { a: any }>>()              // ✓ Omitted properties absent

// Test with complex objects
interface UserProfile { id: string; name: string; email: string; lastLogin: Date }
const profile: UserProfile = { id: '1', name: 'Alice', email: 'alice@example.com', lastLogin: new Date() }
const publicProfile = omit(profile, ['email', 'lastLogin'])
yes_<$Equal<typeof publicProfile, Pick<UserProfile, 'id' | 'name'>>>()  // ✓ Correct public interface`}</Code>
                  <div className="mt-4">
                    <Link 
                      href="/typescape/typist-omit-utilities"
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      🔧 Explore in Omit Utilities Typescape
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Related Functional Groups */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Functional Groups</h2>
              <p className="text-lg text-gray-600 mb-6">
                Explore other typist functional groups that work together with comparators to build comprehensive type-safe applications.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/docs/typist/assertions" className="group">
                  <div className="border border-gray-200 rounded-lg p-6 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <span className="text-purple-600 text-xl">✅</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Assertions</h3>
                    </div>
                    <p className="text-gray-600">
                      Test comparator results with <code>yes_</code>, <code>no_</code>, and other assertion functions for complete type-level validation workflows.
                    </p>
                  </div>
                </Link>

                <Link href="/docs/typist/verdicts" className="group">
                  <div className="border border-gray-200 rounded-lg p-6 hover:border-green-300 hover:bg-green-50 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <span className="text-green-600 text-xl">🎯</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Verdicts</h3>
                    </div>
                    <p className="text-gray-600">
                      Understand the <code>$Yes</code> and <code>$No</code> verdict types that comparators produce and how to work with structured error information.
                    </p>
                  </div>
                </Link>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600">
                  💡 <strong>Workflow:</strong> Use comparators like <code>$Equal</code> and <code>$Extends</code> to generate verdicts, then validate those verdicts with assertion functions like <code>yes_</code> and <code>no_</code> for comprehensive type testing.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}