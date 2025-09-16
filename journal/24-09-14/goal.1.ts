// --- content meta model

import path from "path"
import * as yaml from 'yaml'
import * as fs from 'fs';

export type Tags 
  = readonly string[]

export type GenericContentMeta
  = { kind:string
      slug:string
      name:string
      blurb:string
      tags:Tags }

export type ContentMeta
  <KindName extends string> 
  = { kind:KindName
      slug:string
      name:string
      blurb:string
      tags:Tags }

// --- specific content meta models

export type LabMeta 
  = ContentMeta<'lab'> 
  & { iconUrl:string }

export type ContributorMeta 
  = ContentMeta<'contributor'> 
  & { profileImgUrl:string }

export type LibraryMeta 
  = ContentMeta<'library'> 
  & { contributors:ContributorMeta[] 
      logoUrl:string }

// --- article content meta model

export type ArticleMeta 
  = ContentMeta<'article'> 
  & { author:ContributorMeta
      publishedTs:number
      coverImgUrl:string }

// --- content kind meta registry 

export type ContentMetaDisc
  = ArticleMeta 
  | LabMeta 
  | LibraryMeta 
  | ContributorMeta

export type ContentKind
  = ContentMetaDisc['kind']

// --- content chunk model

export type GenericContentChunk
  = { target:GenericContentMeta
      label:string
      tags:Tags
      text:string 
      vectorFp:string}

export type ContentChunk
  < Kind extends ContentKind >
  = GenericContentChunk 
  & { target:ContentMeta<Kind> }

// --- article content chunk model
  
export type GenericEmbeddedContentChunk
  = GenericContentChunk 
  & { embedding:number[] }

export type EmbeddedContentChunk
  < Kind extends ContentKind >
  = GenericEmbeddedContentChunk
  & ContentChunk<Kind> 

// --- contributor meta

export const santi = {
  kind: 'contributor',
  slug: 'santi-herrera',
  name: 'Santi Herrera',
  blurb: 'Fullstack developer and tech writer.',
  tags: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
  profileImgUrl: '/images/contributors/santi-herrera.jpg',
} as const satisfies ContributorMeta

// --- paragraph content model

export type GenericText
  = { kind:string, text:string }

export type Text
  <Kind extends string>
  = GenericText & { kind:Kind }

export const segment 
  = <Kind extends string>
    (kind:Kind, text:string):Text<Kind> => 
    ({ kind, text })

export type NormalText
  = Text<'normal'> 

export const normal 
  = (text:string):NormalText => 
    segment('normal', text)

export type BoldText
  = Text<'bold'> 

export const bold
  = (text:string):BoldText =>
    ({ ...normal(text), kind:'bold' })

export type ItalicText
  = Text<'italic'> 

export const italic
  = (text:string):ItalicText =>
    ({ ...normal(text), kind:'italic' })

export type CodeSyntax
  = 'typescript'|'bash'

export type CodeText
  = Text<'code'> 
  & { syntax:CodeSyntax }

export const code
  = (syntax:CodeSyntax, code:string):CodeText =>
    ({ ...normal(code), kind:'code', syntax })

export type LinkText
  = Text<'link'> 
  & { text:string, href:string }

export const link
  = (text:string, href:string):LinkText =>
    ({ ...normal(text), kind:'link', href })

export type Carriage
  = Text<'carriage'>

export const carriage
  = () => segment('carriage', '\n')
      
export type InlineText
  = NormalText
  | BoldText
  | ItalicText
  | CodeText
  | LinkText
  | Carriage

export type TextKind
  = InlineText['kind']

export const plain
  = (text:InlineText[]):string =>
    text.map(t => t.text).join('')

export const markdown
  = (text:InlineText[]):string =>
    text.map(t => {
      switch (t.kind) {
        case 'normal': return t.text
        case 'bold': return `**${t.text}**`
        case 'italic': return `*${t.text}*`
        case 'code': return `\`${t.text}\``
        case 'link': return `[${t.text}](${t.href})`
        case 'carriage': return '\n'
        default: throw '?'
      } }).join('')

// --- article

export const tsPatterns
  = { kind:'article',
      slug:'advanced-typescript-patterns-react',
      name:'Advanced TypeScript Patterns in React',
      blurb:'Deep dive into advanced TypeScript patterns for building robust React applications.',
      tags:['TypeScript', 'React', 'Advanced', 'Patterns'],
      coverImgUrl:'/images/articles/advanced-typescript-patterns-react/cover.jpg',
      publishedTs:1694659200000, // September 14, 2024
      author:santi
    } as const satisfies ArticleMeta

export const introductionParagraph0
  = [ normal('In this article, we will explore advanced TypeScript patterns that can enhance your React applications. We will cover topics such as '),
      bold('Generics'),
      normal(' like '),
      code('typescript', 'T extends {}'),
      normal(', '),
      italic('Conditional Types'),
      normal(', and '),
      link('Utility Types', 'https://www.typescriptlang.org/docs/handbook/utility-types.html'),
      normal('. By the end of this article, you will have a deeper understanding of how to leverage TypeScript to build more robust and maintainable React codebases.') 
    ] as const satisfies readonly InlineText[]

export const introductionParagraph1
  = [ normal('Let\'s start by looking at how '),
      bold('Generics'),
      normal(' can be used to create reusable components and functions that work with a variety of types. Generics provide a way to capture the type of data that is passed into a component or function, allowing for greater flexibility and type safety.') 
    ] as const satisfies readonly InlineText[]

export const genericsAreCool
  = normal('Generics allow you to create reusable components and functions that can work with a variety of types. For example, consider the following generic component:')

export const genericsSnippetSegway
  = normal('Here, we define a generic type parameter: ')

export const genericsExampleSnippet
  = /* typescript */ `

type ListProps<T> = {
  items: T[]
  renderItem: (item: T) => React.ReactNode
}

`

export const genericsExampleExplanation
  = [ normal('In this example, '),
      code('typescript', '<T>'),
      normal(' is a generic type parameter that allows the '),
      code('typescript', 'List'),
      normal(' component to accept an array of any type. The '),
      code('typescript', 'renderItem'),
      normal(' function is also typed to ensure it receives the correct item type.') 
    ] as const satisfies readonly InlineText[]

// --- chunker

export const chunker
  = <Kind extends ContentKind>
    (target:ContentMeta<Kind>) =>
    (args:{ tags:Tags, vectorFp:string, label:string, text:string }):ContentChunk<Kind> =>
      ({ target, ...args })

// --- chunks

export const santiChunk = chunker(santi)
export const tsPatternsChunk = chunker(tsPatterns)

const vectorFile 
  = (name:string) => 
    path.resolve(__dirname, `gen.vector.${name}.yml`)

export const chunks = [
  santiChunk({ 
    tags:santi.tags,
    label:'Santi Herrera', 
    vectorFp:vectorFile('santi-herrera.yml'),
    text:santi.blurb }),
  tsPatternsChunk({ 
    tags:[...tsPatterns.tags, 'Introduction'],
    label:'Introduction to Advanced TypeScript Patterns',
    vectorFp:vectorFile('introduction.yml'),
    text:plain([
      ...introductionParagraph0, 
      carriage(), 
      ...introductionParagraph1]) }),
  tsPatternsChunk({
    tags:[...tsPatterns.tags, 'Generics', 'Type Parameters', 'Abstract Data Types'],
    label:'Understanding Generics in TypeScript',
    vectorFp:vectorFile('generics.yml'),
    text:plain([
      genericsAreCool,
      ...genericsExampleExplanation]) }),
] as const satisfies GenericContentChunk[]

// --- embeddings

export const loadEmbeddings
  = async (chunks:GenericContentChunk[])
  : Promise<GenericEmbeddedContentChunk[]> => 
    Promise.all(chunks.map(chunk => {
      const ymlFp = path.resolve(__dirname, chunk.vectorFp)
      const text = fs.readFileSync(ymlFp, 'utf-8')
      const data = yaml.parse(text) as { embedding:number[] }
      return { ...chunk, embedding:data.embedding }
    }))