import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { buildDocNavigation } from '@/lib/content/doc.model';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { Code } from '@/lib/content/ui/code.cmp.iso';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata() {
  return {
    title: 'is_ - Typist API Reference',
    description: 'Complete API reference for the is_ function in typist - type assertion and value testing.',
  };
}

export default function IsApiPage() {
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
                  <code>is_</code>
                </h1>
                <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
                  Function
                </span>
              </div>
              
              <p className="text-xl text-gray-600 mb-6">
                Assert that a value is assignable to a given type. Also available as <code>assignable_</code>.
              </p>
            </header>

            {/* Source Code */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Source Code</h2>
              <p className="text-lg text-gray-600 mb-6">
                The <code>is_</code> function is a simple identity function for compile-time type assertions.
              </p>
              
              <Code language="typescript">{`export const is_ = <T>(x:T) => {}`}</Code>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Alias</h3>
                <p className="text-blue-800">
                  <code className="bg-blue-100 px-2 py-1 rounded">assignable_</code> is an alias for <code className="bg-blue-100 px-2 py-1 rounded">is_</code> and works identically.
                </p>
                <Code language="typescript">{`export const assignable_ = is_`}</Code>
              </div>
            </section>

            {/* Signature */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Type Signature</h2>
              
              <Code language="typescript">{`function is_<T>(x: T): void`}</Code>
              
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Parameters</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded mr-3">x: T</code>
                      <span className="text-gray-600">The value to assert against type T</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Type Parameters</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded mr-3">T</code>
                      <span className="text-gray-600">The type to assert the value against</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Returns</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded mr-3">void</code>
                      <span className="text-gray-600">Used purely for compile-time type assertions</span>
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Type Assertions</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Use <code>is_</code> or <code>assignable_</code> to assert that a value belongs to a specific type. Both functions work identically.
                  </p>
                  
                  <Code language="typescript">{`type Status = 'pending' | 'complete' | 'error'

// Both functions work the same way
is_<Status>('pending')          // ✓ Valid
assignable_<Status>('complete') // ✓ Valid (same as is_)

// @ts-expect-error ✓
is_<Status>('invalid')          // Error: not assignable to type 'Status'
// @ts-expect-error ✓  
assignable_<Status>('invalid')  // Error: same as above`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Runtime Value Testing</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Test runtime values against type constraints. The function works with both const and mutable values.
                  </p>
                  
                  <Code language="typescript">{`const userRole = 'admin' as const
const dynamicRole: string = getUserRole()

is_<string>(userRole)        // ✓ const assignable to string
is_<'admin'>(userRole)       // ✓ const value matches literal
is_<string>(dynamicRole)     // ✓ string assignable to string

// @ts-expect-error ✓
is_<'admin'>(dynamicRole)    // Error: string not assignable to 'admin'`}</Code>
                </div>
              </div>
            </section>

            {/* Advanced Patterns */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced Patterns</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Object Type Assertions</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Assert object structures and their properties against interface types.
                  </p>
                  
                  <Code language="typescript">{`interface User {
  id: number
  name: string
}

const user = { id: 1, name: 'Alice' } as const
const partialUser = { name: 'Bob' }

is_<User>(user)        // ✓ Object has all required properties
is_<User['name']>(user.name)  // ✓ Property type assertion

// @ts-expect-error ✓
is_<User>(partialUser) // Error: missing 'id' property`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Generic Type Testing</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Use with generic types and conditional type assertions.
                  </p>
                  
                  <Code language="typescript">{`function processArray<T>(items: T[]) {
  is_<T[]>(items)           // ✓ Array type assertion
  is_<T>(items[0])          // ✓ Element type assertion
  
  // Type-safe array operations
  const mapped = items.map(item => {
    is_<T>(item)            // ✓ Item maintains type
    return item
  })
  
  is_<T[]>(mapped)          // ✓ Result maintains array type
}`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Union Type Discrimination</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Test values against union types to verify they match one of the allowed variants.
                  </p>
                  
                  <Code language="typescript">{`type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

const successResult = { success: true, data: 'hello' } as const
const errorResult = { success: false, error: 'failed' } as const

is_<Result<string>>(successResult) // ✓ Matches success variant
is_<Result<string>>(errorResult)   // ✓ Matches error variant

// Extract specific variants
if (successResult.success) {
  is_<string>(successResult.data)  // ✓ Type narrowed to data
}`}</Code>
                </div>
              </div>
            </section>

            {/* Testing Patterns */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Testing Patterns</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Negative Testing</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Use <code>@ts-expect-error</code> to write negative tests that ensure certain values do not conform to expected types.
                  </p>
                  
                  <Code language="typescript">{`type StrictNumber = 1 | 2 | 3

is_<StrictNumber>(1)    // ✓ Valid value

// @ts-expect-error ✓
is_<StrictNumber>(4)    // Expected error: 4 not in union

// @ts-expect-error ✓
is_<StrictNumber>('1')  // Expected error: string not number`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Type Compatibility Testing</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Verify type relationships and assignability rules in complex type hierarchies.
                  </p>
                  
                  <Code language="typescript">{`interface Base { id: string }
interface Extended extends Base { name: string }

const base: Base = { id: '123' }
const extended: Extended = { id: '123', name: 'test' }

is_<Base>(base)       // ✓ Direct type match
is_<Base>(extended)   // ✓ Extended assignable to Base

// @ts-expect-error ✓
is_<Extended>(base)   // Error: Base missing 'name' property`}</Code>
                </div>
              </div>
            </section>

            {/* See Also */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">See Also</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link 
                  href="/docs/typist/api/extends_"
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">extends_</h3>
                  <p className="text-sm text-gray-600">Test type relationships and inheritance</p>
                </Link>
                
                <Link 
                  href="/docs/typist/api/has_"
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">has_</h3>
                  <p className="text-sm text-gray-600">Test object property types</p>
                </Link>
                
                <Link 
                  href="/docs/typist/api/t_"
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">t_</h3>
                  <p className="text-sm text-gray-600">Create phantom type values</p>
                </Link>
                
                <Link 
                  href="/docs/typist/guide"
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">Guide</h3>
                  <p className="text-sm text-gray-600">Interactive examples and tutorials</p>
                </Link>
              </div>
            </section>

            {/* Navigation */}
            <section className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <Link 
                  href="/docs/typist"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Documentation
                </Link>
                
                <Link 
                  href="/docs/typist/api/extends_"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next: extends_
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}