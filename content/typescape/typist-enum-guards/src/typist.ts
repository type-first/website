// Local implementation of typist functions for typist-enum-guards scenario
export const t_ = <T>(): T => null as T
export const is_ = <T>(x: T) => {}
export const test_ = (name: string | (() => void), fn?: () => void) => {
  if (typeof name === 'function') {
    name()
  } else if (fn) {
    fn()
  }
}