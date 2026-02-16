import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { buildDocNavigation } from '@/lib/content/doc.model';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { Code } from '@/lib/content/ui/code.cmp.iso';
import { ArrowLeft, Package, TestTube, Target, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata() {
  return {
    title: 'Blocks - Typist API Reference',
    description: 'Test organization and scoping utilities with test_, example_, and proof_ functions that create isolated environments for type-level testing.',
  };
}

export default function BlocksApiPage() {
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
                  Blocks
                </h1>
                <span className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full font-medium">
                  Functional Group
                </span>
              </div>
              
              <p className="text-xl text-gray-600 mb-6">
                Test organization and scoping utilities that create isolated environments 
                for type-level testing. Blocks provide structure and context for assertions, 
                enabling clean test organization with minimal overhead.
              </p>
            </header>

            {/* Overview */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
              
              <p className="text-lg text-gray-600 mb-6">
                Blocks are the organizational backbone of typist testing. They provide scoped environments 
                where type assertions can be grouped logically, preventing namespace pollution while 
                enabling complex type testing workflows. Each block function creates an isolated context 
                that returns its result type, allowing for compositional testing patterns.
              </p>

              <p className="text-lg text-gray-600 mb-6">
                The blocks system enables both simple test organization and sophisticated type computation 
                patterns. Through function closures, blocks avoid interference between test contexts while 
                still allowing result types to be passed through and built upon in downstream tests.
              </p>

              <div className="prose max-w-none mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Block Types and Usage</h3>
                <p className="text-gray-600 mb-4">
                  Each block function serves a specific purpose in organizing type-level testing, 
                  from simple test cases to complex proof construction and practical examples.
                </p>
              </div>
              
              <div className="mb-8">
                <Code language="typescript">{`import { test_, example_, proof_, is_, yes_, $Equal } from '@typefirst/typist'

// Simple test block
test_('Basic type checking', () => {
  is_<string>('hello')
  is_<number>(42)
  yes_<$Equal<'hello', string>>()
})

// Example block with return value
const userExample = example_(() => {
  interface User { name: string; age: number }
  const alice: User = { name: 'Alice', age: 30 }
  is_<User>(alice)
  return alice
})

// Proof block for formal verification
proof_('Type hierarchy validation', () => {
  interface Base { id: string }
  interface Extended extends Base { value: number }
  
  yes_<$Extends<Extended, Base>>()  // ✓ Extended is subtype of Base
  no_<$Equal<Extended, Base>>()     // ✓ But they're not identical
})`}</Code>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Integration Workflow</h3>

              <p className="text-gray-600 mb-4">
                Blocks integrate seamlessly with other typist functional groups to provide complete testing capabilities:
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Blocks → Assertions</h4>
                  <p className="text-gray-600 text-sm">
                    Block functions create contexts where <Link href="/docs/typist/assertions" className="text-blue-600 underline">assertion functions</Link> like <code>is_</code>, <code>yes_</code>, and <code>no_</code> 
                    can be organized and executed without interference.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Blocks → Verdicts</h4>
                  <p className="text-gray-600 text-sm">
                    Blocks provide scoped environments for testing <Link href="/docs/typist/verdicts" className="text-blue-600 underline">verdict types</Link> from comparisons, 
                    organizing complex type relationship validation into readable test structures.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Compositional Testing</h4>
                  <p className="text-gray-600 text-sm">
                    Block return types can be composed and built upon, enabling sophisticated testing patterns 
                    where the results of one block inform the testing in subsequent blocks.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Code language="typescript">{`// Compositional block workflow
const baseTypes = example_(() => {
  type UserId = string & { readonly brand: unique symbol }
  type UserName = string & { readonly brand: unique symbol }
  return { UserId, UserName } as const
})

const userValidation = test_('User type validation', () => {
  // Build on previous block results
  type UserId = typeof baseTypes.UserId
  type UserName = typeof baseTypes.UserName
  
  interface User {
    id: UserId
    name: UserName
    email: string
  }
  
  // Test the composed types
  is_<User>({ 
    id: 'user-123' as UserId, 
    name: 'Alice' as UserName, 
    email: 'alice@example.com' 
  })
})`}</Code>
              </div>
            </section>

            {/* API Reference */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">API Reference</h2>
              
              <div className="space-y-8">
                {/* test_ Block */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TestTube className="h-6 w-6 text-blue-600" />
                    Test Block
                  </h3>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      <code>test_(label?, fn)</code>
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Creates a scoped testing environment for organizing type assertions. 
                      Supports both labeled and unlabeled forms for flexible test organization.
                    </p>
                    <Code language="typescript">{'// Signature overloads\nexport function test_<T>(fn: (a: any) => T): T\nexport function test_<T>(label: string, fn: (a: any) => T): T'}</Code>
                    <div className="mt-4 space-y-4">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Basic Usage</h5>
                        <Code language="typescript">{`// Simple test block
test_(() => {
  is_<string>('hello')
  yes_<$Equal<number, number>>()
})

// Labeled test block for clarity
test_('String validation', () => {
  type Name = string & { readonly __brand: 'Name' }
  const userName: Name = 'alice' as Name
  is_<Name>(userName)
  is_<string>(userName)  // ✓ Branded type extends base type
})`}</Code>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Type Return Integration</h5>
                        <Code language="typescript">{`// test_ returns the function's return type
const resultType = test_('Complex type creation', () => {
  interface ComplexType {
    nested: {
      value: string
      computed: ReturnType<typeof someFunction>
    }
  }
  return {} as ComplexType
})

// Use the returned type in subsequent tests
type ExtractedType = typeof resultType`}</Code>
                      </div>
                    </div>
                  </div>
                </div>

                {/* example_ Block */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="h-6 w-6 text-green-600" />
                    Example Block
                  </h3>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      <code>example_(fn)</code>
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Creates practical demonstration contexts that showcase real-world usage patterns. 
                      Designed for building reusable examples that other code can reference.
                    </p>
                    <Code language="typescript">{`// Signature
export function example_<T>(fn: (a: any) => T): T `}</Code>
                    <div className="mt-4 space-y-4">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Practical Demonstrations</h5>
                        <Code language="typescript">{`// Create reusable example
const tupleExample = example_(() => {
  const tuple = <const T extends readonly string[]>(...args: T): T => args
  const fruits = tuple('apple', 'banana', 'cherry')
  is_<typeof fruits>(['apple', 'banana', 'cherry'])
  is_<readonly ['apple', 'banana', 'cherry']>(fruits)
  return { tuple, fruits } 
})
  
// Use example results in other contexts
const { tuple, fruits } = tupleExample
is_<typeof fruits[0]>('apple')  // ✓ Literal type preserved `}</Code>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Async Pattern Support</h5>
                        <Code language="typescript">{`// Examples can handle async patterns
const asyncExample = example_(async () => {
  type ApiResponse<T> = {
    data: T
    status: 200 | 404 | 500
  }
  
  const response: ApiResponse<User[]> = await fetchUsers()
  is_<User[]>(response.data)
  is_<200 | 404 | 500>(response.status)
  
  return response
})`}</Code>
                      </div>
                    </div>
                  </div>
                </div>

                {/* proof_ Block */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="h-6 w-6 text-purple-600" />
                    Proof Block
                  </h3>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      <code>proof_(label?, fn)</code>
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Creates formal verification contexts for proving type-level properties and relationships. 
                      Ideal for mathematical-style proofs and property validation.
                    </p>
                    <Code language="typescript">{'// Signature (same overloads as test_)\nexport function proof_<T>(fn: (a: any) => T): T\nexport function proof_<T>(label: string, fn: (a: any) => T): T'}</Code>
                    <div className="mt-4 space-y-4">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Formal Property Verification</h5>
                        <Code language="typescript">{`// Prove type system properties
proof_('Union distributivity over intersection', () => {
  type Distributive<A, B, C> = A & (B | C) extends (A & B) | (A & C) ? true : false
  
  yes_<Distributive<string, number, boolean>>()  // ✓ Property holds
  yes_<Distributive<{ a: 1 }, { b: 2 }, { c: 3 }>>()  // ✓ For object types too
})

proof_('Function type contravariance', () => {
  type IsContravariant<A, B, F> = 
    A extends B 
      ? ((arg: A) => unknown) extends ((arg: B) => unknown)
        ? false  // Covariant - wrong!
        : true   // Contravariant - correct!
      : false
      
  yes_<IsContravariant<'hello', string, (x: string) => void>>()  // ✓ Proven
})`}</Code>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Complex Type Theorems</h5>
                        <Code language="typescript">{`// Prove complex relationships
proof_('Generic invariant preservation', () => {
  type PreservesInvariant<T> = {
    value: T
    update: (fn: (current: T) => T) => PreservesInvariant<T>
  }
  
  // Prove the invariant holds through transformations
  type StringInvariant = PreservesInvariant<string>
  type NumberInvariant = PreservesInvariant<number>
  
  yes_<$Extends<StringInvariant['update'], (fn: (current: string) => string) => StringInvariant>>()
  no_<$Equal<StringInvariant, NumberInvariant>>()  // ✓ Different parameterizations are distinct
})`}</Code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Key Patterns */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Patterns</h2>
              
              <p className="text-lg text-gray-600 mb-8">
                Master these essential block patterns to organize effective type testing and build sophisticated 
                verification workflows. Each pattern demonstrates practical techniques for structuring type-level tests.
              </p>

              <div className="space-y-10">
                {/* Pattern 1: Test Organization and Scoping */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Test Organization and Scoping</h3>
                  <p className="text-gray-600 mb-4">
                    Use labeled blocks to organize related tests and create clear documentation of what 
                    each test section validates. This pattern prevents namespace pollution and improves readability.
                  </p>
                  <Code language="typescript">{`import { test_, is_, yes_, no_, $Equal, $Extends } from '@typefirst/typist'

test_('User type system validation', () => {
  // Define types in isolated scope
  interface BaseUser {
    id: string
    email: string
  }
  
  interface AdminUser extends BaseUser {
    permissions: string[]
    lastLogin: Date
  }
  
  interface GuestUser extends BaseUser {
    temporaryAccess: boolean
  }
  
  // Test inheritance relationships
  yes_<$Extends<AdminUser, BaseUser>>()
  yes_<$Extends<GuestUser, BaseUser>>()
  no_<$Equal<AdminUser, GuestUser>>()
  
  // Test concrete instances
  const admin: AdminUser = {
    id: 'admin-123',
    email: 'admin@example.com',
    permissions: ['read', 'write', 'delete'],
    lastLogin: new Date()
  }
  
  is_<AdminUser>(admin)
  is_<BaseUser>(admin)  // ✓ Subtype relationship works
})

test_('API response type validation', () => {
  // Separate test scope for API types
  type ApiResponse<T> = {
    success: boolean
    data: T
    errors?: string[]
  }
  
  type UserResponse = ApiResponse<AdminUser[]>
  
  // Test response structure
  const response: UserResponse = {
    success: true,
    data: [admin],  // Note: admin from previous scope not accessible
    errors: undefined
  }
  
  is_<boolean>(response.success)
  is_<AdminUser[]>(response.data)
})`}</Code>
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Link 
                      href="/typescape/typist-intro"
                      className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium"
                    >
                      🏗️ Explore in Typist Introduction Typescape
                    </Link>
                  </div>
                </div>

                {/* Pattern 2: Compositional Example Building */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Compositional Example Building</h3>
                  <p className="text-gray-600 mb-4">
                    Build complex examples by composing simpler ones, creating reusable building blocks 
                    that can be referenced and extended in subsequent tests and examples.
                  </p>
                  <Code language="typescript">{`import { example_, test_, is_, yes_, $Equal, t_ } from '@typefirst/typist'

// Base tuple utilities
const tupleUtilities = example_(() => {
  const tuple = <const T extends readonly string[]>(...args: T): T => args
  
  type Head<T extends readonly any[]> = T extends readonly [infer H, ...any[]] ? H : never
  type Tail<T extends readonly any[]> = T extends readonly [any, ...infer R] ? R : never
  type Last<T extends readonly any[]> = T extends readonly [...any[], infer L] ? L : never
  
  return { tuple, Head, Tail, Last }
})

// Build on base utilities
const advancedTupleOps = example_(() => {
  const { tuple, Head, Tail, Last } = tupleUtilities
  
  type Join<A extends readonly any[], B extends readonly any[]> = [...A, ...B]
  type Reverse<T extends readonly any[]> = 
    T extends readonly [...infer Rest, infer Last]
      ? [Last, ...Reverse<Rest>]
      : []
  
  const colors = tuple('red', 'green', 'blue')
  const numbers = tuple('1', '2', '3')
  
  // Test type operations
  type FirstColor = Head<typeof colors>  // 'red'
  type LastNumber = Last<typeof numbers>  // '3'
  type Combined = Join<typeof colors, typeof numbers>  // ['red', 'green', 'blue', '1', '2', '3']
  
  yes_<$Equal<FirstColor, 'red'>>()
  yes_<$Equal<LastNumber, '3'>>()
  is_<Combined>(['red', 'green', 'blue', '1', '2', '3'])
  
  return { Join, Reverse, colors, numbers, Combined }
})

// Use composed examples in tests
test_('Tuple operation validation', () => {
  const { Join, Reverse, colors, numbers } = advancedTupleOps
  
  // Test reverse operation
  type ReversedColors = Reverse<typeof colors>  // ['blue', 'green', 'red']
  yes_<$Equal<ReversedColors, ['blue', 'green', 'red']>>()
  
  // Test complex compositions
  type ReversedJoin = Reverse<Join<typeof colors, typeof numbers>>
  yes_<$Equal<ReversedJoin, ['3', '2', '1', 'blue', 'green', 'red']>>()
})`}</Code>
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <Link 
                      href="/typescape/typist-tuple-manipulation"
                      className="inline-flex items-center gap-2 text-green-700 hover:text-green-900 font-medium"
                    >
                      🔧 Explore in Tuple Manipulation Typescape
                    </Link>
                  </div>
                </div>

                {/* Pattern 3: Formal Proof Construction */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Formal Proof Construction</h3>
                  <p className="text-gray-600 mb-4">
                    Use proof blocks to establish type-level theorems and verify complex properties. 
                    This pattern enables mathematical-style reasoning about type relationships and system properties.
                  </p>
                  <Code language="typescript">{`import { proof_, yes_, no_, $Equal, $Extends, never_ } from '@typefirst/typist'

proof_('Functor laws for Maybe type', () => {
  type Maybe<T> = { tag: 'some'; value: T } | { tag: 'none' }
  
  type FMap<F, A> = F extends { tag: 'some'; value: infer V }
    ? { tag: 'some'; value: A extends (x: V) => infer R ? R : never }
    : { tag: 'none' }
  
  // Identity law: fmap(id) = id
  type Identity<T> = (x: T) => T
  type IdentityLaw<T> = $Equal<FMap<Maybe<T>, Identity<T>>, Maybe<T>>
  yes_<IdentityLaw<string>>()
  yes_<IdentityLaw<number>>()
  
  // Composition law: fmap(g ∘ f) = fmap(g) ∘ fmap(f)  
  type Compose<F, G> = <T>(x: T) => F extends (y: any) => infer R1
    ? G extends (z: R1) => infer R2 ? R2 : never
    : never
    
  // For practical purposes, verify the law holds for specific functions
  type DoubleString = (x: string) => string
  type StringLength = (x: string) => number
  type Composed = Compose<StringLength, (x: number) => boolean>
  
  // Verify composition preserves structure
  yes_<$Equal<
    FMap<FMap<Maybe<string>, StringLength>, (x: number) => boolean>,
    FMap<Maybe<string>, Composed>
  >>()
})

proof_('Distributive property of union over intersection', () => {
  // Prove: A & (B | C) ≡ (A & B) | (A & C)
  type DistributesLeft<A, B, C> = $Equal<A & (B | C), (A & B) | (A & C)>
  
  // Test with concrete types
  yes_<DistributesLeft<string, number, boolean>>()
  yes_<DistributesLeft<{ a: 1 }, { b: 2 }, { c: 3 }>>()
  
  // Test edge cases
  yes_<DistributesLeft<never, string, number>>()  // never & anything = never
  yes_<DistributesLeft<unknown, string, number>>() // unknown & anything = anything
})

proof_('Type-level arithmetic properties', () => {
  // Define type-level natural numbers
  type Zero = []
  type Succ<N extends readonly any[]> = [...N, any]
  type Add<A extends readonly any[], B extends readonly any[]> = [...A, ...B]
  
  type One = Succ<Zero>     // [any]
  type Two = Succ<One>      // [any, any]  
  type Three = Succ<Two>    // [any, any, any]
  
  // Prove commutativity: A + B = B + A
  yes_<$Equal<Add<One, Two>, Add<Two, One>>>()    // [any, any, any] = [any, any, any]
  yes_<$Equal<Add<Two, Three>, Add<Three, Two>>>()
  
  // Prove associativity: (A + B) + C = A + (B + C)
  yes_<$Equal<Add<Add<One, Two>, Three>, Add<One, Add<Two, Three>>>>()
  
  // Prove identity: A + 0 = A
  yes_<$Equal<Add<Two, Zero>, Two>>()
  yes_<$Equal<Add<Zero, Three>, Three>>()
})`}</Code>
                  <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <Link 
                      href="/typescape/typist-advanced-patterns"
                      className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium"
                    >
                      🎓 Explore in Advanced Patterns Typescape
                    </Link>
                  </div>
                </div>

                {/* Pattern 4: Registry and Configuration Patterns */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Registry and Configuration Patterns</h3>
                  <p className="text-gray-600 mb-4">
                    Use blocks to build type-safe registries and configuration systems that maintain 
                    compile-time guarantees while providing runtime functionality.
                  </p>
                  <Code language="typescript">{`import { example_, test_, is_, yes_, $Equal, has_ } from '@typefirst/typist'

const registrySystem = example_(() => {
  // Type-safe registry builder
  type RegistryEntry<T> = {
    id: string
    data: T
    metadata: {
      created: Date
      version: number
    }
  }
  
  type Registry<T extends Record<string, any>> = {
    entries: { [K in keyof T]: RegistryEntry<T[K]> }
    get: <K extends keyof T>(key: K) => T[K]
    has: <K extends keyof T>(key: K) => boolean
    keys: () => (keyof T)[]
  }
  
  const createRegistry = <T extends Record<string, any>>(
    config: { [K in keyof T]: T[K] }
  ): Registry<T> => {
    const entries = {} as Registry<T>['entries']
    
    Object.keys(config).forEach(key => {
      entries[key as keyof T] = {
        id: key,
        data: config[key as keyof T],
        metadata: {
          created: new Date(),
          version: 1
        }
      }
    })
    
    return {
      entries,
      get: (key) => entries[key].data,
      has: (key) => key in entries,
      keys: () => Object.keys(entries) as (keyof T)[]
    }
  }
  
  return { RegistryEntry, Registry, createRegistry }
})

test_('Registry type safety validation', () => {
  const { createRegistry } = registrySystem
  
  // Create typed registry
  const appConfig = createRegistry({
    apiUrl: 'https://api.example.com',
    maxRetries: 3,
    features: {
      auth: true,
      analytics: false,
      debugMode: true
    }
  })
  
  // Test type preservation
  is_<string>(appConfig.get('apiUrl'))
  is_<number>(appConfig.get('maxRetries'))
  is_<{ auth: boolean; analytics: boolean; debugMode: boolean }>(appConfig.get('features'))
  
  // Test key validation
  yes_<$Equal<ReturnType<typeof appConfig.keys>, ('apiUrl' | 'maxRetries' | 'features')[]>>()
  
  // Verify registry structure
  has_<'get', (key: 'apiUrl' | 'maxRetries' | 'features') => any>(appConfig)
  has_<'has', (key: 'apiUrl' | 'maxRetries' | 'features') => boolean>(appConfig)
})

const enumRegistry = example_(() => {
  // Enum-like registry with type safety
  type Color = 'red' | 'green' | 'blue'
  type Status = 'active' | 'inactive' | 'pending'
  
  const Colors = createRegistry({
    red: '#FF0000',
    green: '#00FF00', 
    blue: '#0000FF'
  } satisfies Record<Color, string>)
  
  const StatusMessages = createRegistry({
    active: 'System is running',
    inactive: 'System is stopped',
    pending: 'System is starting up'
  } satisfies Record<Status, string>)
  
  return { Color, Status, Colors, StatusMessages }
})`}</Code>
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <Link 
                      href="/typescape/typist-registry-patterns"
                      className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 font-medium"
                    >
                      📚 Explore in Registry Patterns Typescape
                    </Link>
                  </div>
                </div>

                {/* Pattern 5: Error Boundary Testing */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Error Boundary Testing</h3>
                  <p className="text-gray-600 mb-4">
                    Use blocks to test error conditions and edge cases, ensuring that type systems 
                    behave correctly at boundaries and with invalid inputs.
                  </p>
                  <Code language="typescript">{`import { test_, is_, never_, yes_, no_, $Equal, $Extends } from '@typefirst/typist'

test_('Exhaustive union handling', () => {
  type Shape = 
    | { type: 'circle'; radius: number }
    | { type: 'rectangle'; width: number; height: number }
    | { type: 'triangle'; base: number; height: number }
  
  // Exhaustive handler must cover all cases
  const handleShape = (shape: Shape): number => {
    switch (shape.type) {
      case 'circle':
        return Math.PI * shape.radius ** 2
      case 'rectangle':
        return shape.width * shape.height
      case 'triangle':
        return (shape.base * shape.height) / 2
      // If we miss a case, TypeScript will catch it
      default:
        // This should be never if all cases are handled
        const exhaustive: never = shape
        throw new Error(\`Unhandled shape type: \$\{exhaustive\}\`)
    }
  }
  
  // Test that all cases are properly typed
  const circle: Shape = { type: 'circle', radius: 5 }
  const rectangle: Shape = { type: 'rectangle', width: 10, height: 20 }
  const triangle: Shape = { type: 'triangle', base: 15, height: 8 }
  
  is_<number>(handleShape(circle))
  is_<number>(handleShape(rectangle))
  is_<number>(handleShape(triangle))
})

test_('Invalid operation detection', () => {
  // Test operations that should result in never
  type InvalidIntersection = string & number  // never
  type EmptyArray<T> = T extends any[] ? (T extends [any, ...any[]] ? never : T) : never
  type NonEmptyArray<T> = T extends [any, ...any[]] ? T : never
  
  never_<InvalidIntersection>()
  never_<EmptyArray<[1, 2, 3]>>()
  never_<NonEmptyArray<[]>>()
  
  // Test valid operations
  yes_<$Equal<EmptyArray<[]>, []>>()
  yes_<$Equal<NonEmptyArray<[1, 2, 3]>, [1, 2, 3]>>()
})

test_('Constraint boundary testing', () => {
  // Test generic constraints at their limits
  type RequiresString<T extends string> = T
  type RequiresObject<T extends object> = T
  type RequiresFunction<T extends (...args: any[]) => any> = T
  
  // Valid constraints
  is_<RequiresString<'hello'>>('hello')
  is_<RequiresObject<{ a: 1 }>>({ a: 1 })
  is_<RequiresFunction<(x: number) => string>>((x: number) => 'test')
  
  // Test edge cases
  is_<RequiresObject<[]>>([])        // Arrays are objects
  is_<RequiresObject<() => void>>(() => {})  // Functions are objects
  
  // These should fail at compile time (using @ts-expect-error in real code)
  // is_<RequiresString<number>>(42)       // ✗ number doesn't extend string
  // is_<RequiresObject<string>>('hello')  // ✗ primitives aren't objects
  
  // Test union constraint boundaries  
  type StringOrNumber<T extends string | number> = T
  is_<StringOrNumber<'hello'>>('hello')
  is_<StringOrNumber<42>>(42)
  // is_<StringOrNumber<boolean>>(true)    // ✗ boolean not in union
})`}</Code>
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <Link 
                      href="/typescape/typist-enum-guards"
                      className="inline-flex items-center gap-2 text-red-700 hover:text-red-900 font-medium"
                    >
                      🛡️ Explore in Enum Guards Typescape
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Related Functional Groups */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Functional Groups</h2>
              
              <p className="text-gray-600 mb-6">
                Blocks work closely with other typist functional groups to provide complete testing organization:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Link href="/docs/typist/assertions" className="group block p-6 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3 group-hover:text-blue-700">
                    Assertions <ExternalLink className="inline h-4 w-4 ml-1" />
                  </h3>
                  <p className="text-blue-800 mb-3">
                    Functions that perform type testing within block contexts. Blocks provide 
                    the organizational structure while assertions provide the testing mechanisms.
                  </p>
                  <div className="text-sm text-blue-600">
                    <strong>Key Functions:</strong> is_, yes_, no_, extends_
                  </div>
                </Link>

                <Link href="/docs/typist/verdicts" className="group block p-6 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors">
                  <h3 className="text-lg font-semibold text-orange-900 mb-3 group-hover:text-orange-700">
                    Verdicts <ExternalLink className="inline h-4 w-4 ml-1" />
                  </h3>
                  <p className="text-orange-800 mb-3">
                    Result types that encode comparison outcomes tested within blocks. 
                    Blocks provide contexts for organizing complex verdict testing workflows.
                  </p>
                  <div className="text-sm text-orange-600">
                    <strong>Key Types:</strong> $Yes, $No, $Maybe
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