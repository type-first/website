import { t_, is_, test_ } from './typist'

export const isUnd 
  = (value:unknown): value is undefined => 
    value === undefined

export const isStr 
  = (value:unknown): value is string => 
    typeof value === 'string'

export const rand
  = (a1?:number, a2?:number): number => {
    let min: number, max: number
    if (isUnd(a1)) min = 0, max = 100
    else if (isUnd(a2)) max = a1, min = 0
    else max = a2, min = a1
    const { floor, random } = Math
    return floor(random() * (max - min + 1)) + min }

export class Enum
  < V extends readonly string[] >
  { private constructor
      ( public readonly values:V ) {}
    public readonly _ = t_<V[number]>()
    static make
      < V extends readonly string[] >
      ( v:V ): Enum<V> 
      { return new Enum(v) }
    public is
      ( x:unknown ): x is typeof this._
      { if (!isStr(x)) return false
        return this.values.includes(x) }
    public is_
      ( x:V[number] ): x is typeof this._ 
      { return this.is(x) }
    public map
      <T>(fn:(v:typeof this._) => T)
      { return this.values.map(fn) }
    public dict
      <T>(fn:(v:typeof this._) => T)
      { return this.values.reduce(
          (dict, v) => ({ ...dict, [v]: fn(v)}), 
          {} as { [K in typeof this._]: T }) } }

test_(async () => 
{ const sports = ['hockey','soccer','squash'] as const
  is_<typeof sports[0]>('hockey')
  // @ts-expect-error
  is_<typeof sports[0]>(string)
  is_<'hockey'>(t_<typeof sports[0]>())
  is_<string>(t_<typeof sports[0]>())
  // @ts-expect-error
  is_<typeof sports[0]>(string)
  is_<typeof sports[number]>(sports[rand(2)]!)
  is_<string>(sports[rand(2)]!)
  // @ts-expect-error
  is_<'hockey'>(sports[rand(2)])
  is_<'hockey'>(sports[0])  
  // @ts-expect-error
  is_<'hockey'>(sports[t_<1 | 2>()])    
  is_<'soccer' | 'squash'>(sports[t_<1 | 2>()])
  is_<typeof sports[0 | 1]>(sports[t_<0 | 1>()])

  const Sport = Enum.make(sports)
  is_<'hockey'|'soccer'|'squash'>(Sport._)
  // @ts-expect-error
  is_<'hockey'|'soccer'>(Sport._)
  is_<typeof Sport._>(t_<'hockey'|'soccer'>())
  // @ts-expect-error
  is_<typeof Sport._>(t_<'hockey'|'soccer'|'squash'|'chess'>())
  is_<'hockey'|'soccer'|'squash'|'chess'>(Sport._)
  Sport.is_('hockey')
  is_<typeof Sport._>('hockey')
  // @ts-expect-error
  Sport.is_('cooking')
  // @ts-expect-error
  is_<typeof Sport._>('cooking')
  const x0 = null
  // @ts-expect-error
  Sport.is_(x0)
  // @ts-expect-error
  is_<typeof Sport._>(x0)
  if (Sport.is(x0)) 
  { Sport.is_(x0)
    is_<typeof Sport._>(x0) } })