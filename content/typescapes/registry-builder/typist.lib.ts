export const t_ = <T>(): T => null as T
export const is_ = <T>(x: T) => {}
export const test_ 
  = (a0:string|(() => void), a1?:() => void) => 
  { if (typeof a0 === 'function') a0()
    else if (a1) a1() }