/**
 * Article-specific content model
 * Types, constructors, and guards for articles
 */

import type { ContentMeta, ContentChunk } from './content.model'
import type { ContributorMeta } from './content.model'
import { chunker } from './content.model'

// --- article types

export type ArticleMeta = ContentMeta<'article'> & {
  author: ContributorMeta
  publishedTs: number
  coverImgUrl: string
}

export type ArticleChunk = ContentChunk<'article'>

// --- constructors

export const createArticle = (data: {
  slug: string
  name: string
  blurb: string
  tags: readonly string[]
  author: ContributorMeta
  publishedTs: number
  coverImgUrl: string
}): ArticleMeta => ({
  kind: 'article',
  ...data
})

export const createArticleChunk = (article: ArticleMeta) => chunker(article)

// --- type guards

export const isArticle = (content: ContentMeta<any>): content is ArticleMeta => {
  return content.kind === 'article'
}

export const isArticleChunk = (chunk: ContentChunk<any>): chunk is ArticleChunk => {
  return chunk.target.kind === 'article'
}

// --- utilities

export const getArticleAuthor = (article: ArticleMeta): ContributorMeta => article.author

export const getArticlePublishedDate = (article: ArticleMeta): Date => 
  new Date(article.publishedTs)

export const formatPublishedDate = (article: ArticleMeta): string => {
  const date = getArticlePublishedDate(article)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
