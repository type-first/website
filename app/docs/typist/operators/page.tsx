import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { buildDocNavigation } from '@/lib/content/doc.model';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { Code } from '@/lib/content/ui/code.cmp.iso';
import Link from 'next/link';
import { ArrowLeft, Zap, RefreshCw, Settings, Combine, Target, Plus } from 'lucide-react';

export async function generateMetadata() {
  return {
    title: 'Operators - Typist API Reference',
    description: 'Core phantom value operators and type manipulation utilities. Transform, compose, and control phantom types with t_, assign_, widen_, and more.',
  };
}

export default function OperatorsApiPage() {
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
                  Operators
                </h1>
                <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
                  Functional Group
                </span>
              </div>
              
              <p className="text-xl text-gray-600 mb-6">
                Core phantom value operators and type manipulation utilities. Transform, compose, and 
                control phantom types for sophisticated type-level programming with zero runtime overhead.
              </p>
            </header>

            <Code language="typescript">{`
const smile = t_<'😊'>() // phantom value creation
is_<'😊'>(smile) // ✓
assign_('💡', '✨') // type assertion
widen_(t_<'hello'>()) // inference control
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
                  The <strong>Operators</strong> functional group provides the fundamental building blocks 
                  for phantom value creation and type manipulation. These utilities enable sophisticated 
                  type-level programming patterns with zero runtime overhead through TypeScript's type system.
                </p>

                <p>
                  Operators work by leveraging TypeScript's type inference and constraint systems to create, 
                  transform, and compose phantom values. They provide the essential utilities for expressing 
                  complex type relationships directly in the type system: phantom value creation with <code>t_</code>, 
                  type assertion with <code>assign_</code>, inference control with <code>widen_</code>, and 
                  constraint specification with <code>specify_</code>. All operators follow consistent design 
                  principles with zero runtime overhead and seamless integration with TypeScript's type system.
                </p>

                <p>
                  Whether you're building type-safe utility functions, creating phantom type systems for 
                  domain modeling, or implementing complex type-level algorithms, operators provide the 
                  foundational tools for expressing sophisticated type relationships. Multiple operators 
                  can be composed together to build complex type transformations and validation chains.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Phantom Value Creation Pattern</h3>

                <p>
                  The core pattern in typist is creating phantom values that carry type information without 
                  runtime overhead. Use <code>t_&lt;Type&gt;()</code> to create phantom values that represent 
                  types for use in assertions, comparisons, and type-level computations. This enables mixing 
                  value-level and type-level programming seamlessly within TypeScript's inference system.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Integration with Assertions and Comparators</h3>

                <p>
                  Operators work hand-in-hand with assertions and comparators to provide complete type-level 
                  programming capabilities. Use operators to create and transform phantom values, then test 
                  those values with assertions or compare them with comparators. This creates a complete 
                  ecosystem for type-level validation, computation, and proof construction.
                </p>
              </div>
            </section>

            {/* Examples Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Examples</h2>
              
              <div className="space-y-10">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Phantom Value Creation</h3>
                  <p className="text-gray-600 mb-4">
                    The foundation of typist operators - creating phantom values that carry type information 
                    without runtime overhead. Use <code>t_</code> for pure type representation and leverage 
                    with assertions for type-level programming patterns.
                  </p>
                  <Code language="typescript">{`const smile = t_<'😊'>()
is_<'😊'>(smile) // ✓
const union = t_<'a' | 'b' | 'c'>()
is_<'a' | 'b' | 'c'>(union) // ✓
// @ts-expect-error ✓
is_<'d'>(union)

// Type aliases work seamlessly
type Positive = '👍' | '👌' | '🎉' | '😊'
const positive = t_<Positive>()
is_<Positive>(positive) // ✓`}</Code>
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Type Assertion and Identity</h3>
                  <p className="text-gray-600 mb-4">
                    Use <code>assign_</code> for type assertion and identity operations. This pattern 
                    validates that values can be assigned to specific types while maintaining type 
                    information through the operation chain.
                  </p>
                  <Code language="typescript">{`assign_('hello', 'world') // ✓ - both strings
assign_(42, 100) // ✓ - both numbers
// @ts-expect-error ✓
assign_('hello', 42) // string ≠ number

const result = assign_<string>('typed value')
is_<string>(result) // ✓

// Identity preservation
const value = 'specific'
const preserved = assign_(value, 'specific')
is_<typeof value>(preserved) // ✓`}</Code>
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Inference Control with Widening</h3>
                  <p className="text-gray-600 mb-4">
                    Control TypeScript's type inference with <code>widen_</code> to ensure values 
                    are treated at the desired level of specificity. This is essential when you 
                    need broader type inference than TypeScript's default literal narrowing.
                  </p>
                  <Code language="typescript">{`// Control literal narrowing
const literal = 'hello' // inferred as 'hello'
const widened = widen_(literal)
is_<string>(widened) // ✓ - now string instead of literal

// Useful for generic constraints
function process<T extends string>(x: T) {
  const wide = widen_(x)
  is_<string>(wide) // ✓ - guaranteed string
  return wide
}

const result = process('specific')
is_<string>(result) // ✓ - widened to string`}</Code>
                  <div className="mt-4">
                    <Link 
                      href="/typescape/typist-tuple-manipulation"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      🔭 Explore in Tuple Manipulation Typescape
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Constraint Specification</h3>
                  <p className="text-gray-600 mb-4">
                    Use <code>specify_</code> to create phantom values with specific type constraints. 
                    This pattern is crucial for building type-safe APIs where you need to ensure 
                    values conform to specific structural or semantic requirements.
                  </p>
                  <Code language="typescript">{`// Constraint specification
type EmailAddress = string & { __brand: 'email' }
const email = specify_<EmailAddress>()
is_<EmailAddress>(email) // ✓

// Works with complex constraints
type NonEmptyArray<T> = T[] & { 0: T }
const items = specify_<NonEmptyArray<string>>()
is_<NonEmptyArray<string>>(items) // ✓

// @ts-expect-error ✓
const empty: never[] = []
is_<NonEmptyArray<string>>(empty)`}</Code>
                  <div className="mt-4">
                    <Link 
                      href="/typescape/typist-registry-patterns"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      🔭 Explore in Registry Patterns Typescape
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
                    <code>t_&lt;T&gt;(value?: unknown): T</code>
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Core phantom value creator. Converts any type into a symbolic value with zero runtime overhead. 
                    The foundational operator for type-level programming in typist.
                  </p>
                  <div className="mb-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                    <strong>Aliases:</strong> <code>type_&lt;T&gt;(...)</code>, <code>t&lt;T&gt;(...)</code> - Identical functionality with different naming conventions
                  </div>
                  <Code language="typescript">{`const smile = t_<'😊'>()
is_<'😊'>(smile) // ✓
const union = t_<'a' | 'b' | 'c'>()
is_<'a' | 'b' | 'c'>(union) // ✓
// @ts-expect-error ✓
is_<'d'>(union)

// Complex types work seamlessly
const apiResponse = t_<{ data: User[], status: 200 }>()
is_<{ data: User[], status: 200 }>(apiResponse) // ✓`}</Code>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <code>assign_&lt;T&gt;(value: T): T</code>
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Identity operator that preserves runtime values while asserting type conformance. 
                    Bridges runtime values with the phantom type system for validation pipelines.
                  </p>
                  <div className="mb-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                    <strong>Aliases:</strong> <code>a_&lt;T&gt;(...)</code>, <code>a&lt;T&gt;(...)</code> - Shorter variants for frequent use
                  </div>
                  <Code language="typescript">{`const userData = { name: 'Alice', age: 30 }
const typedUser = assign_<User>(userData)
is_<User>(typedUser) // ✓

assign_('hello', 'world') // ✓ - both strings
// @ts-expect-error ✓
assign_('hello', 42) // string ≠ number

// Useful in validation pipelines
function process<T>(value: unknown): T {
  // ... validation logic
  return assign_<T>(value as T)
}`}</Code>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <code>widen_&lt;T&gt;(value: T): T extends string ? string : T extends number ? number : T</code>
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Controls TypeScript's type inference by widening literal types to their primitive counterparts. 
                    Essential for preventing over-specific type inference in generic contexts.
                  </p>
                  <div className="mb-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                    <strong>Alias:</strong> <code>w_&lt;T&gt;(...)</code> - Shorter variant for frequent use
                  </div>
                  <Code language="typescript">{`const literal = 'hello' // type: 'hello'
const widened = widen_(literal) // type: string
is_<string>(widened) // ✓

function createConfig<T extends string>(key: T) {
  const wide = widen_(key)
  is_<string>(wide) // ✓ - guaranteed string
  return { [wide]: 'value' }
}

const config = createConfig('api')
// @ts-expect-error ✓
is_<'api'>(config) // widened beyond literal`}</Code>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <code>specify_&lt;T&gt;(): T</code>
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Creates phantom values with specific type constraints. Used for building type-safe APIs 
                    where values must conform to structural or semantic requirements.
                  </p>
                  <div className="mb-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                    <strong>Alias:</strong> <code>s_&lt;T&gt;()</code> - Shorter variant for frequent use
                  </div>
                  <Code language="typescript">{`// Branded types
type EmailAddress = string & { __brand: 'email' }
const email = specify_<EmailAddress>()
is_<EmailAddress>(email) // ✓

// Complex constraints
type NonEmptyArray<T> = T[] & { 0: T }
const items = specify_<NonEmptyArray<string>>()
is_<NonEmptyArray<string>>(items) // ✓

// Union constraints
type ValidStatus = 'pending' | 'approved' | 'rejected'
const status = specify_<ValidStatus>()
is_<ValidStatus>(status) // ✓`}</Code>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <code>intersect_&lt;T, U&gt;(left?: T, right?: U): T & U</code>
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Creates phantom values representing type intersections. Combines multiple types 
                    into a single phantom value for complex type composition patterns.
                  </p>
                  <Code language="typescript">{`type User = { name: string }
type Admin = { permissions: string[] }

const userType = t_<User>()
const adminType = t_<Admin>()
const adminUser = intersect_(userType, adminType)

is_<User & Admin>(adminUser) // ✓
extends_<typeof adminUser, User>() // ✓
extends_<typeof adminUser, Admin>() // ✓

// Complex intersection chains
const combined = intersect_(
  t_<{ id: string }>(),
  intersect_(userType, adminType)
)
is_<{ id: string } & User & Admin>(combined) // ✓`}</Code>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <code>force_&lt;T&gt;(value?: unknown): T</code>
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Unsafe type coercion for edge cases where type safety must be bypassed. 
                    Use with extreme caution - prefer other operators for type-safe operations.
                  </p>
                  <div className="mb-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                    <strong>Alias:</strong> <code>f_&lt;T&gt;(...)</code> - Shorter variant, use sparingly
                  </div>
                  <Code language="typescript">{`// Unsafe coercion - use with caution
const unsafe = force_<string>(42)
// No type checking - this could cause runtime errors

// Better: use proper validation instead
const safe = assign_<string>('hello')
is_<string>(safe) // ✓

// force_ is primarily for internal typist implementation
// Prefer t_, assign_, or specify_ for application code`}</Code>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <code>any_(): any</code>
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Creates phantom values of type <code>any</code> for scenarios requiring maximum flexibility. 
                    Use sparingly as it bypasses TypeScript's type checking benefits.
                  </p>
                  <div className="mb-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                    <strong>Alias:</strong> <code>__</code> - Minimal syntax for any-typed phantoms
                  </div>
                  <Code language="typescript">{`const anything = any_()
is_<any>(anything) // ✓
const shorthand = __
is_<any>(shorthand) // ✓

// Use when interfacing with untyped libraries
function legacyInterop() {
  const legacy = any_()
  // ... work with untyped values
  return assign_<TypedResult>(legacy as TypedResult)
}`}</Code>
                </div>
              </div>
            </section>

            {/* Related Functional Groups */}
            <section className="mb-12">
              
              <p className="text-lg text-gray-600 mb-6">
                Explore other typist functional groups that complement operators in building comprehensive type-safe applications.
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
                      Type assertion utilities that test phantom values created by operators and validate type relationships with functions like <code>is_</code> and <code>extends_</code>.
                    </p>
                  </div>
                </Link>

                <Link href="/docs/typist/comparators" className="group">
                  <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <span className="text-blue-600 text-xl">⚖️</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Comparators</h3>
                    </div>
                    <p className="text-gray-600">
                      Type-level comparison utilities like <code>$Equal</code> and <code>$Extends</code> that work with phantom values to produce structured verdicts.
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
