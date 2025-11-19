import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { buildDocNavigation } from '@/lib/content/doc.model';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { Code } from '@/lib/content/ui/code.cmp.iso';
import Link from 'next/link';
import { ArrowLeft, Zap, RefreshCw, Settings, Combine, Target, Plus } from 'lucide-react';

export async function generateMetadata() {
  return {
    title: 'Operators - Typist API Reference',
    description: 'Core phantom value operators and type manipulation utilities. Transform, compose, and control phantom types with t_, assign_, widen_, and more.',
  };
}

export default function OperatorsApiPage() {
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
                  Operators
                </h1>
                <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
                  Functional Group
                </span>
              </div>
              
              <p className="text-xl text-gray-600 mb-6">
                Core phantom value operators and type manipulation utilities. Transform, compose, and 
                control phantom types for sophisticated type-level programming with zero runtime overhead.
              </p>
            </header>

            {/* Overview */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
              
              <p className="text-lg text-gray-600 mb-6">
                Operators are the atomic building blocks of typist's type-level programming system. They provide 
                the essential utilities for creating, transforming, and composing phantom values. Each operator 
                is designed for specific type manipulation patterns while maintaining the zero-cost abstraction 
                principle that makes typist both powerful and performant.
              </p>

              <p className="text-lg text-gray-600 mb-6">
                The operator system is organized around practical type-level programming needs: phantom value 
                creation, type assertion, constraint specification, intersection composition, and inference control. 
                These utilities enable expressing complex type relationships and computations directly in the 
                type system without runtime overhead.
              </p>

              <div className="prose max-w-none mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Operator Categories</h3>
                <p className="text-gray-600 mb-4">
                  The operators are functionally categorized to provide clear interfaces for different 
                  type-level programming patterns, from basic phantom creation to advanced type composition.
                </p>
              </div>
              
              <div className="mb-8">
                <Code language="typescript">{`import { 
  t_, type_, t,           // Phantom value creation
  assign_, a_,            // Identity and type assertion
  widen_, w_,             // Inference control  
  specify_, s_,           // Type constraint specification
  intersect_,             // Type intersection
  force_, f_,             // Unsafe type coercion
  any_, __                // Any type utilities
} from '@typefirst/typist'

// Create phantom values with different operators
const user = t_<User>()              // Primary phantom creator
const config = type_<AppConfig>()    // Alternative syntax
const data = assign_(runtimeValue)   // Preserve runtime value
const constrained = specify_<string>()<'hello'>()  // Constrained phantom

// Transform and compose phantom types
const widened = widen_(literal)      // Control inference
const intersection = intersect_(userType, adminType)  // Combine types
const anyValue = any_()              // Create any-typed phantom`}</Code>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Integration Workflow</h3>

              <p className="text-gray-600 mb-4">
                Operators integrate seamlessly with other typist functional groups as the foundational layer:
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Operators → Assertions</h4>
                  <p className="text-gray-600 text-sm">
                    Phantom values created by operators enable type assertions with `is_`, `extends_`, 
                    and `has_` without requiring concrete runtime values for testing.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Operators → Blocks</h4>
                  <p className="text-gray-600 text-sm">
                    Block functions like `test_`, `example_`, and `proof_` internally use the `t_` 
                    operator to return symbolic results while preserving type information.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Compositional Programming</h4>
                  <p className="text-gray-600 text-sm">
                    Operators enable compositional type-level programming where the results of one 
                    operator can be transformed by another, building complex type computations.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Code language="typescript">{`// Compositional operator workflow
import { t_, assign_, widen_, specify_, intersect_, is_, extends_ } from '@typefirst/typist'

// Start with runtime data
const userData = { name: 'Alice', age: 30 }

// Apply operators in sequence
const typedUser = assign_<User>(userData)        // Assert runtime type
const widenedUser = widen_(typedUser)            // Control inference
const phantom = t_<typeof widenedUser>()         // Create phantom

// Use in type-level operations  
is_<User>(phantom)                               // Validate phantom
extends_(phantom, t_<{ name: string }>())        // Test structure

// Compose types with intersections
const adminRights = t_<{ permissions: string[] }>()
const adminUser = intersect_(phantom, adminRights)
extends_(adminUser, t_<User & { permissions: string[] }>())  // ✓ Composed type`}</Code>
              </div>
            </section>

            {/* API Reference */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">API Reference</h2>
              
              <div className="space-y-8">
                {/* Core Phantom Creators */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="h-6 w-6 text-blue-600" />
                    Core Phantom Creators
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>t_&lt;T&gt;(value?)</code>, <code>type_&lt;T&gt;(value?)</code>, <code>t&lt;T&gt;(value?)</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Primary phantom value creators with equivalent functionality. The foundational operators 
                        for converting any type into a symbolic value with zero runtime overhead.
                      </p>
                      <Code language="typescript">{`// All equivalent - source implementation
export const type_ = <T>(v: unknown = null): T => v as T
export const t_ = type_
export const t = t_

// Usage variations for stylistic preference
const user1 = t_<User>()        // Underscore style (recommended)
const user2 = type_<User>()     // Descriptive style
const user3 = t<User>()         // Minimal style

// Complex type phantom creation
const response = t_<ApiResponse<User[]>>()
const state = t_<StateMap<'idle' | 'loading' | 'error'>>()`}</Code>
                      
                      <div className="mt-4 space-y-4">
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">Type Inference Control</h5>
                          <Code language="typescript">{`// Control generic inference with explicit type parameters
function createValidator<T>() {
  const phantom = t_<T>()
  return (value: unknown): value is T => {
    // Use phantom for type-level validation logic
    return typeof value === typeof phantom
  }
}

const stringValidator = createValidator<string>()
const userValidator = createValidator<User>()`}</Code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Identity and Assignment */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <RefreshCw className="h-6 w-6 text-green-600" />
                    Identity and Assignment Operators
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>assign_&lt;T&gt;(value)</code>, <code>a_&lt;T&gt;(value)</code>, <code>a&lt;T&gt;(value)</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Identity operators that preserve the input value while asserting type conformance. 
                        Bridge runtime values with phantom type system for validation and transformation.
                      </p>
                      <Code language="typescript">{`// Source implementation
export const assign_ = <T>(v: T): T => v as T
export const a_ = assign_
export const a = a_

// Runtime value preservation with type assertion
const userData = { name: 'Alice', age: 30, email: 'alice@example.com' }
const typedUser = assign_<User>(userData)  // Value preserved, type asserted

// Validation pipeline with assign_
function validateAndProcess<T>(data: unknown, validator: (x: unknown) => x is T): T {
  if (validator(data)) {
    return assign_<T>(data)  // Safe assignment after validation
  }
  throw new Error('Invalid data')
}`}</Code>
                      
                      <div className="mt-4 space-y-4">
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">Type-Safe Transformations</h5>
                          <Code language="typescript">{`// Use assign_ in transformation pipelines
function transformUser(input: unknown): User {
  // Validation step
  if (isValidUserData(input)) {
    // Safe assignment with type preservation
    const validUser = assign_<User>(input)
    
    // Transform while maintaining type safety
    return assign_<User>({
      ...validUser,
      id: generateId(),
      createdAt: new Date()
    })
  }
  
  throw new Error('Invalid user data')
}`}</Code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inference Control */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Settings className="h-6 w-6 text-orange-600" />
                    Inference Control Operators
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>widen_&lt;T&gt;(value)</code>, <code>w_&lt;T&gt;(value)</code>, <code>w&lt;T&gt;(value)</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Controls type inference to preserve const assertions and literal types. 
                        Essential for maintaining type precision in phantom operations.
                      </p>
                      <Code language="typescript">{`// Source implementation  
export const widen_ = <const T>(v: T) => t_<T>(v)
export const w_ = widen_
export const w = w_

// Preserve literal types and const assertions
const literal = widen_('hello')                    // Type: 'hello' (not string)
const tuple = widen_([1, 2, 3] as const)          // Type: readonly [1, 2, 3]
const config = widen_({ env: 'dev', debug: true } as const)  // Preserves literals

// Control inference in generic functions
function createConstantMap<const T>(values: T) {
  return widen_(values)  // Preserves exact literal types
}

const statusMap = createConstantMap({
  IDLE: 'idle',
  LOADING: 'loading', 
  ERROR: 'error'
} as const)  // Type: { readonly IDLE: 'idle'; readonly LOADING: 'loading'; readonly ERROR: 'error' }`}</Code>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>specify_&lt;T&gt;(value?)</code>, <code>s_&lt;T&gt;(value?)</code>, <code>s&lt;T&gt;(value?)</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Creates constrained phantom factories that enforce type relationships. 
                        Enables building type-safe APIs with compile-time constraint validation.
                      </p>
                      <Code language="typescript">{`// Source implementation
export const specify_ = <T>(v?: T) => <E extends T>(e_?: E) => t_<E>(v)
export const s_ = specify_
export const s = s_

// Create constrained phantom factories
const stringFactory = specify_<string>()
const helloPhantom = stringFactory<'hello'>()     // ✓ 'hello' extends string
// const numPhantom = stringFactory<number>()      // ✗ number doesn't extend string

// Build type-safe APIs with constraints
function createStatusFactory<TBase extends string>() {
  return specify_<TBase>()
}

const httpStatusFactory = createStatusFactory<'2xx' | '4xx' | '5xx'>()
const successStatus = httpStatusFactory<'2xx'>()   // ✓ Valid
const clientErrorStatus = httpStatusFactory<'4xx'>() // ✓ Valid
// const invalidStatus = httpStatusFactory<'3xx'>() // ✗ Not in base union`}</Code>
                    </div>
                  </div>
                </div>

                {/* Type Composition */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Combine className="h-6 w-6 text-purple-600" />
                    Type Composition Operators
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>intersect_&lt;T0, T1&gt;(v0, v1)</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Creates intersection types by combining two phantom values. 
                        Enables compositional type construction for complex domain modeling.
                      </p>
                      <Code language="typescript">{`// Source implementation
export const intersect_ = <T0, T1>(v0: T0, v1: T1) => t_<T0 & T1>()

// Compose types through intersection
const userBase = t_<{ name: string; email: string }>()
const userMeta = t_<{ id: string; createdAt: Date }>()
const fullUser = intersect_(userBase, userMeta)  // Type: User & UserMeta

// Build complex domain types compositionally
const permissions = t_<{ permissions: string[] }>()
const adminUser = intersect_(fullUser, permissions)

// Use in type-level validation
extends_(adminUser, t_<{ 
  name: string
  email: string  
  id: string
  createdAt: Date
  permissions: string[] 
}>())  // ✓ Intersection contains all properties`}</Code>
                    </div>
                  </div>
                </div>

                {/* Advanced Operators */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="h-6 w-6 text-red-600" />
                    Advanced and Utility Operators
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>force_&lt;T&gt;(value?)</code>, <code>f_&lt;T&gt;(value?)</code>, <code>f&lt;T&gt;(value?)</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Unsafe type coercion for advanced scenarios where type safety can be ensured externally. 
                        Use with caution for complex type-level programming where constraints are known but not provable.
                      </p>
                      <Code language="typescript">{`// Source implementation  
export const force_ = <T>(v: unknown = null) => t_<T>(v)
export const f_ = force_
export const f = f_

// Bypass type constraints (use carefully)
const unsafePhantom = force_<ComplexType>()

// Advanced type-level programming with external validation
function createTypedRegistry(data: unknown): TypedRegistry {
  // External validation ensures safety
  if (isValidRegistryStructure(data)) {
    return force_<TypedRegistry>(data)  // Safe due to validation
  }
  throw new Error('Invalid registry structure')
}

// Force phantom creation for known-safe scenarios
function deserializeFromTrustedSource<T>(serialized: string): T {
  const parsed = JSON.parse(serialized)
  // Source is trusted, force type assertion
  return force_<T>(parsed)
}`}</Code>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>any_(value?)</code>, <code>__(value?)</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Creates any-typed phantom values for scenarios requiring maximum type flexibility. 
                        Useful for gradual typing adoption and integration with untyped JavaScript code.
                      </p>
                      <Code language="typescript">{`// Source implementation
export const any_ = (v: any = null) => t_<any>(v)
export const __ = any_

// Create any-typed phantoms for flexibility
const anyValue = any_()              // Type: any
const flexibleData = __()            // Type: any (shorthand)

// Use in gradual typing scenarios
function integrateWithLegacyCode(legacyData: unknown) {
  const anyData = any_(legacyData)   // Accept any type
  
  // Gradually add type safety
  if (hasRequiredProperties(anyData)) {
    return assign_<KnownInterface>(anyData)
  }
  
  return anyData  // Fallback to any
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
                Master these essential operator patterns to build sophisticated type-level programming solutions. 
                Each pattern demonstrates practical techniques for type manipulation, composition, and constraint validation.
              </p>

              <div className="space-y-10">
                {/* Pattern 1: Phantom Pipeline Transformations */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Phantom Pipeline Transformations</h3>
                  <p className="text-gray-600 mb-4">
                    Build complex type transformation pipelines using operator composition. This pattern enables 
                    step-by-step type refinement and validation with full compile-time verification.
                  </p>
                  <Code language="typescript">{`import { t_, assign_, widen_, specify_, intersect_, is_, extends_ } from '@typefirst/typist'

// Define transformation pipeline types
type RawUserData = { name: string; email: string }
type ValidatedUser = RawUserData & { id: string }
type EnrichedUser = ValidatedUser & { permissions: string[]; createdAt: Date }

// Build transformation pipeline with operators
function transformUserData(raw: unknown): EnrichedUser {
  // Step 1: Validate and assign base type
  if (isValidRawUser(raw)) {
    const validated = assign_<RawUserData>(raw)
    
    // Step 2: Create phantom for type-level operations
    const phantom = t_<typeof validated>()
    is_<RawUserData>(phantom)  // ✓ Verify base structure
    
    // Step 3: Compose with additional data
    const withId = intersect_(phantom, t_<{ id: string }>())
    extends_(withId, t_<ValidatedUser>())  // ✓ Verify composition
    
    // Step 4: Final enrichment
    const enriched = intersect_(withId, t_<{ 
      permissions: string[]
      createdAt: Date 
    }>())
    
    // Step 5: Verify final type
    extends_(enriched, t_<EnrichedUser>())  // ✓ Pipeline complete
    
    // Return with runtime data
    return assign_<EnrichedUser>({
      ...validated,
      id: generateId(),
      permissions: ['read'],
      createdAt: new Date()
    })
  }
  
  throw new Error('Invalid user data')
}

// Use transformation pipeline
const rawData = { name: 'Alice', email: 'alice@example.com' }
const enrichedUser = transformUserData(rawData)
is_<EnrichedUser>(enrichedUser)  // ✓ Final validation`}</Code>
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Link 
                      href="/typescape/typist-transformation-pipelines"
                      className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium"
                    >
                      🔄 Explore in Transformation Pipelines Typescape
                    </Link>
                  </div>
                </div>

                {/* Pattern 2: Constrained Factory Pattern */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Constrained Factory Pattern</h3>
                  <p className="text-gray-600 mb-4">
                    Use `specify_` to create type-safe factory functions with compile-time constraint validation. 
                    This pattern enables building APIs that enforce domain rules through the type system.
                  </p>
                  <Code language="typescript">{`import { specify_, t_, assign_, extends_, test_ } from '@typefirst/typist'

// Define domain constraints
type HttpStatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 500
type SuccessStatus = 200 | 201
type ClientErrorStatus = 400 | 401 | 403 | 404
type ServerErrorStatus = 500

// Create constrained factories using specify_
const httpStatusFactory = specify_<HttpStatusCode>()
const successFactory = specify_<SuccessStatus>()
const clientErrorFactory = specify_<ClientErrorStatus>()
const serverErrorFactory = specify_<ServerErrorStatus>()

// Type-safe status creation with constraints
const okStatus = successFactory<200>()           // ✓ 200 extends SuccessStatus
const createdStatus = successFactory<201>()      // ✓ 201 extends SuccessStatus
// const errorStatus = successFactory<404>()     // ✗ 404 doesn't extend SuccessStatus

const notFoundStatus = clientErrorFactory<404>() // ✓ 404 extends ClientErrorStatus  
const serverError = serverErrorFactory<500>()    // ✓ 500 extends ServerErrorStatus

// Build response factory with constraints
function createResponseFactory<TStatus extends HttpStatusCode>() {
  return specify_<{ status: TStatus; data?: any }>()
}

const successResponseFactory = createResponseFactory<SuccessStatus>()
const errorResponseFactory = createResponseFactory<ClientErrorStatus>()

// Create typed responses with automatic constraint validation
const successResponse = successResponseFactory<{ status: 200; data: User[] }>()
const errorResponse = errorResponseFactory<{ status: 404; data?: undefined }>()

test_('Constrained factory validation', () => {
  // Verify constraint enforcement
  extends_(okStatus, t_<SuccessStatus>())         // ✓ Factory enforces constraints
  extends_(notFoundStatus, t_<ClientErrorStatus>()) // ✓ Correct category
  extends_(serverError, t_<ServerErrorStatus>())   // ✓ Server error type
  
  // Verify response structure
  extends_(successResponse, t_<{ status: SuccessStatus }>())
  extends_(errorResponse, t_<{ status: ClientErrorStatus }>())
  
  return t_<boolean>()
})`}</Code>
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <Link 
                      href="/typescape/typist-constrained-apis"
                      className="inline-flex items-center gap-2 text-green-700 hover:text-green-900 font-medium"
                    >
                      🏭 Explore in Constrained APIs Typescape
                    </Link>
                  </div>
                </div>

                {/* Pattern 3: Type Intersection Composition */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Type Intersection Composition</h3>
                  <p className="text-gray-600 mb-4">
                    Use `intersect_` to build complex domain types through compositional design. 
                    This pattern enables modular type construction where features can be mixed and matched.
                  </p>
                  <Code language="typescript">{`import { t_, intersect_, extends_, test_, yes_, $Equal, $Extends } from '@typefirst/typist'

// Define base type components
const baseEntity = t_<{ id: string; createdAt: Date }>()
const namedEntity = t_<{ name: string }>()
const emailEntity = t_<{ email: string }>()
const permissionsEntity = t_<{ permissions: string[] }>()
const metadataEntity = t_<{ metadata: Record<string, any> }>()

// Compose types through intersection
const user = intersect_(
  intersect_(baseEntity, namedEntity),
  emailEntity
)  // User = Entity & Named & Email

const admin = intersect_(
  user,
  permissionsEntity
)  // Admin = User & Permissions

const enrichedAdmin = intersect_(
  admin,
  metadataEntity  
)  // EnrichedAdmin = Admin & Metadata

// Build role-based composition system
function composeUserRole<TBase, TRole>(
  base: TBase,
  role: TRole
) {
  return intersect_(base, role)
}

const moderator = composeUserRole(user, t_<{ canModerate: boolean }>())
const superAdmin = composeUserRole(admin, t_<{ 
  canManageUsers: boolean
  canAccessSystem: boolean 
}>())

test_('Intersection composition validation', () => {
  // Verify component inheritance
  extends_(user, baseEntity)      // ✓ User includes base entity
  extends_(user, namedEntity)     // ✓ User includes name  
  extends_(user, emailEntity)     // ✓ User includes email
  
  extends_(admin, user)           // ✓ Admin extends user
  extends_(admin, permissionsEntity) // ✓ Admin includes permissions
  
  // Verify composed structure
  yes_<$Extends<typeof user, { 
    id: string
    createdAt: Date
    name: string
    email: string 
  }>>()
  
  yes_<$Extends<typeof admin, { 
    id: string
    createdAt: Date  
    name: string
    email: string
    permissions: string[]
  }>>()
  
  // Verify role composition
  extends_(moderator, user)       // ✓ Moderator extends user
  extends_(superAdmin, admin)     // ✓ SuperAdmin extends admin
  
  return t_<boolean>()
})`}</Code>
                  <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <Link 
                      href="/typescape/typist-type-composition"
                      className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium"
                    >
                      🧩 Explore in Type Composition Typescape
                    </Link>
                  </div>
                </div>

                {/* Pattern 4: Inference Control Patterns */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Inference Control and Literal Preservation</h3>
                  <p className="text-gray-600 mb-4">
                    Master `widen_` to control TypeScript's type inference and preserve literal types in complex scenarios. 
                    This pattern is essential for maintaining type precision in generic programming.
                  </p>
                  <Code language="typescript">{`import { widen_, t_, assign_, test_, yes_, $Equal } from '@typefirst/typist'

// Preserve literal types in configuration systems
const appConfig = widen_({
  environment: 'development',
  features: {
    authentication: true,
    analytics: false,
    debugMode: true
  },
  apiEndpoints: {
    users: '/api/v1/users',
    posts: '/api/v1/posts',
    auth: '/api/v1/auth'
  }
} as const)

// Build type-safe enum-like structures
function createConstants<const T>(values: T) {
  return widen_(values)
}

const httpMethods = createConstants(['GET', 'POST', 'PUT', 'DELETE'] as const)
const statusCodes = createConstants({
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
} as const)

// Control inference in generic functions
function createTypedState<const TInitial>(initial: TInitial) {
  const state = widen_(initial)
  
  return {
    current: state,
    update: <const TNext>(next: TNext) => {
      return createTypedState(widen_(next))
    }
  }
}

const userState = createTypedState({
  status: 'idle',
  data: null,
  error: null
} as const)

// Precise literal type preservation
const theme = widen_('dark')      // Type: 'dark' (not string)
const colors = widen_(['red', 'green', 'blue'] as const)  // Exact tuple type

test_('Inference control validation', () => {
  // Verify literal type preservation
  yes_<$Equal<typeof appConfig.environment, 'development'>>()
  yes_<$Equal<typeof appConfig.features.authentication, true>>()
  yes_<$Equal<typeof appConfig.apiEndpoints.users, '/api/v1/users'>>()
  
  // Verify enum-like constant types
  yes_<$Equal<typeof httpMethods, readonly ['GET', 'POST', 'PUT', 'DELETE']>>()
  yes_<$Equal<typeof statusCodes.OK, 200>>()
  yes_<$Equal<typeof statusCodes.NOT_FOUND, 404>>()
  
  // Verify controlled inference in generic contexts
  yes_<$Equal<typeof userState.current, {
    readonly status: 'idle'
    readonly data: null
    readonly error: null
  }>>()
  
  // Verify literal preservation
  yes_<$Equal<typeof theme, 'dark'>>()
  yes_<$Equal<typeof colors, readonly ['red', 'green', 'blue']>>()
  
  return t_<boolean>()
})`}</Code>
                  <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <Link 
                      href="/typescape/typist-inference-control"
                      className="inline-flex items-center gap-2 text-orange-700 hover:text-orange-900 font-medium"
                    >
                      🎯 Explore in Inference Control Typescape
                    </Link>
                  </div>
                </div>

                {/* Pattern 5: Runtime-Phantom Bridging */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Runtime-Phantom Bridging Patterns</h3>
                  <p className="text-gray-600 mb-4">
                    Use `assign_` and validation patterns to safely bridge runtime JavaScript values with 
                    phantom type system. This enables gradual typing adoption and safe data transformation.
                  </p>
                  <Code language="typescript">{`import { assign_, t_, force_, any_, is_, extends_, test_ } from '@typefirst/typist'

// Safe runtime-to-phantom bridging with validation
interface User {
  id: string
  name: string  
  email: string
  age: number
}

function isValidUser(value: unknown): value is User {
  return typeof value === 'object' && 
         value !== null &&
         'id' in value && typeof (value as any).id === 'string' &&
         'name' in value && typeof (value as any).name === 'string' &&
         'email' in value && typeof (value as any).email === 'string' &&
         'age' in value && typeof (value as any).age === 'number'
}

// Runtime data processing with phantom validation
function processApiResponse(data: unknown): User {
  // Validate runtime data
  if (isValidUser(data)) {
    // Safe assignment with phantom validation
    const user = assign_<User>(data)
    const phantom = t_<typeof user>()
    
    // Verify phantom type structure
    is_<User>(phantom)
    extends_(phantom, t_<{ id: string }>())
    extends_(phantom, t_<{ name: string }>())
    
    return user
  }
  
  throw new Error('Invalid user data')
}

// Gradual typing integration patterns
function integrateWithLegacySystem(legacyData: unknown) {
  // Start with any for maximum compatibility
  const flexibleData = any_(legacyData)
  
  // Gradually add type safety
  if (hasKnownStructure(flexibleData)) {
    return assign_<KnownInterface>(flexibleData)
  }
  
  // Handle partially typed scenarios
  if (hasPartialStructure(flexibleData)) {
    const partial = assign_<Partial<KnownInterface>>(flexibleData)
    
    // Fill missing fields with defaults
    return assign_<KnownInterface>({
      ...getDefaults(),
      ...partial
    })
  }
  
  // Fallback for completely unknown data
  return force_<KnownInterface>(transformUnknownData(flexibleData))
}

// Type-safe serialization/deserialization
function serializeUser(user: User): string {
  // Validate phantom type before serialization
  const phantom = t_<typeof user>()
  is_<User>(phantom)
  
  return JSON.stringify(assign_<User>(user))
}

function deserializeUser(json: string): User {
  try {
    const parsed = JSON.parse(json)
    
    // Validate deserialized data
    if (isValidUser(parsed)) {
      const user = assign_<User>(parsed)
      
      // Phantom validation after deserialization
      const phantom = t_<typeof user>()
      extends_(phantom, t_<User>())
      
      return user
    }
    
    throw new Error('Invalid user JSON structure')
  } catch {
    throw new Error('Failed to deserialize user')
  }
}

test_('Runtime-phantom bridging validation', () => {
  // Test safe assignment patterns
  const validUser = { id: '1', name: 'Alice', email: 'alice@test.com', age: 30 }
  const assignedUser = assign_<User>(validUser)
  is_<User>(assignedUser)
  
  // Test phantom validation
  const phantom = t_<User>()
  extends_(phantom, t_<{ id: string }>())
  extends_(phantom, t_<{ name: string }>())
  extends_(phantom, t_<{ email: string }>())
  extends_(phantom, t_<{ age: number }>())
  
  // Test serialization roundtrip
  const serialized = serializeUser(validUser)
  const deserialized = deserializeUser(serialized)
  is_<User>(deserialized)
  
  return t_<boolean>()
})`}</Code>
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <Link 
                      href="/typescape/typist-runtime-bridging"
                      className="inline-flex items-center gap-2 text-red-700 hover:text-red-900 font-medium"
                    >
                      🌉 Explore in Runtime Bridging Typescape
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Related Functional Groups */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Functional Groups</h2>
              
              <p className="text-gray-600 mb-6">
                Operators provide the foundational layer for all other typist functional groups:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Link href="/docs/typist/phantoms" className="group block p-6 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors">
                  <h3 className="text-lg font-semibold text-emerald-900 mb-3 group-hover:text-emerald-700">
                    Phantoms <Zap className="inline h-4 w-4 ml-1" />
                  </h3>
                  <p className="text-emerald-800 mb-3">
                    Phantom types and zero-cost abstractions built on the operator foundation. 
                    Operators provide the core utilities that phantoms use for type-level programming.
                  </p>
                  <div className="text-sm text-emerald-600">
                    <strong>Core Operators:</strong> t_, type_, t, phantom_
                  </div>
                </Link>

                <Link href="/docs/typist/assertions" className="group block p-6 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3 group-hover:text-blue-700">
                    Assertions <Plus className="inline h-4 w-4 ml-1" />
                  </h3>
                  <p className="text-blue-800 mb-3">
                    Type assertions that consume phantom values created by operators. 
                    The operator-assertion combination enables comprehensive type-level testing.
                  </p>
                  <div className="text-sm text-blue-600">
                    <strong>Key Functions:</strong> is_, extends_, has_, never_
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