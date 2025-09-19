/**
 * Typist Documentation - UI Components
 * Documentation content rendered as JSX components
 */

import React from 'react';

export function IntroductionPage() {
  return (
    <div className="prose prose-blue max-w-none">
      <h1>Introduction to Typist</h1>
      
      <p className="lead">
        Typist is a minimal, compositional, and debug-friendly suite of type-level utilities 
        designed for static analysis, symbolic testing, and phantom type operations in TypeScript.
      </p>
      
      <h2>What is Typist?</h2>
      
      <p>
        Typist treats types as first-class values, leveraging TypeScript's structural type system 
        to encode symbolic verdicts, composable constraints, and static proofs. It provides a 
        powerful toolkit for type-level programming that enables:
      </p>
      
      <ul>
        <li><strong>Phantom types</strong> to represent symbolic or nominal values without runtime cost</li>
        <li><strong>Assertions</strong> to test assignability, identity, and structure in-place</li>
        <li><strong>Verdict encoding</strong> for static error annotation, debugging, and type introspection</li>
        <li><strong>Symbolic inference</strong> and type comparison as first-class idioms</li>
      </ul>
      
      <h2>Why Typist?</h2>
      
      <p>
        Traditional TypeScript development often requires runtime checks and validation to ensure 
        type safety. Typist shifts this validation to compile-time, enabling you to:
      </p>
      
      <ul>
        <li>Catch type errors before they reach production</li>
        <li>Build more expressive and self-documenting APIs</li>
        <li>Create robust type-level test suites</li>
        <li>Eliminate runtime overhead for type checking</li>
      </ul>
      
      <h2>Core Philosophy</h2>
      
      <p>
        Typist follows these key principles:
      </p>
      
      <dl>
        <dt><strong>Minimal</strong></dt>
        <dd>Small, focused utilities that compose well together</dd>
        
        <dt><strong>Compositional</strong></dt>
        <dd>Building blocks that can be combined to create complex type-level logic</dd>
        
        <dt><strong>Debug-friendly</strong></dt>
        <dd>Clear error messages and introspectable type-level behavior</dd>
        
        <dt><strong>Zero runtime cost</strong></dt>
        <dd>All utilities operate at compile-time with no runtime overhead</dd>
      </dl>
      
      <h2>Getting Started</h2>
      
      <p>
        Ready to dive in? Check out our <a href="/docs/typist/installation">Installation Guide</a> 
        to set up typist in your project, or jump straight to the{' '}
        <a href="/docs/typist/quick-start">Quick Start</a> for hands-on examples.
      </p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-blue-900 mt-0 mb-3">
          💡 Pro Tip
        </h3>
        <p className="text-blue-800 mb-0">
          Typist works best when you embrace type-first thinking. Start with the types 
          you want to express, then use typist's utilities to encode and validate those 
          type relationships.
        </p>
      </div>
    </div>
  );
}

export function InstallationPage() {
  return (
    <div className="prose prose-blue max-w-none">
      <h1>Installation</h1>
      
      <p className="lead">
        Get started with typist by installing it in your TypeScript project.
      </p>
      
      <h2>Prerequisites</h2>
      
      <p>
        Typist requires TypeScript 4.5 or later for optimal type inference and error reporting.
      </p>
      
      <ul>
        <li>TypeScript 4.5+</li>
        <li>Node.js 14+ (for development)</li>
      </ul>
      
      <h2>Package Installation</h2>
      
      <p>Install typist using your preferred package manager:</p>
      
      <h3>npm</h3>
      <pre><code>{`npm install @type-first/typist`}</code></pre>
      
      <h3>yarn</h3>
      <pre><code>{`yarn add @type-first/typist`}</code></pre>
      
      <h3>pnpm</h3>
      <pre><code>{`pnpm add @type-first/typist`}</code></pre>
      
      <h2>TypeScript Configuration</h2>
      
      <p>
        Ensure your <code>tsconfig.json</code> has strict type checking enabled for the best 
        experience with typist:
      </p>
      
      <pre><code>{`{
  "compilerOptions": {
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true
  }
}`}</code></pre>
      
      <h2>Local Development Setup</h2>
      
      <p>
        If you're working with a local monorepo or want to contribute to typist, 
        you can set up the package locally:
      </p>
      
      <pre><code>{`# Clone the repository
git clone https://github.com/type-first/typist.git
cd typist

# Install dependencies
npm install

# Build the package
npm run build

# Link for local development
npm link`}</code></pre>
      
      <p>Then in your project:</p>
      
      <pre><code>{`npm link @type-first/typist`}</code></pre>
      
      <h2>Verification</h2>
      
      <p>
        Verify your installation by creating a simple test file:
      </p>
      
      <pre><code>{`// test-typist.ts
import { t_, $Equal, yes_ } from '@type-first/typist';

// Create a phantom value
const stringValue = t_<string>();

// Test type equality
type IsEqual = $Equal<string, string>; // $Yes

// Assert the result
yes_<IsEqual>(); // ✅ compiles successfully

console.log('Typist is installed and working!');`}</code></pre>
      
      <p>Run the TypeScript compiler:</p>
      
      <pre><code>{`npx tsc test-typist.ts --noEmit`}</code></pre>
      
      <p>If typist is installed correctly, this should compile without errors.</p>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-green-900 mt-0 mb-3">
          ✅ Next Steps
        </h3>
        <p className="text-green-800 mb-0">
          Great! Now that typist is installed, head over to the{' '}
          <a href="/docs/typist/quick-start" className="text-green-700 underline">
            Quick Start guide
          </a>{' '}
          to learn the basics, or explore the{' '}
          <a href="/docs/typist/concepts" className="text-green-700 underline">
            Core Concepts
          </a>{' '}
          for a deeper understanding.
        </p>
      </div>
    </div>
  );
}

export function QuickStartPage() {
  return (
    <div className="prose prose-blue max-w-none">
      <h1>Quick Start</h1>
      
      <p className="lead">
        Get up and running with typist in minutes. This guide covers the essential 
        patterns you'll use in everyday type-level programming.
      </p>
      
      <h2>Basic Import</h2>
      
      <p>Start by importing the core utilities:</p>
      
      <pre><code>{`import { 
  t_, 
  $Equal, 
  $Extends, 
  yes_, 
  no_, 
  extends_, 
  example_ 
} from '@type-first/typist';`}</code></pre>
      
      <h2>Creating Phantom Values</h2>
      
      <p>
        Phantom values let you work with types as if they were runtime values, 
        without any runtime cost:
      </p>
      
      <pre><code>{`// Create phantom values for any type
const user = t_<{ name: string; age: number }>();
const id = t_<string>();
const count = t_<number>();

// Use them in type-level operations
type UserType = typeof user; // { name: string; age: number }`}</code></pre>
      
      <h2>Type Comparisons</h2>
      
      <p>Test relationships between types using comparison utilities:</p>
      
      <pre><code>{`// Test if one type extends another
type StringExtendsAny = $Extends<string, any>;     // $Yes
type AnyExtendsString = $Extends<any, string>;     // $No<...>

// Test exact type equality
type StringsEqual = $Equal<string, string>;        // $Yes
type StringNumberEqual = $Equal<string, number>;   // $No<...>

// More complex type relationships
type LiteralExtendsString = $Extends<"hello", string>; // $Yes
type ObjectsEqual = $Equal<
  { a: number }, 
  { a: number }
>; // $Yes`}</code></pre>
      
      <h2>Static Assertions</h2>
      
      <p>Use assertions to enforce type relationships at compile-time:</p>
      
      <pre><code>{`// Assert that a type extends another
extends_<string, "hello">();     // ✅ compiles
// extends_<"hello", string>();  // ❌ compile error

// Assert verdict results
yes_<$Equal<number, number>>();   // ✅ compiles
// yes_<$Equal<string, number>>(); // ❌ compile error

// Test object shapes
has_<"name", string>({ name: "John", age: 30 }); // ✅ compiles`}</code></pre>
      
      <h2>Creating Type Tests</h2>
      
      <p>Build structured test suites for your types:</p>
      
      <pre><code>{`// Create a test block
example_('User type validation', () => {
  // Test basic properties
  extends_<User['name'], string>();
  extends_<User['age'], number>();
  
  // Test that optional properties work correctly
  extends_<Partial<User>, { name?: string; age?: number }>();
  
  // Test type relationships
  const equalityTest = $Equal<
    Required<Partial<User>>, 
    User
  >;
  yes_(equalityTest);
});

// Named examples for documentation
const basicStringTest = example_('String literal relationships', () => {
  extends_<"hello", string>();
  extends_<"world", string>();
  
  // This should fail:
  // @ts-expect-error
  extends_<string, "hello">();
});`}</code></pre>
      
      <h2>Working with Complex Types</h2>
      
      <p>Handle more sophisticated type-level programming:</p>
      
      <pre><code>{`// Define a utility type
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? DeepReadonly<T[P]> 
    : T[P];
};

// Test the utility type
example_('DeepReadonly utility', () => {
  type Original = {
    user: { name: string; settings: { theme: string } };
    count: number;
  };
  
  type ReadonlyVersion = DeepReadonly<Original>;
  
  // Verify the transformation worked
  extends_<ReadonlyVersion['count'], number>();
  extends_<ReadonlyVersion['user']['name'], string>();
  
  // Verify readonly properties
  const readonlyTest = $Equal<
    ReadonlyVersion['user'],
    { readonly name: string; readonly settings: { readonly theme: string } }
  >;
  yes_(readonlyTest);
});`}</code></pre>
      
      <h2>Debugging Type Issues</h2>
      
      <p>When types don't match expectations, typist provides helpful debugging:</p>
      
      <pre><code>{`// Get detailed information about why types don't match
type DebugResult = $Equal<
  { a: string }, 
  { a: number }
>; // $No<'not-equal', [{ a: string }, { a: number }]>

// The verdict contains debugging information
no_<DebugResult>(); // Use this to inspect the mismatch

// For extends relationships
type ExtendsDebug = $Extends<
  { a: string }, 
  { a: number; b: string }
>; // $No<'right-does-not-extend-left', [...]>`}</code></pre>
      
      <h2>Common Patterns</h2>
      
      <p>Here are some patterns you'll use frequently:</p>
      
      <pre><code>{`// 1. Validate API response types
type ApiUser = { id: string; name: string; email: string };

example_('API response validation', () => {
  // Ensure all required fields are present
  extends_<keyof ApiUser, 'id' | 'name' | 'email'>();
  
  // Ensure no extra fields
  extends_<'id' | 'name' | 'email', keyof ApiUser>();
});

// 2. Test generic type constraints
function createRepository<T extends { id: string }>() {
  return {
    findById: (id: string): T | null => null as any,
    save: (entity: T): void => {}
  };
}

example_('Repository constraints', () => {
  type ValidEntity = { id: string; data: any };
  type InvalidEntity = { data: any }; // missing 'id'
  
  // This should work
  extends_<ValidEntity, { id: string }>();
  
  // This should fail (uncomment to test)
  // extends_<InvalidEntity, { id: string }>();
});

// 3. Branded types validation
type UserId = string & { readonly brand: unique symbol };
type ProductId = string & { readonly brand: unique symbol };

example_('Branded types', () => {
  // These should be different types despite both being strings
  const userIdTest = $Equal<UserId, ProductId>;
  no_(userIdTest); // They should NOT be equal
});`}</code></pre>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-blue-900 mt-0 mb-3">
          🚀 What's Next?
        </h3>
        <p className="text-blue-800 mb-0">
          You're now ready to use typist effectively! Explore the{' '}
          <a href="/docs/typist/concepts" className="text-blue-700 underline">
            Core Concepts
          </a>{' '}
          to understand the theory behind typist, or dive into the{' '}
          <a href="/docs/typist/api" className="text-blue-700 underline">
            API Reference
          </a>{' '}
          for comprehensive documentation of all available utilities.
        </p>
      </div>
    </div>
  );
}

export function PhantomTypesPage() {
  return (
    <div className="prose prose-blue max-w-none">
      <h1>Phantom Types</h1>
      
      <p className="lead">
        Phantom types are the foundation of typist's approach to type-level programming. 
        They allow you to work with types as if they were runtime values, enabling 
        powerful compile-time analysis and validation.
      </p>
      
      <h2>What are Phantom Types?</h2>
      
      <p>
        A phantom type is a type that carries information at the type level but has 
        no corresponding runtime representation. In typist, we create phantom values 
        that "lie to the compiler" by casting <code>null</code> or <code>undefined</code> 
        to any type we want to work with.
      </p>
      
      <pre><code>{`// The core phantom value creator
export const t_ = <T>(x: unknown = null): T => x as T;

// Usage examples
const user = t_<{ name: string; age: number }>();
const id = t_<string>();
const config = t_<{ theme: 'dark' | 'light' }>();`}</code></pre>
      
      <h2>Why Use Phantom Types?</h2>
      
      <p>Phantom types enable several powerful patterns:</p>
      
      <ul>
        <li><strong>Type-level testing</strong> - Test type relationships without runtime overhead</li>
        <li><strong>Symbolic computation</strong> - Perform calculations at the type level</li>
        <li><strong>Zero-cost abstractions</strong> - Express complex type constraints with no runtime impact</li>
        <li><strong>Compile-time validation</strong> - Catch errors before they reach production</li>
      </ul>
      
      <h2>Creating Phantom Values</h2>
      
      <p>
        The <code>t_</code> function (and its aliases <code>type_</code> and <code>t</code>) 
        creates phantom values for any type:
      </p>
      
      <pre><code>{`import { t_, type_, t } from '@type-first/typist';

// All equivalent ways to create phantom values
const value1 = t_<string>();
const value2 = type_<string>();
const value3 = t<string>();

// Complex types work too
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

const response = t_<ApiResponse<User>>();`}</code></pre>
      
      <h2>Phantom Value Operators</h2>
      
      <p>Typist provides several operators for working with phantom values:</p>
      
      <pre><code>{`import { 
  assign_, a_, a,    // Assignment with type preservation
  widen_, w_, w,     // Widen types to their literal forms
  specify_, s_, s,   // Specify more concrete types
  intersect_,        // Create intersection types
  force_, f_, f,     // Force any type (unsafe)
  any_, __           // Create any-typed values
} from '@type-first/typist';

// Assignment preserves exact types
const exact = a_({ name: "John", age: 30 });
// typeof exact: { name: "John"; age: 30 }

// Widening converts to general types
const wide = w_({ name: "John", age: 30 });
// typeof wide: { name: string; age: number }

// Specify narrows types
const specify = s_<{ name: string }>(); 
const narrowed = specify({ name: "John", age: 30 });
// typeof narrowed: { name: string }

// Intersection combines types
const combined = intersect_(
  t_<{ a: string }>(),
  t_<{ b: number }>()
);
// typeof combined: { a: string } & { b: number }`}</code></pre>
      
      <h2>Best Practices</h2>
      
      <ul>
        <li><strong>Use descriptive variable names</strong> - <code>const userType = t_&lt;User&gt;()</code> is clearer than <code>const u = t_&lt;User&gt;()</code></li>
        <li><strong>Prefer <code>t_</code> for brevity</strong> - It's the most commonly used phantom creator</li>
        <li><strong>Combine with type assertions</strong> - Use phantom values to set up type-level tests</li>
        <li><strong>Document complex phantom types</strong> - Add comments explaining the purpose of complex phantom constructions</li>
      </ul>
      
      <h2>Common Patterns</h2>
      
      <pre><code>{`// 1. Type-level function testing
type MapArray<T> = T extends readonly (infer U)[] ? U[] : never;

example_('MapArray utility', () => {
  const input = t_<readonly string[]>();
  const output = t_<MapArray<typeof input>>();
  
  extends_<typeof output, string[]>();
});

// 2. API contract validation
type UserApi = {
  getUser: (id: string) => Promise<User>;
  updateUser: (id: string, data: Partial<User>) => Promise<User>;
};

example_('API contract', () => {
  const api = t_<UserApi>();
  
  // Validate method signatures
  extends_<Parameters<typeof api.getUser>[0], string>();
  extends_<ReturnType<typeof api.getUser>, Promise<User>>();
});

// 3. Generic constraint testing
function createValidator<T extends Record<string, any>>() {
  return (obj: T): boolean => true;
}

example_('Generic constraints', () => {
  type ValidInput = { name: string; age: number };
  type InvalidInput = string; // not a record
  
  // This should work
  extends_<ValidInput, Record<string, any>>();
  
  // This should fail (uncomment to test)
  // extends_<InvalidInput, Record<string, any>>();
});`}</code></pre>
    </div>
  );
}

export function VerdictsPage() {
  return (
    <div className="prose prose-blue max-w-none">
      <h1>Verdicts</h1>
      
      <p className="lead">
        Verdicts are symbolic markers that encode the results of type-level comparisons. 
        They provide structured, debuggable feedback about type relationships.
      </p>
      
      <h2>The Verdict System</h2>
      
      <p>
        Every type comparison in typist returns a verdict - either <code>$Yes</code> for 
        successful comparisons or <code>$No</code> for failures. This system provides 
        rich debugging information when types don't match expectations.
      </p>
      
      <pre><code>{`// Core verdict types
export type $Verdict = { $___verdict: boolean };

export type $Yes = {
  $___verdict: true;
  $___type_error: false;
};

export type $No<
  Key extends string,
  Dump extends readonly any[] = []
> = {
  $___verdict: false;
  $___type_error: true;
  $___type_error_key: Key;
  $___dump: Dump;
};

export type $Maybe = $Verdict & ($Yes | $No<string>);`}</code></pre>
      
      <h2>Understanding Verdict Results</h2>
      
      <p>When a type comparison succeeds, you get a simple <code>$Yes</code>:</p>
      
      <pre><code>{`type SuccessfulComparison = $Extends<string, any>;
// Result: $Yes

type ExactMatch = $Equal<number, number>;
// Result: $Yes`}</code></pre>
      
      <p>
        When a comparison fails, you get a <code>$No</code> with debugging information:
      </p>
      
      <pre><code>{`type FailedExtends = $Extends<any, string>;
// Result: $No<'right-does-not-extend-left', [any, string]>

type FailedEquality = $Equal<string, number>;
// Result: $No<'not-equal', [string, number]>`}</code></pre>
      
      <h2>Working with Verdicts</h2>
      
      <p>Use verdict assertion functions to enforce type relationships:</p>
      
      <pre><code>{`import { yes_, no_, decidable_ } from '@type-first/typist';

// Assert a positive verdict
yes_<$Equal<string, string>>();  // ✅ compiles
// yes_<$Equal<string, number>>(); // ❌ type error

// Assert a negative verdict
no_<$Equal<string, number>>();   // ✅ compiles
// no_<$Equal<string, string>>();  // ❌ type error

// Accept any verdict (for exhaustive testing)
decidable_<$Equal<string, any>>(); // ✅ always compiles`}</code></pre>
      
      <h2>Debugging with Verdicts</h2>
      
      <p>
        The structured information in <code>$No</code> verdicts helps you understand 
        exactly why a type comparison failed:
      </p>
      
      <pre><code>{`// Complex type debugging
type ComplexType = {
  users: Array<{
    id: string;
    profile: {
      name: string;
      settings: {
        theme: 'light' | 'dark';
        notifications: boolean;
      };
    };
  }>;
};

type SimilarType = {
  users: Array<{
    id: string;
    profile: {
      name: string;
      settings: {
        theme: 'light' | 'dark';
        notifications: string; // 👈 Different type here!
      };
    };
  }>;
};

type ComparisonResult = $Equal<ComplexType, SimilarType>;
// Result: $No<'not-equal', [ComplexType, SimilarType]>

// The verdict tells you these types are not equal
// and includes both types in the dump for inspection
no_<ComparisonResult>();`}</code></pre>
      
      <h2>Custom Verdict Functions</h2>
      
      <p>You can create your own verdict-based utilities:</p>
      
      <pre><code>{`// Custom assertion that accepts either Yes or No
function assertVerdict<T extends $Maybe>(verdict?: T) {
  // This function accepts any verdict, useful for testing
}

// Custom utility that only accepts successful verdicts
function requireSuccess<T extends $Yes>(verdict?: T) {
  return true;
}

// Usage
const stringTest = $Equal<string, string>;
assertVerdict<typeof stringTest>(); // ✅ works for any verdict
requireSuccess<typeof stringTest>(); // ✅ only works for $Yes`}</code></pre>
      
      <h2>Verdict Patterns</h2>
      
      <pre><code>{`// 1. Exhaustive type relationship testing
example_('Exhaustive testing', () => {
  type A = { a: string };
  type B = { a: string; b: number };
  
  // Test all possible relationships
  yes_<$Extends<A, A>>();           // A extends A
  no_<$Extends<A, B>>();            // A does not extend B
  yes_<$Extends<B, A>>();           // B extends A (structural)
  no_<$Equal<A, B>>();              // A is not equal to B
});

// 2. Conditional verdict handling
type CheckOptional<T, K extends keyof T> = 
  undefined extends T[K] 
    ? $Yes 
    : $No<'property-not-optional', [T, K]>;

type UserName = CheckOptional<{ name?: string }, 'name'>; // $Yes
type UserAge = CheckOptional<{ age: number }, 'age'>;     // $No<...>

// 3. Verdict composition
type AllExtend<T, U> = 
  T extends U 
    ? U extends T 
      ? $Yes 
      : $No<'right-does-not-extend-left', [T, U]>
    : $No<'left-does-not-extend-right', [T, U]>;

type BidirectionalTest = AllExtend<string, any>; // $No<...>`}</code></pre>
    </div>
  );
}

export function OperatorsApiPage() {
  return (
    <div className="prose prose-blue max-w-none">
      <h1>Operators API</h1>
      
      <p className="lead">
        Core operators for creating and manipulating phantom values. These are the 
        building blocks for all type-level operations in typist.
      </p>
      
      <h2>Phantom Value Creators</h2>
      
      <h3><code>t_&lt;T&gt;(x?)</code></h3>
      <p>The primary phantom value creator. Converts any value to the specified type.</p>
      
      <pre><code>{`export const t_ = <T>(x: unknown = null): T => x as T;

// Aliases
export const type_ = t_;
export const t = t_;

// Usage
const str = t_<string>();
const obj = t_<{ name: string }>();
const arr = t_<number[]>();`}</code></pre>
      
      <h3><code>assign_&lt;T&gt;(v)</code></h3>
      <p>Preserves the exact type of a value, useful for maintaining literal types.</p>
      
      <pre><code>{`export const assign_ = <T>(v: T): T => v as T;

// Aliases
export const a_ = assign_;
export const a = a_;

// Usage
const exact = a_({ name: "John", age: 30 });
// Type: { name: "John"; age: 30 } (preserves literals)

const regular = { name: "John", age: 30 };
// Type: { name: string; age: number } (widened)`}</code></pre>
      
      <h3><code>widen_&lt;T&gt;(v)</code></h3>
      <p>Explicitly widens literal types to their base types.</p>
      
      <pre><code>{`export const widen_ = <const T>(v: T) => t_<T>(v);

// Aliases
export const w_ = widen_;
export const w = w_;

// Usage
const literal = "hello" as const;
const widened = w_(literal);
// Type: "hello" (the const assertion preserves the literal)`}</code></pre>
      
      <h2>Type Specification</h2>
      
      <h3><code>specify_&lt;T&gt;(v?)</code></h3>
      <p>Creates a function that narrows types to a more specific constraint.</p>
      
      <pre><code>{`export const specify_ = <T>(v?: T) => 
  <E extends T>(e_?: E) => t_<E>(v);

// Aliases
export const s_ = specify_;
export const s = s_;

// Usage
const specifyUser = s_<{ name: string }>();
const user = specifyUser({ name: "John", age: 30 });
// Type: { name: string } (narrowed to constraint)`}</code></pre>
      
      <h2>Type Combination</h2>
      
      <h3><code>intersect_&lt;T0, T1&gt;(v0, v1)</code></h3>
      <p>Creates intersection types from two phantom values.</p>
      
      <pre><code>{`export const intersect_ = <T0, T1>(v0: T0, v1: T1) => t_<T0 & T1>();

// Usage
const nameType = t_<{ name: string }>();
const ageType = t_<{ age: number }>();
const combined = intersect_(nameType, ageType);
// Type: { name: string } & { age: number }`}</code></pre>
      
      <h2>Unsafe Operations</h2>
      
      <h3><code>force_&lt;T&gt;(v?)</code></h3>
      <p>Forces any value to any type. Use with caution!</p>
      
      <pre><code>{`export const force_ = <T>(v: unknown = null) => t_<T>(v);

// Aliases
export const f_ = force_;
export const f = f_;

// Usage (be careful!)
const dangerous = f_<string>(123); // number forced to string
// This compiles but is unsafe`}</code></pre>
      
      <h3><code>any_(v?)</code></h3>
      <p>Creates a value of type <code>any</code>.</p>
      
      <pre><code>{`export const any_ = (v: any = null) => t_<any>(v);

// Aliases
export const __ = any_;

// Usage
const anything = any_();
const wildcard = __();
// Both have type: any`}</code></pre>
      
      <h2>Usage Patterns</h2>
      
      <h3>Chaining Operations</h3>
      <pre><code>{`// Combine multiple operators
const baseType = t_<{ id: string }>();
const extendedType = intersect_(
  baseType,
  t_<{ name: string; age: number }>()
);
const finalType = a_(extendedType);
// Type: { id: string } & { name: string; age: number }`}</code></pre>
      
      <h3>Building Type Factories</h3>
      <pre><code>{`// Create reusable type builders
function createEntity<T>() {
  return intersect_(
    t_<{ id: string; createdAt: Date }>(),
    t_<T>()
  );
}

const userEntity = createEntity<{ name: string; email: string }>();
// Type: { id: string; createdAt: Date } & { name: string; email: string }`}</code></pre>
      
      <h3>Type-Level Computation</h3>
      <pre><code>{`// Use operators for complex type derivations
type ExtractArrayElement<T> = T extends (infer U)[] ? U : never;

function processArray<T extends any[]>() {
  const arrayType = t_<T>();
  const elementType = t_<ExtractArrayElement<T>>();
  
  return {
    array: arrayType,
    element: elementType,
    mapped: t_<ExtractArrayElement<T>[]>()
  };
}

const stringArrayProcessor = processArray<string[]>();
// stringArrayProcessor.element has type: string`}</code></pre>
    </div>
  );
}

export function ComparatorsApiPage() {
  return (
    <div className="prose prose-blue max-w-none">
      <h1>Comparators API</h1>
      
      <p className="lead">
        Type-level comparison utilities that test relationships between types 
        and return structured verdicts.
      </p>
      
      <h2>Core Comparators</h2>
      
      <h3><code>$Extends&lt;L, R&gt;</code></h3>
      <p>Tests whether type <code>L</code> is assignable to type <code>R</code>.</p>
      
      <pre><code>{`export type $Extends<L, R> =
  [L] extends [R] ? $Yes 
  : $No<'right-does-not-extend-left', [L, R]>;

// Examples
type Test1 = $Extends<string, any>;        // $Yes
type Test2 = $Extends<"hello", string>;    // $Yes  
type Test3 = $Extends<string, "hello">;    // $No<...>
type Test4 = $Extends<number, string>;     // $No<...>`}</code></pre>
      
      <h3><code>$Equal&lt;T1, T2&gt;</code></h3>
      <p>Tests whether two types are exactly equal (mutual assignability).</p>
      
      <pre><code>{`export type $Equal<T1, T2> = 
  ([T1] extends [T2] ? 
    [T2] extends [T1] ? 
    true : false : false) extends true ? $Yes 
  : $No<'not-equal', [T1, T2]>;

// Examples
type Test1 = $Equal<string, string>;       // $Yes
type Test2 = $Equal<"hello", "hello">;     // $Yes
type Test3 = $Equal<string, "hello">;      // $No<...>
type Test4 = $Equal<{ a: 1 }, { a: 1 }>;   // $Yes`}</code></pre>
      
      <h2>Using Comparators</h2>
      
      <h3>Basic Type Testing</h3>
      <pre><code>{`import { $Extends, $Equal, yes_, no_ } from '@type-first/typist';

// Test inheritance relationships
yes_<$Extends<'hello', string>>();     // ✅ literal extends string
no_<$Extends<string, 'hello'>>();      // ❌ string doesn't extend literal

// Test exact equality
yes_<$Equal<number, number>>();         // ✅ same type
no_<$Equal<number, string>>();          // ❌ different types`}</code></pre>
      
      <h3>Object Type Comparisons</h3>
      <pre><code>{`type User = { name: string; age: number };
type PartialUser = { name: string };
type ExtendedUser = { name: string; age: number; email: string };

// Structural subtyping tests
yes_<$Extends<ExtendedUser, User>>();   // ✅ more props extends fewer
no_<$Extends<User, ExtendedUser>>();    // ❌ fewer props doesn't extend more
yes_<$Extends<User, PartialUser>>();    // ✅ has required property

// Exact shape tests
no_<$Equal<User, ExtendedUser>>();      // ❌ different shapes
yes_<$Equal<User, { name: string; age: number }>>();  // ✅ same shape`}</code></pre>
      
      <h3>Generic Type Testing</h3>
      <pre><code>{`// Test generic constraints
type ApiResponse<T> = { data: T; status: number };
type UserResponse = ApiResponse<User>;

// Verify generic instantiation
yes_<$Equal<
  UserResponse,
  { data: User; status: number }
>>();

// Test generic relationships
yes_<$Extends<
  ApiResponse<User>,
  { data: any; status: number }
>>();`}</code></pre>
      
      <h2>Advanced Patterns</h2>
      
      <h3>Conditional Type Validation</h3>
      <pre><code>{`// Test conditional type behavior
type NonNullable<T> = T extends null | undefined ? never : T;

// Verify the conditional type works correctly
yes_<$Equal<NonNullable<string>, string>>();
yes_<$Equal<NonNullable<string | null>, string>>();
yes_<$Equal<NonNullable<null>, never>>();`}</code></pre>
      
      <h3>Union Type Analysis</h3>
      <pre><code>{`type StringOrNumber = string | number;
type JustString = string;

// Union relationship testing
yes_<$Extends<JustString, StringOrNumber>>();  // ✅ member extends union
no_<$Extends<StringOrNumber, JustString>>();   // ❌ union doesn't extend member
no_<$Equal<StringOrNumber, JustString>>();     // ❌ not equal`}</code></pre>
      
      <h3>Mapped Type Verification</h3>
      <pre><code>{`type Readonly<T> = { readonly [P in keyof T]: T[P] };
type Optional<T> = { [P in keyof T]?: T[P] };

type TestType = { a: string; b: number };

// Test mapped type transformations
yes_<$Equal<
  Readonly<TestType>,
  { readonly a: string; readonly b: number }
>>();

yes_<$Equal<
  Optional<TestType>,
  { a?: string; b?: number }
>>();`}</code></pre>
      
      <h3>Complex Type Relationships</h3>
      <pre><code>{`// Test complex inheritance chains
interface Base {
  id: string;
}

interface Named extends Base {
  name: string;
}

interface User extends Named {
  email: string;
}

// Verify inheritance chain
yes_<$Extends<User, Named>>();
yes_<$Extends<User, Base>>();
yes_<$Extends<Named, Base>>();

// Test transitive relationships
yes_<$Extends<User, { id: string }>>();
no_<$Equal<User, Base>>();`}</code></pre>
      
      <h2>Debugging Failed Comparisons</h2>
      
      <p>
        When comparisons fail, the verdict contains debugging information:
      </p>
      
      <pre><code>{`// Failed comparison example
type FailedTest = $Equal<
  { name: string; age: number },
  { name: string; age: string }  // different age type
>;
// Result: $No<'not-equal', [{ name: string; age: number }, { name: string; age: string }]>

// Use the verdict to understand the failure
no_<FailedTest>();  // This will compile and show the types don't match

// You can extract the debugging information
type DebugInfo = FailedTest extends $No<infer Key, infer Dump> 
  ? { key: Key; types: Dump }
  : never;
// DebugInfo: { key: 'not-equal'; types: [{ name: string; age: number }, { name: string; age: string }] }`}</code></pre>
    </div>
  );
}

export function AssertionsApiPage() {
  return (
    <div className="prose prose-blue max-w-none">
      <h1>Assertions API</h1>
      
      <p className="lead">
        Runtime stubs for static type assertions. These functions are designed to be 
        invoked at the type level to enforce structural relationships and trigger 
        inference flows.
      </p>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-yellow-900 mt-0 mb-3">
          ⚠️ Important Note
        </h3>
        <p className="text-yellow-800 mb-0">
          These functions are <strong>not meant to execute at runtime</strong>. 
          They exist purely for compile-time type checking and should be used 
          in type-level tests and static assertions.
        </p>
      </div>
      
      <h2>Type Assignment Assertions</h2>
      
      <h3><code>is_&lt;T&gt;(x)</code></h3>
      <p>Asserts that a value is of type <code>T</code>.</p>
      
      <pre><code>{`export const is_ = <T>(x: T) => {};

// Alias
export const assignable_ = is_;

// Usage
is_<string>("hello");        // ✅ compiles
is_<number>("hello");        // ❌ type error

// Test assignability
const value: unknown = "test";
// is_<string>(value);       // ❌ unknown not assignable to string
is_<unknown>(value);         // ✅ compiles`}</code></pre>
      
      <h3><code>extends_&lt;T, E&gt;(x?, y?)</code></h3>
      <p>Asserts that type <code>E</code> extends type <code>T</code>.</p>
      
      <pre><code>{`export const extends_ = <T, E extends T>(x?: T, y?: E) => {};

// Usage
extends_<string, "hello">();     // ✅ literal extends string
extends_<any, string>();         // ✅ string extends any
// extends_<"hello", string>();  // ❌ string doesn't extend literal
// extends_<string, number>();    // ❌ number doesn't extend string`}</code></pre>
      
      <h2>Property Assertions</h2>
      
      <h3><code>has_&lt;P, V&gt;(x)</code></h3>
      <p>Asserts that an object has property <code>P</code> of type <code>V</code>.</p>
      
      <pre><code>{`export const has_ = <
  const P extends string,
  const V = any
>(x: { [k in P]: V }) => {};

// Usage
has_<"name", string>({ name: "John", age: 30 });     // ✅ has name: string
has_<"age", number>({ name: "John", age: 30 });      // ✅ has age: number
// has_<"email", string>({ name: "John", age: 30 }); // ❌ missing email property
// has_<"age", string>({ name: "John", age: 30 });   // ❌ age is number, not string`}</code></pre>
      
      <h2>Instance Assertions</h2>
      
      <h3><code>instance_&lt;T&gt;(x?)</code></h3>
      <p>Asserts that a value is an instance of constructor <code>T</code>.</p>
      
      <pre><code>{`export const instance_ = <T extends AnyClass>(x?: InstanceType<T>) => {};

type AnyClass = abstract new (...args: any[]) => any;

// Usage
class User {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

const user = new User("John");
instance_<typeof User>(user);        // ✅ user is instance of User
// instance_<typeof User>("string"); // ❌ string is not User instance`}</code></pre>
      
      <h2>Never Assertions</h2>
      
      <h3><code>never_&lt;T&gt;(x?)</code></h3>
      <p>Asserts that a type is <code>never</code> (unreachable code path).</p>
      
      <pre><code>{`export const never_ = <T extends never>(x?: T): never => x as never;

// Usage in exhaustive checks
type Color = 'red' | 'green' | 'blue';

function handleColor(color: Color) {
  switch (color) {
    case 'red':
      return 'Red color';
    case 'green':
      return 'Green color';
    case 'blue':
      return 'Blue color';
    default:
      return never_(color); // ✅ ensures all cases handled
  }
}`}</code></pre>
      
      <h2>Verdict Assertions</h2>
      
      <h3><code>decidable_&lt;T&gt;(t?)</code></h3>
      <p>Accepts any verdict result (either <code>$Yes</code> or <code>$No</code>).</p>
      
      <pre><code>{`export const decidable_ = <T extends $Maybe>(t?: T) => {};

// Usage
decidable_<$Equal<string, string>>();  // ✅ accepts $Yes
decidable_<$Equal<string, number>>();  // ✅ accepts $No
decidable_<$Extends<any, string>>();   // ✅ accepts any verdict`}</code></pre>
      
      <h3><code>yes_&lt;T&gt;(t?)</code></h3>
      <p>Only accepts successful verdicts (<code>$Yes</code>).</p>
      
      <pre><code>{`export const yes_ = <T extends $Yes>(t?: T) => true;

// Usage
yes_<$Equal<string, string>>();        // ✅ accepts $Yes
// yes_<$Equal<string, number>>();     // ❌ rejects $No
yes_<$Extends<"hello", string>>();     // ✅ accepts $Yes`}</code></pre>
      
      <h3><code>no_&lt;T&gt;(t?)</code></h3>
      <p>Only accepts failed verdicts (<code>$No</code>).</p>
      
      <pre><code>{`export const no_ = <T extends $No<string>>(t?: T) => {};

// Usage
no_<$Equal<string, number>>();         // ✅ accepts $No
// no_<$Equal<string, string>>();      // ❌ rejects $Yes
no_<$Extends<string, "hello">>();      // ✅ accepts $No`}</code></pre>
      
      <h2>Usage Patterns</h2>
      
      <h3>Building Type Test Suites</h3>
      <pre><code>{`example_('User type validation', () => {
  type User = { name: string; age: number; email?: string };
  
  // Test required properties
  has_<"name", string>({ name: "John", age: 30 });
  has_<"age", number>({ name: "John", age: 30 });
  
  // Test type relationships
  extends_<User, { name: string }>(); // User has name
  extends_<User, { age: number }>();  // User has age
  
  // Test verdict results
  yes_<$Equal<User['name'], string>>();
  no_<$Equal<User['age'], string>>();
});`}</code></pre>
      
      <h3>API Contract Testing</h3>
      <pre><code>{`example_('API contract validation', () => {
  type CreateUserRequest = {
    name: string;
    email: string;
    age?: number;
  };
  
  type CreateUserResponse = {
    id: string;
    user: User;
    success: boolean;
  };
  
  // Validate request structure
  has_<"name", string>({ name: "John", email: "john@example.com" });
  has_<"email", string>({ name: "John", email: "john@example.com" });
  
  // Validate response structure
  extends_<CreateUserResponse, { id: string }>();
  extends_<CreateUserResponse, { success: boolean }>();
  
  // Test type compatibility
  yes_<$Extends<CreateUserResponse['user'], User>>();
});`}</code></pre>
      
      <h3>Generic Constraint Testing</h3>
      <pre><code>{`function createRepository<T extends { id: string }>() {
  return {
    save: (entity: T) => entity,
    findById: (id: string): T | null => null as any
  };
}

example_('Repository constraints', () => {
  type ValidEntity = { id: string; name: string };
  type InvalidEntity = { name: string }; // missing id
  
  // Test valid entity
  extends_<ValidEntity, { id: string }>();
  
  // Test repository methods
  const repo = createRepository<ValidEntity>();
  extends_<Parameters<typeof repo.save>[0], ValidEntity>();
  extends_<ReturnType<typeof repo.findById>, ValidEntity | null>();
});`}</code></pre>
    </div>
  );
}

export function PatternsApiPage() {
  return (
    <div className="prose prose-blue max-w-none">
      <h1>Patterns API</h1>
      
      <p className="lead">
        Test patterns and symbolic evaluation frameworks for building structured 
        type-level test suites and documentation.
      </p>
      
      <h2>Core Pattern Functions</h2>
      
      <h3><code>example_&lt;T&gt;(fn)</code></h3>
      <p>Creates a type-level example that returns the specified type.</p>
      
      <pre><code>{`export function example_<T>(fn: (a: any) => T): T;
export function example_<T>(label: string, fn: (a: any) => T): T;

// Implementation
export function example_<T>(..._args: [string, (a: any) => T] | [(a: any) => T]): T {
  return t_<T>();
}

// Usage
const stringTest = example_(() => {
  extends_<"hello", string>();
  return t_<string>();
});

const namedTest = example_('String literal test', () => {
  extends_<"world", string>();
  return t_<boolean>();
});`}</code></pre>
      
      <h3><code>test_&lt;T&gt;(fn)</code></h3>
      <p>Alias for <code>example_</code> - same functionality with testing semantics.</p>
      
      <pre><code>{`export const test_ = example_;

// Usage
const userTypeTest = test_('User type validation', () => {
  type User = { name: string; age: number };
  
  has_<"name", string>({ name: "John", age: 30 });
  has_<"age", number>({ name: "John", age: 30 });
  
  yes_<$Equal<User['name'], string>>();
  
  return t_<User>();
});`}</code></pre>
      
      <h3><code>proof_&lt;T&gt;(fn)</code></h3>
      <p>Alias for <code>example_</code> - same functionality with proof semantics.</p>
      
      <pre><code>{`export const proof_ = example_;

// Usage
const distributivityProof = proof_('Union distributivity', () => {
  type Distribute<T, U> = T extends any ? T | U : never;
  
  yes_<$Equal<
    Distribute<'a' | 'b', 'c'>,
    'a' | 'c' | 'b' | 'c'
  >>();
  
  return t_<boolean>();
});`}</code></pre>
      
      <h2>Pattern Usage</h2>
      
      <h3>Building Test Suites</h3>
      <pre><code>{`// Comprehensive type testing
const apiTests = {
  userValidation: test_('User type validation', () => {
    type User = { id: string; name: string; email: string };
    
    // Test structure
    has_<"id", string>({ id: "1", name: "John", email: "john@example.com" });
    has_<"name", string>({ id: "1", name: "John", email: "john@example.com" });
    has_<"email", string>({ id: "1", name: "John", email: "john@example.com" });
    
    // Test relationships
    extends_<User, { id: string }>();
    yes_<$Equal<keyof User, 'id' | 'name' | 'email'>>();
    
    return t_<User>();
  }),
  
  responseValidation: test_('API response validation', () => {
    type ApiResponse<T> = {
      data: T;
      status: number;
      message: string;
    };
    
    type UserResponse = ApiResponse<User>;
    
    // Test generic instantiation
    yes_<$Equal<
      UserResponse,
      { data: User; status: number; message: string }
    >>();
    
    return t_<ApiResponse<any>>();
  })
};`}</code></pre>
      
      <h3>Documenting Type Behavior</h3>
      <pre><code>{`// Document complex type transformations
const utilityTypeExamples = {
  partialBehavior: example_('Partial<T> behavior', () => {
    type Original = { a: string; b: number; c: boolean };
    type PartialVersion = Partial<Original>;
    
    // Document what Partial does
    yes_<$Equal<
      PartialVersion,
      { a?: string; b?: number; c?: boolean }
    >>();
    
    // Show relationships
    extends_<{}, PartialVersion>();  // empty object extends Partial
    extends_<Original, PartialVersion>();  // original extends Partial
    
    return t_<PartialVersion>();
  }),
  
  pickBehavior: example_('Pick<T, K> behavior', () => {
    type Original = { a: string; b: number; c: boolean };
    type Picked = Pick<Original, 'a' | 'c'>;
    
    yes_<$Equal<Picked, { a: string; c: boolean }>>();
    extends_<Picked, { a: string }>();
    extends_<Picked, { c: boolean }>();
    
    return t_<Picked>();
  })
};`}</code></pre>
      
      <h3>Proving Type Properties</h3>
      <pre><code>{`// Mathematical-style proofs for type properties
const typeProofs = {
  associativity: proof_('Union associativity', () => {
    type A = 'a';
    type B = 'b';
    type C = 'c';
    
    // Prove (A | B) | C = A | (B | C)
    yes_<$Equal<(A | B) | C, A | (B | C)>>();
    
    return t_<boolean>();
  }),
  
  distributivity: proof_('Intersection over union distributivity', () => {
    type A = { a: string };
    type B = { b: number };
    type C = { c: boolean };
    
    // Prove A & (B | C) = (A & B) | (A & C)
    yes_<$Equal<
      A & (B | C),
      (A & B) | (A & C)
    >>();
    
    return t_<boolean>();
  }),
  
  identity: proof_('Union identity element', () => {
    type A = string;
    
    // Prove A | never = A
    yes_<$Equal<A | never, A>>();
    
    // Prove A & unknown = A
    yes_<$Equal<A & unknown, A>>();
    
    return t_<boolean>();
  })
};`}</code></pre>
      
      <h2>Advanced Patterns</h2>
      
      <h3>Recursive Type Testing</h3>
      <pre><code>{`const recursiveTests = {
  deepReadonly: example_('Deep readonly transformation', () => {
    type DeepReadonly<T> = {
      readonly [P in keyof T]: T[P] extends object 
        ? DeepReadonly<T[P]> 
        : T[P];
    };
    
    type Nested = {
      user: {
        profile: {
          name: string;
          settings: { theme: string };
        };
      };
      count: number;
    };
    
    type ReadonlyNested = DeepReadonly<Nested>;
    
    // Test deep transformation
    extends_<ReadonlyNested['count'], number>();
    extends_<ReadonlyNested['user']['profile']['name'], string>();
    
    return t_<DeepReadonly<any>>();
  })
};`}</code></pre>
      
      <h3>Conditional Type Testing</h3>
      <pre><code>{`const conditionalTests = {
  typeFiltering: example_('Type filtering with conditionals', () => {
    type NonFunctionKeys<T> = {
      [K in keyof T]: T[K] extends Function ? never : K;
    }[keyof T];
    
    type Mixed = {
      name: string;
      age: number;
      getName: () => string;
      setAge: (age: number) => void;
    };
    
    type DataKeys = NonFunctionKeys<Mixed>;
    
    yes_<$Equal<DataKeys, 'name' | 'age'>>();
    
    return t_<DataKeys>();
  })
};`}</code></pre>
    </div>
  );
}

export function BasicUsageExamplesPage() {
  return (
    <div className="prose prose-blue max-w-none">
      <h1>Basic Usage Examples</h1>
      
      <p className="lead">
        Simple, practical examples to get you started with typist's core functionality.
      </p>
      
      <h2>Getting Started</h2>
      
      <h3>Your First Phantom Value</h3>
      <pre><code>{`import { t_ } from '@type-first/typist';

// Create a phantom value for any type
const user = t_<{ name: string; age: number }>();

// The value is typed but has no runtime cost
console.log(typeof user); // "object" (but it's actually null)
console.log(user);        // null

// Use it for type-level operations
type UserType = typeof user; // { name: string; age: number }`}</code></pre>
      
      <h3>Basic Type Comparisons</h3>
      <pre><code>{`import { $Equal, $Extends, yes_, no_ } from '@type-first/typist';

// Test if types are equal
type StringsEqual = $Equal<string, string>;     // $Yes
type NumberStringEqual = $Equal<number, string>; // $No<...>

// Assert the results
yes_<typeof StringsEqual>();       // ✅ compiles
no_<typeof NumberStringEqual>();   // ✅ compiles

// Test type relationships
type LiteralExtendsString = $Extends<"hello", string>; // $Yes
type StringExtendsLiteral = $Extends<string, "hello">; // $No<...>`}</code></pre>
      
      <h2>Working with Objects</h2>
      
      <h3>Object Shape Validation</h3>
      <pre><code>{`import { has_, extends_ } from '@type-first/typist';

type User = {
  id: string;
  name: string;
  email: string;
  age?: number;
};

// Test that objects have required properties
has_<"id", string>({ id: "123", name: "John", email: "john@example.com" });
has_<"name", string>({ id: "123", name: "John", email: "john@example.com" });
has_<"email", string>({ id: "123", name: "John", email: "john@example.com" });

// Test type relationships
extends_<User, { id: string }>();     // User has an id property
extends_<User, { name: string }>();   // User has a name property

// These would fail:
// has_<"age", number>({ id: "123", name: "John", email: "john@example.com" }); // age is optional
// extends_<{ id: string }, User>();  // partial object doesn't extend full User`}</code></pre>
      
      <h3>Testing Object Transformations</h3>
      <pre><code>{`// Test built-in utility types
type OriginalUser = { name: string; age: number; email: string };

// Test Partial<T>
type PartialUser = Partial<OriginalUser>;
yes_<$Equal<
  PartialUser,
  { name?: string; age?: number; email?: string }
>>();

// Test Pick<T, K>
type UserSummary = Pick<OriginalUser, 'name' | 'age'>;
yes_<$Equal<
  UserSummary,
  { name: string; age: number }
>>();

// Test Omit<T, K>
type UserWithoutEmail = Omit<OriginalUser, 'email'>;
yes_<$Equal<
  UserWithoutEmail,
  { name: string; age: number }
>>();`}</code></pre>
      
      <h2>Array and Tuple Types</h2>
      
      <h3>Array Type Testing</h3>
      <pre><code>{`// Test array types
type StringArray = string[];
type NumberArray = number[];
type MixedArray = (string | number)[];

// Test array relationships
yes_<$Extends<string[], (string | number)[]>>();  // string[] extends mixed array
no_<$Extends<(string | number)[], string[]>>();   // mixed array doesn't extend string[]

// Test tuple types
type UserTuple = [string, number, boolean]; // [name, age, isActive]
type LooseArray = (string | number | boolean)[];

yes_<$Extends<UserTuple, LooseArray>>();  // tuple extends array
no_<$Extends<LooseArray, UserTuple>>();   // array doesn't extend tuple`}</code></pre>
      
      <h3>Tuple Manipulation</h3>
      <pre><code>{`// Test tuple operations
type Head<T extends readonly any[]> = T extends readonly [infer H, ...any[]] ? H : never;
type Tail<T extends readonly any[]> = T extends readonly [any, ...infer Rest] ? Rest : never;

type SampleTuple = [string, number, boolean];

// Test head extraction
type TupleHead = Head<SampleTuple>;
yes_<$Equal<TupleHead, string>>();

// Test tail extraction
type TupleTail = Tail<SampleTuple>;
yes_<$Equal<TupleTail, [number, boolean]>>();`}</code></pre>
      
      <h2>Function Types</h2>
      
      <h3>Function Signature Testing</h3>
      <pre><code>{`type UserCreator = (name: string, age: number) => User;
type UserUpdater = (id: string, updates: Partial<User>) => Promise<User>;

// Test parameter types
type CreatorParams = Parameters<UserCreator>;
yes_<$Equal<CreatorParams, [string, number]>>();

type UpdaterParams = Parameters<UserUpdater>;
yes_<$Equal<UpdaterParams, [string, Partial<User>]>>();

// Test return types
type CreatorReturn = ReturnType<UserCreator>;
yes_<$Equal<CreatorReturn, User>>();

type UpdaterReturn = ReturnType<UserUpdater>;
yes_<$Equal<UpdaterReturn, Promise<User>>>();`}</code></pre>
      
      <h3>Generic Function Testing</h3>
      <pre><code>{`// Test generic function constraints
type Repository<T extends { id: string }> = {
  findById: (id: string) => T | null;
  save: (entity: T) => T;
  delete: (id: string) => boolean;
};

type UserRepository = Repository<User>;

// Test that the generic constraint works
yes_<$Extends<User, { id: string }>>();

// Test the instantiated type
type FindMethod = UserRepository['findById'];
yes_<$Equal<FindMethod, (id: string) => User | null>>();

type SaveMethod = UserRepository['save'];
yes_<$Equal<SaveMethod, (entity: User) => User>>();`}</code></pre>
      
      <h2>Union and Intersection Types</h2>
      
      <h3>Union Type Testing</h3>
      <pre><code>{`type Status = 'pending' | 'completed' | 'failed';
type Priority = 'low' | 'medium' | 'high';

// Test union membership
yes_<$Extends<'pending', Status>>();
yes_<$Extends<'high', Priority>>();
no_<$Extends<'unknown', Status>>();

// Test union relationships
type Combined = Status | Priority;
yes_<$Extends<Status, Combined>>();
yes_<$Extends<Priority, Combined>>();
no_<$Extends<Combined, Status>>();`}</code></pre>
      
      <h3>Intersection Type Testing</h3>
      <pre><code>{`type Named = { name: string };
type Aged = { age: number };
type Identified = { id: string };

type Person = Named & Aged;
type User = Person & Identified;

// Test intersection properties
has_<"name", string>(t_<Person>());
has_<"age", number>(t_<Person>());

has_<"name", string>(t_<User>());
has_<"age", number>(t_<User>());
has_<"id", string>(t_<User>());

// Test intersection relationships
yes_<$Extends<User, Person>>();
yes_<$Extends<User, Named>>();
yes_<$Extends<User, Aged>>();
yes_<$Extends<User, Identified>>();`}</code></pre>
    </div>
  );
}

export function TroubleshootingPage() {
  return (
    <div className="prose prose-blue max-w-none">
      <h1>Troubleshooting</h1>
      
      <p className="lead">
        Common issues and solutions when working with typist. Learn how to debug 
        type-level problems and understand error messages.
      </p>
      
      <h2>Common Issues</h2>
      
      <h3>Type Assertion Failures</h3>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <h4 className="text-red-900 mt-0 mb-3">❌ Problem</h4>
        <p className="text-red-800 mb-0">
          <code>yes_()</code> or <code>no_()</code> assertions fail with confusing error messages.
        </p>
      </div>
      
      <pre><code>{`// This fails but why?
yes_<$Equal<{ a: string }, { a: any }>>(); // ❌ Type error`}</code></pre>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <h4 className="text-green-900 mt-0 mb-3">✅ Solution</h4>
        <p className="text-green-800 mb-3">
          Use <code>decidable_()</code> to accept any verdict, then examine the result:
        </p>
        <pre className="mb-0"><code>{`// First, accept any result to see what you get
type Result = $Equal<{ a: string }, { a: any }>;
decidable_<Result>(); // This will compile

// Hover over Result to see: $No<'not-equal', [{ a: string }, { a: any }]>
// Now you know the types aren't equal
no_<Result>(); // ✅ This is the correct assertion`}</code></pre>
      </div>
      
      <h3>Phantom Value Type Inference</h3>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <h4 className="text-red-900 mt-0 mb-3">❌ Problem</h4>
        <p className="text-red-800 mb-0">
          TypeScript infers <code>any</code> or incorrect types for phantom values.
        </p>
      </div>
      
      <pre><code>{`// Type gets inferred as 'any'
const badValue = t_(); // any

// Generic parameter not properly inferred
function createValue() {
  return t_(); // Returns any
}`}</code></pre>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <h4 className="text-green-900 mt-0 mb-3">✅ Solution</h4>
        <p className="text-green-800 mb-3">
          Always provide explicit type parameters:
        </p>
        <pre className="mb-0"><code>{`// Explicitly specify the type
const goodValue = t_<string>(); // string

// Use generic constraints in functions
function createValue<T>(): T {
  return t_<T>();
}

const typedValue = createValue<number>(); // number`}</code></pre>
      </div>
      
      <h3>Complex Type Comparison Failures</h3>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <h4 className="text-red-900 mt-0 mb-3">❌ Problem</h4>
        <p className="text-red-800 mb-0">
          Complex types appear identical but comparison fails.
        </p>
      </div>
      
      <pre><code>{`type A = { user: { name: string; age: number } };
type B = { user: { name: string; age: number } };

// This should work but fails
yes_<$Equal<A, B>>(); // ❌ Unexpected failure`}</code></pre>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <h4 className="text-green-900 mt-0 mb-3">✅ Solution</h4>
        <p className="text-green-800 mb-3">
          Break down the comparison into smaller parts:
        </p>
        <pre className="mb-0"><code>{`// Test parts separately
yes_<$Equal<A['user'], B['user']>>();
yes_<$Equal<A['user']['name'], B['user']['name']>>();
yes_<$Equal<A['user']['age'], B['user']['age']>>();

// If parts work, the whole should work
// If this still fails, there might be a subtle difference`}</code></pre>
      </div>
      
      <h2>Debugging Techniques</h2>
      
      <h3>Verdict Inspection</h3>
      <p>Use the structured information in verdicts to understand failures:</p>
      
      <pre><code>{`// Extract debugging information from failed verdicts
type FailedComparison = $Equal<string, number>;
// Result: $No<'not-equal', [string, number]>

// Create a type to inspect the failure
type DebugInfo = FailedComparison extends $No<infer Key, infer Types>
  ? { reason: Key; types: Types }
  : never;
// DebugInfo: { reason: 'not-equal'; types: [string, number] }`}</code></pre>
      
      <h3>Step-by-Step Verification</h3>
      <p>Build complex assertions incrementally:</p>
      
      <pre><code>{`// Instead of one complex assertion
// yes_<$Equal<ComplexTypeA, ComplexTypeB>>();

// Build it step by step
type StepA = ComplexTypeA['property1'];
type StepB = ComplexTypeB['property1'];
yes_<$Equal<StepA, StepB>>();

type StepC = ComplexTypeA['property2'];
type StepD = ComplexTypeB['property2'];
yes_<$Equal<StepC, StepD>>();

// Now try the full comparison
yes_<$Equal<ComplexTypeA, ComplexTypeB>>();`}</code></pre>
      
      <h3>Type Narrowing Investigation</h3>
      <p>When <code>extends_</code> fails unexpectedly:</p>
      
      <pre><code>{`// If this fails:
// extends_<ChildType, ParentType>();

// Check both directions
const extendsTest = $Extends<ChildType, ParentType>;
const reverseTest = $Extends<ParentType, ChildType>;

// Inspect the results
decidable_<typeof extendsTest>();
decidable_<typeof reverseTest>();

// Check specific properties
has_<"expectedProperty", ExpectedType>(t_<ChildType>());`}</code></pre>
      
      <h2>Performance Issues</h2>
      
      <h3>TypeScript Compiler Slowdown</h3>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <h4 className="text-yellow-900 mt-0 mb-3">⚠️ Problem</h4>
        <p className="text-yellow-800 mb-0">
          Complex type-level operations cause TypeScript compilation to slow down.
        </p>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h4 className="text-blue-900 mt-0 mb-3">💡 Solutions</h4>
        <ul className="text-blue-800 mb-0">
          <li>Simplify deeply nested type operations</li>
          <li>Use type aliases to break complex types into smaller parts</li>
          <li>Avoid excessive recursive type definitions</li>
          <li>Use conditional compilation flags for development vs. production</li>
        </ul>
      </div>
      
      <pre><code>{`// Instead of deeply nested operations
type Complex = DeepTransform<DeepNested<DeepMapped<Type>>>;

// Break it down
type Step1 = DeepMapped<Type>;
type Step2 = DeepNested<Step1>;
type Step3 = DeepTransform<Step2>;
type Complex = Step3;`}</code></pre>
      
      <h2>Best Practices for Debugging</h2>
      
      <ol>
        <li><strong>Start Simple</strong> - Begin with basic assertions and build complexity gradually</li>
        <li><strong>Use <code>decidable_()</code></strong> - Accept any verdict first, then narrow down to <code>yes_()</code> or <code>no_()</code></li>
        <li><strong>Break Down Complex Types</strong> - Test components separately before testing the whole</li>
        <li><strong>Leverage IDE Features</strong> - Hover over types to see their resolved forms</li>
        <li><strong>Create Debug Types</strong> - Extract information from failed verdicts for inspection</li>
        <li><strong>Use Descriptive Names</strong> - Name your phantom values and tests clearly</li>
      </ol>
      
      <h2>Getting Help</h2>
      
      <p>If you're still stuck:</p>
      
      <ul>
        <li>Check the <a href="/docs/typist/examples">Examples</a> for similar patterns</li>
        <li>Review the <a href="/docs/typist/api">API Reference</a> for detailed function signatures</li>
        <li>Create a minimal reproduction case</li>
        <li>Use TypeScript's <code>--noEmit</code> flag to check types without generating output</li>
      </ul>
    </div>
  );
}

// Export all pages
export const typistDocPages = {
  IntroductionPage,
  InstallationPage,
  QuickStartPage,
  PhantomTypesPage,
  VerdictsPage,
  OperatorsApiPage,
  ComparatorsApiPage,
  AssertionsApiPage,
  PatternsApiPage,
  BasicUsageExamplesPage,
  TroubleshootingPage,
};