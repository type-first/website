import { is_, t_, extends_ } from '@typefirst/typist'

/**
 * typist documentation compilation
 * generated on November 15, 2025
 * 
 * this file compiles all typist documentation pages from the website into a single TypeScript file
 * with executable code examples and markdown content in comments.
 */

/* 
# typist

show what your types are made of.

## overview

typist is a minimal suite for compilable static proofs at the type level. 
we can encode static assertions and build compile-time validations with zero runtime overhead.

whether you're building type-safe APIs, enforcing domain constraints, or creating 
self-documenting interfaces, typist gives you the tools to **prove your types work** 
before your code ever runs.
*/

// ## introduction

// here's a basic type assertion

type Positive = '👍' | '👌' | '🎉' | '😊'

is_<Positive>('🎉') // ✓

// @ts-expect-error ✓
// type '👎' is not assignable to type 'Positive'.
is_<Positive>('👎')

// let's try out different assignment behaviors

const smile = '😊'

is_<string>(smile) // ✓
is_<Positive>(smile) // ✓
is_<'😓'|'😊'>(smile) // ✓

const party:string = '🎉' 

is_<string>(party) // ✓

// @ts-expect-error ✓
// type 'string' is not assignable to type 'Positive'.
is_<Positive>(party)

// we can test if a type is more specific than (ie: extends) another

type Reaction = '👍' | '👎' | '👌' | '🎉' | '😊' | '😢' | '❓' | '💡'

extends_<Positive, Reaction>() // ✓

// @ts-expect-error ✓
// type 'Reactions' does not satisfy the constraint 'Positive'
extends_<Reaction, Positive>()

// @ts-expect-error ✓
// type 'Positive' does not satisfy the constraint '👍'.
//  type '😊' is not assignable to type '👍'.
extends_<Positive, '👍'>()

// we can use runtime identifiers as either regular arguments `(t:T)`, or as type arguments `<T>` by extracting their types using 'typeof` 

export const random
  = <T>( arr: T[] ): T =>
  { const und = (v: unknown): v is undefined => v === void 0
    const between
      = (a1?: number, a2?: number): number =>
      { let min: number, max: number
        if (und(a1)) min = 0, max = 100
        else if (und(a2)) max = a1, min = 0
        else max = a2, min = a1
        const { floor, random } = Math
        return floor(random() * (max - min + 1)) + min }
    return arr[ between(0, arr.length - 1) ] as T }

const hand = random(['👍','👎','👌'] as const)

is_<Reaction>(hand) // ✓

// @ts-expect-error ✓
// type '👎' is not assignable to type 'Positive'
is_<Positive>(hand)

is_<typeof hand>('👍') // ✓
is_<typeof hand>('👎') // ✓

// likewise, we can use type identifiers as type arguments `<T>`, or as regular arguments `(t:T)` by creating a phantom value

type Hand = '👍' | '👎' | '👌'

extends_<Hand, Reaction>() // ✓
extends_(hand, t_<Reaction>()) // ✓

is_<Hand>(hand) // ✓
is_<typeof hand>(t_<Hand>()) // ✓

// we can drill deeply into runtime and type-level structures following the same principles

type RegularUser = { name:string }
type PremiumUser = RegularUser & { premiumSince:Date }
type User = RegularUser | PremiumUser

has_<'name', string>(t_<User>()) // ✓

// @ts-expect-error ✓
// property 'premiumSince' is missing in type 'RegularUser'
has_<'premiumSince', string>(t_<User>()) // ✓

const alice = { name:'alice' } as const
const bob = { name:'bob', premiumSince:new Date('2022-01-01') } as const

has_<'name', string>(bob) // ✓
has_<'premiumSince', Date>(bob) // ✓

is_<typeof bob['premiumSince']>(t_<Date>()) // ✓

is_<PremiumUser>(bob) // ✓
extends_<typeof bob, RegularUser>() // ✓

is_<User['name']>(alice.name) // ✓
is_<'alice'>(alice.name) // ✓

// @ts-expect-error ✓
// type 'alice' is not assignable to type 'bob'
is_<'bob'>(alice.name) // ✓

// @ts-expect-error ✓
// property 'premiumSince' missing
has_<'premiumSince', Date>(alice)

// @ts-expect-error ✓
// property 'premiumSince' missing
is_<PremiumUser>(alice)

// we can make assert invariants that are contextual to our type guards and control flow logic

type ExclusiveReaction = '💎' | '🐸'

type PremiumFeedback 
  = { user:PremiumUser, 
      reaction:Reaction | ExclusiveReaction, 
      text:string }

type RegularFeedback
  = { user:RegularUser,
      reaction:Reaction,
      text:string }

type Feedback 
  = RegularFeedback | PremiumFeedback

const isPremiumUser 
  = (user:User): user is PremiumUser => 
    'premiumSince' in user

const isPremiumFeedback
  = (feedback:Feedback): feedback is PremiumFeedback => 
    isPremiumUser(feedback.user)

const getFeedback 
  = async (): Promise<Feedback> => t_<Feedback>()

const feedback0 = await getFeedback()

if (isPremiumFeedback(feedback0))
  { extends_<ExclusiveReaction, typeof feedback0.reaction>() // ✓
    is_<PremiumUser>(feedback0.user) // ✓ 
    has_<'premiumSince'>(feedback0.user) } // ✓
else 
  { // @ts-expect-error ✓ 
    // type '"💎"' is not assignable to type 'Reaction'
    extends_<ExclusiveReaction, typeof feedback0.reaction>() // ✓ 
    
    // @ts-expect-error ✓
    // type 'RegularUser' is not assignable to parameter of type 'PremiumUser'
    is_<PremiumUser>(feedback0.user) 

    is_<RegularUser>(feedback0.user) } // ✓

/*
## installation

```bash
# npm
npm install @typefirst/typist

# yarn  
yarn add @typefirst/typist

# pnpm
pnpm add @typefirst/typist
```

### configuration

add these recommended settings to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  }
}
```

### verification

create a test file to verify installation:

```typescript
// test-typist.ts
import { t_, $Equal, yes_ } from '@typefirst/typist';

const stringValue = t_<string>();
type StringsAreEqual = $Equal<string, string>;
yes_<StringsAreEqual>();

console.log('Typist is working correctly!');
```

*/

// ============================================================================
// import statements - core typist functionality
// ============================================================================

import { 
  // t_, 
  type_,
  t,
  $Equal, 
  $Extends,
  yes_, 
  no_,
  // is_,
  never_,
  test_,
  proof_,
  example_,
  has_,
  // extends_,
  decidable_ 
} from '@typefirst/typist';

// ============================================================================
// verification example
// ============================================================================

// verification example - creating a simple test file
const stringValue_0 = t_<string>();
type StringsAreEqual_0 = $Equal<string, string>;
yes_<StringsAreEqual_0>();

console.log('Typist is working correctly!');

// additional test-typist example - verification code
const stringValue_verification = t_<string>();
type StringsAreEqual_verification = $Equal<string, string>;
yes_<StringsAreEqual_verification>();

console.log('Additional typist verification completed!');

// ============================================================================
// quick start examples
// ============================================================================

/*
## quick start

jump into typist with practical examples that showcase its **core capabilities**. 
learn the essential patterns through *hands-on examples* with phantom types, 
compile-time proofs, and type-safe domain modeling.
*/

// ### Your First Phantom Type

// create phantom types - no runtime cost, pure type-level
const user = t_<{ name: string; age: number }>();
const admin = t_<{ name: string; role: 'admin' }>();

// type assertions and proofs
is_<string>(user.name);                    // ✓ property type check
yes_<$Equal<number, typeof user.age>>();   // ✓ Type equality proof
never_<string & number>();                 // ✓ Impossibility proof

// build type-safe constraints
type ValidUser<T> = T extends { name: string } ? T : never;
const validUser = t_<ValidUser<typeof user>>(); // ✓ Compiles
// const invalid = t_<ValidUser<string>>()      // ✗ compile error

// use for API design and domain modeling
type BrandedId<T extends string> = string & { __brand: T };
const userId = t_<BrandedId<'user'>>();
const orderId = t_<BrandedId<'order'>>();

// ### Type Comparisons

// basic type equality
type StringTest = $Equal<string, string>;        // $Yes
type MismatchTest = $Equal<string, number>;      // $No<...>

// verify the results
yes_<StringTest>();    // ✅ compiles - strings are equal
no_<MismatchTest>();   // ✅ Compiles - string ≠ number

// type extension relationships
type LiteralExtends = $Extends<"hello", string>; // $Yes
type GeneralExtends = $Extends<string, "hello">; // $No<...>

yes_<LiteralExtends>(); // ✅ Literal types extend their base type
no_<GeneralExtends>();  // ✅ General types don't extend specific literals

// ### practical example: user management

// define distinct ID types
type UserId = string & { readonly __brand: 'UserId' };
type ProductId = string & { readonly __brand: 'ProductId' };

// create phantom values for testing
const userIdPhantom = t_<UserId>();
const productIdPhantom = t_<ProductId>();

// verify they're different types despite same runtime representation
no_<$Equal<UserId, ProductId>>(); // ✅ these should be different

// define user structure
interface User1 {
  id: UserId;
  name: string;
  email: string;
  age: number;
}

// test user structure compliance
function validateUser<T extends User>(userParam: T): T {
  // type-level validation happens at compile time
  // these would be compile-time checks in real typist usage
  return userParam;
}

// ### advanced pattern: API response validation

// define expected API response structure
interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message: string;
  timestamp: number;
}

// create a validation helper
const apiValidationExample = example_('API Response Validation', () => {
  type UserResponse = ApiResponse<User>;
  
  // validate the response structure
  extends_<UserResponse, { data: User }>();
  extends_<UserResponse, { status: string }>();
  extends_<UserResponse, { message: string }>();
  
  // test that data field has correct type
  yes_<$Extends<UserResponse['data'], User>>();
  
  return t_<UserResponse>();
});

// ### Testing Your Types

// named test for user type validation
const userTypeTest = test_('User type structure', () => {
  // test basic structure
  yes_<$Extends<User, { id: UserId }>>();
  yes_<$Extends<User, { name: string }>>();
  
  // test that User is not assignable to simpler types
  no_<$Equal<User, { id: string }>>();
  
  return t_<User>();
});

// mathematical-style proof for type distributivity
const distributivityProof = proof_('Union type distributivity', () => {
  type Distribute<T, U> = T extends any ? T | U : never;
  
  yes_<$Equal<
    Distribute<'a' | 'b', 'c'>,
    'a' | 'c' | 'b' | 'c'
  >>();
  
  return t_<boolean>();
});

// ============================================================================
// phantom types - core concepts
// ============================================================================

/*
## phantom types

create nominal types without runtime overhead using phantom type patterns.

### understanding phantom types

phantom types are a powerful pattern that allows you to create distinct types 
that share the same runtime representation but are treated as completely 
different by the type system. this enables you to encode additional information 
in types without any runtime overhead.

### the problem: primitive obsession

consider this common scenario where we use strings for different purposes:
*/

// problematic: all are just strings at the type level
function createUserProblematic(userId: string, email: string, name: string) {
  // easy to accidentally swap parameters!
  // return saveUser(email, userId, name); // ❌ Bug: swapped userId and email
  return { id: userId, email, name };
}

function sendEmail(to: string, from: string, subject: string) {
  // what if someone passes a user ID instead of an email?
  console.log(`Sending email to ${to} from ${from}: ${subject}`);
}

// Usage - no protection against mistakes
// createUserProblematic("user@example.com", "123", "John"); // ❌ Parameters swapped!

/*
### the solution: phantom types with brands

with phantom types, we can create distinct types that prevent these mistakes:
*/

// ### creating phantom values

// typist provides several utilities for creating phantom values
const userIdType = t_<UserId>();
const userIdType2 = type_<UserId>();
const userIdType3 = t<UserId>();

// you can use phantom values in type-level operations
type UserIdTypeCheck = typeof userIdType;  // UserId
type IsUserIdType = $Equal<UserIdTypeCheck, UserId>; // $Yes

// phantom values for complex types
const responsePhantom = t_<ApiResponse<User>>();
type ResponseType = typeof responsePhantom; // ApiResponse<User>

// ### branded types pattern

// brand pattern: BaseType & { readonly __brand: 'BrandName' }
type EmailAddress = string & { readonly __brand: 'Email' };

// helper functions for creating branded values
function createUserId(id: string): UserId {
  // in real code, you might validate the format here
  return id as UserId;
}

function createEmail(email: string): EmailAddress {
  // email validation logic
  if (!email.includes('@')) {
    throw new Error('Invalid email');
  }
  return email as EmailAddress;
}

// now our function is type-safe
function createUserTypeSafe(userId: UserId, email: EmailAddress, name: string) {
  return {
    id: userId,
    email: email,
    name: name
  };
}

// usage
const safeUserId = createUserId("user_123");
const safeEmail = createEmail("user@example.com");

const safeUser = createUserTypeSafe(safeUserId, safeEmail, "John"); // ✅ Correct order enforced
// createUserTypeSafe(safeEmail, safeUserId, "John"); // ❌ Compile error!

// ### advanced phantom type patterns

// #### state machine types

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

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

// usage with phantom types
const disconnectedConn = t_<Connection<'disconnected'>>();
const connectingConn = t_<Connection<'connecting'>>();
const connectedConn = t_<Connection<'connected'>>();

// #### units of measure

type Meters = number & { readonly __unit: 'meters' };
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

// conversion functions
function metersToFeet(m: Meters): Feet {
  return feet(m * 3.28084);
}

function calculateSpeed(distance: Meters, time: Seconds): number {
  return distance / time; // Returns meters per second
}

// usage examples
const distance = meters(100);
const time = seconds(10);
const speed = calculateSpeed(distance, time); // ✅ Type safe
// calculateSpeed(feet(100), time); // ❌ Can't mix units!

// #### permission systems

type Permission = 'read' | 'write' | 'admin';

type SecureData<TPermission extends Permission> = {
  data: string;
  readonly __permission: TPermission;
};

type PermissionUser<TPermission extends Permission> = {
  id: UserId;
  name: string;
  readonly __permission: TPermission;
};

// Only admin users can access admin data
function accessAdminData<T extends Permission>(
  user: PermissionUser<T>,
  data: SecureData<'admin'>
): T extends 'admin' ? string : never {
  // Compile-time check that user has admin permission
  if ((user as any).__permission === 'admin') {
    return data.data as any;
  }
  throw new Error('Access denied');
}

// usage
const adminUser = t_<PermissionUser<'admin'>>();
const readUser = t_<PermissionUser<'read'>>();
const adminData = t_<SecureData<'admin'>>();

// const result1 = accessAdminData(adminUser, adminData); // ✅ Works
// const result2 = accessAdminData(readUser, adminData); // ❌ Compile error

// ### testing phantom types

const phantomTypeTests = test_('Phantom type validation', () => {
  // Test that branded types are distinct
  no_<$Equal<UserId, EmailAddress>>();
  no_<$Equal<UserId, string>>();
  no_<$Equal<EmailAddress, string>>();
  
  // Test that they extend their base type for runtime compatibility
  yes_<$Extends<UserId, string>>();
  yes_<$Extends<EmailAddress, string>>();
  
  // Test state machine structure
  type DisconnectedConn = Connection<'disconnected'>;
  type ConnectingConn = Connection<'connecting'>;
  
  // Verify state machine structure
  yes_<$Extends<DisconnectedConn, { connect(): any }>>();
  no_<$Extends<DisconnectedConn, { send(data: string): void }>>();
  
  return t_<boolean>();
});

// ============================================================================
// ADVANCED PATTERNS
// ============================================================================

/*
## advanced patterns

complex type-level programming patterns and real-world applications.

### type-level arithmetic

implement addition at the type level using tuples:
*/

// Helper type for creating tuples of specific length
type Tuple<T extends number, R extends readonly unknown[] = []> = 
  R['length'] extends T ? R : Tuple<T, readonly [...R, unknown]>;

// Type-level addition
type Add<A extends number, B extends number> = 
  [...Tuple<A>, ...Tuple<B>]['length'];

// Type-level subtraction  
type Subtract<A extends number, B extends number> = 
  Tuple<A> extends readonly [...infer U, ...Tuple<B>] ? U['length'] : never;

// test arithmetic operations
type Sum = Add<3, 4>;        // 7
type Difference = Subtract<10, 3>;  // 7

// ### advanced string manipulation

// type-level string operations using template literals
type Split<S extends string, D extends string> = 
  S extends `${infer T}${D}${infer U}` 
    ? [T, ...Split<U, D>] 
    : [S];

type Join<T extends readonly string[], D extends string> = 
  T extends readonly [infer F, ...infer R]
    ? F extends string
      ? R extends readonly string[]
        ? R['length'] extends 0
          ? F
          : `${F}${D}${Join<R, D>}`
        : never
      : never
    : '';

type CamelCase<S extends string> = 
  S extends `${infer F}_${infer R}`
    ? `${F}${Capitalize<CamelCase<R>>}`
    : S;

// test string operations
type Words = Split<'hello,world,typescript', ','>;  // ['hello', 'world', 'typescript']
type Rejoined = Join<['a', 'b', 'c'], '-'>;         // 'a-b-c'
type Camel = CamelCase<'user_first_name'>;           // 'userFirstName'

// ### deep object transformation

// deep readonly transformation
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? T[P] extends Function 
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P];
};

// Deep partial transformation
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepPartial<T[P]>
    : T[P];
};

// Path-based property access
type Path<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? T[K] extends ArrayLike<any>
      ? K | `${K}.${Path<T[K], Exclude<keyof T[K], keyof any[]>>}`
      : K | `${K}.${Path<T[K], keyof T[K]>}`
    : K
  : never;

type PathValue<T, P extends Path<T, keyof T>> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends Path<T[K], keyof T[K]>
      ? PathValue<T[K], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never;

// test deep transformations
interface ComplexUser {
  id: number;
  profile: {
    name: string;
    settings: {
      theme: 'light' | 'dark';
      notifications: boolean;
    };
  };
  posts: Array<{ title: string; content: string }>;
}

type ReadonlyUser = DeepReadonly<ComplexUser>;
type PartialUser = DeepPartial<ComplexUser>;
type UserPaths = Path<ComplexUser, keyof ComplexUser>;  // 'id' | 'profile' | 'profile.name' | ...
type ThemePath = PathValue<ComplexUser, 'profile.settings.theme'>;  // 'light' | 'dark'

// ### type-safe state machine

// create a complex state machine for user authentication
type AuthState = 'logged-out' | 'logging-in' | 'logged-in' | 'session-expired';

type AuthEvents = 
  | { type: 'LOGIN_START'; credentials: { email: string; password: string } }
  | { type: 'LOGIN_SUCCESS'; user: { id: string; name: string } }
  | { type: 'LOGIN_FAILURE'; error: string }
  | { type: 'LOGOUT' }
  | { type: 'SESSION_EXPIRE' }
  | { type: 'REFRESH_SESSION' };

type AuthTransitions = {
  'logged-out': {
    'LOGIN_START': 'logging-in';
  };
  'logging-in': {
    'LOGIN_SUCCESS': 'logged-in';
    'LOGIN_FAILURE': 'logged-out';
  };
  'logged-in': {
    'LOGOUT': 'logged-out';
    'SESSION_EXPIRE': 'session-expired';
  };
  'session-expired': {
    'LOGIN_START': 'logging-in';
    'REFRESH_SESSION': 'logged-in';
  };
};

// Type-safe state machine implementation
type StateMachine<TState extends AuthState> = {
  currentState: TState;
  transition<TEvent extends keyof AuthTransitions[TState]>(
    event: TEvent
  ): StateMachine<AuthTransitions[TState][TEvent] extends AuthState ? AuthTransitions[TState][TEvent] : never>;
};

// ============================================================================
// INTERACTIVE SCENARIOS - From Type Explorer
// ============================================================================

/*
## interactive learning scenarios

the following examples are derived from the interactive scenarios available 
in the type explorer.

### phantom types basics scenario

this scenario introduces the fundamental concept of phantom types and how 
typist enables type-level programming in TypeScript.
*/

// Phantom types let you work with types as first-class values
function t_scenario<T>(): T {
  return null as any as T;
}

const stringType = t_scenario<string>();
const numberType = t_scenario<number>(); 
const userType = t_scenario<{ id: string; name: string }>();

// These values are typed but have no runtime cost
console.log('Phantom values are always null at runtime:', { stringType, numberType, userType });

// ### Branded Types with Phantom Values

// Helper functions for scenario examples
function createUserIdScenario(id: string): UserId {
  return id as UserId;
}

function createEmailScenario(email: string): EmailAddress {
  if (!email.includes('@')) {
    throw new Error('Invalid email format');
  }
  return email as EmailAddress;
}

// Create strongly-typed IDs that prevent mixing different types
const scenarioUserId = createUserIdScenario('user_123');
const scenarioUserEmail = createEmailScenario('user@example.com');

console.log('Branded types:', { scenarioUserId, scenarioUserEmail });

// ### Working with Type-Level Information

// Phantom types let us encode information purely at the type level
type DatabaseTable<TName extends string> = {
  readonly __tableName: TName; // phantom field
  insert<T>(data: T): void;
  find<T>(id: string): T | null;
};

// Create typed table references
const usersTable = t_scenario<DatabaseTable<'users'>>();
const postsTable = t_scenario<DatabaseTable<'posts'>>();

// The type system knows these are different table types
type UsersTableType = typeof usersTable; // DatabaseTable<'users'>
type PostsTableType = typeof postsTable; // DatabaseTable<'posts'>

// ### Phantom Types for State Machines

type ConnectionStateScenario = 'disconnected' | 'connecting' | 'connected';

type ConnectionScenario<TState extends ConnectionStateScenario> = {
  readonly __state: TState; // phantom field for state tracking
  readonly id: string;
}

// State-specific methods using conditional types
type ConnectionMethodsScenario<TState extends ConnectionStateScenario> = 
  TState extends 'disconnected' ? { connect(): ConnectionScenario<'connecting'> } :
  TState extends 'connecting' ? { cancel(): ConnectionScenario<'disconnected'> } :
  TState extends 'connected' ? { 
    send(data: string): void;
    disconnect(): ConnectionScenario<'disconnected'>;
  } : never;

type TypedConnectionScenario<TState extends ConnectionStateScenario> = 
  ConnectionScenario<TState> & ConnectionMethodsScenario<TState>;

// Create phantom values for different connection states
const disconnectedConnScenario = t_scenario<TypedConnectionScenario<'disconnected'>>();
const connectingConnScenario = t_scenario<TypedConnectionScenario<'connecting'>>();
const connectedConnScenario = t_scenario<TypedConnectionScenario<'connected'>>();

// ### Phantom Values for API Design

// Use phantom types to create type-safe builder patterns
type QueryBuilder<TSelected extends boolean = false> = {
  readonly __selected: TSelected; // phantom field
  select<T>(fields: T[]): QueryBuilder<true>;
  where(condition: string): QueryBuilder<TSelected>;
  // execute() only available after select() has been called
} & (TSelected extends true ? { execute(): any[] } : {});

const queryScenario = t_scenario<QueryBuilder<false>>();
const queryWithSelectScenario = t_scenario<QueryBuilder<true>>();

// Type-safe query building:
// queryScenario.execute() // ✗ Type error! Must call select() first
// queryWithSelectScenario.execute() // ✓ Valid

// ============================================================================
// COMMON PATTERNS AND BEST PRACTICES
// ============================================================================

/*
## common patterns

### branded types for domain safety

use phantom types to prevent mixing up similar values:
*/

// before: easy to mix up parameters
function transferMoneyUnsafe(fromAccount: string, toAccount: string, amount: number) {
  console.log(`Transferring ${amount} from ${fromAccount} to ${toAccount}`);
}

// after: type-safe with brands
type AccountId = string & { readonly __brand: 'AccountId' };
type Amount = number & { readonly __brand: 'Amount' };

function transferMoneySafe(fromAccount: AccountId, toAccount: AccountId, amount: Amount) {
  console.log(`Safe transfer: ${amount} from ${fromAccount} to ${toAccount}`);
}

// ### compile-time configuration validation

interface Config {
  database: {
    host: string;
    port: number;
  };
  features: {
    enableNewUI: boolean;
    maxUsers: number;
  };
}

// validate config at compile time
function validateConfig<T extends Config>(config: T): T {
  // Type-level validation happens at compile time
  return config;
}

/*
## best practices

### naming conventions

- Use descriptive names that indicate the domain: `UserId`, `EmailAddress`, `ProductSku`
- For units, include the unit in the name: `Meters`, `Seconds`, `Dollars`
- For states, use clear state names: `PendingOrder`, `ConfirmedOrder`

### Brand Property

- Use consistent brand property names: `__brand`, `__phantom`, or `__tag`
- Make brand properties `readonly` to prevent runtime modification
- Use string literals for brand values to enable better error messages

### Creation Functions

- Provide factory functions for creating branded values safely
- Include validation logic in factory functions
- Use descriptive names: `createUserId`, `parseEmail`, `validateProductSku`

## Common Pitfalls

### Runtime Confusion

remember that phantom types are compile-time only. at runtime, branded values 
are just their base type:
*/

const userIdRuntime: UserId = "user_123" as UserId;
console.log(typeof userIdRuntime); // "string" - not "UserId"!

// Don't rely on runtime type checking
// if (userIdRuntime instanceof UserId) { } // ❌ This doesn't work

// instead, use validation functions
function isValidUserId(value: string): value is UserId {
  return value.startsWith('user_');
}

/*
### Excessive Branding

Don't create phantom types for every string or number. Only use them when:

- Values can be easily confused (IDs, emails, phone numbers)
- Type safety provides significant business value
- The domain naturally has distinct concepts

## troubleshooting

### common issues and solutions

when working with typist, you may encounter these common issues:

#### Module Not Found Error

if you see `Cannot find module '@typefirst/typist'`, ensure:
- the package is installed in your project
- Your `node_modules` directory is not corrupted
- TypeScript can resolve the module path

#### Type Errors in Strict Mode

Typist is designed for strict TypeScript. If you're seeing unexpected type errors:
- Enable strict mode in your tsconfig.json
- Update to TypeScript 4.5 or later
- Check that all phantom type brands are properly defined

Use `decidable_()` to accept any verdict result, then examine the structured 
debugging information in `$No` verdicts.

*/

// ============================================================================
// COMPREHENSIVE EXAMPLES
// ============================================================================

/*
## comprehensive examples

here are complete examples that demonstrate real-world usage of typist patterns.
*/

// ### complete user management system

// Domain types with phantom branding
type UserIdDomain = string & { readonly __brand: 'UserIdDomain' };
type EmailDomain = string & { readonly __brand: 'EmailDomain' };
type RoleDomain = 'user' | 'admin' | 'moderator';

// User entity
interface UserEntity {
  id: UserIdDomain;
  email: EmailDomain;
  name: string;
  role: RoleDomain;
  createdAt: Date;
}

// Factory functions with validation
function createUserIdDomain(id: string): UserIdDomain {
  if (!id.startsWith('user_') || id.length < 6) {
    throw new Error('Invalid user ID format');
  }
  return id as UserIdDomain;
}

function createEmailDomain(email: string): EmailDomain {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  return email as EmailDomain;
}

// Type-safe service layer
class UserService {
  static validateUserEntity<T extends UserEntity>(user: T): T {
    // Type-level validation happens at compile time
    return user;
  }

  static createUser(id: string, email: string, name: string, role: RoleDomain): UserEntity {
    return {
      id: createUserIdDomain(id),
      email: createEmailDomain(email),
      name,
      role,
      createdAt: new Date()
    };
  }
}

// Testing the user management system
const userManagementTest = test_('User management system types', () => {
  // Test that our domain types are distinct
  no_<$Equal<UserIdDomain, EmailDomain>>();
  no_<$Equal<UserIdDomain, string>>();
  
  // Test that they extend their base types
  yes_<$Extends<UserIdDomain, string>>();
  yes_<$Extends<EmailDomain, string>>();
  
  // Test user entity structure
  yes_<$Extends<UserEntity, { id: UserIdDomain }>>();
  yes_<$Extends<UserEntity, { email: EmailDomain }>>();
  
  return t_<UserEntity>();
});

// ### type-safe API client

// API response types
type ApiSuccess<T> = {
  status: 'success';
  data: T;
  message: string;
};

type ApiError = {
  status: 'error';
  error: string;
  code: number;
};

type ApiResult<T> = ApiSuccess<T> | ApiError;

// HTTP method phantom types
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type HttpMethodPhantom<T extends HttpMethod> = {
  readonly __httpMethod: T;
};

// Type-safe API client
class TypeSafeApiClient {
  static validateApiResponse<T>(response: unknown): response is ApiResult<T> {
    return typeof response === 'object' && response !== null && 'status' in response;
  }

  static async request<T, M extends HttpMethod>(
    method: M,
    url: string,
    data?: M extends 'GET' ? never : any
  ): Promise<ApiResult<T>> {
    // Simulate API call
    const response = {
      status: 'success' as const,
      data: {} as T,
      message: 'Success'
    };
    return response;
  }
}

// Test API client types
const apiClientTest = test_('API client type safety', () => {
  type GetResponse = ApiResult<UserEntity>;
  type PostResponse = ApiResult<UserEntity>;
  
  // Test response structure
  yes_<$Extends<GetResponse, { status: string }>>();
  yes_<$Extends<ApiSuccess<UserEntity>, { data: UserEntity }>>();
  
  return t_<ApiResult<UserEntity>>();
});

// ============================================================================
// FINAL VALIDATION AND EXPORT
// ============================================================================

/*
## summary

this compilation demonstrates the full power of typist for type-level programming:

1. **phantom types** - create distinct types without runtime overhead
2. **branded types** - prevent mixing similar values through nominal typing  
3. **type-level computation** - perform complex operations at the type level
4. **compile-time validation** - catch errors before runtime through static analysis
5. **domain modeling** - encode business rules directly in the type system

### key takeaways

- Phantom types encode domain knowledge in the type system
- They help prevent bugs by making invalid states unrepresentable  
- Type-level programming enables powerful static analysis
- Typist provides a minimal, zero-runtime-cost toolkit for these patterns

### next steps

1. install typist in your project
2. Start with simple branded types for IDs and similar values
3. Gradually introduce more advanced patterns as needed
4. Use type tests to validate your phantom type implementations
5. Explore the interactive scenarios for hands-on practice

Remember: Start small and build up complexity gradually. Phantom types are most 
valuable when they prevent real-world bugs and improve code clarity.
*/

// Comprehensive type validation of our examples
const comprehensiveValidation = test_('Complete typist documentation validation', () => {
  // Validate all our phantom types work together
  yes_<$Extends<UserId, string>>();
  yes_<$Extends<EmailAddress, string>>();
  yes_<$Extends<UserIdDomain, string>>();
  yes_<$Extends<EmailDomain, string>>();
  
  // Validate type-level arithmetic
  yes_<$Equal<Add<2, 3>, 5>>();
  yes_<$Equal<Subtract<10, 4>, 6>>();
  
  // Validate string manipulation
  yes_<$Equal<Split<'a,b,c', ','>, ['a', 'b', 'c']>>();
  yes_<$Equal<CamelCase<'hello_world'>, 'helloWorld'>>();
  
  // Validate complex structures
  yes_<$Extends<UserEntity, { id: UserIdDomain; email: EmailDomain }>>();
  yes_<$Extends<ApiSuccess<UserEntity>, { status: 'success'; data: UserEntity }>>();
  
  return t_<'All validations passed!'>();
});

// Export key types and utilities for use
export {
  // Core phantom type utilities
  t_, type_, t, yes_, no_, is_, never_, test_, proof_, example_,
  
  // Factory functions
  createUserId, createEmail, createUserIdDomain, createEmailDomain,
  
  // Services
  UserService, TypeSafeApiClient,
  
  // Validation utilities
  validateUser, validateConfig, isValidUserId
};

export type {
  // Domain types
  UserId, EmailAddress, UserIdDomain, EmailDomain, UserEntity,
  
  // Advanced types
  Add, Subtract, Split, Join, CamelCase,
  DeepReadonly, DeepPartial, Path, PathValue,
  
  // API types
  ApiResult, ApiSuccess, ApiError,
  
  // Connection and state types
  Connection, ConnectionState, QueryBuilder
};

console.log('🎉 Typist documentation compilation completed successfully!');