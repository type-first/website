// Local implementation of typist functions for typist-get-operations scenario
export const t_ = <T>(): T => null as T
export const is_ = <T>(x: T) => {}
export const never_ = <T extends never>(x?: T): never => x as never
export const test_ = (name: string | (() => void), fn?: () => void) => {
  if (typeof name === 'function') {
    name()
  } else if (fn) {
    fn()
  }
}

export type $Yes = true
export type $No<A = any, B = any> = {
  readonly _tag: 'No'
  readonly left: A
  readonly right: B
  readonly debug: string
}

export const yes_ = <T extends $Yes>(t?: T) => true

export type $Equal<A, B> = 
  [A] extends [B] 
    ? [B] extends [A] 
      ? $Yes 
      : $No<A, B>
    : $No<A, B>