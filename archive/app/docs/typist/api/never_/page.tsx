import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { buildDocNavigation } from '@/lib/content/doc.model';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { Code } from '@/lib/content/ui/code.cmp.iso';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata() {
  return {
    title: 'never_ - Typist API Reference',
    description: 'Assert that a type is never (unreachable code) using the never_ function from Typist',
  };
}

export default function NeverApiPage() {
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
                  <code>never_</code>
                </h1>
                <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
                  Function
                </span>
              </div>
              
              <p className="text-xl text-gray-600 mb-6">
                Assert that a type is never, representing unreachable code or impossible types. Used for exhaustiveness checking.
              </p>
            </header>

            {/* Source Code */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Source Code</h2>
              <p className="text-lg text-gray-600 mb-6">
                The <code>never_</code> function constrains the type parameter to <code>never</code> and returns never, ensuring code paths are truly unreachable.
              </p>
              
              <Code language="typescript">{`export const never_ = <T extends never>(x?: T): never => x as never`}</Code>
            </section>

            {/* Signature */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Type Signature</h2>
              
              <Code language="typescript">{`function never_<T extends never>(x?: T): never`}</Code>
              
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Parameters</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded mr-3">x?: T</code>
                      <span className="text-gray-600">Optional value that must be of type never</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Type Parameters</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded mr-3">T extends never</code>
                      <span className="text-gray-600">Must be the never type (no values assignable)</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Returns</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded mr-3">never</code>
                      <span className="text-gray-600">The never type (indicates unreachable code)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Basic Usage */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic Usage</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Exhaustiveness Checking</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Use <code>never_</code> to ensure all cases in a union type are handled.
                  </p>
                  
                  <Code language="typescript">{`type Color = 'red' | 'green' | 'blue';

function handleColor(color: Color): string {
  switch (color) {
    case 'red':
      return 'Stop';
    case 'green':
      return 'Go';
    case 'blue':
      return 'Cool';
    default:
      // This ensures all Color cases are handled
      return never_(color); // ✓ TypeScript verifies color is never here
  }
}`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Impossible Type States</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Assert that certain type combinations should never occur.
                  </p>
                  
                  <Code language="typescript">{`type Success = { status: 'success'; data: string };
type Error = { status: 'error'; message: string };
type Result = Success | Error;

function processResult(result: Result) {
  if (result.status === 'success' && 'message' in result) {
    // This should never happen - success results don't have messages
    return never_(result); // TypeScript error: result is never here
  }
  
  if (result.status === 'error' && 'data' in result) {
    // This should never happen - error results don't have data  
    return never_(result); // TypeScript error: result is never here
  }
}`}</Code>
                </div>
              </div>
            </section>

            {/* Advanced Patterns */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced Patterns</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Type-level Assertions</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Use <code>never_</code> to assert that type operations result in empty types.
                  </p>
                  
                  <Code language="typescript">{`type A = { a: string };
type B = { b: number };
type Intersection = A & B; // { a: string; b: number }

// Assert that excluding all properties results in never
type Empty = Exclude<keyof Intersection, 'a' | 'b'>; // never

// Compile-time assertion that Empty is never
const proof = never_<Empty>(); // ✓ TypeScript verifies Empty is never`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Generic Constraints</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Prove that generic type parameters cannot have certain values.
                  </p>
                  
                  <Code language="typescript">{`type NonEmpty<T> = T extends '' ? never : T;

function processString<S extends string>(str: S): NonEmpty<S> {
  if (str === '') {
    // TypeScript knows str is never here due to the constraint
    return never_(str); // ✓ Proves empty string is excluded
  }
  
  return str as NonEmpty<S>; // Safe cast
}

// Usage
const result1 = processString('hello'); // string "hello"
const result2 = processString('world'); // string "world"  
// const result3 = processString(''); // TypeScript error!`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Unreachable Code Detection</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Mark code paths that should theoretically never execute.
                  </p>
                  
                  <Code language="typescript">{`function assertUnreachable(x: never): never {
  return never_(x);
}

type Shape = 'circle' | 'square' | 'triangle';

function getShapeArea(shape: Shape): number {
  switch (shape) {
    case 'circle':
      return Math.PI * 5 * 5;
    case 'square':
      return 10 * 10;
    case 'triangle':
      return 0.5 * 5 * 8;
    default:
      // If we add a new shape but forget to handle it,
      // TypeScript will error here
      return assertUnreachable(shape);
  }
}`}</Code>
                </div>
              </div>
            </section>

            {/* Navigation */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">API Reference</h2>
              <div className="flex items-center gap-4">
                <Link 
                  href="/docs/typist/api/instance_"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Previous: instance_
                </Link>
                <Link 
                  href="/docs/typist/api/decidable_"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next: decidable_
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}