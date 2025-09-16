/**
 * Contributor-specific content model
 * Types, constructors, and guards for contributors
 */

import type { ContentMeta, ContentChunk } from './content.model'
import { chunker } from './content.model'

// --- contributor types

export type ContributorMeta = ContentMeta<'contributor'> & {
  profileImgUrl: string
}

export type ContributorChunk = ContentChunk<'contributor'>

// --- constructors

export const createContributor = (data: {
  slug: string
  name: string
  blurb: string
  tags: readonly string[]
  profileImgUrl: string
}): ContributorMeta => ({
  kind: 'contributor',
  ...data
})

export const createContributorChunk = (contributor: ContributorMeta) => chunker(contributor)

// --- type guards

export const isContributor = (content: ContentMeta<any>): content is ContributorMeta => {
  return content.kind === 'contributor'
}

export const isContributorChunk = (chunk: ContentChunk<any>): chunk is ContributorChunk => {
  return chunk.target.kind === 'contributor'
}

// --- utilities

export const getContributorProfileImage = (contributor: ContributorMeta): string => 
  contributor.profileImgUrl

export const getContributorExpertise = (contributor: ContributorMeta): readonly string[] => 
  contributor.tags
