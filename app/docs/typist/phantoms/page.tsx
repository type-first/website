import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { buildDocNavigation } from '@/lib/content/doc.model';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { Code } from '@/lib/content/ui/code.cmp.iso';
import Link from 'next/link';
import { ArrowLeft, Zap, Settings, Bug, Layers } from 'lucide-react';

export async function generateMetadata() {
  return {
    title: 'Phantoms - Typist API Reference',
    description: 'Phantom value operators and zero-cost type abstractions. Create phantom values with t_, type_, and related utilities for type-level programming.',
  };
}

export default function PhantomsApiPage() {
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
                  Phantoms
                </h1>
                <span className="px-3 py-1 text-sm bg-emerald-100 text-emerald-800 rounded-full font-medium">
                  Functional Group
                </span>
              </div>
              
              <p className="text-xl text-gray-600 mb-6">
                Phantom value operators and zero-cost type abstractions. Create type-level values 
                without runtime overhead for pure type-level programming and symbolic computation.
              </p>
            </header>

            {/* Overview */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
              
              <p className="text-lg text-gray-600 mb-6">
                Phantoms are the foundation of typist's type-level programming capabilities. They enable 
                "lying to the compiler" in a controlled way, creating values that exist only at compile-time 
                while carrying rich type information. This technique allows pure type manipulation without 
                any runtime cost, enabling sophisticated static analysis and symbolic computation.
              </p>

              <p className="text-lg text-gray-600 mb-6">
                The core phantom operators transform any type into a symbolic value using type assertion. 
                By leveraging TypeScript's structural type system, phantoms enable treating types as 
                first-class values that can be passed, manipulated, and composed in expressions.
              </p>

              <div className="prose max-w-none mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Zero-Cost Abstractions</h3>
                <p className="text-gray-600 mb-4">
                  Phantom values provide the fundamental abstraction layer for type-level programming. 
                  They enable complex type relationships and constraints with zero runtime overhead.
                </p>
              </div>
              
              <div className="mb-8">
                <Code language="typescript">{`import { t_, type_, t, phantom_ } from '@typefirst/typist'

// Core phantom value creation - all equivalent
const stringValue = t_<string>()
const numberValue = type_<number>()
const boolValue = t<boolean>()
const objectValue = phantom_<{ name: string }>()

// Extract types from phantom values
type StringType = typeof stringValue  // string
type NumberType = typeof numberValue  // number

// Complex phantom types for advanced patterns
const apiResponse = t_<{
  data: User[]
  status: 200 | 404 | 500
  meta: { total: number; page: number }
}>()

// Use phantom values in type-level operations
type ResponseData = typeof apiResponse.data  // User[]
type StatusCode = typeof apiResponse.status  // 200 | 404 | 500`}</Code>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Integration Workflow</h3>

              <p className="text-gray-600 mb-4">
                Phantoms integrate seamlessly with other typist functional groups as the foundational layer:
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Phantoms → Assertions</h4>
                  <p className="text-gray-600 text-sm">
                    Phantom values enable pure type-level testing with `is_`, `extends_`, and `has_`, 
                    allowing assertions without requiring runtime values.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Phantoms → Blocks</h4>
                  <p className="text-gray-600 text-sm">
                    Block functions like `test_`, `example_`, and `proof_` internally use phantom values 
                    to return symbolic results while maintaining type information.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Type-Value Bridging</h4>
                  <p className="text-gray-600 text-sm">
                    Phantom values bridge the gap between TypeScript's type system and JavaScript's 
                    value system, enabling seamless integration with runtime code.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Code language="typescript">{`// Phantom-driven testing workflow
import { t_, is_, extends_, example_ } from '@typefirst/typist'

// Create phantom values for testing
const userId = t_<UserId>()
const userEmail = t_<EmailAddress>()
const adminUser = t_<AdminUser>()

// Test type relationships using phantom values
is_<string>(userId)           // ✓ UserId extends string
extends_(adminUser, t_<User>())  // ✓ AdminUser extends User

// Use in block patterns
const userValidation = example_('User type system', () => {
  const user = t_<User>()
  const admin = t_<AdminUser>()
  
  extends_(admin, user)  // ✓ Verify inheritance
  is_<User>(admin)       // ✓ Test assignability
  
  return { user, admin }
})`}</Code>
              </div>
            </section>

            {/* API Reference */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">API Reference</h2>
              
              <div className="space-y-8">
                {/* t_ Phantom Operator */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="h-6 w-6 text-emerald-600" />
                    Primary Phantom Operator
                  </h3>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      <code>t_&lt;T&gt;(value?)</code>
                    </h4>
                    <p className="text-gray-600 mb-3">
                      The core phantom value creator. Transforms any type into a symbolic value 
                      with zero runtime overhead. The primary interface for type-level programming.
                    </p>
                    <Code language="typescript">{`// Signature
export const t_ = <T>(value: unknown = null): T => value as T`}</Code>
                    <div className="mt-4 space-y-4">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Basic Usage</h5>
                        <Code language="typescript">{`// Create phantom values for any type
const str = t_<string>()
const num = t_<number>()
const user = t_<User>()

// Optional value parameter (typically unused)
const custom = t_<string>('phantom')  // Still returns null as T

// Complex generic types
const response = t_<ApiResponse<User[]>>()
const promise = t_<Promise<Result<Data, Error>>>()`}</Code>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Type-Level Operations</h5>
                        <Code language="typescript">{`// Extract types from phantom values
type StringType = typeof t_<string>()     // string
type UserType = typeof t_<User>()         // User

// Use in conditional types
type IsString<T> = typeof t_<T>() extends string ? true : false
type Check1 = IsString<string>            // true
type Check2 = IsString<number>            // false

// Phantom-driven generic functions
function validateType<T>() {
  const phantom = t_<T>()
  // Type is now available for compile-time checks
  return phantom
}`}</Code>
                      </div>
                    </div>
                  </div>
                </div>

                {/* type_ Alias */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Settings className="h-6 w-6 text-blue-600" />
                    Alternative Phantom Operators
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>type_&lt;T&gt;(value?)</code>, <code>t&lt;T&gt;(value?)</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Alternative names for `t_` providing stylistic flexibility. 
                        All three operators are functionally identical.
                      </p>
                      <Code language="typescript">{`// All equivalent - choose your preferred style
const value1 = t_<string>()      // Underscore style (recommended)
const value2 = type_<string>()   // Descriptive style
const value3 = t<string>()       // Minimal style

// Use consistently within a project
export const phantom = t_        // Alias for your preferred style`}</Code>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>phantom_&lt;T&gt;(value?)</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Explicit phantom value creator for enhanced clarity. 
                        Functionally identical to `t_` but with more descriptive naming.
                      </p>
                      <Code language="typescript">{`import { phantom_ } from '@typefirst/typist'

// Explicit phantom creation for clarity
const userPhantom = phantom_<User>()
const configPhantom = phantom_<AppConfig>()

// Particularly useful in complex type computations
function createTypeRegistry<T extends Record<string, any>>() {
  const registry = phantom_<{
    [K in keyof T]: { type: T[K]; phantom: T[K] }
  }>()
  
  return registry
}`}</Code>
                    </div>
                  </div>
                </div>

                {/* Advanced Phantom Operators */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Layers className="h-6 w-6 text-purple-600" />
                    Advanced Phantom Utilities
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>assign_&lt;T&gt;(value)</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Identity phantom operator that preserves the input value while ensuring type safety. 
                        Useful for type assertions and runtime-to-phantom bridging.
                      </p>
                      <Code language="typescript">{`// Signature: <T>(value: T): T
const assign_ = <T>(v: T): T => v as T

// Bridge runtime and phantom types
const userData = { name: 'Alice', age: 30 }
const typedUser = assign_<User>(userData)  // Runtime value with User type

// Use in validation chains
function processUser<T extends User>(user: T): T {
  return assign_(user)  // Ensure type preservation
}`}</Code>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>widen_&lt;T&gt;(value)</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Widens literal types to their broader types while preserving const assertions. 
                        Useful for controlling type inference in phantom operations.
                      </p>
                      <Code language="typescript">{`// Signature: <const T>(value: T) => t_<T>(value)
const widen_ = <const T>(v: T) => t_<T>(v)

// Control literal type widening
const literal = widen_('hello')     // Type: 'hello' (not string)
const array = widen_([1, 2, 3])     // Type: readonly [1, 2, 3]

// Use in phantom type patterns
const config = widen_({
  env: 'development',
  debug: true
} as const)  // Type: { readonly env: 'development'; readonly debug: true }`}</Code>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>force_&lt;T&gt;(value?)</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Forceful phantom creation that bypasses type checking. Use with caution 
                        for advanced type-level programming where safety can be ensured externally.
                      </p>
                      <Code language="typescript">{`// Signature: <T>(value: unknown = null) => t_<T>(value)
const force_ = <T>(v: unknown = null) => t_<T>(v)

// Bypass type constraints (use carefully)
const unsafePhantom = force_<ComplexType>()

// Advanced phantom patterns
function createUntypedRegistry(data: unknown) {
  // Force type when structure is known but not statically provable
  return force_<TypedRegistry>(data)
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
                Master these essential phantom patterns to unlock powerful type-level programming capabilities. 
                Each pattern demonstrates practical techniques for zero-cost abstractions and symbolic computation.
              </p>

              <div className="space-y-10">
                {/* Pattern 1: Branded Type Creation */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Branded Type Creation and Testing</h3>
                  <p className="text-gray-600 mb-4">
                    Use phantom values to create and test branded types, enabling nominal typing patterns 
                    that prevent common mistakes while maintaining runtime compatibility.
                  </p>
                  <Code language="typescript">{`import { t_, is_, extends_, yes_, no_, $Equal, $Extends } from '@typefirst/typist'

// Define branded types with phantom fields
type UserId = string & { readonly __brand: 'UserId' }
type EmailAddress = string & { readonly __brand: 'EmailAddress' }
type ProductSku = string & { readonly __brand: 'ProductSku' }

// Create phantom values for testing
const userId = t_<UserId>()
const emailAddress = t_<EmailAddress>()
const productSku = t_<ProductSku>()

// Test brand distinctiveness
no_<$Equal<UserId, EmailAddress>>()     // ✓ Different brands
no_<$Equal<UserId, ProductSku>>()       // ✓ Different brands
no_<$Equal<EmailAddress, ProductSku>>() // ✓ Different brands

// Test runtime compatibility
yes_<$Extends<UserId, string>>()        // ✓ Can be used as string
yes_<$Extends<EmailAddress, string>>()  // ✓ Runtime compatibility
extends_(userId, t_<string>())          // ✓ Phantom-based test

// Test phantom value relationships
is_<string>(userId)                     // ✓ UserId is assignable to string
is_<UserId>(userId)                     // ✓ Identity assertion

// Factory functions with phantom validation
function createUserId(id: string): UserId {
  // Runtime validation
  if (!id.startsWith('user_')) {
    throw new Error('Invalid user ID format')
  }
  
  // Phantom-based compile-time validation
  const phantom = t_<UserId>()
  extends_(phantom, t_<string>())  // ✓ Verify base type compatibility
  
  return id as UserId
}`}</Code>
                  <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <Link 
                      href="/typescape/typist-phantom-types-basics"
                      className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-medium"
                    >
                      🏷️ Explore in Phantom Types Basics Typescape
                    </Link>
                  </div>
                </div>

                {/* Pattern 2: Type-Level State Machines */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Type-Level State Machines</h3>
                  <p className="text-gray-600 mb-4">
                    Model complex state transitions using phantom types and conditional type patterns. 
                    This enables compile-time verification of state machine correctness.
                  </p>
                  <Code language="typescript">{`import { t_, test_, yes_, no_, $Equal, $Extends } from '@typefirst/typist'

// State machine phantom types
type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error'

type Connection<TState extends ConnectionState> = {
  readonly __state: TState  // phantom state field
  readonly id: string
} & (
  TState extends 'disconnected' ? { connect(): Connection<'connecting'> } :
  TState extends 'connecting' ? { cancel(): Connection<'disconnected'> } :
  TState extends 'connected' ? { 
    send(data: string): void
    disconnect(): Connection<'disconnected'>
  } :
  TState extends 'error' ? { retry(): Connection<'connecting'> } :
  never
)

// Create phantom connections for testing
const disconnected = t_<Connection<'disconnected'>>()
const connecting = t_<Connection<'connecting'>>()
const connected = t_<Connection<'connected'>>()
const error = t_<Connection<'error'>>()

test_('Connection state machine validation', () => {
  // Test state-specific method availability
  yes_<$Extends<typeof disconnected, { connect(): any }>>()
  no_<$Extends<typeof disconnected, { send(data: string): void }>>()
  
  yes_<$Extends<typeof connecting, { cancel(): any }>>()
  no_<$Extends<typeof connecting, { connect(): any }>>()
  
  yes_<$Extends<typeof connected, { send(data: string): void }>>()
  yes_<$Extends<typeof connected, { disconnect(): any }>>()
  no_<$Extends<typeof connected, { connect(): any }>>()
  
  yes_<$Extends<typeof error, { retry(): any }>>()
  no_<$Extends<typeof error, { send(data: string): void }>>()
  
  // Test state transitions
  type FromDisconnected = ReturnType<typeof disconnected.connect>
  yes_<$Equal<FromDisconnected, Connection<'connecting'>>>()
  
  type FromConnecting = ReturnType<typeof connecting.cancel>
  yes_<$Equal<FromConnecting, Connection<'disconnected'>>>()
  
  return t_<boolean>()
})`}</Code>
                  <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <Link 
                      href="/typescape/typist-advanced-patterns"
                      className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium"
                    >
                      🎭 Explore in Advanced Patterns Typescape
                    </Link>
                  </div>
                </div>

                {/* Pattern 3: Units of Measure */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Units of Measure and Dimensional Analysis</h3>
                  <p className="text-gray-600 mb-4">
                    Encode units of measurement in phantom types to prevent unit confusion and enable 
                    compile-time dimensional analysis without runtime overhead.
                  </p>
                  <Code language="typescript">{`import { t_, is_, test_, yes_, no_, $Equal } from '@typefirst/typist'

// Unit phantom types
type Meters = number & { readonly __unit: 'meters' }
type Feet = number & { readonly __unit: 'feet' }
type Seconds = number & { readonly __unit: 'seconds' }
type MetersPerSecond = number & { readonly __unit: 'meters/second' }

// Phantom unit values
const meters = t_<Meters>()
const feet = t_<Feet>()
const seconds = t_<Seconds>()
const speed = t_<MetersPerSecond>()

// Unit conversion functions with phantom validation
function metersToFeet(distance: Meters): Feet {
  // Phantom-based input validation
  is_<Meters>(distance)
  
  const result = (distance * 3.28084) as Feet
  
  // Phantom-based output validation
  is_<Feet>(result)
  return result
}

function calculateSpeed(distance: Meters, time: Seconds): MetersPerSecond {
  // Phantom-based parameter validation
  is_<Meters>(distance)
  is_<Seconds>(time)
  
  const result = (distance / time) as MetersPerSecond
  
  // Phantom-based result validation
  is_<MetersPerSecond>(result)
  return result
}

test_('Unit type validation', () => {
  // Test unit distinctiveness
  no_<$Equal<Meters, Feet>>()
  no_<$Equal<Meters, Seconds>>()
  no_<$Equal<Feet, Seconds>>()
  no_<$Equal<MetersPerSecond, Meters>>()
  
  // Test numeric compatibility
  yes_<$Extends<Meters, number>>()
  yes_<$Extends<Feet, number>>()
  yes_<$Extends<Seconds, number>>()
  yes_<$Extends<MetersPerSecond, number>>()
  
  // Test phantom unit operations
  const distance = t_<Meters>()
  const time = t_<Seconds>()
  const velocity = calculateSpeed(distance, time)
  
  is_<MetersPerSecond>(velocity)
  
  return t_<boolean>()
})`}</Code>
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Link 
                      href="/typescape/typist-units-measurement"
                      className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium"
                    >
                      📏 Explore in Units & Measurement Typescape
                    </Link>
                  </div>
                </div>

                {/* Pattern 4: Type-Level Computation */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Type-Level Computation and Symbolic Math</h3>
                  <p className="text-gray-600 mb-4">
                    Use phantom values to perform compile-time computations and mathematical operations 
                    at the type level, enabling sophisticated static analysis and proof construction.
                  </p>
                  <Code language="typescript">{`import { t_, test_, yes_, $Equal, example_ } from '@typefirst/typist'

// Type-level natural numbers using tuple length
type Zero = []
type One = [unknown]
type Two = [unknown, unknown]
type Three = [unknown, unknown, unknown]

type Succ<N extends readonly unknown[]> = [...N, unknown]
type Add<A extends readonly unknown[], B extends readonly unknown[]> = [...A, ...B]

// Phantom arithmetic values
const zero = t_<Zero>()
const one = t_<One>()
const two = t_<Two>()
const three = t_<Three>()

const typeArithmetic = example_('Type-level arithmetic', () => {
  // Test successor function
  type OneFromZero = Succ<Zero>
  yes_<$Equal<OneFromZero, One>>()
  
  type TwoFromOne = Succ<One>
  yes_<$Equal<TwoFromOne, Two>>()
  
  // Test addition
  type OnePlusTwo = Add<One, Two>
  yes_<$Equal<OnePlusTwo, Three>>()
  
  type TwoPlusOne = Add<Two, One>
  yes_<$Equal<TwoPlusOne, Three>>()
  
  // Phantom-based arithmetic verification
  const sum1 = t_<Add<One, Two>>()
  const sum2 = t_<Three>()
  yes_<$Equal<typeof sum1, typeof sum2>>()
  
  return { zero, one, two, three }
})

// Type-level string operations
type Split<S extends string, D extends string> = 
  S extends \`\${infer T}\${D}\${infer U}\` ? [T, ...Split<U, D>] : [S]

type Join<T extends readonly string[], D extends string> = 
  T extends readonly [infer F, ...infer R] 
    ? F extends string
      ? R extends readonly string[]
        ? R extends readonly []
          ? F
          : \`\${F}\${D}\${Join<R, D>}\`
        : never
      : never
    : ''

test_('Type-level string operations', () => {
  // Test string splitting
  type SplitResult = Split<'a,b,c', ','>
  yes_<$Equal<SplitResult, ['a', 'b', 'c']>>()
  
  // Test string joining
  type JoinResult = Join<['a', 'b', 'c'], ','>
  yes_<$Equal<JoinResult, 'a,b,c'>>()
  
  // Phantom string operations
  const splitPhantom = t_<Split<'hello,world', ','>>()
  is_<['hello', 'world']>(splitPhantom)
  
  const joinPhantom = t_<Join<['hello', 'world'], ','>>()
  is_<'hello,world'>(joinPhantom)
  
  return t_<boolean>()
})`}</Code>
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <Link 
                      href="/typescape/typist-type-level-math"
                      className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 font-medium"
                    >
                      🧮 Explore in Type-Level Math Typescape
                    </Link>
                  </div>
                </div>

                {/* Pattern 5: Phantom-Driven Testing */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Phantom-Driven Test Harnesses</h3>
                  <p className="text-gray-600 mb-4">
                    Build comprehensive test suites using phantom values to verify complex type relationships 
                    and ensure type system correctness without requiring runtime test data.
                  </p>
                  <Code language="typescript">{`import { t_, test_, example_, is_, extends_, yes_, no_, $Equal, $Extends } from '@typefirst/typist'

// Complex type system for testing
type Permission = 'read' | 'write' | 'admin'

type User<TPermissions extends Permission[] = Permission[]> = {
  id: string
  name: string
  email: string
  permissions: TPermissions
}

type Admin = User<['admin']>
type Editor = User<['read', 'write']>
type Viewer = User<['read']>

// Phantom test harness
const phantomTestHarness = example_('User permission system validation', () => {
  // Create phantom users for each permission level
  const admin = t_<Admin>()
  const editor = t_<Editor>()
  const viewer = t_<Viewer>()
  const genericUser = t_<User>()
  
  // Test inheritance relationships
  extends_(admin, genericUser)    // ✓ Admin extends User
  extends_(editor, genericUser)   // ✓ Editor extends User  
  extends_(viewer, genericUser)   // ✓ Viewer extends User
  
  // Test permission specificity
  yes_<$Extends<Admin['permissions'], ['admin']>>()
  yes_<$Extends<Editor['permissions'], ['read', 'write']>>()
  yes_<$Extends<Viewer['permissions'], ['read']>>()
  
  // Test structural requirements
  is_<{ id: string }>(admin)
  is_<{ name: string }>(editor)  
  is_<{ email: string }>(viewer)
  is_<{ permissions: Permission[] }>(genericUser)
  
  return { admin, editor, viewer, genericUser }
})

// Advanced phantom testing with conditional types
type CanWrite<T> = T extends User<infer P> 
  ? 'write' extends P[number] ? true : false 
  : false

type CanAdmin<T> = T extends User<infer P>
  ? 'admin' extends P[number] ? true : false
  : false

test_('Permission capability testing', () => {
  // Test write capabilities
  yes_<$Equal<CanWrite<Admin>, true>>()      // Admin can write
  yes_<$Equal<CanWrite<Editor>, true>>()     // Editor can write
  no_<$Equal<CanWrite<Viewer>, true>>()      // Viewer cannot write
  
  // Test admin capabilities  
  yes_<$Equal<CanAdmin<Admin>, true>>()      // Admin has admin rights
  no_<$Equal<CanAdmin<Editor>, true>>()      // Editor doesn't have admin rights
  no_<$Equal<CanAdmin<Viewer>, true>>()      // Viewer doesn't have admin rights
  
  // Phantom-based capability testing
  const admin = t_<Admin>()
  const editor = t_<Editor>() 
  const viewer = t_<Viewer>()
  
  // Use phantom values in type-level functions
  const adminCanWrite = t_<CanWrite<typeof admin>>()
  const viewerCanWrite = t_<CanWrite<typeof viewer>>()
  
  yes_<$Equal<typeof adminCanWrite, true>>()
  yes_<$Equal<typeof viewerCanWrite, false>>()
  
  return t_<boolean>()
})`}</Code>
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <Link 
                      href="/typescape/typist-permission-systems"
                      className="inline-flex items-center gap-2 text-red-700 hover:text-red-900 font-medium"
                    >
                      🔐 Explore in Permission Systems Typescape
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Related Functional Groups */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Functional Groups</h2>
              
              <p className="text-gray-600 mb-6">
                Phantoms form the foundation for all other typist functional groups:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Link href="/docs/typist/assertions" className="group block p-6 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3 group-hover:text-blue-700">
                    Assertions <Bug className="inline h-4 w-4 ml-1" />
                  </h3>
                  <p className="text-blue-800 mb-3">
                    Use phantom values in type assertions like `is_`, `extends_`, and `has_`. 
                    Phantoms enable pure type-level testing without runtime values.
                  </p>
                  <div className="text-sm text-blue-600">
                    <strong>Key Functions:</strong> is_, extends_, has_, never_
                  </div>
                </Link>

                <Link href="/docs/typist/blocks" className="group block p-6 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3 group-hover:text-purple-700">
                    Blocks <Layers className="inline h-4 w-4 ml-1" />
                  </h3>
                  <p className="text-purple-800 mb-3">
                    Block functions internally use phantom values to return symbolic results. 
                    Phantoms enable the zero-cost abstraction pattern for test organization.
                  </p>
                  <div className="text-sm text-purple-600">
                    <strong>Key Functions:</strong> test_, example_, proof_
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