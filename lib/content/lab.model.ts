/**
 * Lab-specific content model
 * Types, constructors, and guards for labs
 */

import type { ContentMeta, ContentChunk } from './content.model'
import { chunker } from './content.model'

// --- lab types

export type LabMeta = ContentMeta<'lab'> & {
  iconUrl: string
}

export type LabChunk = ContentChunk<'lab'>

// --- constructors

export const createLab = (data: {
  slug: string
  name: string
  blurb: string
  tags: readonly string[]
  iconUrl: string
}): LabMeta => ({
  kind: 'lab',
  ...data
})

export const createLabChunk = (lab: LabMeta) => chunker(lab)

// --- type guards

export const isLab = (content: ContentMeta<any>): content is LabMeta => {
  return content.kind === 'lab'
}

export const isLabChunk = (chunk: ContentChunk<any>): chunk is LabChunk => {
  return chunk.target.kind === 'lab'
}

// --- utilities

export const getLabIcon = (lab: LabMeta): string => lab.iconUrl

export const getLabFeatures = (lab: LabMeta): readonly string[] => lab.tags
