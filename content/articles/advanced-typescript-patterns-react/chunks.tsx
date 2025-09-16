/**
 * Advanced TypeScript Patterns for React Applications - Content Chunks
 * Using the new component-based content system
 */

import React from 'react'
import { chunker } from '@/lib/content'
import { renderPlainText } from '@/lib/content/rich-text/render-plaintext'
import { Paragraph } from '@/lib/content/rich-text/components/paragraph'
import { Plain } from '@/lib/content/rich-text/components/plain'
import { List, ListItem } from '@/lib/content/rich-text/components/list'
import { article } from './meta'
import { 
  IntroductionParagraph,
  GenericsIntroduction,
  ConditionalTypesIntro,
  ConditionalTypesExample,
  ApiIntroduction,
  ApiExample,
  BestPracticesList,
  ConclusionParagraph
} from './body'
import path from 'path'

// Create chunker for this article
const createChunk = chunker(article)

// Helper to create vector file paths
const vectorPath = (filename: string) => 
  path.resolve(__dirname, 'vectors', `${filename}.yml`)

// --- Export all chunks

export const chunks = [
  // Article metadata chunk
  createChunk({
    id: 'advanced-typescript-patterns-react:metadata',
    label: 'Advanced TypeScript Patterns for React - Complete Guide Overview',
    tags: [...article.tags, 'Overview', 'Metadata'] as const,
    text: renderPlainText(
      <>
        <Plain space="none">{article.blurb}</Plain>
        <List>
          <ListItem>**Tags:** {article.tags.join(', ')}</ListItem>
          <ListItem>**Author:** {article.author.name}</ListItem>
          <ListItem>**Published:** {new Date(article.publishedTs).toLocaleDateString()}</ListItem>
        </List>
      </>
    ),
    vectorFp: vectorPath('metadata')
  }),

  // Introduction chunk
  createChunk({
    id: 'advanced-typescript-patterns-react:introduction',
    label: 'Introduction to TypeScript React Development and Type Safety Benefits',
    tags: [...article.tags, 'Introduction', 'Overview'] as const,
    text: renderPlainText(<IntroductionParagraph />),
    vectorFp: vectorPath('introduction')
  }),

  // Generic Components chunk
  createChunk({
    id: 'advanced-typescript-patterns-react:generic-components',
    label: 'Building Reusable Generic Components with TypeScript Type Parameters',
    tags: [...article.tags, 'Generics', 'Components', 'Reusability'] as const,
    text: renderPlainText(
      <>
        <GenericsIntroduction />
      </>
    ),
    vectorFp: vectorPath('generic-components')
  }),

  // Conditional Types chunk
  createChunk({
    id: 'advanced-typescript-patterns-react:conditional-types',
    label: 'Advanced Conditional Types and Dynamic Type Logic in React Components',
    tags: [...article.tags, 'Conditional Types', 'Advanced', 'Type Logic'] as const,
    text: renderPlainText(
      <>
        <ConditionalTypesIntro />
        <ConditionalTypesExample />
      </>
    ),
    vectorFp: vectorPath('conditional-types')
  }),

  // Type-Safe APIs chunk
  createChunk({
    id: 'advanced-typescript-patterns-react:type-safe-apis',
    label: 'Creating Type-Safe API Clients with End-to-End TypeScript Validation',
    tags: [...article.tags, 'APIs', 'Type Safety', 'Client-Server'] as const,
    text: renderPlainText(
      <>
        <ApiIntroduction />
        <ApiExample />
      </>
    ),
    vectorFp: vectorPath('type-safe-apis')
  }),

  // Best Practices chunk
  createChunk({
    id: 'advanced-typescript-patterns-react:best-practices',
    label: 'Essential Best Practices for Professional TypeScript React Development',
    tags: [...article.tags, 'Best Practices', 'Guidelines', 'Standards'] as const,
    text: renderPlainText(
      <>
        <Paragraph break="none">
          Here are the essential best practices for advanced TypeScript React development:
        </Paragraph>
        <BestPracticesList />
      </>
    ),
    vectorFp: vectorPath('best-practices')
  }),

  // Conclusion chunk
  createChunk({
    id: 'advanced-typescript-patterns-react:conclusion',
    label: 'Mastering TypeScript Patterns - Next Steps and Advanced Development Journey',
    tags: [...article.tags, 'Conclusion', 'Summary', 'Next Steps'] as const,
    text: renderPlainText(<ConclusionParagraph />),
    vectorFp: vectorPath('conclusion')
  })
] as const

// Export individual chunks for external use
export const [
  metadataChunk,
  introductionChunk,
  genericComponentsChunk,
  conditionalTypesChunk,
  typeSafeApisChunk,
  bestPracticesChunk,
  conclusionChunk
] = chunks
