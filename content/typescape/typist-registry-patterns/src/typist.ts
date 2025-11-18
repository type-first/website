// Local implementation of typist functions for typist-registry-patterns scenario
export const t_ = <T>(): T => null as T
export const is_ = <T>(x: T) => {}
export const example_ = <T>(fn: () => T): T => fn()
export const __ = null as any