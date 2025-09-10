type A = [ 1, 2 ]
type B = [ 3 ]

// Tuple-based power set (exact 2^n length)
type MapPrepend<V, L extends (unknown[])[]> =
  L extends [infer H, ...infer R]
    ? H extends unknown[]
      ? R extends (unknown[])[]
        ? [[V, ...H], ...MapPrepend<V, R>]
        : never
      : never
    : []

type TuplePowerSet<T extends unknown[]> =
  T extends [infer H, ...infer R]
    ? R extends unknown[]
      ? [...TuplePowerSet<R>, ...MapPrepend<H, TuplePowerSet<R>>]
      : never
    : [[]]

// Precise tuple power set
type PofA = TuplePowerSet<A>
type PofPofA = TuplePowerSet<PofA>

type PofAB = TuplePowerSet<[ ...PofA, A, B ]>

type D = []
type PofD = TuplePowerSet<D> // 2^0 = 1
type PofPofD = TuplePowerSet<PofD> // 2^(2^0) = 2
type PofPofPofD = TuplePowerSet<PofPofD> // 2^(2^(2^0)) = 4
type PofPofPofPofD = TuplePowerSet<PofPofPofD> // 2^(2^(2^(2^0))) = 16

export {}
