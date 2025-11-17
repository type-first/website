import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic'
import { buildDocNavigation } from '@/lib/content/doc.model'
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso'
import { Code } from '@/lib/content/ui/code.cmp.iso'

export const metadata: Metadata = {
  title: 'extends_ - Typist API Reference',
  description: 'Test type relationships and inheritance with the extends_ function from Typist',
}

export default function ExtendsApiPage() {
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
                  <code>extends_</code>
                </h1>
                <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
                  Function
                </span>
              </div>
              
              <p className="text-xl text-gray-600 mb-6">
                Test type relationships and inheritance. Validate that one type extends another type.
              </p>
            </header>

            {/* Source Code */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Source Code</h2>
              <p className="text-lg text-gray-600 mb-6">
                The <code>extends_</code> function validates that type E extends type T using TypeScript's constraint system.
              </p>
              
              <Code language="typescript">{`export const extends_ = <E extends T,T>(y?:E, x?:T) => {}`}</Code>
            </section>

            {/* Signature */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Type Signature</h2>
              
              <Code language="typescript">{`function extends_<E extends T, T>(y?: E, x?: T): void`}</Code>
              
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Parameters</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded mr-3">y?: E</code>
                      <span className="text-gray-600">Optional value of the extending type E</span>
                    </li>
                    <li className="flex">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded mr-3">x?: T</code>
                      <span className="text-gray-600">Optional value of the base type T</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Type Parameters</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded mr-3">E extends T</code>
                      <span className="text-gray-600">The extending type that must be assignable to T</span>
                    </li>
                    <li className="flex">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded mr-3">T</code>
                      <span className="text-gray-600">The base type that E must extend</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Returns</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded mr-3">void</code>
                      <span className="text-gray-600">Used purely for compile-time type checking</span>
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Basic Type Relationships</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    The constraint <code>E extends T</code> ensures that the first type must extend the second type.
                  </p>
                  
                  <Code language="typescript">{`type Animal = { name: string }
type Dog = Animal & { breed: string }

// E=Dog extends T=Animal - compiles successfully
extends_<Dog, Animal>()     

// E=string extends T=any - compiles successfully
extends_<string, any>()     

// This would fail at compile time:
// extends_<Animal, Dog>()  // Error: Animal doesn't extend Dog`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Union Type Relationships</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Test subset relationships between union types.
                  </p>
                  
                  <Code language="typescript">{`type Primary = 'red' | 'blue' | 'yellow'
type Colors = Primary | 'green' | 'purple'  
type Warm = 'red' | 'yellow'

// Warm extends Primary (subset relationship)
extends_<Warm, Primary>()   

// Primary extends Colors  
extends_<Primary, Colors>()

// Single literal extends union
extends_<'red', Primary>()`}</Code>
                </div>
              </div>
            </section>

            {/* Advanced Patterns */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced Patterns</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Interface Inheritance</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Test object type relationships and interface inheritance chains.
                  </p>
                  
                  <Code language="typescript">{`interface Base {
  id: string
}

interface User extends Base {
  name: string
}

interface Admin extends User {
  permissions: string[]
}

extends_<User, Base>()      // ✓ User extends Base
extends_<Admin, User>()     // ✓ Admin extends User  
extends_<Admin, Base>()     // ✓ Transitive relationship`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Compile-time Validation</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    The constraint system prevents invalid type relationships at compile time.
                  </p>
                  
                  <Code language="typescript">{`// These would cause TypeScript compilation errors:

// extends_<Base, User>()     // Error: Base doesn't extend User
// extends_<string, number>() // Error: string doesn't extend number
// extends_<{a: 1}, {}>()     // Error: specific doesn't extend general

// Valid relationships:
extends_<'hello', string>() // ✓ Literal extends base type
extends_<never, any>()      // ✓ never extends everything`}</Code>
                </div>
              </div>
            </section>

            {/* Navigation */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">API Reference</h2>
              <div className="flex items-center gap-4">
                <Link 
                  href="/docs/typist/api/is_"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Previous: is_
                </Link>
                <Link 
                  href="/docs/typist/api/has_"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next: has_
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}