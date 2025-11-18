import { __, example_, is_, t_ } from './typist'

export const join  
  = < const A extends readonly any[], 
      const B extends readonly any[] >
    (a:A, b:B): [...A, ...B] => [...a, ...b] as const

export type ObjectWithKey 
  = { [k:string]:any } 
  & { key:string } 

export type RTuple
  < E extends ObjectWithKey > 
  = readonly E[]

export type RDef
  < E extends ObjectWithKey > 
  = { model_:E, entries:RTuple<E> }

export type RKeys
  < R extends readonly ObjectWithKey[] > 
  = R[number]['key']

export type RIndex
  < E extends ObjectWithKey, D extends RTuple<E> > 
  = D extends readonly [infer Head, ...infer Tail]
    ? Head extends { key:infer K } & E
    ? K extends string
    ? Tail extends RTuple<E>
    ? { [P in K]: Head } & RIndex<E, Tail>
      : never : never : never : { [k:string]:any }

export type REntry
  < D extends RTuple<any>, 
    Key extends D[number]['key'] > 
  = D extends readonly [infer Head, ...infer Tail]
    ? Head extends { key:infer K }
    ? K extends Key 
    ? Head : Tail extends RTuple<any>
    ? REntry<Tail, Key> 
      : never : never : never

example_(() => 
{ type Person = 
    { key:string, age:number, active:boolean }
  const people = 
    [ { key:'alice', age:30, active:true },
      { key:'bob', age:40, active:false },
      { key:'carol', age:35, active:true } ] as 
    const satisfies RTuple<Person>
  type PeopleIndex 
    = RIndex<Person, typeof people>
  is_<PeopleIndex>({
    alice:{ key:'alice', age:30, active:true },
    bob:  { key:'bob',  age:40, active:false },
    carol:{ key:'carol', age:35, active:true } })
  type Carol 
    = REntry<typeof people, 'carol'>
  is_<Carol>({ key:'carol', age:35, active:true })
  // @ts-expect-error:✔︎ bob !< carol
  is_<Carol>({ key:'bob', age:40, active:false }) })

export class Registry
  < const T extends ObjectWithKey,
    const $ extends RDef<T> >
  { constructor(readonly $def:$) {} 
    readonly model_ = this.$def.model_
    readonly entries = this.$def.entries
    readonly key_ = t_<RKeys<$['entries']>>()
    readonly keys = this.$def.entries
      .map(e => e.key) as RKeys<$['entries']>[]
    readonly index = this.$def.entries
      .reduce((acc, e) => ({ ...acc, [e.key]:e }),  
        {} as RIndex<$['model_'],$['entries']> )
    add<const E extends T>(entry:E): Registry<T, { model_:T, entries:readonly[...$['entries'], E] }>
      { const entries = join(t_<$['entries']>(this.$def.entries), [ entry ] as const)
        const updated = { model_:this.model_, entries } as const
        return new Registry(updated) } 
    get<const K extends typeof this.key_>(k:K):typeof this.index[K]
      { return this.index[k] } 
    has(k:typeof this.key_):boolean
      { return k in this.index } }

example_(() => 
{ type Person = 
    { key:string, age:number, active:boolean }
  const registry = new Registry({
    model_: t_<Person>(),
    entries: 
    [ { key:'alice', age:30, active:true },
      { key:'bob', age:40, active:false },
      { key:'carol', age:35, active:true }
    ] as const satisfies RTuple<Person> })
  is_<RKeys<typeof registry.$def.entries>>
    (t_<'alice' | 'bob' | 'carol'>())
  is_<RIndex<typeof registry.model_, typeof registry.entries>>
   ({ alice:{ key:'alice', age:30, active:true },
      bob:{ key:'bob', age:40, active:false },
      carol:{ key:'carol', age:35, active:true } })
  is_<REntry<typeof registry.$def.entries, 'carol'>>
    ({ key:'carol', age:35, active:true })
  const p0 = registry.get('alice')
  is_<typeof p0>({ key:'alice', age:30, active:true })
  // @ts-expect-error:✔︎ 
  const p1 = registry.get('XXXTentacion')
  const r0 = registry.add({ key:'xXxlil_peepxXx', age:21, active:false })
  const peep = r0.get('xXxlil_peepxXx')
  is_<{ age:21 }>(peep)
  const r1 = r0.add({ key:'XXXTentacion', age:20, active:false })
  const xxt = r1.get('XXXTentacion')
  is_<{ age:20 }>(xxt) })