
import { $Equal, is_, has_, t_, test_, yes_ } from '@typefirst/typist'

// --- basic utils

export type Rec<T> = Record<string, T>

// ---

export type OneOrMore <T> = T|(readonly T[])

export type SK <Name extends string> = 
  `$:${Name}` & { ['$:key']:true }
export type SKey = SK<string>
export type SKMap = Rec<SKey>

export type SToggle <K extends SKey, V extends boolean> = { [_ in K]: V }
export type SToggleSelection <KM extends SKMap> 
  = { [K in keyof KM]?:true }
export type SToggleAttributes 
  < KM extends SKMap, STS extends SToggleSelection<KM> > = 
  { [K in keyof KM]: STS[K] extends true ? true : false }

// ---

export type SemioticString<S extends string = string> = S & { ['$:string']:true }
export type SS<S extends string = string> = SemioticString<S>

export type BasePrimitive = null|boolean|number|SemioticString<string>|SKey
export type SyntheticPrimitiveBase =
  { ['$:primitive']:'$:branded'
    ['$:primitive:branded:type']:SKey }

// ---

export type TextualSymbolTKM = 
  { break:SK<'break-hard'>
    return:SK<'break-soft'> 
    tab:SK<'tab'>
    space:SK<'space'> 
    bullet:SK<'bullet'> 
    divider:SK<'divider'> }
export type TextualSymbolTKA = keyof TextualSymbolTKM
export type TextualSymbolTK = TextualSymbolTKM[TextualSymbolTKA]

export type SymbolBase
  = SyntheticPrimitiveBase &
  { ['$:primitive:branded:type']:SK<'symbol'>
    ['$:primitive:branded:symbol:type']:TextualSymbolTK }

export type HardBreakSymbol
  = SymbolBase & 
  { ['$:primitive:branded:symbol:type']:SKey }

export type SoftBreakSymbol
  = SymbolBase & 
  { ['$:primitive:branded:symbol:type']:SK<'break-soft'> }

export type TabSymbol
  = SymbolBase & 
  { ['$:primitive:branded:symbol:type']:SK<'tab'> }

export type SpaceSymbol
  = SymbolBase &
  { ['$:primitive:branded:symbol:type']:SK<'space'> }

export type BulletSymbol
  = SymbolBase &
  { ['$:primitive:branded:symbol:type']:SK<'bullet'> }

export type TextSymbols
  = HardBreakSymbol 
  | SoftBreakSymbol
  | TabSymbol
  | SpaceSymbol
  | BulletSymbol

export type TextSymbol
  < TK extends TextualSymbolTK >
  = SymbolBase &  
  ( TextSymbols & 
  { ['$:primitive:branded:symbol:type']:TK } )
  
export type TS
  <A extends TextualSymbolTKA = TextualSymbolTKA> = 
    TextSymbol<TextualSymbolTKM[A]>

// ---

export type TextFragmentToggleSKM = 
  { broken: SK<'primitive:branded:fragment:broken'>,
    padded: SK<'primitive:branded:fragment:padded'>,
    raw: SK<'primitive:branded:fragment:impure'> }
export type TextFragmentToggleSelection = 
  SToggleSelection<TextFragmentToggleSKM>

test_(() => {
  type xTS = TextFragmentToggleSelection & { raw:true }
  type xTFTA = SToggleAttributes<TextFragmentToggleSKM, xTS>
  yes_<$Equal<xTFTA, 
    { broken:false
      padded:false
      raw:true }>>() })

export type TextFragmentBase
  = SyntheticPrimitiveBase &
  { ['$:primitive:branded:type']:SK<'fragment'>
    ['$:primitive:branded:fragment:broken']:boolean 
    ['$:primitive:branded:fragment:padded']:boolean
    ['$:primitive:branded:fragment:clean']:boolean 
    string:SemioticString<string> }

export type InlineFragment
  = TextFragmentBase &
  { ['$:primitive:branded:fragment:broken']:true }

export type TrimmedFragment
  = TextFragmentBase &
  { ['$:primitive:branded:fragment:trimmed']:true }

export type CleanFragment
  = TextFragmentBase &
  { ['$:primitive:branded:fragment:clean']:true }

export type TextFragments
  = InlineFragment
  | TrimmedFragment
  | CleanFragment

export type TextFragment
  < TFTS extends TextFragmentToggleSelection >
  = TextFragmentBase & 
  ( TextFragments & SToggleAttributes<TextFragmentToggleSKM, TFTS> ) 

export type TF 
  <A extends TextFragmentToggleSelection = {}> = TextFragment<A>

// ---

export type TextLiteral
  < A extends SemioticString<string> >
  = SyntheticPrimitiveBase &
  { ['$:primitive:branded:type']:SK<'literal'>
    string: A }

export type TL 
  <A extends string|SemioticString> = 
    A extends SemioticString<infer S> 
      ? TextLiteral<SS<S>>
      : TextLiteral<SS<A>>

// ---

export type TextPrimitive
  = TextSymbol<any> | TextFragment<any> | TextLiteral<any>

export type SemioticPrimitive
  = BasePrimitive|TextPrimitive

export interface SemioticDTO 
  { ['$:dto']:true
    ['$:dto:type']:SKey
    [prop:string]:OneOrMore<SemioticPrimitive|SemioticDTO> }

// ---

export interface Glyph 
  extends SemioticDTO  
  { ['$:dto:type']:SK<'glyph'>
    ['$:dto:glyph:type']:SKey
    [prop:string]:OneOrMore<SemioticPrimitive|Glyph> }

export interface Glypheme
  < G extends Glyph > 
  extends SemioticDTO 
  { ['$:dto:kind']:SK<'glypheme'>
    instance_:G }

// ---

export interface Date
  extends Glyph 
  { ['$:dto:glyph:type']:SK<'date'>
    ['$:dto:glyph:date:type']:SKey  
    year:number
    month:number
    date:number 
    day:TL<'monday'>
      | TL<'tuesday'>
      | TL<'wednesday'>
      | TL<'thursday'>
      | TL<'friday'> } 

export interface Time
  extends Date 
  { ['$:dto:glyph:date:type']:SK<'datetime'>
    hour:number
    minute:number
    second:number 
    millisecond:number } 
    
export interface Text
  < Segments extends readonly (TextPrimitive|Text<any>)[] >
  extends Glyph 
  { ['$:dto:glyph:type']:SK<'text'>
    ['$:dto:glyph:text:type']:SKey
    segments:Segments }

export type T
  < Segments extends readonly (TextPrimitive|Text<any>)[] > 
  = Text<Segments> 

/** ~
 * @start @section %d #demo:primitive-composition
 * @desc 
 *  - a demonstration of **structural type composition** using low-level glyph primitives.
 *  - here's an sample of the resulting **resolved structure** of our demo glyph type.
 *  ```ts
 *  Text<[
 *    Text<[
 *      Text<[
 *        TS<'return'>, 
 *        TS<'tab'>, 
 *        TS<'bullet'> ]>
 *      TL<Label<O>>,
 *      TS<'space'>, 
 *      TL<S>
 *   ...    
 *  ```
 * @note #not-semantic
 *  - in reality this example would be *too close to the specific modal syntax*.
 *  - glyphs should capture semantic intent and be **modality agnostic** 
 *    (ex:*we shouldnt be specifying whitespace*).
 * @todo #semantic-primitives .priority:high
 *  - arguably [this flaw](@note:#not-semantic) stems from our definition of primitives
 *    such as `TS<'space'>` and `TS<'tab'>` in the first place.
 ** ~ */
test_(() => { 

  type Bullet =
    Text<[
      TS<'return'>, 
      TS<'tab'>, 
      TS<'bullet'> ]>

  type Ordinal = 'first' | 'second'
  type Label <S extends string> = `${S}:`

  type Item 
    <O extends Ordinal, S extends string> =
    Text<[ 
      Bullet,
      TL<Label<O>>,
      TS<'space'>, 
      TL<S> ]>

  type First = Item<'first', 'thing #1 begins initially'>
  type Second <Content extends string> = Item<'second', Content>

  type List 
    < SecondItemContent extends string, 
      Rest extends TextFragment<any> > = 
    Text<[ 
      First,
      Second<SecondItemContent>,
      TS<'break'>,
      Rest ]>

  type Rest = TF<{ raw:true }>

  type Glyph = 
    List<'what follows is subsequently terminal as far as our list goes', Rest>

  /** @start @section %t #typetest */

  /** ~ 
   * @start @section %r #root
   * @desc our **root glyph**
   *  -:an instance of *Text*
   *  -:a serializable object with flag `dto:glyph:text`
   *  -:has a *tuple* `.segments` containing *4* elements
   *    0:`First`
   *    1:`Second<'what follows is ...'>` 
   *    2:`TS<'break'>`
   *    3:`TF<{ raw:true }>`
   ** ~ */

  const r = t_<Glyph>()

  has_<SK<'dto'>>(r) // ✔︎
  has_<SK<'dto:glyph:type'>, SK<'text'>>(r) // ✔︎
  has_<'segments'>(r) // ✔︎
  has_<'2', TS<'break'>>(r.segments) // ✔︎

  /** ~ %ts0
   * @tserr [✔︎] 
   *  -:`tuple` of *length 4* has no element at index 4
   ** ~ */// @ts-expect-error:✔︎ %ts0
  const [s0, s1, s2, s3, s4] = r.segments

  is_<First>(s0) // ✔︎
  
  /** ~ %ts1  
   * @tserr [✔︎]
   *  -:type `SS<'what follows is subsequently terminal as far as our list goes'>` 
   *    is not assignable to type `SS<'something else'>`
   ** ~ */// @ts-expect-error:✔︎ %ts1
  is_<Second<'something else'>>(s1) 
  is_<Second<'what follows is subsequently terminal as far as our list goes'>>(s1) // ✔︎

  is_<TS<'break'>>(s2) // ✔︎
  has_<SK<'dto:glyph:type'>, SK<'symbol'>>(s2)
  
  is_<TF<{ raw:true }>>(s3) // ✔︎
  has_<SK<'dto:glyph:type'>, SK<'primitive:branded:fragment'>>(s3) // ✔︎
  has_<SK<'dto:primitive:branded:type'>, SK<'fragment'>>(s3) // ✔︎
  has_<SK<'dto:primitive:branded:fragment:raw'>, true>(s3) // ✔︎

  /** @end @section %r **/
  /** @start @section %p0 #p:root.seg.0 */

  /** ~
   * @path `root.segments.0`
   * @desc our *root glyph's* **first segment**
   * @type **First (Text)** 
   * @prop `dto:glyph:type` => `text`
   * @prop `segments` => [ 
   *  0: `Bullet (Text<[TS<'return'>, TS<'tab'>, TS<'bullet'>]>`, 
   *  1: `TL<'first:'>`, 
   *  2: `TS<'space'>`, 
   *  3: `TL<'thing #1 ...'>` ]
   ** ~ */

  is_<Text<any>>(s0) // ✔︎
  has_<SK<'dto:glyph:type'>, SK<'text'>>(s0) // ✔︎
  has_<'segments'>(s0) // ✔︎

  const [ s0s0, s0s1, s0s2, s0s3 ] = s0.segments
  
  is_<Bullet>(s0s0) // ✔︎
  has_<SK<'dto:glyph:type'>, SK<'text'>>(s0s0) // ✔︎
  has_<SK<'dto:gkyp'>, SK<'literal'>>(s0s0) // ✔︎
  is_<T<[TS<'return'>, TS<'tab'>, TS<'bullet'>]>>(s0s0) // ✔︎

  is_<TL<'first:'>>(s0s1) // ✔︎
  has_<SK<'dto:glyph:type'>, SK<'text'>>(s0s1) // ✔︎
  has_<SK<'dto:primitive:branded:type'>, SK<'literal'>>(s0s1) // ✔︎

  is_<TS<'space'>>(s0s2) // ✔︎
  has_<SK<'dto:glyph:type'>, SK<'symbol'>>(s0s2) // ✔︎
  has_<SK<'dto:primitive:branded:symbol:type'>, SK<'space'>>(s0s2) // ✔︎

  is_<TL<'thing #1 begins initially'>>(s0s3) // ✔︎
  has_<SK<'dto:glyph:type'>, SK<'text'>>(s0s3) // ✔︎
  has_<SK<'dto:primitive:branded:type'>, SK<'literal'>>(s0s3) // ✔︎

  /** @end @section %p0 **/ 
  
}) 

/** @end @section %d **/
