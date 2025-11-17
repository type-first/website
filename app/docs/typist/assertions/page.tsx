import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { buildDocNavigation } from '@/lib/content/doc.model';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { Code } from '@/lib/content/ui/code.cmp.iso';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata() {
  return {
    title: 'Assertions - Typist API Reference',
    description: 'Comprehensive reference for the Assertions functional group in typist - static type-level assertion kit for testing and debugging.',
  };
}

export default function AssertionsApiPage() {
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
                  Assertions
                </h1>
                <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full font-medium">
                  Functional Group
                </span>
              </div>
              
              <p className="text-xl text-gray-600 mb-6">
                Essential static type-level assertion kit for writing type-level unit tests, 
                examples, demonstrations, and debugging. Zero runtime overhead.
              </p>
            </header>

            {/* Introductory Exposition */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              
              <div className="prose prose-lg text-gray-700 max-w-none space-y-6">
                <p>
                  The <strong>Assertions</strong> functional group provides compile-time type checking 
                  utilities with zero runtime overhead. These functions test type relationships, validate 
                  assignability, and verify constraints entirely through TypeScript's type system.
                </p>

                <p>
                  Assertions operate by leveraging type constraints to trigger compilation errors when 
                  invalid relationships are tested. They accept phantom parameters that exist only for 
                  type checking and have no runtime behavior.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Type-Level and Value-Level Flexibility</h3>

                <p>
                  Assertions work with both type identifiers and runtime values through <code>typeof </code> 
                  and <code>t_</code> conversions. This allows flexible usage patterns:
                </p>

                <Code language="typescript">{`// Use runtime values as type arguments
const user = { id: 1, name: 'Alice' }
extends_<typeof user, { id: number }>()     // Extract type from value

// Use type identifiers as phantom arguments  
type User = { id: number; name: string }
extends_(user, t_<User>())                   // Create phantom from type

// Both patterns work identically
is_<User>(user)           // Type argument + runtime value
is_<typeof user>(t_<User>())  // Both as type arguments`}</Code>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Functional Categories</h3>

                <div className="grid gap-4 mt-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Assignment Assertions
                    </h4>
                    <p className="text-gray-600">Test value assignability to types (<code>is_</code>, <code>assignable_</code>)</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      Structural Assertions
                    </h4>
                    <p className="text-gray-600">Verify object properties and structure (<code>has_</code>)</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                      Relationship Assertions  
                    </h4>
                    <p className="text-gray-600">Test type extension and instance relationships (<code>extends_</code>, <code>instance_</code>)</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      Impossibility Assertions
                    </h4>
                    <p className="text-gray-600">Verify type contradictions and unreachable states (<code>never_</code>)</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      Verdict Assertions
                    </h4>
                    <p className="text-gray-600">Test comparator results (<code>yes_</code>, <code>no_</code>, <code>decidable_</code>)</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Design Patterns</h3>

                <p>
                  All assertion functions follow consistent patterns:
                </p>

                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Generic constraints</strong> enforce valid relationships at compile time</li>
                  <li><strong>Phantom parameters</strong> exist only for type checking, not runtime execution</li>
                  <li><strong>Empty implementations</strong> since all behavior is type-level</li>
                  <li><strong>Composable design</strong> allows combining assertions in test blocks</li>
                </ul>
              </div>
            </section>

            {/* Canonical API List */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">API Reference</h2>
              
              <div className="space-y-8">
                {/* Assignment Assertions */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    Assignment Assertions
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>is_&lt;T&gt;(x: T): void</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Core type assertion function. Tests that a value is assignable to type T. 
                        Provides immediate compile-time feedback if the assignment is invalid.
                      </p>
                      <Code language="typescript">{`export const is_ = <T>(x:T) => {}`}</Code>
                      <div className="mt-2 text-sm text-gray-500">
                        <strong>Usage:</strong> Direct type compatibility testing, runtime value validation against type constraints
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>assignable_&lt;T&gt;(x: T): void</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Alias for <code>is_</code>. Provides identical functionality with more explicit naming 
                        that emphasizes the assignability testing aspect.
                      </p>
                      <Code language="typescript">{`export const assignable_ = is_`}</Code>
                      <div className="mt-2 text-sm text-gray-500">
                        <strong>Relationship:</strong> Exact alias of <code>is_</code> - use interchangeably based on naming preference
                      </div>
                    </div>
                  </div>
                </div>

                {/* Structural Assertions */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                    Structural Assertions
                  </h3>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      <code>has_&lt;P, V&gt;(x: &#123;[k in P]: V&#125;): void</code>
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Verifies that an object has a property <code>P</code> with value type <code>V</code>. 
                      Uses mapped types to enforce property existence and type constraints simultaneously.
                    </p>
                    <Code language="typescript">{`export const has_ = <const P extends string, const V = any>(x: {[k in P]: V }) => {}`}</Code>
                    <div className="mt-2 text-sm text-gray-500">
                      <strong>Type Parameters:</strong> <code>P extends string</code> (property name), <code>V</code> (value type, defaults to any)
                      <br />
                      <strong>Usage:</strong> Object structure validation, property existence testing, shape verification
                    </div>
                  </div>
                </div>

                {/* Relationship Assertions */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                    Relationship Assertions
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>extends_&lt;E extends T, T&gt;(y?: E, x?: T): void</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Tests subtype relationships by constraining <code>E</code> to extend <code>T</code>. 
                        Can be used with phantom parameters or with actual runtime values for type extraction.
                      </p>
                      <Code language="typescript">{`export const extends_ = <E extends T,T>(y?:E, x?:T) => {}`}</Code>
                      <div className="mt-2 text-sm text-gray-500">
                        <strong>Constraint:</strong> <code>E extends T</code> enforced at compile time
                        <br />
                        <strong>Usage:</strong> Type hierarchy verification, subtype relationship testing
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>instance_&lt;T&gt;(x?: InstanceType&lt;T&gt;): void</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Verifies constructor/class instance relationships. Tests that a value is an instance 
                        of a class or constructor function type.
                      </p>
                      <Code language="typescript">{`export const instance_ = <T extends abstract new (...args:any[]) => any>(x?:InstanceType<T>) => {}`}</Code>
                      <div className="mt-2 text-sm text-gray-500">
                        <strong>Constraint:</strong> <code>{'T extends abstract new (...args:any[]) => any'}</code>
                        <br />
                        <strong>Usage:</strong> Class instance validation, constructor type verification
                      </div>
                    </div>
                  </div>
                </div>

                {/* Impossibility Assertions */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <XCircle className="h-6 w-6 text-red-600" />
                    Impossibility Assertions
                  </h3>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      <code>never_&lt;T extends never&gt;(x?: T): never</code>
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Asserts type impossibility by constraining the type parameter to <code>never</code>. 
                      Useful for proving that certain type combinations are invalid or unreachable.
                    </p>
                    <Code language="typescript">{`export const never_ = <T extends never>(x?: T): never => x as never`}</Code>
                    <div className="mt-2 text-sm text-gray-500">
                      <strong>Constraint:</strong> <code>T extends never</code> - only never type satisfies this constraint
                      <br />
                      <strong>Usage:</strong> Proof of impossibility, contradiction verification, unreachable code paths
                    </div>
                  </div>
                </div>

                {/* Verdict Assertions */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="h-6 w-6 text-orange-600" />
                    Verdict Assertions
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>yes_&lt;T extends $Yes&gt;(t?: T): true</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Asserts positive verdicts from comparator types. Used to verify that type 
                        comparisons resolve to <code>$Yes</code>, indicating successful matches.
                      </p>
                      <Code language="typescript">{`export const yes_ = <T extends $Yes>(t?:T) => true`}</Code>
                      <div className="mt-2 text-sm text-gray-500">
                        <strong>Integration:</strong> Works with comparators like <code>$Equal</code>, <code>$Extends</code>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>no_&lt;T extends $No&lt;any, any&gt;&gt;(t?: T): void</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Asserts negative verdicts from comparator types. Used to verify that type 
                        comparisons correctly fail and produce <code>$No</code> verdicts.
                      </p>
                      <Code language="typescript">{`export const no_ = <T extends $No<any, any>>(t?:T) => {}`}</Code>
                      <div className="mt-2 text-sm text-gray-500">
                        <strong>Integration:</strong> Verifies expected failure cases in type comparisons
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        <code>decidable_&lt;T extends $Maybe&gt;(t?: T): void</code>
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Asserts that a type comparison is decidable (either <code>$Yes</code> or <code>$No</code>). 
                        Used to verify that comparisons don't produce undefined or ambiguous results.
                      </p>
                      <Code language="typescript">{`export const decidable_ = <T extends $Maybe>(t?:T) => {}`}</Code>
                      <div className="mt-2 text-sm text-gray-500">
                        <strong>Usage:</strong> Meta-level verification of comparison decidability
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Examples Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Compositional Usage Examples</h2>
              
              <div className="space-y-8">
                {/* Basic Assertion Composition */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Assertion Composition</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Combine multiple assertions to validate complex type relationships and object structures.
                  </p>
                  
                  <Code language="typescript">{`import { is_, has_, extends_, yes_, no_, $Equal, $Extends } from '@typefirst/typist'

// Define domain types
type User = { id: number; name: string; role: 'admin' | 'user' }
type AdminUser = User & { permissions: string[] }

// Test type hierarchy and structure
const user: User = { id: 1, name: 'Alice', role: 'admin' }
const admin: AdminUser = { ...user, permissions: ['read', 'write'] }

// Basic structure validation
is_<User>(user)                    // ✓ User object structure
has_<'id', number>(user)           // ✓ Has required id property  
has_<'role', User['role']>(user)   // ✓ Role property with correct type

// Type relationship verification
extends_<AdminUser, User>()        // ✓ AdminUser extends User
extends_<typeof admin, User>()     // ✓ Runtime admin extends User type

// Verdict-based comparisons
yes_<$Equal<User['id'], number>>()           // ✓ id property is number
yes_<$Extends<'admin', User['role']>>()     // ✓ 'admin' extends role union
no_<$Equal<User, AdminUser>>()              // ✓ These are different types`}</Code>
                </div>

                {/* Advanced Type Testing Pipeline */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Type Testing Pipeline</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Build comprehensive type validation pipelines that test multiple aspects of type safety.
                  </p>

                  <Code language="typescript">{`import { test_, is_, has_, never_, extends_, instance_ } from '@typefirst/typist'

// Define a type-safe API response system
interface ApiResponse<TData> {
  success: boolean
  data: TData
  timestamp: Date
}

interface ValidationError {
  field: string
  message: string
}

type ApiResult<TData> = 
  | ApiResponse<TData> 
  | { success: false; errors: ValidationError[] }

// Create comprehensive type tests
test_('API Response Type Safety', () => {
  // Test successful response structure
  const successResponse: ApiResponse<User> = {
    success: true,
    data: { id: 1, name: 'Alice', role: 'admin' },
    timestamp: new Date()
  }
  
  is_<ApiResponse<User>>(successResponse)
  has_<'success', boolean>(successResponse)
  has_<'data', User>(successResponse)
  has_<'timestamp', Date>(successResponse)
  
  // Test error response structure  
  const errorResponse: ApiResult<User> = {
    success: false,
    errors: [{ field: 'email', message: 'Invalid email' }]
  }
  
  is_<ApiResult<User>>(errorResponse)
  has_<'success', false>(errorResponse)
  has_<'errors', ValidationError[]>(errorResponse)
  
  // Verify type relationships
  extends_<ApiResponse<User>, ApiResult<User>>()    // ✓ Success case extends result
  extends_<typeof errorResponse, ApiResult<User>>() // ✓ Error case extends result
  
  // Test impossibility cases
  never_<ApiResponse<User> & { success: false }>() // ✓ Cannot be both success=true and false
})`}</Code>
                </div>

                {/* Generic Type Validation */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Generic Type Validation</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Use assertions within generic contexts to validate type parameter relationships and constraints.
                  </p>

                  <Code language="typescript">{`import { is_, extends_, has_, never_, yes_, $Equal } from '@typefirst/typist'

// Generic validation function that proves type relationships
function validateGenericConstraints<
  TEntity extends { id: string },
  TUpdate extends Partial<TEntity>
>(entity: TEntity, update: TUpdate) {
  // Prove constraint satisfaction
  extends_<TEntity, { id: string }>()     // ✓ Entity has required id
  extends_<TUpdate, Partial<TEntity>>()   // ✓ Update is partial of entity
  
  // Test structural properties
  has_<'id', string>(entity)              // ✓ Entity has string id
  is_<string>(entity.id)                  // ✓ Direct id validation
  is_<Partial<TEntity>>(update)           // ✓ Update matches expected type
  
  // Verify type operations
  type MergedType = TEntity & TUpdate
  is_<MergedType>({ ...entity, ...update })  // ✓ Merge operation type-safe
  
  // Test impossibility of invalid operations
  never_<TEntity & never>()               // ✓ Cannot intersect with never
  never_<string & number>()               // ✓ No overlap between primitives
  
  return { ...entity, ...update }
}

// Usage with specific types
interface Product {
  id: string
  name: string
  price: number
}

const product: Product = { id: '123', name: 'Widget', price: 10 }
const update = { price: 15 } // Type inferred as { price: number }

// The function call itself validates all generic constraints
const updated = validateGenericConstraints(product, update)
is_<Product>(updated)                    // ✓ Result maintains Product type`}</Code>
                </div>

                {/* Class and Instance Validation */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Class and Instance Validation</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Combine instance assertions with structural validation for complete class-based type testing.
                  </p>

                  <Code language="typescript">{`import { instance_, is_, extends_, has_, test_ } from '@typefirst/typist'

// Define class hierarchy
abstract class Animal {
  abstract name: string
  abstract speak(): string
}

class Dog extends Animal {
  constructor(public name: string) {
    super()
  }
  
  speak() {
    return "Woof!"
  }
}

class Cat extends Animal {
  constructor(public name: string) {
    super()
  }
  
  speak() {
    return "Meow!"
  }
}

test_('Class Instance Validation', () => {
  const dog = new Dog('Buddy')
  const cat = new Cat('Whiskers')
  
  // Validate instance relationships
  instance_<typeof Dog>(dog)              // ✓ dog is Dog instance
  instance_<typeof Cat>(cat)              // ✓ cat is Cat instance
  instance_<typeof Animal>(dog)           // ✓ dog is also Animal instance
  instance_<typeof Animal>(cat)           // ✓ cat is also Animal instance
  
  // Structural validation
  has_<'name', string>(dog)               // ✓ Has name property
  has_<'speak', () => string>(dog)        // ✓ Has speak method
  is_<string>(dog.name)                   // ✓ Name is string
  is_<string>(dog.speak())                // ✓ speak() returns string
  
  // Type hierarchy validation
  extends_<Dog, Animal>()                 // ✓ Dog extends Animal
  extends_<Cat, Animal>()                 // ✓ Cat extends Animal
  extends_<typeof dog, Animal>()          // ✓ Instance type extends base
  
  // Test method return types
  is_<"Woof!">(dog.speak())              // ✓ Literal return type
  is_<"Meow!">(cat.speak())              // ✓ Literal return type
  is_<string>(dog.speak())               // ✓ Also satisfies string
})`}</Code>
                </div>
              </div>
            </section>

            {/* Integration Notes */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Integration with Other Typist Components</h2>
              
              <div className="space-y-6">
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Verdicts Integration</h3>
                  <p className="text-blue-800 mb-3">
                    Assertions work seamlessly with the verdicts system through <code>yes_</code>, 
                    <code>no_</code>, and <code>decidable_</code> functions that test comparator results.
                  </p>
                  <Code language="typescript">{`// Assertions test comparator verdicts
yes_<$Equal<string, string>>()    // ✓ Assert equality
no_<$Equal<string, number>>()     // ✓ Assert inequality
decidable_<$Equal<any, any>>()    // ✓ Assert decidability`}</Code>
                </div>

                <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Test Blocks Integration</h3>
                  <p className="text-green-800 mb-3">
                    Use with <code>test_</code>, <code>example_</code>, and <code>proof_</code> 
                    blocks to organize assertions into logical groupings.
                  </p>
                  <Code language="typescript">{`test_('Type relationships', () => {
  extends_<'literal', string>()
  is_<string>('any string')
  never_<string & never>()
})`}</Code>
                </div>

                <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">Phantom Types Integration</h3>
                  <p className="text-purple-800 mb-3">
                    Assertions work with phantom type utilities to test type relationships 
                    without requiring actual runtime values.
                  </p>
                  <Code language="typescript">{`// Test with phantom values
const userPhantom = t_<User>()
is_<User>(userPhantom)
has_<'id', number>(userPhantom)`}</Code>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}