import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { getDocPageBySlug, getDocBreadcrumbs, buildDocNavigation } from '@/lib/content/doc.model';
import { DocBreadcrumbs } from '@/lib/content/ui/doc/doc-breadcrumbs.cmp.iso';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { DocNavigation } from '@/lib/content/ui/doc/doc-navigation.cmp.iso';
import { Code } from '@/lib/content/ui/code.cmp.iso';
import { Calendar, User } from 'lucide-react';
import { PhantomTypesExplanation } from '@/content/docs/typist/body';
import { phantomValuesSnippet } from '@/content/docs/typist/snippets/phantom-values';

export async function generateMetadata() {
  const library = getDocLibraryBySlug('typist');
  const page = getDocPageBySlug(library!, 'phantom-types');
  
  return {
    title: `${page?.title} - ${library?.name}`,
    description: page?.description,
  };
}

export default function TypistPhantomTypesPage() {
  const library = getDocLibraryBySlug('typist');
  
  if (!library) {
    notFound();
  }

  const page = getDocPageBySlug(library, 'phantom-types');
  
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
              <PhantomTypesExplanation />
              
              <h2>Understanding Phantom Types</h2>
              <p>
                Phantom types are a powerful pattern that allows you to create distinct types that share the same runtime representation 
                but are treated as completely different by the type system. This enables you to encode additional information in types 
                without any runtime overhead.
              </p>
              
              <h3>The Problem: Primitive Obsession</h3>
              <p>
                Consider this common scenario where we use strings for different purposes:
              </p>
              
              <Code language="typescript">{`// Problematic: All are just strings at the type level
function createUser(userId: string, email: string, name: string) {
  // Easy to accidentally swap parameters!
  return saveUser(email, userId, name); // ❌ Bug: swapped userId and email
}

function sendEmail(to: string, from: string, subject: string) {
  // What if someone passes a user ID instead of an email?
  mail.send(to, from, subject);
}

// Usage - no protection against mistakes
createUser("user@example.com", "123", "John"); // ❌ Parameters swapped!`}</Code>
              
              <h3>The Solution: Phantom Types</h3>
              <p>
                With phantom types, we can create distinct types that prevent these mistakes:
              </p>
              
              <Code language="typescript">{phantomValuesSnippet}</Code>
              
              <h2>Creating Phantom Values</h2>
              <p>
                Typist provides several utilities for creating phantom values. These are compile-time-only constructs 
                that help you work with phantom types:
              </p>
              
              <Code language="typescript">{`import { t_, type_, t } from '@type-first/typist';

// All of these create the same phantom value
const userIdPhantom = t_<UserId>();
const userIdPhantom2 = type_<UserId>();
const userIdPhantom3 = t<UserId>();

// You can use phantom values in type-level operations
type UserIdType = typeof userIdPhantom;  // UserId
type IsUserId = $Equal<UserIdType, UserId>; // $Yes

// Phantom values for complex types
type ApiResponse<T> = {
  data: T;
  status: number;
  success: boolean;
};

const responsePhantom = t_<ApiResponse<User>>();
type ResponseType = typeof responsePhantom; // ApiResponse<User>`}</Code>
              
              <h2>Branded Types Pattern</h2>
              <p>
                The most common way to implement phantom types is through "branded types" using intersection types:
              </p>
              
              <Code language="typescript">{`// Brand pattern: BaseType & { readonly __brand: 'BrandName' }
type UserId = string & { readonly __brand: 'UserId' };
type Email = string & { readonly __brand: 'Email' };
type ProductId = string & { readonly __brand: 'ProductId' };

// Helper functions for creating branded values
function createUserId(id: string): UserId {
  // In real code, you might validate the format here
  return id as UserId;
}

function createEmail(email: string): Email {
  // Email validation logic
  if (!email.includes('@')) {
    throw new Error('Invalid email');
  }
  return email as Email;
}

// Now our function is type-safe
function createUser(userId: UserId, email: Email, name: string) {
  return {
    id: userId,
    email: email,
    name: name
  };
}

// Usage
const userId = createUserId("user_123");
const email = createEmail("user@example.com");

createUser(userId, email, "John"); // ✅ Correct order enforced
// createUser(email, userId, "John"); // ❌ Compile error!`}</Code>
              
              <h2>Advanced Phantom Type Patterns</h2>
              
              <h3>State Machine Types</h3>
              <p>
                Phantom types can represent different states in a state machine:
              </p>
              
              <Code language="typescript">{`type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

type Connection<TState extends ConnectionState> = {
  readonly state: TState;
  readonly __phantom: TState;
} & (
  TState extends 'disconnected' ? { connect(): Connection<'connecting'> } :
  TState extends 'connecting' ? { cancel(): Connection<'disconnected'> } :
  TState extends 'connected' ? { 
    disconnect(): Connection<'disconnected'>;
    send(data: string): void;
  } :
  TState extends 'error' ? { retry(): Connection<'connecting'> } :
  never
);

// Usage
declare const disconnectedConn: Connection<'disconnected'>;

const connecting = disconnectedConn.connect(); // Type: Connection<'connecting'>
const connected = connecting; // In real code, this would be the result of awaiting connection

if (connected.state === 'connected') {
  connected.send("Hello!"); // ✅ Only available when connected
  // connected.connect(); // ❌ connect() not available when already connected
}`}</Code>
              
              <h3>Units of Measure</h3>
              <p>
                Phantom types can encode units of measurement:
              </p>
              
              <Code language="typescript">{`type Meters = number & { readonly __unit: 'meters' };
type Feet = number & { readonly __unit: 'feet' };
type Seconds = number & { readonly __unit: 'seconds' };

function meters(value: number): Meters {
  return value as Meters;
}

function feet(value: number): Feet {
  return value as Feet;
}

function seconds(value: number): Seconds {
  return value as Seconds;
}

// Conversion functions
function metersToFeet(m: Meters): Feet {
  return feet(m * 3.28084);
}

function calculateSpeed(distance: Meters, time: Seconds): number {
  return distance / time; // Returns meters per second
}

// Usage
const distance = meters(100);
const time = seconds(10);
const speed = calculateSpeed(distance, time); // ✅ Type safe

// calculateSpeed(feet(100), time); // ❌ Can't mix units!`}</Code>
              
              <h3>Permission Systems</h3>
              <p>
                Model permission levels with phantom types:
              </p>
              
              <Code language="typescript">{`type Permission = 'read' | 'write' | 'admin';

type SecureData<TPermission extends Permission> = {
  data: string;
  readonly __permission: TPermission;
};

type User<TPermission extends Permission> = {
  id: UserId;
  name: string;
  readonly __permission: TPermission;
};

// Only admin users can access admin data
function accessAdminData<T extends Permission>(
  user: User<T>,
  data: SecureData<'admin'>
): T extends 'admin' ? string : never {
  // Compile-time check that user has admin permission
  return user.__permission extends 'admin' ? data.data as any : never as any;
}

// Usage
declare const adminUser: User<'admin'>;
declare const readUser: User<'read'>;
declare const adminData: SecureData<'admin'>;

const result1 = accessAdminData(adminUser, adminData); // ✅ Works
// const result2 = accessAdminData(readUser, adminData); // ❌ Compile error`}</Code>
              
              <h2>Testing Phantom Types</h2>
              <p>
                Use typist's testing utilities to verify your phantom type implementations:
              </p>
              
              <Code language="typescript">{`import { $Equal, $Extends, yes_, no_, test_ } from '@type-first/typist';

const phantomTypeTests = test_('Phantom type validation', () => {
  // Test that branded types are distinct
  no_<$Equal<UserId, Email>>();
  no_<$Equal<UserId, string>>();
  no_<$Equal<Email, string>>();
  
  // Test that they extend their base type for runtime compatibility
  yes_<$Extends<UserId, string>>();
  yes_<$Extends<Email, string>>();
  
  // Test state machine transitions
  type DisconnectedConn = Connection<'disconnected'>;
  type ConnectingConn = Connection<'connecting'>;
  
  // Verify state machine structure
  yes_<$Extends<DisconnectedConn, { connect(): any }>>();
  no_<$Extends<DisconnectedConn, { send(data: string): void }>>();
  
  return t_<boolean>();
});`}</Code>
              
              <h2>Best Practices</h2>
              
              <h3>Naming Conventions</h3>
              <ul>
                <li>Use descriptive names that indicate the domain: <code>UserId</code>, <code>EmailAddress</code>, <code>ProductSku</code></li>
                <li>For units, include the unit in the name: <code>Meters</code>, <code>Seconds</code>, <code>Dollars</code></li>
                <li>For states, use clear state names: <code>PendingOrder</code>, <code>ConfirmedOrder</code></li>
              </ul>
              
              <h3>Brand Property</h3>
              <ul>
                <li>Use consistent brand property names: <code>__brand</code>, <code>__phantom</code>, or <code>__tag</code></li>
                <li>Make brand properties <code>readonly</code> to prevent runtime modification</li>
                <li>Use string literals for brand values to enable better error messages</li>
              </ul>
              
              <h3>Creation Functions</h3>
              <ul>
                <li>Provide factory functions for creating branded values safely</li>
                <li>Include validation logic in factory functions</li>
                <li>Use descriptive names: <code>createUserId</code>, <code>parseEmail</code>, <code>validateProductSku</code></li>
              </ul>
              
              <h2>Common Pitfalls</h2>
              
              <h3>Runtime Confusion</h3>
              <p>
                Remember that phantom types are compile-time only. At runtime, branded values are just their base type:
              </p>
              
              <Code language="typescript">{`const userId: UserId = "user_123" as UserId;
console.log(typeof userId); // "string" - not "UserId"!

// Don't rely on runtime type checking
if (userId instanceof UserId) { // ❌ This doesn't work
  // ...
}

// Instead, use validation functions
function isValidUserId(value: string): value is UserId {
  return value.startsWith('user_');
}`}</Code>
              
              <h3>Excessive Branding</h3>
              <p>
                Don't create phantom types for every string or number. Only use them when:
              </p>
              <ul>
                <li>Values can be easily confused (IDs, emails, phone numbers)</li>
                <li>Type safety provides significant business value</li>
                <li>The domain naturally has distinct concepts</li>
              </ul>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-blue-900 mt-0 mb-3">
                  💡 Key Takeaway
                </h3>
                <p className="text-blue-800 mb-0">
                  Phantom types are about encoding domain knowledge in the type system. They help prevent bugs by making 
                  invalid states unrepresentable, turning runtime errors into compile-time errors.
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