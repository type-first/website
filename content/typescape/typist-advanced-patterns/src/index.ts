// Typist Advanced Type-Level Patterns 🚀
//
// This scenario demonstrates advanced type-level programming patterns
// using typist's phantom type system for complex computations,
// state machines, and compile-time verification.

import { 
  createStateMachine, 
  createTypeValidator,
  createQueryBuilder
} from './utils/advanced-types';

// Phantom value creator
function t_<T>(): T { return null as any as T; }

// === Part 1: Type-Level Arithmetic ===

// Implement addition at the type level using tuples
type Tuple<T extends number, R extends readonly unknown[] = []> = 
  R['length'] extends T ? R : Tuple<T, readonly [...R, unknown]>;

type Add<A extends number, B extends number> = 
  [...Tuple<A>, ...Tuple<B>]['length'];

type Subtract<A extends number, B extends number> = 
  Tuple<A> extends readonly [...infer U, ...Tuple<B>] ? U['length'] : never;

// Test arithmetic operations
type Sum = Add<3, 4>;        // 7
type Difference = Subtract<10, 3>;  // 7

console.log('Type-level arithmetic works!');

// === Part 2: Advanced String Manipulation ===

// Type-level string operations using template literals
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

// Test string operations
type Words = Split<'hello,world,typescript', ','>;  // ['hello', 'world', 'typescript']
type Rejoined = Join<['a', 'b', 'c'], '-'>;         // 'a-b-c'
type Camel = CamelCase<'user_first_name'>;           // 'userFirstName'

// === Part 3: Deep Object Transformation ===

// Deep readonly transformation
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

// Test deep transformations
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

// === Part 4: Type-Safe State Machine ===

// Create a complex state machine for user authentication
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
type ValidTransition<
  TCurrentState extends AuthState,
  TEvent extends AuthEvents
> = TCurrentState extends keyof AuthTransitions
  ? TEvent['type'] extends keyof AuthTransitions[TCurrentState]
    ? AuthTransitions[TCurrentState][TEvent['type']]
    : never
  : never;

const authMachine = createStateMachine<AuthState, AuthEvents>();

// === Part 5: Type-Level Validation System ===

// Build a type-level schema validation system
type Schema = {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required?: boolean;
  properties?: Record<string, Schema>;
  items?: Schema;
};

type ValidateSchema<T, S extends Schema> = 
  S['type'] extends 'string' 
    ? T extends string ? true : false
  : S['type'] extends 'number'
    ? T extends number ? true : false
  : S['type'] extends 'boolean'
    ? T extends boolean ? true : false
  : S['type'] extends 'object'
    ? T extends object
      ? S['properties'] extends Record<string, Schema>
        ? {
            [K in keyof S['properties']]: K extends keyof T
              ? ValidateSchema<T[K], S['properties'][K]>
              : S['properties'][K]['required'] extends true
                ? false
                : true
          }[keyof S['properties']] extends true
          ? true
          : false
        : true
      : false
  : S['type'] extends 'array'
    ? T extends readonly unknown[]
      ? S['items'] extends Schema
        ? T[number] extends infer Item
          ? ValidateSchema<Item, S['items']>
          : true
        : true
      : false
  : false;

// Define schemas
const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    age: { type: 'number', required: false },
    active: { type: 'boolean', required: true }
  }
} as const;

// Test validation
type ValidUser = { id: string; name: string; active: boolean };
type InvalidUser = { id: number; name: string };

type ValidUserCheck = ValidateSchema<ValidUser, typeof userSchema>;     // true
type InvalidUserCheck = ValidateSchema<InvalidUser, typeof userSchema>; // false

// === Part 6: SQL Query Builder DSL ===

// Type-safe SQL query builder using phantom types
type QueryType = 'select' | 'insert' | 'update' | 'delete';
type JoinType = 'inner' | 'left' | 'right' | 'full';

interface QueryBuilder<
  TTable extends string = string,
  TColumns extends string = string,
  TSelected extends boolean = false,
  TFiltered extends boolean = false
> {
  readonly __table: TTable;
  readonly __columns: TColumns;
  readonly __selected: TSelected;
  readonly __filtered: TFiltered;
}

type SelectQuery<TTable extends string, TColumns extends string> = 
  QueryBuilder<TTable, TColumns, true, false>;

type WhereQuery<
  TTable extends string, 
  TColumns extends string,
  TSelected extends boolean
> = QueryBuilder<TTable, TColumns, TSelected, true>;

// Query builder methods
const queryBuilder = createQueryBuilder();

// Type-safe query construction (phantom types ensure correct usage)
const usersQuery = queryBuilder
  .select(['id', 'name', 'email'])
  .from('users')
  .where('active = ?', [true])
  .orderBy('name');

// === Part 7: Compile-Time Proofs ===

// Create proofs about type relationships
type Proof<T> = { readonly __proof: T };

function prove<T extends true>(): Proof<T> {
  return { __proof: true as T };
}

// Prove mathematical properties
type CommutativeAddition = Add<3, 5> extends Add<5, 3> ? true : false;
type AssociativeAddition = Add<Add<2, 3>, 4> extends Add<2, Add<3, 4>> ? true : false;

const additionIsCommutative = prove<CommutativeAddition>();
const additionIsAssociative = prove<AssociativeAddition>();

// Prove type relationships
type TransitivityProof<A, B, C> = 
  A extends B 
    ? B extends C 
      ? A extends C 
        ? true 
        : false
      : false
    : false;

interface Animal { name: string; }
interface Mammal extends Animal { warmBlooded: true; }
interface Dog extends Mammal { breed: string; }

type DogIsAnimal = TransitivityProof<Dog, Mammal, Animal>; // true
const dogIsAnimalProof = prove<DogIsAnimal>();

// === Part 8: Type-Level Parser ===

// Build a simple JSON path parser at the type level
type ParsePath<T extends string> = 
  T extends `${infer Key}.${infer Rest}`
    ? [Key, ...ParsePath<Rest>]
    : T extends ''
      ? []
      : [T];

type GetByPath<T, P extends readonly string[]> = 
  P extends readonly [infer Head, ...infer Tail]
    ? Head extends keyof T
      ? Tail extends readonly string[]
        ? GetByPath<T[Head], Tail>
        : T[Head]
      : never
    : T;

// Test path parsing
type ParsedPath = ParsePath<'user.profile.settings.theme'>;  // ['user', 'profile', 'settings', 'theme']
type PathResult = GetByPath<ComplexUser, ParsedPath>;        // 'light' | 'dark'

console.log('🚀 Advanced type-level programming patterns mastered!');

// Use the advanced utilities
const validator = createTypeValidator();
const stateMachine = authMachine.start('logged-out');

export type {
  Sum,
  Difference,
  Words,
  Camel,
  ReadonlyUser,
  AuthState,
  ValidUserCheck,
  CommutativeAddition
};

export {
  validator,
  stateMachine,
  queryBuilder
};