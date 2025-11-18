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
                </p>

                <p>
                  Whether you're building domain models with user hierarchies, validating API contracts, 
                  or creating type-safe utility functions, assertions provide compile-time guarantees that 
                  your type relationships are correct before your code ever runs.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Type-Level and Value-Level Flexibility</h3>

                <p>
                  Assertions work seamlessly with both concrete values and phantom types. Use <code>typeof</code> 
                  to extract types from runtime values, or <code>t_&lt;Type&gt;()</code> to create phantom values 
                  for pure type-level testing. See the interactive examples in our typescape scenarios:
                </p>

                <div className="flex gap-4 mt-4 mb-6">
                  <Link 
                    href="/typescape/typist-intro"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    🔭 Domain Modeling Example
                  </Link>
                  <Link 
                    href="/typescape/typist-enum-guards"
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    🛡️ Runtime Guards Example
                  </Link>
                </div>

                <Code language="typescript">{`// From typist-intro scenario - basic assertion patterns
type Positive = '👍' | '👌' | '🎉' | '😊'
is_<Positive>('🎉') // ✓

// @ts-expect-error ✓
is_<Positive>('👎') // type '👎' is not assignable to type 'Positive'

// User system with domain modeling
type PremiumUser = RegularUser & { premiumSince: Date }
has_<'premiumSince', Date>(premiumUser) // ✓
extends_<PremiumUser, RegularUser>() // ✓`}</Code>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Functional Categories</h3>

                <div className="grid gap-4 mt-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Assignment Assertions
                    </h4>
                    <p className="text-gray-600">Test value assignability to types (<code>is_</code>, <code>assignable_</code>)</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      Structural Assertions
                    </h4>
                    <p className="text-gray-600">Verify object properties and structure (<code>has_</code>)</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                      Relationship Assertions  
                    </h4>
                    <p className="text-gray-600">Test type extension and instance relationships (<code>extends_</code>, <code>instance_</code>)</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      Impossibility Assertions
                    </h4>
                    <p className="text-gray-600">Verify type contradictions and unreachable states (<code>never_</code>)</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      Verdict Assertions
                    </h4>
                    <p className="text-gray-600">Test comparator results (<code>yes_</code>, <code>no_</code>, <code>decidable_</code>)</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Core Patterns</h3>

                <p>
                  All assertion functions follow consistent design principles for maximum flexibility and type safety:
                </p>

                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Generic constraints</strong> enforce valid relationships at compile time, triggering errors for invalid type combinations</li>
                  <li><strong>Value or phantom parameters</strong> accept both runtime values and phantom types created with <code>t_&lt;Type&gt;()</code></li>
                  <li><strong>Empty implementations</strong> with all behavior happening at the type level for zero runtime overhead</li>
                  <li><strong>Negative testing support</strong> using <code>@ts-expect-error</code> to validate that invalid relationships correctly fail</li>
                  <li><strong>Control flow integration</strong> work seamlessly with TypeScript's type narrowing in conditional blocks</li>
                  <li><strong>Composable design</strong> allowing multiple assertions in sequence to build complex type proofs</li>
                </ul>
              </div>
            </section>

            {/* Canonical API List */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">API Reference</h2>
              
              <div className="space-y-8">
                {/* Assignment Assertions */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    Assignment Assertions
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>is_&lt;T&gt;(x: T): void</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Core type assertion function. Tests that a value is assignable to type T. 
                        Provides immediate compile-time feedback if the assignment is invalid.
                      </p>
                      <Code language="typescript">{`export const is_ = <T>(x:T) => {}`}</Code>
                      <div className="mt-2 text-sm text-gray-500">
                        <strong>Usage:</strong> Direct type compatibility testing, runtime value validation against type constraints
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>assignable_&lt;T&gt;(x: T): void</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Alias for <code>is_</code>. Provides identical functionality with more explicit naming 
                        that emphasizes the assignability testing aspect.
                      </p>
                      <Code language="typescript">{`export const assignable_ = is_`}</Code>
                      <div className="mt-2 text-sm text-gray-500">
                        <strong>Relationship:</strong> Exact alias of <code>is_</code> - use interchangeably based on naming preference
                      </div>
                    </div>
                  </div>
                </div>

                {/* Structural Assertions */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                    Structural Assertions
                  </h3>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      <code>has_&lt;P, V&gt;(x: &#123;[k in P]: V&#125;): void</code>
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Verifies that an object has a property <code>P</code> with value type <code>V</code>. 
                      Uses mapped types to enforce property existence and type constraints simultaneously.
                      The property name <code>P</code> is constrained to <code>string</code> and marked as <code>const</code>.
                    </p>
                    <Code language="typescript">{`export const has_ = <const P extends string, const V = any>(x: { [k in P]: V }) => {}`}</Code>
                    <div className="mt-2 text-sm text-gray-500">
                      <strong>Type Parameters:</strong> <code>P extends string</code> (property name), <code>V</code> (value type, defaults to any)
                      <br />
                      <strong>Usage:</strong> Object structure validation, property existence testing, runtime value property checks
                      <br />
                      <strong>Example:</strong> <code>has_&lt;'premiumSince', Date&gt;(user)</code> ensures user has premiumSince property of type Date
                    </div>
                  </div>
                </div>

                {/* Relationship Assertions */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                    Relationship Assertions
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>extends_&lt;E extends T, T&gt;(y?: E, x?: T): void</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Tests subtype relationships by constraining <code>E</code> to extend <code>T</code>. 
                        Can be used with phantom parameters or with actual runtime values for type extraction.
                      </p>
                      <Code language="typescript">{`export const extends_ = <E extends T,T>(y?:E, x?:T) => {}`}</Code>
                      <div className="mt-2 text-sm text-gray-500">
                        <strong>Constraint:</strong> <code>E extends T</code> enforced at compile time
                        <br />
                        <strong>Usage:</strong> Type hierarchy verification, subtype relationship testing
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>instance_&lt;T&gt;(x?: InstanceType&lt;T&gt;): void</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Verifies constructor/class instance relationships. Tests that a value is an instance 
                        of a class or constructor function type.
                      </p>
                      <Code language="typescript">{`export const instance_ = <T extends abstract new (...args:any[]) => any>(x?:InstanceType<T>) => {}`}</Code>
                      <div className="mt-2 text-sm text-gray-500">
                        <strong>Constraint:</strong> <code>{'T extends abstract new (...args:any[]) => any'}</code>
                        <br />
                        <strong>Usage:</strong> Class instance validation, constructor type verification
                      </div>
                    </div>
                  </div>
                </div>

                {/* Impossibility Assertions */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <XCircle className="h-6 w-6 text-red-600" />
                    Impossibility Assertions
                  </h3>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      <code>never_&lt;T extends never&gt;(x?: T): never</code>
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Asserts type impossibility by constraining the type parameter to <code>never</code>. 
                      Useful for proving that certain type combinations are invalid or unreachable.
                    </p>
                    <Code language="typescript">{`export const never_ = <T extends never>(x?: T): never => x as never`}</Code>
                    <div className="mt-2 text-sm text-gray-500">
                      <strong>Constraint:</strong> <code>T extends never</code> - only never type satisfies this constraint
                      <br />
                      <strong>Usage:</strong> Proof of impossibility, contradiction verification, unreachable code paths
                    </div>
                  </div>
                </div>

                {/* Verdict Assertions */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="h-6 w-6 text-orange-600" />
                    Verdict Assertions
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>yes_&lt;T extends $Yes&gt;(t?: T): true</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Asserts positive verdicts from comparator types. Used to verify that type 
                        comparisons resolve to <code>$Yes</code>, indicating successful matches.
                      </p>
                      <Code language="typescript">{`export const yes_ = <T extends $Yes>(t?:T) => true`}</Code>
                      <div className="mt-2 text-sm text-gray-500">
                        <strong>Integration:</strong> Works with comparators like <code>$Equal</code>, <code>$Extends</code>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>no_&lt;T extends $No&lt;any, any&gt;&gt;(t?: T): void</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Asserts negative verdicts from comparator types. Used to verify that type 
                        comparisons correctly fail and produce <code>$No</code> verdicts.
                      </p>
                      <Code language="typescript">{`export const no_ = <T extends $No<any, any>>(t?:T) => {}`}</Code>
                      <div className="mt-2 text-sm text-gray-500">
                        <strong>Integration:</strong> Verifies expected failure cases in type comparisons
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>decidable_&lt;T extends $Maybe&gt;(t?: T): void</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Asserts that a type comparison is decidable (either <code>$Yes</code> or <code>$No</code>). 
                        Used to verify that comparisons don't produce undefined or ambiguous results.
                      </p>
                      <Code language="typescript">{`export const decidable_ = <T extends $Maybe>(t?:T) => {}`}</Code>
                      <div className="mt-2 text-sm text-gray-500">
                        <strong>Usage:</strong> Meta-level verification of comparison decidability
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Examples Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Patterns</h2>
              
              <div className="space-y-10">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Basic Type Testing</h3>
                  <p className="text-gray-600 mb-4">
                    The foundation of typist assertions - testing whether values belong to specific types. 
                    Use <code>is_</code> for direct assignability testing and leverage <code>@ts-expect-error</code> 
                    to validate that invalid assignments correctly fail at compile time.
                  </p>
                  <Code language="typescript">{`// From typist-intro typescape - emoji type system
type Positive = '👍' | '👌' | '🎉' | '😊'
is_<Positive>('🎉') // ✓

// @ts-expect-error ✓
is_<Positive>('👎') // type '👎' is not assignable to type 'Positive'

// Runtime value testing
const smile = '😊'
is_<Positive>(smile) // ✓
is_<string>(smile) // ✓`}</Code>
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
                  <Code language="typescript">{`// From typist-intro typescape - hierarchy validation
type Reaction = '👍' | '👎' | '👌' | '🎉' | '😊' | '😢' | '❓' | '💡'
extends_<Positive, Reaction>() // ✓

// @ts-expect-error ✓
// type 'Reaction' does not satisfy the constraint 'Positive'
extends_<Reaction, Positive>()`}</Code>
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
                  <Code language="typescript">{`// From typist-intro typescape - user system modeling
type PremiumUser = RegularUser & { premiumSince: Date }

const bob = { name: 'bob', premiumSince: new Date('2022-01-01') }
has_<'name', string>(bob) // ✓
has_<'premiumSince', Date>(bob) // ✓

// @ts-expect-error ✓
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
                  <Code language="typescript">{`// From typist-intro typescape - contextual validation
if (isPremiumFeedback(feedback0)) {
  extends_<ExclusiveReaction, typeof feedback0.reaction>() // ✓
  is_<PremiumUser>(feedback0.user) // ✓
  has_<'premiumSince'>(feedback0.user) // ✓
} else {
  // @ts-expect-error ✓
  extends_<ExclusiveReaction, typeof feedback0.reaction>()
  is_<RegularUser>(feedback0.user) // ✓
}`}</Code>
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
                  <Code language="typescript">{`// From typist-intro typescape - type/value flexibility
type Hand = '👍' | '👎' | '👌'
const hand = random(['👍','👎','👌'] as const)

// Using typeof to extract runtime types
is_<typeof hand>('👍') // ✓

// Using t_ to create phantom values
extends_(hand, t_<Reaction>()) // ✓
is_<typeof hand>(t_<Hand>()) // ✓`}</Code>
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Runtime Enum Guards</h3>
                  <p className="text-gray-600 mb-4">
                    Create robust enum-like structures that provide both compile-time type safety and 
                    runtime validation. This pattern bridges static typing with dynamic data validation, 
                    essential for handling external data sources.
                  </p>
                  <Code language="typescript">{`// From typist-enum-guards typescape - enum validation
class Enum<T extends readonly string[]> {
  constructor(private values: T) {}
  
  is(value: unknown): value is T[number] {
    return typeof value === 'string' && this.values.includes(value as T[number])
  }
  
  is_<V extends T[number]>(value: V): void {
    is_<T[number]>(value)
  }
}

const Sport = new Enum(['football', 'tennis', 'basketball'] as const)
// @ts-expect-error ✓
Sport.is_('cooking') // Compile-time error for invalid sports`}</Code>
                  <div className="mt-4">
                    <Link 
                      href="/typescape/typist-enum-guards"
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      🛡️ Explore in Enum Guards Typescape
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Object Manipulation Validation</h3>
                  <p className="text-gray-600 mb-4">
                    Validate the results of object transformation operations like omit, pick, and merge. 
                    This pattern ensures that utility functions produce objects with the correct shape 
                    and type constraints, essential for type-safe object manipulation libraries.
                  </p>
                  <Code language="typescript">{`// From typist-omit-utilities typescape - transformation validation  
const original = { a: 1, b: 2, c: 3 }
const result = omit(original, ['a', 'c'])

// Validate the transformation worked correctly
has_<'b', 2>(result) // ✓ - property 'b' remains
never_<'a' extends keyof typeof result ? true : false>() // ✓ - property 'a' removed

// @ts-expect-error ✓
has_<'a', 1>(result) // property 'a' should not exist`}</Code>
                  <div className="mt-4">
                    <Link 
                      href="/typescape/typist-omit-utilities"
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      🔧 Explore in Omit Utilities Typescape
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Registry Type Indexing</h3>
                  <p className="text-gray-600 mb-4">
                    Build type-safe registries where adding entries automatically updates the type system. 
                    This advanced pattern enables plugin systems and configuration management where the 
                    registry's type grows dynamically while maintaining compile-time safety.
                  </p>
                  <Code language="typescript">{`// From typist-registry-patterns typescape - dynamic type indexing
const registry = new Registry()
  .add('alice', { age: 30, active: true })
  .add('bob', { age: 25, active: false })
  .add('carol', { age: 35, active: true })

// Validate registry keys are correctly inferred
is_<RKeys<typeof registry.$def.entries>>(t_<'alice' | 'bob' | 'carol'>()) // ✓

// Validate entry retrieval maintains type safety
const person = registry.get('alice')
is_<typeof person>({ key: 'alice', age: 30, active: true }) // ✓`}</Code>
                  <div className="mt-4">
                    <Link 
                      href="/typescape/typist-registry-patterns"
                      className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      📚 Explore in Registry Patterns Typescape
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Related Functional Groups */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Functional Groups</h2>
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
              
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600">
                  💡 <strong>Tip:</strong> Use assertions with comparators to test complex type relationships, then validate the results with verdict assertions like <code>yes_</code> and <code>no_</code>.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}