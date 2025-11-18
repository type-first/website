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
                Essential static type-level assertion kit for writing type-level unit tests, 
                examples, demonstrations, and debugging. Zero runtime overhead.
              </p>
            </header>

            {/* Introductory Exposition */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              
              <div className="prose prose-lg text-gray-700 max-w-none space-y-6">
                <p>
                  The <strong>Assertions</strong> functional group provides compile-time type checking 
                  utilities with zero runtime overhead. These functions test type relationships, validate 
                  assignability, and verify constraints entirely through TypeScript's type system.
                </p>

                <p>
                  Assertions operate by leveraging type constraints to trigger compilation errors when 
                  invalid relationships are tested. They accept phantom parameters that exist only for 
                  type checking and have no runtime behavior.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Type-Level and Value-Level Flexibility</h3>

                <p>
                  Assertions work with both type identifiers and runtime values through <code>typeof</code> 
                  and <code>t_</code> conversions. This flexibility lets you use the same assertion 
                  patterns whether you start with types or runtime values:
                </p>

                <Code language="typescript">{`// Starting with runtime values - extract types with typeof
const user = { id: 1, name: 'Alice' } as const

// Test runtime value against extracted type
is_<typeof user>({ id: 1, name: 'Alice' })        // ✓ 
extends_<typeof user, { id: number }>()           // ✓ Extract and test

// Starting with types - create phantoms with t_
type User = { id: number; name: string }
type Hand = '👍' | '👎' | '👌'

// Test phantom values with type arguments
is_<User>(t_<User>())                             // ✓ 
extends_<Hand, string>()                          // ✓ Pure type-level

// Mix both approaches seamlessly
const hand = '👍' as const
extends_(hand, t_<Hand>())                        // Runtime value, phantom type
is_<typeof hand>(t_<'👍'>())                      // Both as type arguments`}</Code>

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

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Design Patterns</h3>

                <p>
                  All assertion functions follow consistent patterns:
                </p>

                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Generic constraints</strong> enforce valid relationships at compile time</li>
                  <li><strong>Phantom parameters</strong> exist only for type checking, not runtime execution</li>
                  <li><strong>Empty implementations</strong> since all behavior is type-level</li>
                  <li><strong>Composable design</strong> allows combining assertions in test blocks</li>
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
                    </p>
                    <Code language="typescript">{`export const has_ = <const P extends string, const V = any>(x: {[k in P]: V }) => {}`}</Code>
                    <div className="mt-2 text-sm text-gray-500">
                      <strong>Type Parameters:</strong> <code>P extends string</code> (property name), <code>V</code> (value type, defaults to any)
                      <br />
                      <strong>Usage:</strong> Object structure validation, property existence testing, shape verification
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Compositional Usage Examples</h2>
              
              <div className="space-y-8">
                {/* Basic Assertion Composition */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Assertion Composition</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Combine multiple assertions to validate complex type relationships and object structures.
                    Use <code>@ts-expect-error</code> to test negative cases and ensure type safety.
                  </p>
                  
                  <Code language="typescript">{`import { is_, has_, extends_, yes_, no_, $Equal, $Extends } from '@typefirst/typist'

// Define domain types
type User = { id: number; name: string; role: 'admin' | 'user' }
type AdminUser = User & { permissions: string[] }

// Test type hierarchy and structure
const user: User = { id: 1, name: 'Alice', role: 'admin' }
const admin: AdminUser = { ...user, permissions: ['read', 'write'] }

// Basic structure validation
is_<User>(user)                    // ✓ User object structure
has_<'id', number>(user)           // ✓ Has required id property  
has_<'role', User['role']>(user)   // ✓ Role property with correct type

// Type relationship verification
extends_<AdminUser, User>()        // ✓ AdminUser extends User
extends_<typeof admin, User>()     // ✓ Runtime admin extends User type

// Verdict-based comparisons
yes_<$Equal<User['id'], number>>()           // ✓ id property is number
yes_<$Extends<'admin', User['role']>>()     // ✓ 'admin' extends role union
no_<$Equal<User, AdminUser>>()              // ✓ These are different types

// Test negative cases with @ts-expect-error
// @ts-expect-error ✓ 
// Property 'permissions' missing in type 'User'
has_<'permissions', string[]>(user)

// @ts-expect-error ✓
// Type 'string' is not assignable to type 'number'  
is_<number>(user.name)

// @ts-expect-error ✓
// Type 'User' does not satisfy the constraint 'AdminUser'
extends_<User, AdminUser>()`}</Code>
                </div>

                {/* Domain Modeling with Type Guards */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Domain Modeling with Type Guards</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Build sophisticated domain models that combine runtime type guards with compile-time assertions 
                    to prove type relationships in different execution contexts.
                  </p>

                  <Code language="typescript">{`import { test_, is_, has_, never_, extends_, t_ } from '@typefirst/typist'

// Define domain types with inheritance
type RegularUser = { name: string }
type PremiumUser = RegularUser & { premiumSince: Date }
type User = RegularUser | PremiumUser

type ExclusiveReaction = '💎' | '🐸'  // Premium-only reactions
type Reaction = '👍' | '👎' | '👌' | '🎉' | '😊' | '😢'

type PremiumFeedback = {
  user: PremiumUser
  reaction: Reaction | ExclusiveReaction
  text: string
}

type RegularFeedback = {
  user: RegularUser
  reaction: Reaction
  text: string  
}

type Feedback = RegularFeedback | PremiumFeedback

test_('Domain Type Validation', () => {
  // Test base type relationships
  extends_<PremiumUser, User>()                   // ✓ Premium extends User
  extends_<RegularUser, User>()                   // ✓ Regular extends User
  has_<'name', string>(t_<User>())                // ✓ All users have name
  
  // @ts-expect-error ✓
  // Property 'premiumSince' missing in type 'RegularUser'
  has_<'premiumSince', Date>(t_<User>())          // Union doesn't guarantee property
  
  // Runtime type guards with compile-time validation
  const isPremiumUser = (user: User): user is PremiumUser => 
    'premiumSince' in user
  
  const isPremiumFeedback = (feedback: Feedback): feedback is PremiumFeedback => 
    isPremiumUser(feedback.user)
  
  // Simulate feedback processing with type narrowing
  const feedback = t_<Feedback>()
  
  if (isPremiumFeedback(feedback)) {
    // In premium context - all assertions should pass
    is_<PremiumUser>(feedback.user)              // ✓ Narrowed to premium
    has_<'premiumSince', Date>(feedback.user)    // ✓ Premium has property
    extends_<ExclusiveReaction, typeof feedback.reaction>() // ✓ Can use exclusive reactions
  } else {
    // In regular context - test limitations  
    is_<RegularUser>(feedback.user)              // ✓ Narrowed to regular
    
    // @ts-expect-error ✓
    // Property 'premiumSince' does not exist
    has_<'premiumSince', Date>(feedback.user)
    
    // @ts-expect-error ✓ 
    // Type 'ExclusiveReaction' not assignable to 'Reaction'
    extends_<ExclusiveReaction, typeof feedback.reaction>()
  }
})`}</Code>
                </div>

                {/* Utility Function Design */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Utility Function Design</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Design type-safe utility functions with comprehensive validation and error testing.
                  </p>

                  <Code language="typescript">{`import { is_, has_, never_, test_, yes_, $Equal } from '@typefirst/typist'

// Type-safe object property omission
export const omit = <
  const T extends Record<string, any>,
  const K extends readonly (keyof T)[]
>(obj: T, keys: K): Omit<T, K[number]> => {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result as Omit<T, K[number]>
}

test_('Utility Function Validation', () => {
  const user = { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 } as const
  
  // Test successful omission
  const publicUser = omit(user, ['email', 'age'])
  
  has_<'id', 1>(publicUser)                       // ✓ Preserved properties
  has_<'name', 'Alice'>(publicUser)               // ✓ Preserved properties
  
  // @ts-expect-error ✓
  // Property 'email' does not exist
  has_<'email', string>(publicUser)
  
  // @ts-expect-error ✓  
  // Property 'age' does not exist
  has_<'age', number>(publicUser)
  
  // Test type-level correctness
  type ExpectedType = { readonly id: 1; readonly name: 'Alice' }
  yes_<$Equal<typeof publicUser, ExpectedType>>() // ✓ Exact type match
  
  // Test constraint validation
  // @ts-expect-error ✓
  // Argument 'nonexistent' not assignable to parameter of type keyof T
  const invalid = omit(user, ['nonexistent'])
  
  // Test with empty omission  
  const unchanged = omit(user, [])
  yes_<$Equal<typeof unchanged, typeof user>>()   // ✓ No change when no keys omitted
})`}</Code>
                </div>

                {/* Advanced Type System Design */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Advanced Type System Design</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Design sophisticated type systems that combine runtime functionality with compile-time guarantees.
                  </p>

                  <Code language="typescript">{`import { instance_, is_, extends_, has_, test_, yes_, $Equal, t_ } from '@typefirst/typist'

// Registry system with type-level indexing
type ObjectWithKey = { key: string } & { [k: string]: any }

type RTuple<E extends ObjectWithKey> = readonly E[]

type RIndex<E extends ObjectWithKey, D extends RTuple<E>> = 
  D extends readonly [infer Head, ...infer Tail]
    ? Head extends { key: infer K } & E
      ? K extends string
        ? Tail extends RTuple<E>
          ? { [P in K]: Head } & RIndex<E, Tail>
          : never
        : never
      : never
    : {}

class Registry<const T extends ObjectWithKey, const Entries extends RTuple<T>> {
  constructor(public entries: Entries) {}
  
  get index(): RIndex<T, Entries> {
    return this.entries.reduce(
      (acc, entry) => ({ ...acc, [entry.key]: entry }), 
      {} as RIndex<T, Entries>
    )
  }
}

test_('Registry Type System', () => {
  // Define domain model
  type Person = { key: string; age: number; active: boolean }
  
  const people = [
    { key: 'alice', age: 30, active: true },
    { key: 'bob', age: 40, active: false },
    { key: 'carol', age: 35, active: true }
  ] as const satisfies RTuple<Person>
  
  const registry = new Registry<Person, typeof people>(people)
  
  // Test type-level indexing
  type ExpectedIndex = {
    alice: { key: 'alice'; age: 30; active: true }
    bob: { key: 'bob'; age: 40; active: false } 
    carol: { key: 'carol'; age: 35; active: true }
  }
  
  yes_<$Equal<typeof registry.index, ExpectedIndex>>() // ✓ Perfect type-level mapping
  
  // Test individual entries
  const alice = registry.index.alice
  is_<{ key: 'alice'; age: 30; active: true }>(alice) // ✓ Exact literal types preserved
  has_<'key', 'alice'>(alice)                         // ✓ Specific key type
  has_<'age', 30>(alice)                              // ✓ Literal age preserved
  
  // Test constraint enforcement  
  // @ts-expect-error ✓
  // Property 'david' does not exist
  const david = registry.index.david
  
  // @ts-expect-error ✓ 
  // Type '{ key: "invalid" }' is not assignable to type 'Person'
  const invalidPeople = [
    { key: 'invalid' }
  ] as const satisfies RTuple<Person>
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
                    Assertions work seamlessly with the verdicts system through <code>yes_</code>, 
                    <code>no_</code>, and <code>decidable_</code> functions that test comparator results.
                  </p>
                  <Code language="typescript">{`// Assertions test comparator verdicts
yes_<$Equal<string, string>>()    // ✓ Assert equality
no_<$Equal<string, number>>()     // ✓ Assert inequality
decidable_<$Equal<any, any>>()    // ✓ Assert decidability`}</Code>
                </div>

                <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Test Blocks Integration</h3>
                  <p className="text-green-800 mb-3">
                    Use with <code>test_</code>, <code>example_</code>, and <code>proof_</code> 
                    blocks to organize assertions into logical groupings.
                  </p>
                  <Code language="typescript">{`test_('Type relationships', () => {
  extends_<'literal', string>()
  is_<string>('any string')
  never_<string & never>()
})`}</Code>
                </div>

                <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">Phantom Types Integration</h3>
                  <p className="text-purple-800 mb-3">
                    Assertions work with phantom type utilities to test type relationships 
                    without requiring actual runtime values.
                  </p>
                  <Code language="typescript">{`// Test with phantom values
const userPhantom = t_<User>()
is_<User>(userPhantom)
has_<'id', number>(userPhantom)`}</Code>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}