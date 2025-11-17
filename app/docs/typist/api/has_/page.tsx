import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { buildDocNavigation } from '@/lib/content/doc.model';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { Code } from '@/lib/content/ui/code.cmp.iso';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata() {
  return {
    title: 'has_ - Typist API Reference',
    description: 'Complete API reference for the has_ function in typist - object property type testing.',
  };
}

export default function HasApiPage() {
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
                  <code>has_</code>
                </h1>
                <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
                  Function
                </span>
              </div>
              
              <p className="text-xl text-gray-600 mb-6">
                Test that an object has a specific string property. The value type is optional and defaults to any.
              </p>
            </header>

            {/* Source Code */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Source Code</h2>
              <p className="text-lg text-gray-600 mb-6">
                The <code>has_</code> function validates that an object has specific string properties with optional value type constraints.
              </p>
              
              <Code language="typescript">{`export const has_ = <const P extends string, const V = any>(x: {[k in P]: V }) => {}`}</Code>
            </section>

            {/* Signature */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Type Signature</h2>
              
              <Code language="typescript">{`function has_<const P extends string, const V = any>(x: {[k in P]: V }): void`}</Code>
              
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Parameters</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded mr-3">x</code>
                      <span className="text-gray-600">The object that must have property P of type V</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Type Parameters</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded mr-3">P</code>
                      <span className="text-gray-600">The string property name to require</span>
                    </li>
                    <li className="flex">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded mr-3">V</code>
                      <span className="text-gray-600">The expected type of property P (defaults to any)</span>
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Simple Property Testing</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Test that an object has a specific property. The value type parameter V defaults to any.
                  </p>
                  
                  <Code language="typescript">{`const user = { id: 1, name: 'Alice', email: 'alice@example.com' }

// Simple usage - just check for property existence (V defaults to any)
has_<'name'>(user)              // ✓ user has 'name' property 
has_<'email'>(user)             // ✓ user has 'email' property

// @ts-expect-error ✓
has_<'age'>(user)               // Error: property 'age' missing

// Specify value type when needed
has_<'id', number>(user)        // ✓ user has id: number  
has_<'name', string>(user)      // ✓ user has name: string

// @ts-expect-error ✓
has_<'id', string>(user)        // Error: id is number, not string`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Property Existence vs Type Checking</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Choose between simple property existence checking or strict type validation.
                  </p>
                  
                  <Code language="typescript">{`interface Config {
  port: number
  host?: string
  mode: 'dev' | 'prod'
}

const config: Config = { port: 3000, mode: 'dev' }

// Just check property exists (any type)
has_<'port'>(config)                      // ✓ Property exists
has_<'mode'>(config)                      // ✓ Property exists

// Check property with specific type  
has_<'port', number>(config)              // ✓ Correct type
has_<'mode', 'dev' | 'prod'>(config)      // ✓ Union type matches

// Optional properties
const configWithHost = { ...config, host: 'localhost' }
has_<'host'>(configWithHost)              // ✓ Optional property exists
has_<'host', string>(configWithHost)      // ✓ With type validation`}</Code>
                </div>
              </div>
            </section>

            {/* Advanced Patterns */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced Patterns</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Nested Property Testing</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Test properties of nested objects and complex structures.
                  </p>
                  
                  <Code language="typescript">{`interface User {
  profile: {
    settings: {
      theme: 'light' | 'dark'
      notifications: boolean
    }
  }
}

const user: User = {
  profile: {
    settings: {
      theme: 'dark',
      notifications: true
    }
  }
}

has_<'profile', User['profile']>(user)                           // ✓ Top-level property
has_<'settings', User['profile']['settings']>(user.profile)     // ✓ Nested property
has_<'theme', 'light' | 'dark'>(user.profile.settings)         // ✓ Deep property`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Array and Index Types</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Test array elements and indexed access patterns.
                  </p>
                  
                  <Code language="typescript">{`interface ApiResponse {
  data: string[]
  meta: {
    [key: string]: any
    count: number
  }
}

const response: ApiResponse = {
  data: ['item1', 'item2'],
  meta: { count: 2, page: 1 }
}

has_<'data', string[]>(response)           // ✓ Array property
has_<'meta', ApiResponse['meta']>(response) // ✓ Index signature type
has_<'count', number>(response.meta)       // ✓ Known property in indexed type

// Testing array elements
const firstItem = response.data[0]
has_<0, string>(response.data)             // ✓ Array index access`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Generic Property Testing</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Use with generic types and conditional property testing.
                  </p>
                  
                  <Code language="typescript">{`interface Container<T> {
  value: T
  metadata: {
    type: string
    created: Date
  }
}

function validateContainer<T>(container: Container<T>) {
  has_<'value', T>(container)                           // ✓ Generic property
  has_<'metadata', Container<T>['metadata']>(container) // ✓ Fixed property
  has_<'type', string>(container.metadata)             // ✓ Nested validation
  has_<'created', Date>(container.metadata)            // ✓ Date property
}

const stringContainer: Container<string> = {
  value: 'hello',
  metadata: { type: 'string', created: new Date() }
}

validateContainer(stringContainer) // All validations pass`}</Code>
                </div>
              </div>
            </section>

            {/* Testing Patterns */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Testing Patterns</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Type-Level Property Validation</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Use phantom types to test property existence without runtime values.
                  </p>
                  
                  <Code language="typescript">{`interface BaseEntity {
  id: string
  createdAt: Date
}

interface User extends BaseEntity {
  name: string
  email: string
}

// Test interface structure with phantom types
has_<'id', string>(t_<User>())          // ✓ Inherited property
has_<'name', string>(t_<User>())        // ✓ Own property
has_<'createdAt', Date>(t_<User>())     // ✓ Inherited property

// @ts-expect-error ✓
has_<'password', string>(t_<User>())    // Error: property doesn't exist`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">API Response Validation</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Validate API response structures and their properties.
                  </p>
                  
                  <Code language="typescript">{`interface UserResponse {
  user: {
    id: number
    profile: {
      displayName: string
      avatar?: string
    }
  }
  permissions: string[]
}

function validateUserResponse(response: unknown) {
  const data = response as UserResponse
  
  has_<'user', UserResponse['user']>(data)              // ✓ User object
  has_<'permissions', string[]>(data)                   // ✓ Permissions array
  has_<'id', number>(data.user)                        // ✓ User ID
  has_<'profile', UserResponse['user']['profile']>(data.user) // ✓ Profile object
  has_<'displayName', string>(data.user.profile)       // ✓ Display name
}

// Test with mock data
const mockResponse: UserResponse = {
  user: {
    id: 123,
    profile: { displayName: 'John Doe' }
  },
  permissions: ['read', 'write']
}

validateUserResponse(mockResponse) // All validations pass`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Conditional Property Testing</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Test properties that exist conditionally based on other properties.
                  </p>
                  
                  <Code language="typescript">{`type SuccessResult = {
  success: true
  data: string
}

type ErrorResult = {
  success: false
  error: string
}

type Result = SuccessResult | ErrorResult

const successResult: SuccessResult = { success: true, data: 'hello' }
const errorResult: ErrorResult = { success: false, error: 'failed' }

has_<'success', boolean>(successResult)     // ✓ Common property
has_<'data', string>(successResult)        // ✓ Success-specific property

has_<'success', boolean>(errorResult)      // ✓ Common property  
has_<'error', string>(errorResult)         // ✓ Error-specific property

// @ts-expect-error ✓
has_<'data', string>(errorResult)          // Error: data not in ErrorResult`}</Code>
                </div>
              </div>
            </section>

            {/* See Also */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">See Also</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link 
                  href="/docs/typist/api/is_"
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">is_</h3>
                  <p className="text-sm text-gray-600">Assert value-to-type compatibility</p>
                </Link>
                
                <Link 
                  href="/docs/typist/api/extends_"
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">extends_</h3>
                  <p className="text-sm text-gray-600">Test type relationships and inheritance</p>
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
                  href="/docs/typist/api/extends_"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous: extends_
                </Link>
                
                <Link 
                  href="/docs/typist/api/t_"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next: t_
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}