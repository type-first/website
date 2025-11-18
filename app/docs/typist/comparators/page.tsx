import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { buildDocNavigation } from '@/lib/content/doc.model';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { Code } from '@/lib/content/ui/code.cmp.iso';
import { ArrowLeft, Scale, CheckCircle, XCircle } from 'lucide-react';
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
                Type-level comparison utilities for decidable evaluations that resolve to verdicts. 
                Compare types for equality and extension relationships.
              </p>
            </header>

            {/* Introductory Exposition */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              
              <div className="prose prose-lg text-gray-700 max-w-none space-y-6">
                <p>
                  The <strong>Comparators</strong> functional group provides type-level comparison 
                  utilities that evaluate relationships between types and resolve to verdict types. 
                  These are pure type-level operations with no runtime representation.
                </p>

                <p>
                  Comparators work by using conditional types to test relationships and returning 
                  structured verdict types (<code>$Yes</code> or <code>$No</code>) that encode 
                  both the result and debugging information about failed comparisons.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Verdict Resolution Pattern</h3>

                <p>
                  All comparators follow a consistent pattern of resolving to verdict types that 
                  can be tested with assertion functions:
                </p>

                <Code language="typescript">{`// Comparator resolves to verdict
type IsEqual = $Equal<string, string>        // → $Yes
type IsNotEqual = $Equal<string, number>     // → $No<'not-equal', [string, number]>

// Test verdicts with assertions
yes_<IsEqual>()        // ✓ Compiles - equality holds
no_<IsNotEqual>()      // ✓ Compiles - inequality confirmed

// Chain with other type operations
type StringOrNumber = string | number
yes_<$Extends<string, StringOrNumber>>()    // ✓ string extends union`}</Code>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Comparison Categories</h3>

                <div className="grid gap-4 mt-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Scale className="h-5 w-5 text-blue-600" />
                      Equality Comparison
                    </h4>
                    <p className="text-gray-600">Bidirectional assignability test for type identity (<code>$Equal</code>)</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Extension Comparison
                    </h4>
                    <p className="text-gray-600">Unidirectional subtype relationship test (<code>$Extends</code>)</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Error Information</h3>

                <p>
                  Failed comparisons produce <code>$No</code> verdicts that include structured 
                  error information for debugging:
                </p>

                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Error key</strong> identifies the specific failure reason</li>
                  <li><strong>Type dump</strong> captures the compared types for inspection</li>
                  <li><strong>Structured format</strong> enables programmatic error handling</li>
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
                      This ensures structural identity between types.
                    </p>
                    <Code language="typescript">{`export type $Equal<T1, T2> = 
  ([T1] extends [T2] ? 
    [T2] extends [T1] ? 
    true : false : false) extends true ? $Yes 
  : $No<'not-equal', [T1,T2]>`}</Code>
                    <div className="mt-2 text-sm text-gray-500">
                      <strong>Returns:</strong> <code>$Yes</code> if types are structurally identical, <code>$No&lt;'not-equal', [T1,T2]&gt;</code> otherwise
                      <br />
                      <strong>Usage:</strong> Type identity verification, exact match testing, symmetrical comparison
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h5 className="font-semibold text-green-900 mb-2">Success Cases</h5>
                        <Code language="typescript">{`type T1 = $Equal<string, string>                 // → $Yes
type T2 = $Equal<{ a: number }, { a: number }>   // → $Yes  
type T3 = $Equal<[1, 2], [1, 2]>                // → $Yes`}</Code>
                      </div>
                      
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h5 className="font-semibold text-red-900 mb-2">Failure Cases</h5>
                        <Code language="typescript">{`type F1 = $Equal<string, number>                 // → $No<'not-equal', [string, number]>
type F2 = $Equal<{ a: string }, { a: number }>  // → $No<'not-equal', [...]>
type F3 = $Equal<string, string | number>       // → $No<'not-equal', [...]>`}</Code>
                      </div>
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
                      Used for inheritance, assignability, and subtype verification.
                    </p>
                    <Code language="typescript">{`export type $Extends<L, R> =
  [L] extends [R] ? $Yes 
  : $No<'right-does-not-extend-left', [L,R]>`}</Code>
                    <div className="mt-2 text-sm text-gray-500">
                      <strong>Parameters:</strong> <code>L</code> (left/sub type), <code>R</code> (right/super type)
                      <br />
                      <strong>Returns:</strong> <code>$Yes</code> if L extends R, <code>$No&lt;'right-does-not-extend-left', [L,R]&gt;</code> otherwise
                      <br />
                      <strong>Usage:</strong> Subtype testing, inheritance verification, assignability checking
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h5 className="font-semibold text-green-900 mb-2">Success Cases</h5>
                        <Code language="typescript">{`type T1 = $Extends<'hello', string>              // → $Yes (literal extends base)
type T2 = $Extends<never, any>                   // → $Yes (never extends everything)
type T3 = $Extends<{ a: 1, b: 2 }, { a: 1 }>    // → $Yes (more specific extends less)`}</Code>
                      </div>
                      
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h5 className="font-semibold text-red-900 mb-2">Failure Cases</h5>
                        <Code language="typescript">{`type F1 = $Extends<string, 'hello'>             // → $No<...> (general doesn't extend specific)
type F2 = $Extends<{ a: 1 }, { a: 1, b: 2 }>    // → $No<...> (less specific doesn't extend more)
type F3 = $Extends<string, number>               // → $No<...> (unrelated types)`}</Code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Examples Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Compositional Usage Examples</h2>
              
              <div className="space-y-8">
                {/* Type Identity Verification */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Type Identity Verification</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Use comparators to verify exact type matches and catch subtle type differences.
                  </p>
                  
                  <Code language="typescript">{`import { $Equal, yes_, no_, test_ } from '@typefirst/typist'

test_('API Response Type Safety', () => {
  // Define API types
  interface User {
    id: number
    name: string
    email: string
  }
  
  interface UserResponse {
    user: User
    lastLogin: Date
  }
  
  // Verify exact type matches
  type UserIdType = User['id']
  yes_<$Equal<UserIdType, number>>()              // ✓ id is number
  
  // Catch subtle differences
  interface SimilarUser {
    id: number
    name: string  
    email: string
  }
  
  yes_<$Equal<User, SimilarUser>>()               // ✓ Structurally identical
  
  // Test with modified types
  interface UserWithOptionalEmail {
    id: number
    name: string
    email?: string  // Optional vs required
  }
  
  no_<$Equal<User, UserWithOptionalEmail>>()     // ✓ Different due to optionality
  
  // Verify response structure
  type ResponseUserType = UserResponse['user']
  yes_<$Equal<ResponseUserType, User>>()          // ✓ Response contains correct User type
})`}</Code>
                </div>

                {/* Type Hierarchy Validation */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Type Hierarchy Validation</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Combine equality and extension comparisons to validate complex type hierarchies.
                  </p>

                  <Code language="typescript">{`import { $Equal, $Extends, yes_, no_, test_ } from '@typefirst/typist'

test_('Generic Type Constraints', () => {
  // Base entity interface
  interface BaseEntity {
    id: string
    createdAt: Date
  }
  
  // Extended interfaces
  interface User extends BaseEntity {
    name: string
    email: string
  }
  
  interface Product extends BaseEntity {
    title: string
    price: number
  }
  
  // Test inheritance relationships
  yes_<$Extends<User, BaseEntity>>()             // ✓ User extends BaseEntity
  yes_<$Extends<Product, BaseEntity>>()          // ✓ Product extends BaseEntity
  no_<$Extends<BaseEntity, User>>()              // ✓ Base doesn't extend specific
  
  // Test sibling relationships
  no_<$Extends<User, Product>>()                 // ✓ Siblings don't extend each other
  no_<$Equal<User, Product>>()                   // ✓ Siblings are not equal
  
  // Test union and intersection types
  type EntityUnion = User | Product
  yes_<$Extends<User, EntityUnion>>()            // ✓ User extends union
  yes_<$Extends<Product, EntityUnion>>()         // ✓ Product extends union
  no_<$Extends<EntityUnion, User>>()             // ✓ Union doesn't extend specific
  
  // Test intersection types
  type UserProduct = User & Product
  yes_<$Extends<UserProduct, User>>()            // ✓ Intersection extends both
  yes_<$Extends<UserProduct, Product>>()         // ✓ Intersection extends both
  no_<$Equal<UserProduct, User>>()               // ✓ Intersection is not equal to either
})`}</Code>
                </div>

                {/* Runtime Type Guard Validation */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Runtime Type Guard Validation</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Validate that runtime type guard implementations correctly match their compile-time type relationships.
                  </p>

                  <Code language="typescript">{`import { $Equal, $Extends, yes_, no_, test_, t_ } from '@typefirst/typist'

// Enum-like pattern with runtime validation
class Enum<const V extends readonly string[]> {
  constructor(public readonly values: V) {}
  
  // Runtime type guard
  is(x: unknown): x is V[number] {
    return typeof x === 'string' && this.values.includes(x)
  }
  
  // Phantom type for compile-time usage
  get _() { return t_<V[number]>() }
}

test_('Enum Type Guard Validation', () => {
  const Sport = new Enum(['hockey', 'soccer', 'squash'] as const)
  
  // Verify type-level relationships
  yes_<$Equal<typeof Sport._, 'hockey' | 'soccer' | 'squash'>>()  // ✓ Correct union type
  yes_<$Extends<'hockey', typeof Sport._>>()                      // ✓ Members extend union
  yes_<$Extends<'soccer', typeof Sport._>>()                      // ✓ Members extend union
  no_<$Extends<'tennis', typeof Sport._>>()                       // ✓ Non-members don't extend
  
  // Test compile-time constraints
  const validSport: typeof Sport._ = 'hockey'                     // ✓ Valid assignment
  
  // @ts-expect-error ✓
  // Type '"tennis"' is not assignable to type union
  const invalidSport: typeof Sport._ = 'tennis'
  
  // Verify that our type matches what the runtime guard accepts
  if (Sport.is('hockey')) {
    // TypeScript knows this is typeof Sport._
    yes_<$Equal<'hockey', typeof Sport._>>()                      // ✓ Literal extends union
  }
  
  // Test negative cases
  if (Sport.is('invalid')) {
    // This branch is unreachable due to type constraints
    // @ts-expect-error ✓
    // This would be a type error if reached
    no_<$Extends<'invalid', typeof Sport._>>()
  }
})`}</Code>
                </div>

                {/* Advanced Type-Level Programming */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Advanced Type-Level Programming</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Use comparators to validate sophisticated type-level algorithms like tuple manipulation and union operations.
                  </p>

                  <Code language="typescript">{`import { $Equal, $Extends, yes_, no_, test_, t_ } from '@typefirst/typist'

// Advanced tuple splitting algorithm
type Split<
  T extends readonly any[],
  N extends number,
  A extends readonly any[] = [],
  B extends readonly any[] = T
> = A['length'] extends N
  ? [A, B]
  : B extends readonly [infer H, ...infer R]
    ? Split<T, N, readonly [...A, H], R>
    : [A, readonly []]

// Union explosion utility
type ExplodeUnion<U> = 
  (U extends any ? (k: () => U) => void : never) extends
  (k: infer I) => void
    ? I extends () => infer V
      ? readonly [...ExplodeUnion<Exclude<U, V>>, V]
      : readonly []
    : readonly []

test_('Type-Level Algorithm Validation', () => {
  // Test tuple splitting at various indices
  type TestTuple = readonly ['a', 'b', 'c', 'd']
  
  yes_<$Equal<Split<TestTuple, 0>, [readonly [], TestTuple]>>()       // ✓ Split at start
  yes_<$Equal<Split<TestTuple, 2>, [readonly ['a', 'b'], readonly ['c', 'd']]>>() // ✓ Split in middle  
  yes_<$Equal<Split<TestTuple, 4>, [TestTuple, readonly []]>>()       // ✓ Split at end
  
  // Test union explosion (order may vary but all elements present)
  type TestUnion = 'x' | 'y' | 'z'
  type ExplodedTuple = ExplodeUnion<TestUnion>
  
  // Verify all union members are captured
  yes_<$Extends<'x', ExplodedTuple[number]>>()                        // ✓ x is in result
  yes_<$Extends<'y', ExplodedTuple[number]>>()                        // ✓ y is in result  
  yes_<$Extends<'z', ExplodedTuple[number]>>()                        // ✓ z is in result
  yes_<$Equal<ExplodedTuple[number], TestUnion>>()                    // ✓ Complete round-trip
  
  // Test edge cases
  yes_<$Equal<Split<readonly [], 0>, [readonly [], readonly []]>>()   // ✓ Empty tuple
  yes_<$Equal<ExplodeUnion<never>, readonly []>>()                    // ✓ Never union
})`}</Code>
                </div>
              </div>
            </section>

            {/* Integration Notes */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Integration with Other Typist Components</h2>
              
              <div className="space-y-6">
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Verdicts Integration</h3>
                  <p className="text-blue-800 mb-3">
                    Comparators resolve to verdict types that can be tested with assertion functions. 
                    This creates a complete feedback loop for type-level testing.
                  </p>
                  <Code language="typescript">{`// Comparators produce verdicts
type EqualResult = $Equal<string, string>        // → $Yes
type ExtendsResult = $Extends<'hi', string>      // → $Yes

// Assertions test verdicts  
yes_<EqualResult>()       // ✓ Test positive verdict
yes_<ExtendsResult>()     // ✓ Test positive verdict`}</Code>
                </div>

                <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Test Blocks Integration</h3>
                  <p className="text-green-800 mb-3">
                    Organize comparator-based tests in logical blocks using <code>test_</code>, 
                    <code>example_</code>, and <code>proof_</code> functions.
                  </p>
                  <Code language="typescript">{`test_('Type relationship proofs', () => {
  yes_<$Equal<string, string>>()
  yes_<$Extends<'literal', string>>()
  no_<$Equal<string, number>>()
})`}</Code>
                </div>

                <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">Error Diagnostics</h3>
                  <p className="text-purple-800 mb-3">
                    Failed comparisons provide structured error information that can be used 
                    for debugging and building more informative type utilities.
                  </p>
                  <Code language="typescript">{`// Failed comparison with debugging info
type FailedEqual = $Equal<string, number>  
// → $No<'not-equal', [string, number]>

type FailedExtends = $Extends<string, number>
// → $No<'right-does-not-extend-left', [string, number]>`}</Code>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}