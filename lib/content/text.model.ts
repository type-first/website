/**
 * Text and markdown model for rich content
 * Based on paragraph content model from goal.ts
 */

export type GenericText = {
  kind: string
  text: string
}

export type Text<Kind extends string> = GenericText & {
  kind: Kind
}

export const segment = <Kind extends string>(
  kind: Kind,
  text: string
): Text<Kind> => ({
  kind,
  text
})

// --- specific text types

export type NormalText = Text<'normal'>

export const normal = (text: string): NormalText =>
  segment('normal', text)

export type BoldText = Text<'bold'>

export const bold = (text: string): BoldText => ({
  ...normal(text),
  kind: 'bold'
})

export type ItalicText = Text<'italic'>

export const italic = (text: string): ItalicText => ({
  ...normal(text),
  kind: 'italic'
})

export type CodeSyntax = 'typescript' | 'bash' | 'javascript' | 'json' | 'yaml'

export type CodeText = Text<'code'> & {
  syntax: CodeSyntax
}

export const code = (syntax: CodeSyntax, code: string): CodeText => ({
  ...normal(code),
  kind: 'code',
  syntax
})

export type LinkText = Text<'link'> & {
  text: string
  href: string
}

export const link = (text: string, href: string): LinkText => ({
  ...normal(text),
  kind: 'link',
  href
})

export type Carriage = Text<'carriage'>

export const carriage = (): Carriage => segment('carriage', '\n')

// --- inline text union

export type InlineText =
  | NormalText
  | BoldText
  | ItalicText
  | CodeText
  | LinkText
  | Carriage

export type TextKind = InlineText['kind']

// --- text renderers

export const plain = (text: readonly InlineText[]): string =>
  text.map(t => t.text).join('')

export const markdown = (text: readonly InlineText[]): string =>
  text.map(t => {
    switch (t.kind) {
      case 'normal': return t.text
      case 'bold': return `**${t.text}**`
      case 'italic': return `*${t.text}*`
      case 'code': return `\`${t.text}\``
      case 'link': return `[${t.text}](${(t as LinkText).href})`
      case 'carriage': return '\n'
      default: throw new Error(`Unknown text kind: ${(t as any).kind}`)
    }
  }).join('')

// --- type guards

export const isText = (obj: unknown): obj is GenericText => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'kind' in obj &&
    'text' in obj &&
    typeof (obj as any).kind === 'string' &&
    typeof (obj as any).text === 'string'
  )
}

export const isNormalText = (text: GenericText): text is NormalText => {
  return text.kind === 'normal'
}

export const isBoldText = (text: GenericText): text is BoldText => {
  return text.kind === 'bold'
}

export const isItalicText = (text: GenericText): text is ItalicText => {
  return text.kind === 'italic'
}

export const isCodeText = (text: GenericText): text is CodeText => {
  return text.kind === 'code'
}

export const isLinkText = (text: GenericText): text is LinkText => {
  return text.kind === 'link'
}

export const isCarriage = (text: GenericText): text is Carriage => {
  return text.kind === 'carriage'
}
