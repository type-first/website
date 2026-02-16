import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { buildDocNavigation } from '@/lib/content/doc.model';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { Code } from '@/lib/content/ui/code.cmp.iso';
import { ArrowLeft, AlertTriangle, CheckCircle2, Info, XCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata() {
  return {
    title: 'Verdicts - Typist API Reference',
    description: 'Type-level verdict system with $Yes, $No, $Maybe types that encode the results of type comparisons and enable structured error reporting.',
  };
}

export default function VerdictsApiPage() {
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
                  Verdicts
                </h1>
                <span className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full font-medium">
                  Functional Group
                </span>
              </div>
              
              <p className="text-xl text-gray-600 mb-6">
                Result types that encode boolean decisions with rich error information. 
                Verdicts bridge comparators and assertions, enabling sophisticated debugging 
                and constraint-based type testing with structured failure metadata.
              </p>
            </header>

            {/* Overview */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
              
              <p className="text-lg text-gray-600 mb-6">
                Verdicts are the backbone of typist's type comparison system. They encode boolean results 
                as structured types that carry both success/failure information and debugging metadata. 
                When comparisons fail, verdicts capture exactly what went wrong and which types were involved, 
                making TypeScript errors more informative and debugging more efficient.
              </p>

              <p className="text-lg text-gray-600 mb-6">
                Every <Link href="/docs/typist/comparators" className="text-blue-600 underline">comparator</Link> produces 
                a verdict type, and every <Link href="/docs/typist/assertions" className="text-blue-600 underline">assertion</Link> tests 
                a verdict type. This creates a complete ecosystem where type relationships are evaluated, 
                encoded as verdicts, and then verified through assertions.
              </p>

              <div className="prose max-w-none mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Success and Failure Results</h3>
                <p className="text-gray-600 mb-4">
                  When type comparisons succeed, they produce <code>$Yes</code> verdicts with success flags. 
                  When they fail, they produce <code>$No</code> verdicts containing descriptive error keys and type dumps for debugging.
                </p>
              </div>
              
              <div className="mb-8">
                <Code language="typescript">{`// Success verdicts
$Equal<string, string>        // → $Yes
$Extends<'hello', string>     // → $Yes
yes_<$Equal<string, string>>() // ✓ Assertion passes

// Failure verdicts with debugging information
$Equal<string, number>        // → $No<'not-equal', [string, number]>
no_<$Equal<string, number>>()  // ✓ Assertion passes`}</Code>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Integration Workflow</h3>

              <p className="text-gray-600 mb-4">
                Verdicts enable a complete type testing workflow that spans the entire typist ecosystem:
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Comparators → Verdicts</h4>
                  <p className="text-gray-600 text-sm">
                    <Link href="/docs/typist/comparators" className="text-blue-600 underline">Comparator types</Link> like <code>$Equal</code> and <code>$Extends</code> 
                    evaluate type relationships and produce verdict types encoding the results with debugging information.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Verdicts → Assertions</h4>
                  <p className="text-gray-600 text-sm">
                    <Link href="/docs/typist/assertions" className="text-blue-600 underline">Assertion functions</Link> like <code>yes_</code> and <code>no_</code> 
                    test verdict types to verify expected outcomes, with TypeScript showing verdict details in error messages.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Structured Debugging</h4>
                  <p className="text-gray-600 text-sm">
                    Failed verdicts include error keys and type dumps that appear in TypeScript errors, 
                    making it clear exactly why comparisons failed and which types were involved.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Code language="typescript">{`// Complete verdict workflow demonstration
type UserComparison = $Equal<User, { name: string, age: number }>  // → $Yes
type AdminComparison = $Equal<User, AdminUser>                     // → $No<'not-equal', [User, AdminUser]>

// Assertions test the verdicts and provide clear error feedback
yes_<UserComparison>()   // ✓ User matches expected shape exactly
no_<AdminComparison>()   // ✓ User and AdminUser have different structures`}</Code>
              </div>
            </section>

            {/* API Reference */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">API Reference</h2>
              
              <div className="space-y-8">
                {/* Base Verdict */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Info className="h-6 w-6 text-gray-600" />
                    Base Verdict Structure
                  </h3>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      <code>$Verdict</code>
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Foundation type that defines the common structure for all verdict types. 
                      Contains the fundamental boolean result encoding used by the entire verdict system.
                    </p>
                    <Code language="typescript">{`// Base structure shared by all verdicts
export type $Verdict = { $___verdict: boolean }`}</Code>
                    <div className="mt-3 p-3 bg-gray-50 rounded border text-sm text-gray-600">
                      <strong>Usage:</strong> Internal base type for verdict constraints and assertions
                    </div>
                  </div>
                </div>

                {/* Success Verdict */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    Success Verdict
                  </h3>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      <code>$Yes</code>
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Represents successful type comparisons and operations. Indicates that 
                      a tested relationship or constraint is satisfied with no errors.
                    </p>
                    <Code language="typescript">{`export type $Yes = {
  $___verdict: true
  $___type_error: false  
}`}</Code>
                    <div className="mt-4 space-y-4">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Common Producers</h5>
                        <Code language="typescript">{`type IdentityComparison = $Equal<string, string>       // → $Yes
type ValidSubtype = $Extends<'hello', string>         // → $Yes  
type LiteralFits = $Extends<42, number>               // → $Yes`}</Code>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Assertion Integration</h5>
                        <Code language="typescript">{`// Test success verdicts with yes_ assertion
yes_<$Equal<User, { name: string; age: number }>>()   // ✓ Passes
yes_<$Extends<AdminUser, User>>()                     // ✓ AdminUser extends User`}</Code>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Failure Verdict */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <XCircle className="h-6 w-6 text-red-600" />
                    Failure Verdict
                  </h3>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      <code>$No&lt;Key, Dump&gt;</code>
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Represents failed type comparisons with detailed error information. 
                      Includes an error key describing the failure reason and a type dump 
                      containing the compared types for debugging.
                    </p>
                    <Code language="typescript">{`export type $No<
  Key extends string, 
  Dump extends readonly any[] = []
> = {
  $___dump: Dump
  $___verdict: false
  $___type_error: true
  $___type_error_key: Key
}`}</Code>
                    <div className="mt-4 space-y-4">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Common Error Patterns</h5>
                        <Code language="typescript">{`// Type equality failures
type DifferentTypes = $Equal<string, number>
// → $No<'not-equal', [string, number]>

// Extension relationship failures  
type BadExtension = $Extends<string, 'hello'>
// → $No<'right-does-not-extend-left', [string, 'hello']>`}</Code>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Error Key Reference</h5>
                        <ul className="text-gray-700 text-sm space-y-1">
                          <li><code>'not-equal'</code> - Types have different structures (from <code>$Equal</code>)</li>
                          <li><code>'right-does-not-extend-left'</code> - Subtype relationship failed (from <code>$Extends</code>)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Maybe Constraint */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                    Decidable Constraint
                  </h3>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      <code>$Maybe</code>
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Union constraint type that represents any decidable verdict - either success 
                      or failure. Used in assertion constraints to accept any valid comparison result.
                    </p>
                    <Code language="typescript">{`export type $Maybe = $Verdict & ($Yes | $No<string>)`}</Code>
                    <div className="mt-4">
                      <h5 className="font-semibold text-gray-900 mb-2">Constraint Usage</h5>
                      <Code language="typescript">{`// decidable_ accepts any valid verdict
decidable_<$Equal<string, string>>()     // ✓ Accepts $Yes
decidable_<$Equal<string, number>>()     // ✓ Accepts $No<...>  

// Ensures type operations produce valid verdicts
function verifyComparison<T extends $Maybe>(result: T) {
  decidable_<T>()  // ✓ T is a valid verdict type
}`}</Code>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Key Patterns */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Patterns</h2>
              
              <p className="text-lg text-gray-600 mb-8">
                Master these essential verdict patterns to build robust type testing and debugging workflows. 
                Each pattern demonstrates practical techniques that leverage verdict structure for maximum effectiveness.
              </p>

              <div className="space-y-10">
                {/* Pattern 1: Basic Verdict Testing */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Verdict Testing</h3>
                  <p className="text-gray-600 mb-4">
                    Test verdict results from comparisons using assertion functions. This is the fundamental 
                    pattern for verifying type relationships and catching type-level logical errors.
                  </p>
                  <Code language="typescript">{`import { $Equal, $Extends, yes_, no_, test_ } from '@typefirst/typist'

test_('Basic verdict testing', () => {
  // Test successful comparisons
  yes_<$Equal<string, string>>()           // ✓ Same types are equal
  yes_<$Extends<'hello', string>>()        // ✓ Literal extends general type
  yes_<$Extends<{ a: 1, b: 2 }, { a: 1 }>>()  // ✓ More props extend fewer

  // Test failed comparisons  
  no_<$Equal<string, number>>()            // ✓ Different types not equal
  no_<$Extends<string, 'hello'>>()         // ✓ General doesn't extend literal
  no_<$Extends<{ a: 1 }, { a: 1, b: 2 }>>()   // ✓ Fewer props don't extend more
})`}</Code>
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Link 
                      href="/typescape/typist-type-comparisons"
                      className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium"
                    >
                      🔍 Explore in Type Comparisons Typescape
                    </Link>
                  </div>
                </div>

                {/* Pattern 2: Verdict-Based Conditional Logic */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Verdict-Based Conditional Logic</h3>
                  <p className="text-gray-600 mb-4">
                    Use verdicts in conditional types to create sophisticated type utilities that provide 
                    different behaviors based on comparison results, with proper error handling.
                  </p>
                  <Code language="typescript">{`import { $Equal, $Extends, $Yes, $No, is_, no_, test_ } from '@typefirst/typist'

// Conditional utility based on type equality
type StrictAssign<TTarget, TSource> =
  $Equal<TTarget, TSource> extends $Yes
    ? TSource                                        // ✓ Types match exactly
    : $No<'types-not-identical', [TTarget, TSource]> // ✗ Different types

// Conditional utility based on extension relationships  
type SafePropertyAccess<T, K> = 
  $Extends<K, keyof T> extends $Yes 
    ? T[K & keyof T]                               // ✓ Property exists
    : $No<'property-does-not-exist', [T, K]>       // ✗ Property missing

test_('Verdict-based conditional logic', () => {
  interface User { name: string; age: number }
  
  // Test strict assignment utility
  type ValidAssign = StrictAssign<string, string>         // → string
  type InvalidAssign = StrictAssign<string, number>       // → $No<'types-not-identical', [string, number]>
  
  is_<string>(t_<ValidAssign>())          // ✓ Matching types pass through
  no_<InvalidAssign>()                    // ✓ Different types produce error verdict
  
  // Test safe property access utility
  type ValidAccess = SafePropertyAccess<User, 'name'>     // → string  
  type InvalidAccess = SafePropertyAccess<User, 'email'>  // → $No<'property-does-not-exist', [User, 'email']>
  
  is_<string>(t_<ValidAccess>())          // ✓ Valid property access returns type
  no_<InvalidAccess>()                    // ✓ Invalid access produces error verdict
})`}</Code>
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <Link 
                      href="/typescape/typist-advanced-patterns"
                      className="inline-flex items-center gap-2 text-green-700 hover:text-green-900 font-medium"
                    >
                      🚀 Explore in Advanced Patterns Typescape
                    </Link>
                  </div>
                </div>

                {/* Pattern 3: Custom Verdict Producers */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Custom Verdict Producers</h3>
                  <p className="text-gray-600 mb-4">
                    Create custom comparison utilities that produce verdict types following the same patterns 
                    as built-in comparators. This enables domain-specific type validations with consistent error reporting.
                  </p>
                  <Code language="typescript">{`import { $Yes, $No, yes_, no_, test_ } from '@typefirst/typist'

// Custom comparator for required properties
type $HasRequiredProperties<T, Props extends readonly string[]> = 
  Props extends readonly [infer First, ...infer Rest]
    ? First extends string
      ? Rest extends readonly string[]
        ? First extends keyof T
          ? $HasRequiredProperties<T, Rest>          // Continue checking
          : $No<'missing-required-property', [T, First]>  // Property missing
        : $No<'invalid-properties-spec', [Props]>
      : $No<'invalid-property-name', [First]>
    : $Yes  // All properties verified successfully

// Custom comparator for array constraints
type $HasMinLength<T, N extends number> =
  T extends readonly any[]
    ? T['length'] extends number
      ? N extends 0
        ? $Yes                                       // Zero minimum always satisfied
        : T['length'] extends N | infer Longer
          ? Longer extends N
            ? $Yes                                   // Length sufficient
            : $No<'insufficient-length', [T, N]>     // Array too short
          : $No<'insufficient-length', [T, N]>
      : $No<'dynamic-length-array', [T]>             // Can't verify runtime length
    : $No<'not-an-array', [T]>                       // Not an array type

test_('Custom verdict producers', () => {
  interface User { id: number; name: string; email: string }
  interface PartialUser { name: string }
  
  // Test property requirements comparator
  type UserHasProps = $HasRequiredProperties<User, ['id', 'name']>          // → $Yes
  type PartialMissingId = $HasRequiredProperties<PartialUser, ['id']>       // → $No<'missing-required-property', [PartialUser, 'id']>
  
  yes_<UserHasProps>()                  // ✓ User has required properties
  no_<PartialMissingId>()               // ✓ PartialUser missing required property
  
  // Test array length comparator
  type ValidArray = $HasMinLength<[1, 2, 3], 2>          // → $Yes
  type TooShort = $HasMinLength<[1], 3>                   // → $No<'insufficient-length', [[1], 3]>
  type NotArray = $HasMinLength<string, 5>                // → $No<'not-an-array', [string]>
  
  yes_<ValidArray>()                    // ✓ Array meets minimum length
  no_<TooShort>()                       // ✓ Array below minimum length
  no_<NotArray>()                       // ✓ String is not an array
})`}</Code>
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <Link 
                      href="/typescape/typist-registry-patterns"
                      className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 font-medium"
                    >
                      📋 Explore in Registry Patterns Typescape
                    </Link>
                  </div>
                </div>

                {/* Pattern 4: TypeScript Error Integration */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">TypeScript Error Integration</h3>
                  <p className="text-gray-600 mb-4">
                    Leverage how verdicts appear in TypeScript error messages to create informative 
                    debugging experiences. Verdict structure provides rich context when assertions fail.
                  </p>
                  <Code language="typescript">{`import { $Equal, $Extends, yes_, no_, decidable_, test_ } from '@typefirst/typist'

test_('TypeScript error integration', () => {
  interface User { name: string; age: number }
  interface Admin { name: string; age: number; permissions: string[] }
  
  // When assertions fail, TypeScript shows the full verdict type
  
  // This would show error: 
  // Argument of type '$No<"not-equal", [User, Admin]>' 
  // is not assignable to parameter of type '$Yes'
  // yes_<$Equal<User, Admin>>()  // ✗ Uncommenting shows detailed error
  
  // This would show error:
  // Argument of type '$No<"right-does-not-extend-left", [User, Admin]>'
  // is not assignable to parameter of type '$Yes'  
  // yes_<$Extends<User, Admin>>()  // ✗ Uncommenting shows detailed error
  
  // Correct assertions that pass
  no_<$Equal<User, Admin>>()       // ✓ User and Admin are different types
  yes_<$Extends<Admin, User>>()    // ✓ Admin has all User properties + more
  
  // decidable_ shows verdict information in generic constraints
  decidable_<$Equal<User, Admin>>()    // ✓ Accepts any verdict, shows debugging info
  decidable_<$Extends<Admin, User>>()  // ✓ Shows successful verdict structure
  
  // Use @ts-expect-error to document expected failures
  // @ts-expect-error - Admin has additional properties, not equal to User
  yes_<$Equal<User, Admin>>()
  
  // @ts-expect-error - User lacks Admin permissions property  
  yes_<$Extends<User, Admin>>()
})`}</Code>
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Link 
                      href="/typescape/typist-intro"
                      className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium"
                    >
                      🔭 Explore in Typist Introduction Typescape
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Related Functional Groups */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Functional Groups</h2>
              
              <p className="text-gray-600 mb-6">
                Verdicts work closely with other typist functional groups to provide complete type testing capabilities:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Link href="/docs/typist/comparators" className="group block p-6 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3 group-hover:text-blue-700">
                    Comparators <ExternalLink className="inline h-4 w-4 ml-1" />
                  </h3>
                  <p className="text-blue-800 mb-3">
                    Type-level comparison utilities that produce verdict types. Every comparator evaluation 
                    results in either a <code>$Yes</code> or <code>$No</code> verdict.
                  </p>
                  <div className="text-sm text-blue-600">
                    <strong>Key Types:</strong> $Equal, $Extends
                  </div>
                </Link>

                <Link href="/docs/typist/assertions" className="group block p-6 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                  <h3 className="text-lg font-semibold text-green-900 mb-3 group-hover:text-green-700">
                    Assertions <ExternalLink className="inline h-4 w-4 ml-1" />
                  </h3>
                  <p className="text-green-800 mb-3">
                    Functions that test verdict types and provide compile-time verification. 
                    Assertions consume verdicts and validate expected comparison outcomes.
                  </p>
                  <div className="text-sm text-green-600">
                    <strong>Key Functions:</strong> yes_, no_, decidable_
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