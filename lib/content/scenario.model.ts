/**
 * Scenario-specific content model
 * Types, constructors, and guards for TypeScript scenarios
 */

import type { ContentMeta, ContentChunk } from './content.model'
import { chunker } from './content.model'

// --- scenario types

export type ScenarioMeta = ContentMeta<'scenario'> & {
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  prerequisites: readonly string[]
  learningGoals: readonly string[]
}

export type ScenarioFile = {
  path: string
  content: string
  description?: string
}

export type ScenarioChunk = ContentChunk<'scenario'>

// --- constructors

export const createScenario = (data: {
  slug: string
  name: string
  blurb: string
  tags: readonly string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  prerequisites: readonly string[]
  learningGoals: readonly string[]
}): ScenarioMeta => ({
  kind: 'scenario',
  ...data
})

export const createScenarioChunk = (scenario: ScenarioMeta) => chunker(scenario)

// --- type guards

export const isScenario = (content: ContentMeta<any>): content is ScenarioMeta => {
  return content.kind === 'scenario'
}

export const isScenarioChunk = (chunk: ContentChunk<any>): chunk is ScenarioChunk => {
  return chunk.target.kind === 'scenario'
}

// --- utilities

export const getScenarioDifficulty = (scenario: ScenarioMeta): string => scenario.difficulty

export const getScenarioPrerequisites = (scenario: ScenarioMeta): readonly string[] => scenario.prerequisites

export const getScenarioLearningGoals = (scenario: ScenarioMeta): readonly string[] => scenario.learningGoals