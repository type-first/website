import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { buildDocNavigation } from '@/lib/content/doc.model';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { Code } from '@/lib/content/ui/code.cmp.iso';
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';
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
                Type-level verdict system that encodes the results of type comparisons with 
                structured success/failure information and debugging metadata.
              </p>
            </header>

            {/* Introductory Exposition */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              
              <div className="prose prose-lg text-gray-700 max-w-none space-y-6">
                <p>
                  The <strong>Verdicts</strong> functional group provides structured type-level 
                  result encoding that captures the outcomes of type comparisons and operations. 
                  Verdicts serve as the return types for <Link href="/docs/typist/comparators" className="text-blue-600 hover:text-blue-800 underline">comparators</Link> and 
                  the input types for <Link href="/docs/typist/assertions" className="text-blue-600 hover:text-blue-800 underline">assertion functions</Link>.
                </p>

                <p>
                  Verdicts work by encoding boolean results along with metadata about the comparison 
                  or operation. Success cases produce <code>$Yes</code> verdicts, while failures 
                  produce <code>$No</code> verdicts that include error keys and type information 
                  for debugging.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">The Verdict Ecosystem</h3>

                <p>
                  Verdicts form the communication layer between different typist components:
                </p>

                <div className="grid gap-4 mt-6 mb-6">
                  <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Info className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Comparators → Verdicts</h4>
                      <p className="text-blue-800 text-sm">
                        <Link href="/docs/typist/comparators" className="underline">Comparator types</Link> like <code>$Equal</code> and <code>$Extends</code> 
                        evaluate type relationships and produce verdict types as their results.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-green-900 mb-1">Verdicts → Assertions</h4>
                      <p className="text-green-800 text-sm">
                        <Link href="/docs/typist/assertions" className="underline">Assertion functions</Link> like <code>yes_</code> and <code>no_</code> 
                        test verdict types to verify expected comparison outcomes.
                      </p>
                    </div>
                  </div>
                </div>

                <Code language="typescript">{`// Complete verdict flow example
type ComparisonResult = $Equal<string, string>    // → $Yes (comparator produces verdict)
yes_<ComparisonResult>()                          // ✓ (assertion tests verdict)

type FailedComparison = $Equal<string, number>    // → $No<'not-equal', [string, number]>
no_<FailedComparison>()                           // ✓ (assertion tests failure verdict)`}</Code>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Verdict Structure</h3>

                <p>
                  All verdict types share a common structure with specific properties that enable 
                  both programmatic testing and debugging:
                </p>

                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Verdict flag</strong> - Boolean result encoded in the type structure</li>
                  <li><strong>Error information</strong> - Failure verdicts include descriptive error keys</li>
                  <li><strong>Type dumps</strong> - Failed comparisons capture the compared types for inspection</li>
                  <li><strong>Constraint compatibility</strong> - Verdicts work seamlessly with TypeScript's constraint system</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Debugging Benefits</h3>

                <p>
                  The structured nature of verdicts provides significant debugging advantages:
                </p>

                <Code language="typescript">{`// Failed verdict includes debugging information
type FailedExtends = $Extends<string, number>
// → $No<'right-does-not-extend-left', [string, number]>
//       ↑ Error key                    ↑ Types involved

// This information appears in TypeScript error messages
no_<FailedExtends>()  // ✓ Compiles
yes_<FailedExtends>() // ✗ Error shows: 'right-does-not-extend-left' with [string, number]`}</Code>
              </div>
            </section>

            {/* Canonical API List */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">API Reference</h2>
              
              <div className="space-y-8">
                {/* Base Verdict Types */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Info className="h-6 w-6 text-gray-600" />
                    Base Verdict Type
                  </h3>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      <code>$Verdict</code>
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Base type that defines the common structure for all verdict types. 
                      Contains the fundamental boolean result encoding.
                    </p>
                    <Code language="typescript">{`export type $Verdict = { $___verdict: boolean }`}</Code>
                    <div className="mt-2 text-sm text-gray-500">
                      <strong>Purpose:</strong> Shared structure for all verdict types
                      <br />
                      <strong>Usage:</strong> Internal base type, typically used in constraints like <code>$Maybe</code>
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
                      a tested relationship or constraint is satisfied.
                    </p>
                    <Code language="typescript">{`export type $Yes = {
  $___verdict: true
  $___type_error: false  
}`}</Code>
                    <div className="mt-2 text-sm text-gray-500">
                      <strong>Properties:</strong> <code>$___verdict: true</code> (success flag), <code>$___type_error: false</code> (no error)
                      <br />
                      <strong>Usage:</strong> Returned by successful comparisons, tested by <code>yes_</code> assertion
                      <br />
                      <strong>Integration:</strong> Works with <Link href="/docs/typist/assertions" className="text-blue-600 underline">assertion functions</Link>
                    </div>
                    
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h5 className="font-semibold text-green-900 mb-2">Example Production</h5>
                      <Code language="typescript">{`type SuccessfulEqual = $Equal<string, string>        // → $Yes
type SuccessfulExtends = $Extends<'hello', string>   // → $Yes
type LiteralExtends = $Extends<42, number>           // → $Yes`}</Code>
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
                      containing the compared types.
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
                    <div className="mt-2 text-sm text-gray-500">
                      <strong>Type Parameters:</strong> <code>Key extends string</code> (error description), <code>Dump extends readonly any[]</code> (captured types)
                      <br />
                      <strong>Properties:</strong> Error flag, verdict flag, error key, and type dump for debugging
                      <br />
                      <strong>Integration:</strong> Tested by <code>no_</code> assertion from <Link href="/docs/typist/assertions" className="text-blue-600 underline">assertions</Link>
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h5 className="font-semibold text-red-900 mb-2">Example Production</h5>
                        <Code language="typescript">{`type FailedEqual = $Equal<string, number>
// → $No<'not-equal', [string, number]>

type FailedExtends = $Extends<string, 'hello'>  
// → $No<'right-does-not-extend-left', [string, 'hello']>`}</Code>
                      </div>
                      
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h5 className="font-semibold text-blue-900 mb-2">Error Key Meanings</h5>
                        <ul className="text-blue-800 text-sm space-y-1">
                          <li><code>'not-equal'</code> - Types are not structurally identical (from <code>$Equal</code>)</li>
                          <li><code>'right-does-not-extend-left'</code> - Left type does not extend right type (from <code>$Extends</code>)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Maybe Verdict */}
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
                    <div className="mt-2 text-sm text-gray-500">
                      <strong>Structure:</strong> Intersection of base verdict with union of specific outcomes
                      <br />
                      <strong>Usage:</strong> Constraint for <code>decidable_</code> assertion function
                      <br />
                      <strong>Purpose:</strong> Ensures only valid verdict types are accepted by assertion functions
                    </div>
                    
                    <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <h5 className="font-semibold text-orange-900 mb-2">Usage in Constraints</h5>
                      <Code language="typescript">{`// decidable_ accepts any valid verdict
decidable_<$Equal<string, string>>()     // ✓ Accepts $Yes
decidable_<$Equal<string, number>>()     // ✓ Accepts $No<...>  
decidable_<$Extends<'hi', string>>()     // ✓ Accepts $Yes

// Used to verify that comparisons produce decidable results
function testComparison<T extends $Maybe>(verdict: T) {
  decidable_<T>()  // ✓ Ensures T is a valid verdict
}`}</Code>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Integration Examples */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Integration Usage Examples</h2>
              
              <div className="space-y-8">
                {/* Complete Verdict Flow */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Complete Verdict Flow</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Demonstrate the full pipeline from comparisons to verdicts to assertions.
                  </p>
                  
                  <Code language="typescript">{`import { $Equal, $Extends, yes_, no_, test_ } from '@typefirst/typist'

test_('Verdict Flow Demonstration', () => {
  // Step 1: Comparators produce verdicts
  type StringEquality = $Equal<string, string>           // → $Yes
  type NumberEquality = $Equal<string, number>           // → $No<'not-equal', [string, number]>
  type LiteralExtends = $Extends<'hello', string>        // → $Yes  
  type InvalidExtends = $Extends<string, 'hello'>        // → $No<'right-does-not-extend-left', [string, 'hello']>
  
  // Step 2: Assertions test verdicts
  yes_<StringEquality>()    // ✓ Test successful equality
  no_<NumberEquality>()     // ✓ Test failed equality
  yes_<LiteralExtends>()    // ✓ Test successful extension
  no_<InvalidExtends>()     // ✓ Test failed extension
  
  // Step 3: Verdict metadata appears in errors
  // If you accidentally write:
  // yes_<NumberEquality>()  // ✗ Error shows: '$No<'not-equal', [string, number]>' 
  //                         //   does not satisfy the constraint '$Yes'
})`}</Code>
                </div>

                {/* Verdict-Based Conditional Types */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Verdict-Based Conditional Types</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Use verdicts to build sophisticated conditional type logic with error handling.
                  </p>

                  <Code language="typescript">{`import { $Equal, $Extends, $Yes, $No, yes_, no_, test_ } from '@typefirst/typist'

// Utility type that uses verdicts for conditional logic
type SafePropertyAccess<T, K> = 
  $Extends<K, keyof T> extends $Yes 
    ? T[K & keyof T]
    : $No<'property-does-not-exist', [T, K]>

// Another utility that checks for exact type matches
type StrictAssign<TTarget, TSource> =
  $Equal<TTarget, TSource> extends $Yes
    ? TSource
    : $No<'types-not-identical', [TTarget, TSource]>

test_('Verdict-Based Utilities', () => {
  interface User {
    id: number
    name: string
    email: string
  }
  
  // Test property access utility
  type ValidAccess = SafePropertyAccess<User, 'name'>     // → string
  type InvalidAccess = SafePropertyAccess<User, 'age'>    // → $No<'property-does-not-exist', [User, 'age']>
  
  // Verify the results
  is_<string>(t_<ValidAccess>())                          // ✓ Valid access returns property type
  no_<InvalidAccess>()                                    // ✓ Invalid access returns error verdict
  
  // Test strict assignment utility  
  type ValidAssign = StrictAssign<string, string>         // → string
  type InvalidAssign = StrictAssign<string, number>       // → $No<'types-not-identical', [string, number]>
  
  is_<string>(t_<ValidAssign>())                          // ✓ Matching types pass through
  no_<InvalidAssign>()                                    // ✓ Non-matching types produce error verdict
})`}</Code>
                </div>

                {/* Error Handling and Debugging */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Error Handling and Debugging</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Leverage verdict error information for debugging complex type relationships.
                  </p>

                  <Code language="typescript">{`import { $Equal, $Extends, $No, yes_, no_, never_, test_ } from '@typefirst/typist'

// Utility to extract error information from failed verdicts
type ExtractErrorKey<T> = 
  T extends $No<infer K, any> ? K : never

type ExtractErrorDump<T> = 
  T extends $No<any, infer D> ? D : never

test_('Verdict Error Inspection', () => {
  // Create some failed comparisons
  type FailedEqual = $Equal<{ a: string }, { a: number }>
  type FailedExtends = $Extends<{ a: 1, b: 2 }, { a: 1, b: 2, c: 3 }>
  
  // Extract error information
  type EqualError = ExtractErrorKey<FailedEqual>          // → 'not-equal'
  type ExtendsError = ExtractErrorKey<FailedExtends>      // → 'right-does-not-extend-left'
  
  // Extract type dumps
  type EqualDump = ExtractErrorDump<FailedEqual>          // → [{ a: string }, { a: number }]
  type ExtendsDump = ExtractErrorDump<FailedExtends>      // → [{ a: 1, b: 2 }, { a: 1, b: 2, c: 3 }]
  
  // Verify error extraction
  is_<'not-equal'>(t_<EqualError>())                     // ✓ Correct error key extracted
  is_<'right-does-not-extend-left'>(t_<ExtendsError>())  // ✓ Correct error key extracted
  
  // Test that successful verdicts produce never for error extraction
  type SuccessfulEqual = $Equal<string, string>
  type NoError = ExtractErrorKey<SuccessfulEqual>         // → never
  never_<NoError>()                                       // ✓ Successful verdicts have no error key
})`}</Code>
                </div>

                {/* Custom Verdict Types */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Custom Verdict Types</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Build custom comparison utilities that produce verdict types following the same patterns.
                  </p>

                  <Code language="typescript">{`import { $Yes, $No, yes_, no_, test_ } from '@typefirst/typist'

// Custom comparator that checks if a type has specific properties
type $HasProperties<T, Props extends readonly string[]> = 
  Props extends readonly [infer First, ...infer Rest]
    ? First extends string
      ? Rest extends readonly string[]
        ? First extends keyof T
          ? $HasProperties<T, Rest>  // Recurse if property exists
          : $No<'missing-property', [T, First]>  // Fail if property missing
        : $No<'invalid-props-array', [Props]>
      : $No<'invalid-property-name', [First]>
    : $Yes  // All properties checked successfully

// Custom comparator for array length constraints  
type $HasMinLength<T, N extends number> =
  T extends readonly any[]
    ? T['length'] extends number
      ? N extends T['length']
        ? $Yes
        : T['length'] extends N
          ? $Yes  
          : $No<'insufficient-length', [T, N]>
      : $No<'dynamic-length-array', [T]>
    : $No<'not-an-array', [T]>

test_('Custom Verdict Types', () => {
  interface User {
    id: number
    name: string
    email: string
  }
  
  interface PartialUser {
    name: string
  }
  
  // Test property checking comparator
  type UserHasProps = $HasProperties<User, ['id', 'name']>        // → $Yes
  type PartialMissingProp = $HasProperties<PartialUser, ['id']>   // → $No<'missing-property', [PartialUser, 'id']>
  
  yes_<UserHasProps>()                                            // ✓ User has required properties
  no_<PartialMissingProp>()                                       // ✓ PartialUser missing 'id'
  
  // Test array length comparator
  type ValidArray = $HasMinLength<[1, 2, 3], 2>                  // → $Yes  
  type TooShort = $HasMinLength<[1], 3>                           // → $No<'insufficient-length', [[1], 3]>
  type NotArray = $HasMinLength<string, 5>                        // → $No<'not-an-array', [string]>
  
  yes_<ValidArray>()                                              // ✓ Array meets minimum length
  no_<TooShort>()                                                 // ✓ Array too short
  no_<NotArray>()                                                 // ✓ String is not array
})`}</Code>
                </div>
              </div>
            </section>

            {/* Integration Notes */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Integration with Other Typist Components</h2>
              
              <div className="space-y-6">
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    <Link href="/docs/typist/comparators" className="hover:underline">Comparators Integration</Link>
                  </h3>
                  <p className="text-blue-800 mb-3">
                    Comparators like <code>$Equal</code> and <code>$Extends</code> are designed to 
                    produce verdict types as their results. The specific error keys and dump formats 
                    are determined by each comparator's implementation.
                  </p>
                  <Code language="typescript">{`// Comparators produce specific verdict types
type EqualResult = $Equal<A, B>     // → $Yes | $No<'not-equal', [A, B]>
type ExtendsResult = $Extends<L, R> // → $Yes | $No<'right-does-not-extend-left', [L, R]>`}</Code>
                </div>

                <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">
                    <Link href="/docs/typist/assertions" className="hover:underline">Assertions Integration</Link>
                  </h3>
                  <p className="text-green-800 mb-3">
                    Assertion functions are designed to test specific verdict types. The constraints 
                    ensure that only appropriate verdicts are accepted by each assertion function.
                  </p>
                  <Code language="typescript">{`// Assertions test specific verdict constraints
yes_<T extends $Yes>()           // Only accepts success verdicts
no_<T extends $No<any, any>>()   // Only accepts failure verdicts  
decidable_<T extends $Maybe>()   // Accepts any valid verdict`}</Code>
                </div>

                <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">TypeScript Error Messages</h3>
                  <p className="text-purple-800 mb-3">
                    When assertions fail, TypeScript error messages include the full verdict type 
                    information, making the error keys and type dumps visible in IDE feedback.
                  </p>
                  <Code language="typescript">{`// Failed assertion shows full verdict in error
yes_<$Equal<string, number>>()
// Error: Argument of type '$No<"not-equal", [string, number]>' 
// is not assignable to parameter of type '$Yes'`}</Code>
                </div>

                <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3">Test Block Organization</h3>
                  <p className="text-yellow-800 mb-3">
                    Organize verdict-based tests using test blocks to group related comparisons 
                    and create clear documentation of expected behaviors.
                  </p>
                  <Code language="typescript">{`test_('User type relationships', () => {
  yes_<$Equal<User['id'], number>>()
  yes_<$Extends<AdminUser, User>>()
  no_<$Equal<User, AdminUser>>()
})`}</Code>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}