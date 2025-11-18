// Welcome to Typist Phantom Types! 🧪
//
// This scenario introduces the fundamental concept of phantom types
// and how typist enables type-level programming in TypeScript.
//
// Phantom types let you work with types as first-class values,
// enabling powerful static analysis and compile-time validation.

import { createUserId, createEmail, EmailAddress } from './utils/brands';

// === Part 1: Understanding Phantom Types ===

// A phantom type carries type information but has no runtime representation
// We can simulate typist's t_<T>() function to create phantom values

function t_<T>(): T {
  return null as any as T;
}

const stringType = t_<string>();
const numberType = t_<number>(); 
const userType = t_<{ id: string; name: string }>();

// These values are typed but have no runtime cost:
console.log('Phantom values are always null at runtime:', { stringType, numberType, userType });

// === Part 2: Branded Types with Phantom Values ===

// Create strongly-typed IDs that prevent mixing different types
const userId = createUserId('user_123');
const userEmail = createEmail('user@example.com');

console.log('Branded types:', { userId, userEmail });

// Try uncommenting this line to see the type error:
// const wrongAssignment: EmailAddress = userId; // Type error!

// === Part 3: Working with Type-Level Information ===

// Phantom types let us encode information purely at the type level
type DatabaseTable<TName extends string> = {
  readonly __tableName: TName; // phantom field
  insert<T>(data: T): void;
  find<T>(id: string): T | null;
};

// Create typed table references
const usersTable = t_<DatabaseTable<'users'>>();
const postsTable = t_<DatabaseTable<'posts'>>();

// The type system knows these are different table types
type UsersTableType = typeof usersTable; // DatabaseTable<'users'>
type PostsTableType = typeof postsTable; // DatabaseTable<'posts'>

// === Part 4: Phantom Types for State Machines ===

// Model connection states using phantom types
type ConnectionState = 'disconnected' | 'connecting' | 'connected';

type Connection<TState extends ConnectionState> = {
  readonly __state: TState; // phantom field for state tracking
  readonly id: string;
}

// State-specific methods using conditional types
type ConnectionMethods<TState extends ConnectionState> = 
  TState extends 'disconnected' ? { connect(): Connection<'connecting'> } :
  TState extends 'connecting' ? { cancel(): Connection<'disconnected'> } :
  TState extends 'connected' ? { 
    send(data: string): void;
    disconnect(): Connection<'disconnected'>;
  } : never;

type TypedConnection<TState extends ConnectionState> = 
  Connection<TState> & ConnectionMethods<TState>;

// Create phantom values for different connection states
const disconnectedConn = t_<TypedConnection<'disconnected'>>();
const connectingConn = t_<TypedConnection<'connecting'>>();
const connectedConn = t_<TypedConnection<'connected'>>();

// The type system enforces valid state transitions:
// disconnectedConn.connect() // ✓ Valid
// disconnectedConn.send('data') // ✗ Type error!
// connectedConn.send('data') // ✓ Valid

// === Part 5: Phantom Values for API Design ===

// Use phantom types to create type-safe builder patterns
type QueryBuilder<TSelected extends boolean = false> = {
  readonly __selected: TSelected; // phantom field
  select<T>(fields: T[]): QueryBuilder<true>;
  where(condition: string): QueryBuilder<TSelected>;
  // execute() only available after select() has been called
} & (TSelected extends true ? { execute(): any[] } : {});

const query = t_<QueryBuilder<false>>();
const queryWithSelect = t_<QueryBuilder<true>>();

// Type-safe query building:
// query.execute() // ✗ Type error! Must call select() first
// queryWithSelect.execute() // ✓ Valid

console.log('🎉 Phantom types enable powerful type-level programming!');

export { stringType, numberType, userType, userId, userEmail };