//
// === lib: tuple mapping infrastructure ===
//

export interface Lambda$Map<K, V> {
  key_: K
  arg_: V
  return_: unknown
  (): this['return_']
}

export type apply$Map<
  Fk extends Lambda$Map<any, any>,
  K,
  V
> = (Fk & { key_: K; arg_: V })['return_']

export type Entry<K extends string = string, V = unknown> =
  readonly [K, V]

export type EntryTuple<K extends string = string, V = unknown> =
  readonly Entry<K, V>[]

export const entries = <
  const T extends readonly (readonly [string, any])[]
>(tuple: T): T => tuple

export type mapTuple$<
  T extends readonly (readonly [string, any])[],
  Fk extends Lambda$Map<any, any>
> = {
  [I in keyof T]:
    T[I] extends readonly [infer K extends string, infer V]
      ? apply$Map<Fk, K, V>
      : never
}

//
// === app: glyph domain types ===
//

export type GlyphKind = 'box' | 'circle' | 'line'
export type GlyphSomething = string | number | boolean

export interface Glyph<
  K extends GlyphKind = GlyphKind,
  S extends GlyphSomething = GlyphSomething
> {
  kind: K
  something: S
}

export type GlyphRelationKind = 'up' | 'down' | 'left' | 'right'

export interface GlyphRelation<RK extends GlyphRelationKind, G0 extends Glyph, G1 extends Glyph> {
  kind: RK
  glyph0: G0
  glyph1: G1
}

export const glyph 
  = < K extends GlyphKind,
      S extends GlyphSomething >
    ( kind: K, something: S ): Glyph<K, S> => 
      ({ kind, something })

export const relation 
  = < const RK extends GlyphRelationKind,
      const G0 extends Glyph,
      const G1 extends Glyph >
  ( kind: RK, glyph0:G0, glyph1:G1 )
  : GlyphRelation<RK, G0, G1> => 
    ({ kind, glyph0, glyph1 })

//
// === app: glyph entry mapping lambda ===
//

// the below two definitions might be unified as an overloaded function
export type CorrespondingGlyph 
  < G0 extends Glyph > 
  = ( G0['kind'] extends 'box' ? Glyph<'circle', G0['something']>
    : G0['kind'] extends 'circle' ? Glyph<'line', G0['something']>
    : G0['kind'] extends 'line' ? Glyph<'box', G0['something']>
    : never )
export const corresponding
  = < const G0 extends Glyph >
  ( g: G0 ) => 
  ( g.kind === 'box' ? glyph('circle', g.something)
    : g.kind === 'circle' ? glyph('line', g.something)
    : g.kind === 'line' ? glyph('box', g.something)
    : null as never ) as CorrespondingGlyph<G0>

export interface wrapGlyph$Entry extends Lambda$Map<GlyphRelationKind, Glyph> {
  return_: [this['key_'], [ this['arg_'], CorrespondingGlyph<this['arg_']> ] ]
}

export const mapTuple = <
  const T extends readonly (readonly [GlyphRelationKind, Glyph<any, any>])[]
>(args: T): mapTuple$<T, wrapGlyph$Entry> =>
  args.map(([k, g]) => [k, relation(k, g, corresponding(g))]) as mapTuple$<T, wrapGlyph$Entry>

//
// === app: usage and tests ===
//

import { is_ } from '@typefirst/typist'

const defs = entries([
  ['up', glyph('box', 'yo')],
  ['down', glyph('circle', 'sup')],
  ['left', glyph('line', true)],
] as const)

export const glyphs = mapTuple(defs)

is_<'up'>(glyphs[0][0]) // ✓
// @ts-expect-error ✓
is_<'down'>(glyphs[0][0])

is_<Glyph<'box', 'yo'>>(glyphs[0][1][0]) // ✓
// @ts-expect-error ✓
is_<Glyph<'circle', 'yo'>>(glyphs[0][1][0])
// @ts-expect-error ✓
is_<Glyph<'box', 'hey'>>(glyphs[0][1][0])

is_<Glyph<'circle', 'yo'>>(glyphs[0][1][1]) // ✓
is_<CorrespondingGlyph<typeof glyphs[0][1][0]>>(glyphs[0][1][1]) // ✓
// @ts-expect-error ✓
is_<Glyph<'box', 'yo'>>(glyphs[0][1][1])
// @ts-expect-error ✓
is_<Glyph<'line', 'yo'>>(glyphs[0][1][1])
// @ts-expect-error ✓
is_<Glyph<'circle', 'hey'>>(glyphs[0][1][1])