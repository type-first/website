import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { buildDocNavigation } from '@/lib/content/doc.model';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { Code } from '@/lib/content/ui/code.cmp.iso';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata() {
  return {
    title: 'Verdicts - Typist API Reference',
    description: 'Type-level verdict system with $Yes, $No, $Maybe types and decidable_, yes_, no_ functions from Typist',
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
                  Verdict System
                </h1>
                <span className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full font-medium">
                  Types & Functions
                </span>
              </div>
              
              <p className="text-xl text-gray-600 mb-6">
                Type-level verdict system for type computations. Includes verdict types ($Yes, $No, $Maybe) and assertion functions (decidable_, yes_, no_).
              </p>
            </header>

            {/* Verdict Types */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Verdict Types</h2>
              
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">$Verdict (Base Type)</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    The base verdict type containing a boolean verdict field.
                  </p>
                  
                  <Code language="typescript">{`export type $Verdict = { $___verdict: boolean }`}</Code>
                </div>

                <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                  <h3 className="text-xl font-semibold text-green-900 mb-3">$Yes (Positive Verdict)</h3>
                  <p className="text-lg text-green-800 mb-4">
                    Represents successful type computations or positive assertions.
                  </p>
                  
                  <Code language="typescript">{`export type $Yes = {
  $___verdict: true
  $___type_error: false
}`}</Code>
                </div>

                <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                  <h3 className="text-xl font-semibold text-red-900 mb-3">$No (Negative Verdict)</h3>
                  <p className="text-lg text-red-800 mb-4">
                    Represents failed type computations with diagnostic information.
                  </p>
                  
                  <Code language="typescript">{`export type $No<Key extends string, Dump extends readonly any[] = []> = {
  $___dump: Dump
  $___verdict: false
  $___type_error: true
  $___type_error_key: Key
}`}</Code>
                  
                  <div className="mt-4 p-3 bg-red-100 rounded">
                    <p className="text-sm text-red-800">
                      <strong>Key:</strong> A string describing the error type<br/>
                      <strong>Dump:</strong> An array containing diagnostic information about the failure
                    </p>
                  </div>
                </div>

                <div className="border border-amber-200 rounded-lg p-6 bg-amber-50">
                  <h3 className="text-xl font-semibold text-amber-900 mb-3">$Maybe (Either Verdict)</h3>
                  <p className="text-lg text-amber-800 mb-4">
                    Union type representing any decidable verdict (either $Yes or $No).
                  </p>
                  
                  <Code language="typescript">{`export type $Maybe = $Verdict & ( $Yes | $No<string> )`}</Code>
                </div>
              </div>
            </section>

            {/* Assertion Functions */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Assertion Functions</h2>
              
              <div className="space-y-8">
                {/* decidable_ */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      <code>decidable_</code>
                    </h3>
                    <span className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded font-medium">
                      $Maybe
                    </span>
                  </div>
                  
                  <p className="text-lg text-gray-600 mb-4">
                    Validates that a type is a decidable verdict ($Yes or $No).
                  </p>
                  
                  <Code language="typescript">{`export const decidable_ = <T extends $Maybe>(t?:T) => {}`}</Code>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Usage Example:</h4>
                    <Code language="typescript">{`type StringIsString = /* some computation */ $Yes;
type NumberIsString = /* some computation */ $No<'type-mismatch'>;

decidable_<StringIsString>();    // ✓ Valid verdict
decidable_<NumberIsString>();    // ✓ Valid verdict`}</Code>
                  </div>
                </div>

                {/* yes_ */}
                <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-xl font-semibold text-green-900">
                      <code>yes_</code>
                    </h3>
                    <span className="px-2 py-1 text-xs bg-green-200 text-green-800 rounded font-medium">
                      $Yes → true
                    </span>
                  </div>
                  
                  <p className="text-lg text-green-800 mb-4">
                    Asserts positive verdicts and returns true. Only accepts $Yes types.
                  </p>
                  
                  <Code language="typescript">{`export const yes_ = <T extends $Yes>(t?:T) => true`}</Code>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold text-green-900 mb-2">Usage Example:</h4>
                    <Code language="typescript">{`type StringIsString = $Yes;

const result = yes_<StringIsString>(); // true

// Use in runtime checks
if (yes_<StringIsString>()) {
  console.log('Type check passed!');
}`}</Code>
                  </div>
                </div>

                {/* no_ */}
                <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-xl font-semibold text-red-900">
                      <code>no_</code>
                    </h3>
                    <span className="px-2 py-1 text-xs bg-red-200 text-red-800 rounded font-medium">
                      $No → void
                    </span>
                  </div>
                  
                  <p className="text-lg text-red-800 mb-4">
                    Asserts negative verdicts. Only accepts $No types with diagnostic information.
                  </p>
                  
                  <Code language="typescript">{`export const no_ = <T extends $No<any, any>>(t?:T) => {}`}</Code>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold text-red-900 mb-2">Usage Example:</h4>
                    <Code language="typescript">{`type NumberIsString = $No<'type-mismatch', [number, string]>;

no_<NumberIsString>(); // ✓ Asserts expected failure

// Test that incompatible types are rejected
type CanAssign<From, To> = From extends To 
  ? $Yes 
  : $No<'not-assignable', [From, To]>;

type BadAssignment = CanAssign<number, string>; // $No
no_<BadAssignment>(); // ✓ Expected incompatibility`}</Code>
                  </div>
                </div>
              </div>
            </section>

            {/* Complete Example */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Example: Type Test Suite</h2>
              <p className="text-lg text-gray-600 mb-6">
                Here's how to build a comprehensive type-level test suite using the verdict system:
              </p>
              
              <Code language="typescript">{`// Define type-level test computations
type Equal<A, B> = A extends B 
  ? B extends A 
    ? $Yes 
    : $No<'not-bidirectional', [A, B]>
  : $No<'not-assignable', [A, B]>;

type HasProperty<T, K extends PropertyKey> = K extends keyof T 
  ? $Yes 
  : $No<'missing-property', [T, K]>;

// Create test suite
type TypeTestSuite = {
  equalityTests: {
    stringToString: Equal<string, string>;           // $Yes
    numberToNumber: Equal<number, number>;           // $Yes
    stringToNumber: Equal<string, number>;           // $No<'not-assignable', [string, number]>
  };
  
  propertyTests: {
    arrayHasLength: HasProperty<any[], 'length'>;    // $Yes  
    objectHasToString: HasProperty<{}, 'toString'>;  // $Yes
    numberHasLength: HasProperty<number, 'length'>;  // $No<'missing-property', [number, 'length']>
  };
};

// Validate all results are decidable
decidable_<TypeTestSuite['equalityTests']['stringToString']>();
decidable_<TypeTestSuite['propertyTests']['arrayHasLength']>();
decidable_<TypeTestSuite['equalityTests']['stringToNumber']>();

// Assert positive results
yes_<TypeTestSuite['equalityTests']['stringToString']>();    // ✓ Strings are equal
yes_<TypeTestSuite['propertyTests']['arrayHasLength']>();    // ✓ Arrays have length
yes_<TypeTestSuite['propertyTests']['objectHasToString']>(); // ✓ Objects have toString

// Assert negative results (expected failures)
no_<TypeTestSuite['equalityTests']['stringToNumber']>();     // ✓ String ≠ number
no_<TypeTestSuite['propertyTests']['numberHasLength']>();    // ✓ Numbers don't have length

// Runtime integration
function createTypeTestReport() {
  return {
    stringEquality: yes_<TypeTestSuite['equalityTests']['stringToString']>(), // true
    arrayHasLength: yes_<TypeTestSuite['propertyTests']['arrayHasLength']>(), // true
    // Negative assertions don't return values, just validate at compile time
  };
}

// Advanced: Extract diagnostic information from $No types
type ExtractErrorKey<T> = T extends $No<infer K, any> ? K : never;
type ExtractDump<T> = T extends $No<any, infer D> ? D : never;

type NumberLengthError = ExtractErrorKey<TypeTestSuite['propertyTests']['numberHasLength']>; 
// 'missing-property'

type NumberLengthDump = ExtractDump<TypeTestSuite['propertyTests']['numberHasLength']>; 
// [number, 'length']`}</Code>
            </section>

            {/* Advanced Patterns */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced Patterns</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Custom Verdict Constructors</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Create helper functions to build custom verdicts with consistent error keys.
                  </p>
                  
                  <Code language="typescript">{`// Verdict constructor helpers
type TypeMismatch<A, B> = $No<'type-mismatch', [A, B]>;
type MissingProperty<T, K> = $No<'missing-property', [T, K, keyof T]>;
type Success = $Yes;

// Use in type computations
type StrictEqual<A, B> = A extends B 
  ? B extends A 
    ? Success
    : TypeMismatch<A, B>
  : TypeMismatch<A, B>;

type RequireProperty<T, K extends PropertyKey> = K extends keyof T
  ? Success
  : MissingProperty<T, K>;

// Clear, consistent error reporting
type UserMustHaveEmail = RequireProperty<{name: string}, 'email'>;
// $No<'missing-property', [{name: string}, 'email', 'name']>

no_<UserMustHaveEmail>(); // ✓ User is missing required email property`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Verdict Composition</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Combine multiple verdicts to create complex validation logic.
                  </p>
                  
                  <Code language="typescript">{`// Verdict composition utilities
type AllYes<T extends readonly $Maybe[]> = T extends readonly [$Yes, ...infer Rest]
  ? Rest extends readonly $Maybe[]
    ? AllYes<Rest>
    : never
  : T extends readonly []
    ? $Yes
    : $No<'contains-failures', T>;

type AnyYes<T extends readonly $Maybe[]> = T extends readonly [infer First, ...infer Rest]
  ? First extends $Yes
    ? $Yes
    : Rest extends readonly $Maybe[]
      ? AnyYes<Rest>
      : $No<'all-failed', T>
  : $No<'empty-list', []>;

// Compose multiple checks
type ValidationSuite = [
  Equal<string, string>,              // $Yes
  HasProperty<{name: string}, 'name'>, // $Yes  
  Equal<number, string>               // $No<'not-assignable', [number, string]>
];

type AllPassed = AllYes<ValidationSuite>; // $No (because one failed)
type AnyPassed = AnyYes<ValidationSuite>; // $Yes (because some passed)

no_<AllPassed>();   // ✓ Not all checks passed
yes_<AnyPassed>();  // ✓ At least one check passed`}</Code>
                </div>
              </div>
            </section>

            {/* Navigation */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">API Reference</h2>
              <div className="flex items-center gap-4">
                <Link 
                  href="/docs/typist/api/never_"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Previous: never_
                </Link>
                <Link 
                  href="/docs/typist/api"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  View All API References
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}