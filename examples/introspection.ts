/**
 * Type Introspection Utilities
 * 
 * Tools for forcing TypeScript to resolve complex derived types into their
 * concrete forms, making them more readable and debuggable.
 */

// =============================================================================
// Core Type Utilities
// =============================================================================

/**
 * Resolve type utility - forces shallow type resolution
 * 
 * Preserves function signatures and converts objects to their concrete forms.
 * Does not recursively resolve nested object properties.
 */
export type _r<T> =
  T extends (...args: any[]) => any
    ? T 
  : T extends readonly [any, ...any[]] 
    ? { [K in keyof T]: T[K] }
  : T extends readonly any[] 
    ? Array<T[number]>
  : T extends object
    ? { [K in keyof T]: T[K] }
  : T

/**
 * Shallow type resolver function
 * 
 * Forces TypeScript to resolve the type T into its concrete form at the top level.
 * Useful for seeing the immediate structure of complex derived types.
 */
export const resolve_ = <T>(x_?: T) => x_ as _r<T>

/**
 * Flush type utility - forces deep recursive type resolution
 * 
 * Recursively resolves all nested object types, converting the entire type
 * structure into concrete anonymous object types while preserving literals.
 */
export type _f<T> =
  T extends (...args: any[]) => any
    ? T
  : T extends readonly [any, ...any[]]
    ? { [K in keyof T]: _f<T[K]> }
  : T extends readonly any[]
    ? Array<_f<T[number]>>
  : T extends object 
    ? { [K in keyof T]: _f<T[K]> }
  : T 

/**
 * Deep type resolver function
 * 
 * Forces TypeScript to deeply resolve the type T and all its nested properties
 * into concrete forms. This is the most powerful introspection tool for 
 * understanding complex type hierarchies.
 */
export const flush_ = <T>(x_?: T) => x_ as _f<T>

// =============================================================================
// Demonstration Examples
// =============================================================================

// Example 1: Basic object type resolution
type ComplexMerge<T, U> = T & U & { merged: true }

type UserBase = {
  id: number
  name: string
}

type UserPermissions = {
  canEdit: boolean
  canDelete: boolean
}

type ComplexUser = ComplexMerge<UserBase, UserPermissions>

// Without introspection - shows complex derived type
const complexUser: ComplexUser = {
  id: 1,
  name: "John",
  canEdit: true,
  canDelete: false,
  merged: true
}

// With shallow resolution
const resolvedUser = resolve_(complexUser)
// Hover shows: { id: number; name: string; canEdit: boolean; canDelete: boolean; merged: true; }

// With deep resolution (same result for this simple case)
const flushedUser = flush_(complexUser)
// Hover shows the same clean object type

// =============================================================================

// Example 2: Nested object introspection
type DeepNesting<T> = {
  level1: {
    level2: {
      level3: T & { nested: true }
    }
  }
}

type NestedStructure = DeepNesting<{ value: string }>

const nestedOriginal: NestedStructure = {
  level1: {
    level2: {
      level3: {
        value: "deep",
        nested: true
      }
    }
  }
}

// Shallow resolution - only resolves top level
const nestedResolved = resolve_(nestedOriginal)
// Still shows derived types in nested properties

// Deep resolution - recursively resolves all levels
const nestedFlushed = flush_(nestedOriginal)
// Shows completely concrete nested object structure

// =============================================================================

// Example 3: Array and tuple introspection
type ComplexArray<T> = Array<T & { processed: true }>
type ComplexTuple<T, U> = readonly [T & { first: true }, U & { second: true }]

const complexArray: ComplexArray<{ name: string }> = [
  { name: "item1", processed: true },
  { name: "item2", processed: true }
]

const complexTuple: ComplexTuple<{ id: number }, { label: string }> = [
  { id: 1, first: true },
  { label: "test", second: true }
] as const

// Resolve array structure
const resolvedArray = resolve_(complexArray)
const flushedArray = flush_(complexArray)

// Resolve tuple structure  
const resolvedTuple = resolve_(complexTuple)
const flushedTuple = flush_(complexTuple)

// =============================================================================

// Example 4: Function type preservation
type ComplexFunction = (x: { input: string }) => { output: number }

const complexFn: ComplexFunction = (x) => ({ output: x.input.length })

// Functions are preserved as-is in both resolve_ and flush_
const resolvedFn = resolve_(complexFn)
const flushedFn = flush_(complexFn)

// =============================================================================

// Example 5: Utility type introspection
type PickAndPartial<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>

interface FullUser {
  id: number
  name: string
  email: string
  age: number
  active: boolean
}

type PartialNameUser = PickAndPartial<FullUser, 'name' | 'email'>

const partialUser: PartialNameUser = {
  id: 1,
  age: 30,
  active: true,
  name: "Optional John"
  // email is optional
}

// Without introspection - shows complex utility type chain
// With introspection - shows clean object with optional properties clearly marked
const resolvedPartialUser = resolve_(partialUser)
const flushedPartialUser = flush_(partialUser)

// =============================================================================

// Example 6: Conditional type introspection
type IsString<T> = T extends string ? { isString: true; value: T } : { isString: false; value: never }
type StringOrNot<T> = IsString<T> & { original: T }

type StringResult = StringOrNot<"hello">
type NumberResult = StringOrNot<42>

const stringTest: StringResult = {
  isString: true,
  value: "hello",
  original: "hello"
}

const numberTest: NumberResult = {
  isString: false,
  value: undefined as never,
  original: 42
}

// Introspection reveals the resolved conditional type structure
const resolvedString = resolve_(stringTest)
const flushedString = flush_(stringTest)
const resolvedNumber = resolve_(numberTest)
const flushedNumber = flush_(numberTest)

// =============================================================================

// Example 7: Mapped type introspection
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

type Optional<T> = {
  [P in keyof T]?: T[P]
}

type ReadonlyOptional<T> = Readonly<Optional<T>>

interface MutableRequired {
  name: string
  age: number
  active: boolean
}

type ImmutableOptional = ReadonlyOptional<MutableRequired>

const immutableData: ImmutableOptional = {
  name: "John",
  age: 30
  // active is optional
}

// Shows the final resolved readonly optional properties
const resolvedImmutable = resolve_(immutableData)
const flushedImmutable = flush_(immutableData)

// =============================================================================

// Example 8: Generic constraint introspection
type ExtractMethods<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : never
}

type NonNeverKeys<T> = {
  [K in keyof T]: T[K] extends never ? never : K
}[keyof T]

type MethodsOnly<T> = Pick<ExtractMethods<T>, NonNeverKeys<ExtractMethods<T>>>

class ExampleService {
  name: string = "service"
  count: number = 0
  
  getName() {
    return this.name
  }
  
  increment() {
    this.count++
  }
  
  setName(name: string) {
    this.name = name
  }
}

type ServiceMethods = MethodsOnly<ExampleService>

const serviceMethods = {} as ServiceMethods

// Introspection shows only the method signatures
const resolvedMethods = resolve_(serviceMethods)
const flushedMethods = flush_(serviceMethods)

// =============================================================================
// Testing and Validation Examples
// =============================================================================

// Type equality check utility (if available in your project)
// Uncomment if you have a type testing utility
/*
import { Equal, Expect } from './type-testing-utils'

// Test that resolve_ and flush_ preserve type equality
type TestResolved = Expect<Equal<typeof complexUser, typeof resolvedUser>>
type TestFlushed = Expect<Equal<typeof complexUser, typeof flushedUser>>

// Test that functions are preserved
type TestFunction = Expect<Equal<typeof complexFn, typeof resolvedFn>>
type TestFunctionFlushed = Expect<Equal<typeof complexFn, typeof flushedFn>>
*/

// =============================================================================
// Performance and Edge Cases
// =============================================================================

// Example 9: Very deep nesting (be careful with TypeScript recursion limits)
type VeryDeep = {
  a: {
    b: {
      c: {
        d: {
          e: {
            value: string
          }
        }
      }
    }
  }
}

const veryDeep: VeryDeep = {
  a: {
    b: {
      c: {
        d: {
          e: {
            value: "deep"
          }
        }
      }
    }
  }
}

const resolvedVeryDeep = resolve_(veryDeep)
const flushedVeryDeep = flush_(veryDeep)

// =============================================================================

// Example 10: Circular reference handling (TypeScript will prevent infinite recursion)
interface CircularA {
  b?: CircularB
  value: string
}

interface CircularB {
  a?: CircularA
  count: number
}

const circular: CircularA = {
  value: "test",
  b: {
    count: 1
    // a: circular // This would create actual circular reference
  }
}

const resolvedCircular = resolve_(circular)
const flushedCircular = flush_(circular)

console.log("Type introspection utilities demonstrated successfully!")