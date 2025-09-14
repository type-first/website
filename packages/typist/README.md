# lib.typist

**type-level toolkit**

A minimal, compositional, and debug-friendly suite of type-level utilities designed for static analysis, symbolic testing, and phantom type operations in TypeScript. `typist` treats types as first-class values, leveraging the compiler’s structural type system to encode symbolic verdicts, composable constraints, and static proofs.

* **phantom types** to represent symbolic or nominal values without runtime cost.
* **assertions** to test assignability, identity, and structure in-place.
* **verdict encoding** for static error annotation, debugging, and type introspection.
* **symbolic inference** and type comparison as first-class idioms.

---

## typist.phantom
Phantom values allow types to be passed and manipulated in expression form without requiring actual runtime data.

```ts
export const t = <T>(x: unknown = null): T => x as T
```

### usage

```ts
type Foo = { foo: string }
const value = t<Foo>()  // Phantom Foo value
```

This is useful for defining "values" of types purely for type-checking or simulation purposes.

---

## typist.assertives

Verdicts are symbolic markers used to encode static type comparison results in a composable and debuggable format.

```ts
export type $Verdict = { $___verdict: boolean }

export type $No<
  Key extends string,
  Dump extends readonly any[] = []
> = {
  $___verdict: false
  $___type_error: true
  $___type_error_key: Key
  $___dump: Dump
}

export type $Yes = {
  $___verdict: true
  $___type_error: false
}

export type $YesOrNo = $Verdict & ($Yes | $No<string>)
```

### Pattern

- `$Yes` marks a successful comparison.
- `$No<key, dump>` marks a failure, with structured metadata.

### Example

```ts
type Check = $Extends<"a", string> // ✅ yields $Yes
type Fail = $Extends<string, "a"> // ❌ yields $No<...>
```

---

## typist.comparatives

Static binary type-level comparisons.

```ts
export type $Extends<L, R> =
  [L] extends [R] ? $Yes
  : $No<'right-does-not-extend-left', [L, R]>

export type $Equal<T1, T2> =
  ([T1] extends [T2] ? ([T2] extends [T1] ? true : false) : false) extends true
    ? $Yes
    : $No<'not-equal', [T1, T2]>
```

### Purpose

- `$Extends<A,B>` is a structural subtype test.
- `$Equal<A,B>` checks symmetric assignability (deep identity).

### Example

```ts
type IsString = $Extends<"hi", string>        // $Yes
type IsExact = $Equal<{ a: 1 }, { a: 1 }>     // $Yes
type IsNot = $Equal<{ a: 1 }, { a: number }>  // $No<...>
```

---

## typist.assertions

Runtime stubs for static type assertions. These are **not** meant to execute, but rather to be **invoked at the type level** to enforce structural relationships and trigger inference flows.

```ts
export const is_ = <T>(x: T) => {}
export const assignable_ = is_

export const has_ = <
  const P extends string,
  const V = any
>(x: { [k in P]: V }) => {}

export const extends_ = <T, E extends T>(x?: T, y?: E) => {}
export const instance_ = <T extends AnyClass>(x?: InstanceType<T>) => {}

export const never_ = <T extends never>(x?: T): never => x as never

export const decidable_ = <T extends $YesOrNo>(t?: T) => {}
export const yes_ = <T extends $Yes>(t?: T) => true
export const no_ = <T extends $No<string>>(t?: T) => {}
```

### Usage Patterns

Use these for **static checking and test isolation**. 

```ts
extends_<string, "foo">()      // ✅ OK
// extends_<"foo", string>()   // @ts-expect-error: ❌ not assignable

has_<"foo", number>({ foo: 123 }) // ✅ OK
```

These helpers drive `example_`-based proofs and runtime-ignored test declarations.

---

## typist.framework

Infrastructure for encoding static test blocks, canonical examples, and symbolic validations. These are ergonomically sugar for phantom evaluation and documentation of static behaviors.

```ts
type F<T> = (a: any) => T
type S = string

export function example_<T>(fn: F<T>): T
export function example_<T>(label: S, fn: F<T>): T
export function example_<T>(..._args: [S, F<T>] | [F<T>]): T {
  return t<T>()
}

export const test_ = example_
export const proof_ = example_
```

### Usage

```ts
example_<() => void>(() => {
  extends_<string, "hi">()
  // @ts-expect-error: ❌ "hi" !< string
  extends_<"hi", string>()
})

test_('Equality of literal types', () => {
  const res = $Equal<42, 42> // ✅ $Yes
  yes_(res)
})
```

This idiom encodes static expectations directly into the type system and is easily introspectable via IDE or build feedback.