import { has_, test_, yes_, $Equal } from './typist'

export type Rec<T> = Record<string, T>
export type Key<T> = keyof T & string

export const keys 
  = <const T extends object>(obj: T) => 
    Object.keys(obj || {}) as (Key<T>)[]

export const omit
  = < const T extends Rec<any>, const K extends readonly [...Key<T>[]] >
    ( obj:T, omit:K ): Omit<T, K[number]> => 
    { const allKeys = keys(obj)
      const selection = allKeys.reduce((acc, key) => 
        { if (omit.includes(key)) return acc
          return { ...acc, [key]:obj[key] } }, 
        {} as Omit<T, K[number]>)
      return selection }

test_('omit', async () => {
  const o = { a: 1, b: 2, c: 3 } as const
  const result = omit(o, ['a', 'c'])
  has_< 'b', 2 >(result)
  // @ts-expect-error:✔︎
  has_< 'a', 1 >(result)
  // @ts-expect-error:✔︎
  has_< 'a', undefined >(result)
  yes_<$Equal< typeof result, { b:2 } >>() })