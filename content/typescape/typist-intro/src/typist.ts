// Local implementation of typist functions for typist-intro scenario
export const t_ = <T>(): T => null as T
export const is_ = <T>(x: T) => {}
export const extends_ = <E extends T, T>(y?: E, x?: T) => {}
export const has_ = <const P extends string, const V = any>(x: { [k in P]: V }) => {}