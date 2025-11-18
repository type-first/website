import { is_, t, test_, yes_, $Equal, example_ } from './typist'

export const tuple 
  = <const T extends readonly string[]>
    (...args:T):T => args

export const xtuple 
  = example_(() => {
    const x0 = tuple('a','b','c')
    is_<typeof x0>(['a','b','c'])
    is_<readonly ['a','b','c']>(x0)
    yes_< $Equal<typeof x0, readonly ['a','b','c']> >()
    const x1 = tuple('a','a')
    yes_< $Equal<typeof x1, readonly ['a','a']> >()
    const x2 = tuple()
    yes_< $Equal<typeof x2, readonly []> >()
    return [ x0, x1, x2 ] as const })

export const union_
  = <const T extends readonly any[]>
    (tuple:T): T[number] => t<T[number]>()

export const xunion_
  = example_(async () => {
    const [ t0, t1, t2 ] = xtuple
    const x0 = union_(t0)
    yes_< $Equal<typeof x0, 'a' | 'b' | 'c'> >()
    const x1 = union_(t1)
    yes_< $Equal<typeof x1, 'a'> >()
    const x2 = union_(t2)
    yes_< $Equal<typeof x2, never> >()
    return [ x0, x1, x2 ] as const })

export const xunions 
  = example_(() => {
    const abc_ = t<'a'|'b'|'c'>()
    const cba_ = t<'c'|'b'|'a'>()
    const abca_ = t<'a'|'b'|'c'|'a'>()
    const ab_ = t<'a'|'b'>()
    const a_ = t<'a'>()
    return { abc_, cba_, abca_, ab_, a_ } })

export const xoverloads 
  = example_(() => {
    const u = xunions
    type Distribute<T> = T extends any ? (() => T) : never
    const abc_ = t<(() => 'a') | (() => 'b') | (() => 'c')>()
    // @ts-expect-error:✔︎
    yes_<$Equal< Distribute<typeof u.ab_>, typeof abc_ >>() 
    yes_<$Equal< Distribute<typeof u.abc_>, typeof abc_ >>() 
    yes_<$Equal< Distribute<typeof u.abca_>, typeof abc_ >>() // no duplicates
    yes_<$Equal< Distribute<typeof u.cba_>, typeof abc_ >>() // 🔮 unordered
    return { abc_ } })

export type Intersect
  <U> = (U extends any ? 
  (x: U) => any : never) extends 
  (x: infer I) => any ? I : never

test_(() => 
  { const f0 = t<(x:'a0') => 'r0'>()
    const f1 = t<(x:'a1') => 'r1'>()
    const u0 = t<typeof f0 | typeof f1>()
    const u1 = union_([f0, f1])
    yes_<$Equal< typeof u0,typeof u1 >>()
    const i0 = t<typeof f0 & typeof f1>()
    const i1 = t<Intersect<typeof u1>>()
    is_<typeof f0>(i0); is_<typeof f0>(i1)
    is_<typeof f1>(i0); is_<typeof f1>(i1)
    // @ts-expect-error:✔︎
    // (x:'a0') => 'r0' !< ((x:'a0') => 'r0' | (x:'a1') => 'r1')
    is_<typeof i0>(f0)
    is_<(x:'a'&'b') => any>(i0)
    // @ts-expect-error:✔︎
    // (x:never) => any !< (x:'a0') => 'r0'
    is_<typeof i0>(t<(x:'a'&'b') => any>()) })

/**
 * Joins two tuples `A` and `B` into a single tuple.
 */
export type join<
  A extends readonly any[],
  B extends readonly any[]
> = [...A, ...B]

test_(() => {
  type A = ['x','y']
  type B = ['z']
  type R = join<A, B>
  yes_<$Equal<R, ['x','y','z']>>() })

/**
 * Splits a tuple `T` at index `N` from the start.
 * Returns a pair `[left, right]` such that:
 *   - `left.length === N`
 *   - `join<left, right> === T`
 */
export type split<
  T extends readonly any[],
  N extends number,
  A extends readonly any[] = [],
  B extends readonly any[] = T
> = A['length'] extends N
  ? [A, B]
  : B extends [infer H, ...infer R]
    ? split<T, N, [...A, H], R>
    : [A, []]

test_(() => {
  type T = ['a','b','c','d']
  yes_<$Equal<
    split<T, 0>, 
    [[], ['a','b','c','d']] >>()
  yes_<$Equal<
    split<T, 1>, 
    [['a'], ['b','c','d']] >>()
  yes_<$Equal< 
    split<T, 2>, 
    [['a','b'], ['c','d']]  >>()
  yes_<$Equal< 
    split<T, 3>, 
    [['a','b','c'], ['d']]  >>()
  yes_<$Equal<
    split<T, 4>, 
    [['a','b','c','d'], []]>>() })


/**
 * Splits a tuple `T` at index `N` from the end.
 * Equivalent to `split<T, T.length - N>`
 */
export type splitFromEnd<
  T extends readonly any[],
  N extends number
> = split<T, subtract<T['length'], N>>

/**
 * Takes the first `N` elements from tuple `T`.
 * Equivalent to `split<T, N>[0]`
 */
export type take<
  T extends readonly any[],
  N extends number
> = split<T, N>[0]

/**
 * Takes the last `N` elements from tuple `T`.
 * Equivalent to `splitFromEnd<T, N>[1]`
 */
export type takeLast<
  T extends readonly any[],
  N extends number
> = splitFromEnd<T, N>[1]

test_(() => {
  type T = ['x','y','z','w']
  yes_<$Equal<split<T, 2>, [['x','y'], ['z','w']]>>()
  yes_<$Equal<splitFromEnd<T, 2>, [['x','y'], ['z','w']]>>()
  yes_<$Equal<take<T, 3>, ['x','y','z']>>()
  yes_<$Equal<takeLast<T, 3>, ['y','z','w']>>()
  yes_<$Equal<split<T, 0>, [[], T]>>()
  yes_<$Equal<split<T, 4>, [T, []]>>() })

/**
 * Builds a tuple of length `N`.
 */
type buildTuple<
  N extends number,
  T extends 0[] = []
> = T['length'] extends N
  ? T
  : buildTuple<N, [0, ...T]>

/**
 * Subtracts `B` from `A`, assuming `A >= B`.
 */
export type subtract<
  A extends number,
  B extends number
> = buildTuple<A> extends [...buildTuple<B>, ...infer Rest]
  ? Rest['length']
  : never

/**
 * Converts a union `U` into a tuple of its members.
 * ⚠️ Order is not guaranteed.
 * Guaranteed:
 *   - Tuple contains all distinct members of `U`
 *   - No duplicates
 *   - Result is a finite tuple form of the union
 */
export type explodeUnion<U> = 
  (U extends any ? (k: () => U) => void : never) extends
  (k: infer I) => void
    ? I extends () => infer V
      ? [...explodeUnion<Exclude<U, V>>, V]
      : []
    : []

test_(() => {
  type U = 'x' | 'y' | 'z'
  type T = explodeUnion<U>
  yes_<$Equal<T[number], U>>() })