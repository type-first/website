import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { getDocPageBySlug, getDocBreadcrumbs, buildDocNavigation } from '@/lib/content/doc.model';
import { DocBreadcrumbs } from '@/lib/content/ui/doc/doc-breadcrumbs.cmp.iso';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { DocNavigation } from '@/lib/content/ui/doc/doc-navigation.cmp.iso';
import { Code } from '@/lib/content/ui/code.cmp.iso';
import { CodeExplorerLink } from '@/lib/content/ui/link.code-explorer.cmp.iso';
import { Calendar, User } from 'lucide-react';

// Hardcoded content components
const Intro = () => (
  <div>
    <p>
      <strong>Show what your types are made of.</strong> Typist is a minimal suite for compilable proofs 
      that treats types as first-class values in TypeScript. Create phantom representations, encode static assertions, 
      and build compile-time validations with zero runtime overhead.
    </p>
    <p>
      Whether you're building type-safe APIs, enforcing domain constraints, or creating self-documenting interfaces, 
      typist gives you the tools to <em>prove your types work</em> before your code ever runs.
    </p>
  </div>
);

const BasicUsageIntroduction = () => (
  <div>
    <p>
      Jump into typist with practical examples that showcase its <strong>core capabilities</strong>. 
      Learn the essential patterns through <em>hands-on examples</em> with phantom types, compile-time proofs, 
      and type-safe domain modeling.
    </p>
    <p>
      Start with <code>phantom values</code>, build <code>type assertions</code>, 
      then explore <strong>branded types</strong> and <strong>static constraints</strong>.
    </p>
  </div>
);

const phantomValuesSnippet = `import { t_, $Equal, yes_, is_, never_ } from '@typefirst/typist'

// Create phantom types - no runtime cost, pure type-level
const user = t_<{ name: string; age: number }>()
const admin = t_<{ name: string; role: 'admin' }>()

// Type assertions and proofs
is_<string>(user.name)                    // ✓ Property type check
yes_<$Equal<number, typeof user.age>>()   // ✓ Type equality proof
never_<string & number>()                 // ✓ Impossibility proof

// Build type-safe constraints
type ValidUser<T> = T extends { name: string } ? T : never
const validUser = t_<ValidUser<typeof user>>() // ✓ Compiles
// const invalid = t_<ValidUser<string>>()      // ✗ Compile error

// Use for API design and domain modeling
type BrandedId<T extends string> = string & { __brand: T }
const userId = t_<BrandedId<'user'>>()
const orderId = t_<BrandedId<'order'>>()

// Type-level proofs prevent mixing different ID types
// function getUser(id: typeof userId) { ... }   // ✓ Only accepts user IDs
// getUser(orderId)                              // ✗ Compile error`;

export async function generateMetadata() {
  const library = getDocLibraryBySlug('typist');
  const page = getDocPageBySlug(library!, 'quick-start');
  
  return {
    title: `${page?.title} - ${library?.name}`,
    description: page?.description,
  };
}

export default function TypistQuickStartPage() {
  const library = getDocLibraryBySlug('typist');
  
  if (!library) {
    notFound();
  }

  const page = getDocPageBySlug(library, 'quick-start');
  
  if (!page) {
    notFound();
  }

  const navigationPages = buildDocNavigation(library.pages);
  const breadcrumbs = getDocBreadcrumbs(library, page);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <DocBreadcrumbs breadcrumbs={breadcrumbs} />
      </div>
      
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
          <article className="max-w-4xl">
            {/* Page header */}
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {page.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">
                {page.description}
              </p>
              
              {/* Page metadata */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" strokeWidth={1.8} />
                  {library.author.name}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" strokeWidth={1.8} />
                  Updated {new Date(page.updatedTs).toLocaleDateString()}
                </div>
              </div>
            </header>

            {/* Page content */}
            <div className="prose prose-lg max-w-none">
              <Intro />
              
              <h2>Your First Phantom Type</h2>
              <p>
                Let's start with the most fundamental concept in typist: phantom types. These allow you to create 
                distinct types that share the same runtime representation but are treated differently by TypeScript.
              </p>
              
              <Code language="typescript">{phantomValuesSnippet}</Code>
              
              <h2>Type Comparisons</h2>
              <p>
                One of typist's most powerful features is the ability to compare types at compile time and get 
                meaningful verdicts about their relationships.
              </p>
              
              <Code language="typescript">{`import { $Equal, $Extends, yes_, no_ } from '@typefirst/typist';

// Basic type equality
type StringTest = $Equal<string, string>;        // $Yes
type MismatchTest = $Equal<string, number>;      // $No<...>

// Verify the results
yes_<StringTest>();    // ✅ Compiles - strings are equal
no_<MismatchTest>();   // ✅ Compiles - string ≠ number

// Type extension relationships
type LiteralExtends = $Extends<"hello", string>; // $Yes
type GeneralExtends = $Extends<string, "hello">; // $No<...>

yes_<LiteralExtends>(); // ✅ Literal types extend their base type
no_<GeneralExtends>();  // ✅ General types don't extend specific literals`}</Code>
              
              <h2>Practical Example: User Management</h2>
              <p>
                Let's build a practical example that demonstrates how typist can prevent common bugs in a user management system.
              </p>
              
              <Code language="typescript">{`import { t_, $Equal, $Extends, yes_, has_ } from '@typefirst/typist';

// Define distinct ID types
type UserId = string & { readonly __brand: 'UserId' };
type ProductId = string & { readonly __brand: 'ProductId' };

// Create phantom values for testing
const userId = t_<UserId>();
const productId = t_<ProductId>();

// Verify they're different types despite same runtime representation
no_<$Equal<UserId, ProductId>>(); // ✅ These should be different

// Define user structure
interface User {
  id: UserId;
  name: string;
  email: string;
  age: number;
}

// Test user structure compliance
function validateUser<T>(user: T) {
  // Ensure it extends the base User interface
  yes_<$Extends<T, { id: UserId }>>();
  yes_<$Extends<T, { name: string }>>();
  yes_<$Extends<T, { email: string }>>();
  
  // Test specific properties exist
  has_<"id", UserId>(user);
  has_<"name", string>(user);
  has_<"email", string>(user);
  
  return user;
}

// Usage example
const validUser = validateUser({
  id: 'user_123' as UserId,
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
});

// This would cause compile errors:
// validateUser({
//   id: 'product_456' as ProductId, // ❌ Wrong ID type
//   name: 'John'                    // ❌ Missing required fields
// });`}</Code>
              
              <h2>Advanced Pattern: API Response Validation</h2>
              <p>
                Here's a more advanced example showing how to validate API responses at the type level:
              </p>
              
              <Code language="typescript">{`import { t_, $Equal, $Extends, yes_, extends_, example_ } from '@typefirst/typist';

// Define expected API response structure
interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message: string;
  timestamp: number;
}

// Create a validation helper
example_('API Response Validation', () => {
  type UserResponse = ApiResponse<User>;
  
  // Validate the response structure
  extends_<UserResponse, { data: User }>();
  extends_<UserResponse, { status: string }>();
  extends_<UserResponse, { message: string }>();
  
  // Test that data field has correct type
  yes_<$Extends<UserResponse['data'], User>>();
  
  return t_<UserResponse>();
});

// Usage in actual API handling
function handleApiResponse<T>(response: unknown): response is ApiResponse<T> {
  // Runtime validation would go here
  // Type-level validation is already enforced by typist
  return typeof response === 'object' && response !== null;
}

// Type-safe API client
class TypeSafeApiClient {
  async getUser(id: UserId): Promise<ApiResponse<User>> {
    const response = await fetch(\`/api/users/\${id}\`);
    const data = await response.json();
    
    // Typist ensures we return the correct type structure
    return data as ApiResponse<User>;
  }
}`}</Code>
              
              <h2>Testing Your Types</h2>
              <p>
                Typist encourages you to test your types just like you test your runtime code. Here's how to create a comprehensive type test suite:
              </p>
              
              <Code language="typescript">{`import { test_, proof_, $Equal, $Extends, yes_, no_ } from '@typefirst/typist';

// Named test for user type validation
const userTypeTest = test_('User type structure', () => {
  // Test basic structure
  yes_<$Extends<User, { id: UserId }>>();
  yes_<$Extends<User, { name: string }>>();
  
  // Test that User is not assignable to simpler types
  no_<$Equal<User, { id: string }>>();
  
  return t_<User>();
});

// Mathematical-style proof for type distributivity
const distributivityProof = proof_('Union type distributivity', () => {
  type Distribute<T, U> = T extends any ? T | U : never;
  
  yes_<$Equal<
    Distribute<'a' | 'b', 'c'>,
    'a' | 'c' | 'b' | 'c'
  >>();
  
  return t_<boolean>();
});

// Generic constraint testing
const repositoryTest = test_('Repository pattern constraints', () => {
  interface Entity {
    id: string;
  }
  
  interface Repository<T extends Entity> {
    save(entity: T): Promise<T>;
    findById(id: string): Promise<T | null>;
  }
  
  type UserRepository = Repository<User>;
  
  // Test that repository methods have correct signatures
  extends_<Parameters<UserRepository['save']>[0], User>();
  extends_<ReturnType<UserRepository['findById']>, Promise<User | null>>();
  
  return t_<UserRepository>();
});`}</Code>
              
              <BasicUsageIntroduction />
              
              <h2>Common Patterns</h2>
              
              <h3>Branded Types for Domain Safety</h3>
              <p>Use phantom types to prevent mixing up similar values:</p>
              
              <Code language="typescript">{`// Before: Easy to mix up
function transferMoney(fromAccount: string, toAccount: string, amount: number) {
  // What if someone passes arguments in wrong order?
}

// After: Type-safe with brands
type AccountId = string & { readonly __brand: 'AccountId' };
type Amount = number & { readonly __brand: 'Amount' };

function transferMoney(fromAccount: AccountId, toAccount: AccountId, amount: Amount) {
  // Impossible to mix up parameters!
}`}</Code>
              
              <h3>Compile-Time Configuration Validation</h3>
              <p>Validate configuration objects at build time:</p>
              
              <Code language="typescript">{`interface Config {
  database: {
    host: string;
    port: number;
  };
  features: {
    enableNewUI: boolean;
    maxUsers: number;
  };
}

// Validate config at compile time
function validateConfig<T>(config: T) {
  extends_<T, Config>();
  has_<"database", { host: string; port: number }>(config);
  has_<"features", { enableNewUI: boolean; maxUsers: number }>(config);
  return config;
}`}</Code>
              
              <h2>Next Steps</h2>
              <p>
                Now that you've seen the basics, explore these areas to deepen your understanding:
              </p>
              
              <ul>
                <li><a href="/docs/typist/phantom-types">Phantom Types</a> - Master nominal typing patterns</li>
                <li><a href="/docs/typist/verdicts">Verdict System</a> - Learn about compile-time validation</li>
                <li><a href="/docs/typist/operators">Type Operators</a> - Explore comparison and transformation utilities</li>
                <li><a href="/docs/typist/assertions">Type Assertions</a> - Build robust type tests</li>
              </ul>

              {/* Interactive scenarios */}
              <div className="mt-8">
                <h2>Interactive Learning</h2>
                <p className="mb-6">
                  Master typist concepts through hands-on practice with our interactive scenarios:
                </p>
                
                <div className="grid gap-4 mb-6">
                  <CodeExplorerLink
                    slug="typist-phantom-types-basics"
                    name="Phantom Types Basics"
                    description="Learn the fundamentals of phantom types and type-level programming with typist. Create phantom values and build branded types."
                  />
                  
                  <CodeExplorerLink
                    slug="typist-type-comparisons"
                    name="Type Comparisons & Verdicts"
                    description="Master type-level comparisons using $Equal, $Extends, and the verdict system. Learn to create compile-time assertions."
                  />
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-amber-900 mt-0 mb-3">
                  🚀 Pro Tip
                </h3>
                <p className="text-amber-800 mb-0">
                  Start small! Begin by adding phantom types to distinguish similar values in your existing code, 
                  then gradually introduce more advanced typist patterns as you become comfortable with type-level thinking.
                </p>
              </div>
            </div>

            {/* Page navigation */}
            <DocNavigation 
              library={library} 
              currentPage={page}
              className="mt-12"
            />
          </article>
        </main>
      </div>
    </div>
  );
}