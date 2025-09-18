/**
 * Core content model with types, constructors, and guards
 * Based on goal.ts content meta model
 */

export type Tags = readonly string[]

export type GenericContentMeta = {
  kind: string
  slug: string
  name: string
  blurb: string
  tags: Tags
}

export type ContentMeta<KindName extends string> = {
  kind: KindName
  slug: string
  name: string
  blurb: string
  tags: Tags
}

// --- specific content meta models (forward declarations)

export type LabMeta = ContentMeta<'lab'> & {
  iconUrl: string
}

export type ContributorMeta = ContentMeta<'contributor'> & {
  profileImgUrl: string
}

export type LibraryMeta = ContentMeta<'library'> & {
  contributors: ContributorMeta[]
  logoUrl: string
}

export type ArticleMeta = ContentMeta<'article'> & {
  author: ContributorMeta
  publishedTs: number
  coverImgUrl: string
}

export type ScenarioMeta = ContentMeta<'scenario'> & {
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  prerequisites: readonly string[]
  learningGoals: readonly string[]
  files: readonly { path: string; content: string; description?: string }[]
}

// --- content kind meta registry

export type ContentMetaDisc =
  | ArticleMeta
  | LabMeta
  | LibraryMeta
  | ContributorMeta
  | ScenarioMeta

export type ContentKind = ContentMetaDisc['kind']

// --- content chunk model

export type GenericContentChunk = {
  id: string
  target: GenericContentMeta
  label: string
  tags: Tags
  text: string
  vectorFp: string
}

export type ContentChunk<Kind extends ContentKind> = GenericContentChunk & {
  target: ContentMeta<Kind>
}

// --- embedded content chunk model

export type GenericEmbeddedContentChunk = GenericContentChunk & {
  embedding: number[]
}

export type EmbeddedContentChunk<Kind extends ContentKind> = 
  GenericEmbeddedContentChunk & ContentChunk<Kind>

// --- constructors

export const createContentMeta = <Kind extends string>(
  kind: Kind,
  data: Omit<ContentMeta<Kind>, 'kind'>
): ContentMeta<Kind> => ({
  kind,
  ...data
})

export const chunker = <Kind extends ContentKind>(
  target: ContentMeta<Kind>
) => (args: {
  id: string
  tags: Tags
  vectorFp: string
  label: string
  text: string
}): ContentChunk<Kind> => ({
  target,
  ...args
})

// --- type guards

export const isContentChunk = (obj: unknown): obj is GenericContentChunk => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'target' in obj &&
    'label' in obj &&
    'text' in obj &&
    'vectorFp' in obj
  )
}

export const hasEmbedding = (
  chunk: GenericContentChunk
): chunk is GenericEmbeddedContentChunk => {
  return 'embedding' in chunk && Array.isArray((chunk as any).embedding)
}

export const isArticle = (content: GenericContentMeta): content is ArticleMeta => {
  return content.kind === 'article'
}

export const isLab = (content: GenericContentMeta): content is LabMeta => {
  return content.kind === 'lab'
}

export const isContributor = (content: GenericContentMeta): content is ContributorMeta => {
  return content.kind === 'contributor'
}

export const isLibrary = (content: GenericContentMeta): content is LibraryMeta => {
  return content.kind === 'library'
}

// --- utilities

export const getContentKind = (meta: GenericContentMeta): string => meta.kind

export const getChunkTarget = <Kind extends ContentKind>(
  chunk: ContentChunk<Kind>
): ContentMeta<Kind> => chunk.target
