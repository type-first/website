/**
 * Typist Documentation - Content Chunks
 * Using the new component-based content system for documentation
 */

import React from 'react'
import { chunker } from '@/lib/content/content.model'
import { extractPlainText } from '@/lib/content/rich-text/extract-text'
import { Paragraph } from '@/lib/content/rich-text/components/paragraph'
import { Plain } from '@/lib/content/rich-text/components/plain'
import { List, ListItem } from '@/lib/content/rich-text/components/list'
import { createVectorPath } from '@/lib/content/vector-paths'
import { library } from './meta'
import { 
  IntroductionParagraph,
  InstallationParagraph,
  QuickStartIntroduction,
  PhantomTypesExplanation,
  VerdictsExplanation,
  OperatorsIntroduction,
  ComparatorsIntroduction,
  AssertionsIntroduction,
  PatternsIntroduction,
  BasicUsageIntroduction,
  BestPracticesList,
  TroubleshootingIntroduction,
  ConclusionParagraph
} from './body'
// Note: UI components will be created in ui.tsx

// Create chunker for this documentation library
const createChunk = chunker(library)

// Helper to create vector file paths for docs
const vectorPath = (filename: string) => 
  createVectorPath(`content/docs/typist`, filename)

export const chunks = [
  // Library metadata chunk
  createChunk({
    id: 'typist:metadata',
    label: 'Typist Documentation - Complete Type-Level Toolkit Overview',
    tags: [...library.tags, 'Overview', 'Metadata'] as const,
    text: extractPlainText(
      <>
        <Plain space="none">{library.blurb}</Plain>
        <List>
          <ListItem label='tags'>{library.tags.join(', ')}</ListItem>
          <ListItem label='author'>{library.author.name}</ListItem>
          <ListItem label='version'>{library.version}</ListItem>
          <ListItem label='npm'>{library.npmPackage}</ListItem>
        </List>
      </>
    ),
    vectorFp: vectorPath('metadata')
  }),

  // Introduction chunk
  createChunk({
    id: 'typist:introduction',
    label: 'Introduction to Typist - Type-Level Programming Fundamentals',
    tags: [...library.tags, 'Introduction', 'Overview', 'Getting Started'] as const,
    text: extractPlainText(<IntroductionParagraph />),
    vectorFp: vectorPath('introduction')
  }),

  // Installation chunk
  createChunk({
    id: 'typist:installation',
    label: 'Installing Typist - Setup and Configuration Guide',
    tags: [...library.tags, 'Installation', 'Setup', 'Configuration'] as const,
    text: extractPlainText(<InstallationParagraph />),
    vectorFp: vectorPath('installation')
  }),

  // Quick Start chunk
  createChunk({
    id: 'typist:quick-start',
    label: 'Typist Quick Start - Essential Patterns and Basic Usage',
    tags: [...library.tags, 'Quick Start', 'Tutorial', 'Examples'] as const,
    text: extractPlainText(<QuickStartIntroduction />),
    vectorFp: vectorPath('quick-start')
  }),

  // Phantom Types chunk
  createChunk({
    id: 'typist:phantom-types',
    label: 'Phantom Types - Zero-Cost Type-Level Values and Abstractions',
    tags: [...library.tags, 'Phantom Types', 'Core Concepts', 'Type Safety'] as const,
    text: extractPlainText(<PhantomTypesExplanation />),
    vectorFp: vectorPath('phantom-types')
  }),

  // Verdicts chunk
  createChunk({
    id: 'typist:verdicts',
    label: 'Verdict System - Symbolic Type Comparison Results and Debugging',
    tags: [...library.tags, 'Verdicts', 'Type Comparison', 'Debugging'] as const,
    text: extractPlainText(<VerdictsExplanation />),
    vectorFp: vectorPath('verdicts')
  }),

  // Operators API chunk
  createChunk({
    id: 'typist:operators',
    label: 'Operators API - Phantom Value Creation and Type Manipulation',
    tags: [...library.tags, 'Operators', 'API', 'Phantom Values', 'Type Manipulation'] as const,
    text: extractPlainText(<OperatorsIntroduction />),
    vectorFp: vectorPath('operators')
  }),

  // Comparators API chunk
  createChunk({
    id: 'typist:comparators',
    label: 'Comparators API - Type-Level Comparison Utilities and Relationships',
    tags: [...library.tags, 'Comparators', 'API', 'Type Comparison', '$Equal', '$Extends'] as const,
    text: extractPlainText(<ComparatorsIntroduction />),
    vectorFp: vectorPath('comparators')
  }),

  // Assertions API chunk
  createChunk({
    id: 'typist:assertions',
    label: 'Assertions API - Static Type Testing and Validation Utilities',
    tags: [...library.tags, 'Assertions', 'API', 'Type Testing', 'Validation'] as const,
    text: extractPlainText(<AssertionsIntroduction />),
    vectorFp: vectorPath('assertions')
  }),

  // Patterns API chunk
  createChunk({
    id: 'typist:patterns',
    label: 'Patterns API - Test Frameworks and Symbolic Evaluation',
    tags: [...library.tags, 'Patterns', 'API', 'Testing', 'Examples', 'Framework'] as const,
    text: extractPlainText(<PatternsIntroduction />),
    vectorFp: vectorPath('patterns')
  }),

  // Basic Usage Examples chunk
  createChunk({
    id: 'typist:basic-usage',
    label: 'Basic Usage Examples - Practical Type-Level Programming Patterns',
    tags: [...library.tags, 'Examples', 'Usage', 'Practical', 'Getting Started'] as const,
    text: extractPlainText(<BasicUsageIntroduction />),
    vectorFp: vectorPath('basic-usage')
  }),

  // Type-Level Testing chunk
  createChunk({
    id: 'typist:type-testing',
    label: 'Type-Level Testing - Building Robust Type Test Suites',
    tags: [...library.tags, 'Testing', 'Type Safety', 'Test Suites', 'Quality Assurance'] as const,
    text: extractPlainText(
      <Paragraph>
        Building robust type-level test suites with typist's testing utilities and patterns.
      </Paragraph>
    ),
    vectorFp: vectorPath('type-testing')
  }),

  // Advanced Patterns chunk
  createChunk({
    id: 'typist:advanced-patterns',
    label: 'Advanced Patterns - Complex Type-Level Programming Techniques',
    tags: [...library.tags, 'Advanced', 'Patterns', 'Complex Types', 'Expert'] as const,
    text: extractPlainText(
      <Paragraph>
        Complex type-level programming techniques and advanced patterns for expert developers.
      </Paragraph>
    ),
    vectorFp: vectorPath('advanced-patterns')
  }),

  // Best Practices chunk
  createChunk({
    id: 'typist:best-practices',
    label: 'Best Practices - Professional Type-Level Development Guidelines',
    tags: [...library.tags, 'Best Practices', 'Guidelines', 'Standards', 'Professional'] as const,
    text: extractPlainText(
      <>
        <Paragraph>
          Essential best practices for professional type-level development with typist:
        </Paragraph>
        <BestPracticesList />
      </>
    ),
    vectorFp: vectorPath('best-practices')
  }),

  // Troubleshooting chunk
  createChunk({
    id: 'typist:troubleshooting',
    label: 'Troubleshooting - Debugging Type-Level Issues and Common Problems',
    tags: [...library.tags, 'Troubleshooting', 'Debugging', 'Error Resolution', 'Support'] as const,
    text: extractPlainText(<TroubleshootingIntroduction />),
    vectorFp: vectorPath('troubleshooting')
  }),

  // Conclusion chunk
  createChunk({
    id: 'typist:conclusion',
    label: 'Mastering Typist - Next Steps in Type-Level Programming',
    tags: [...library.tags, 'Conclusion', 'Summary', 'Next Steps', 'Mastery'] as const,
    text: extractPlainText(<ConclusionParagraph />),
    vectorFp: vectorPath('conclusion')
  })
] as const

// Export individual chunks for external use
export const [
  metadataChunk,
  introductionChunk,
  installationChunk,
  quickStartChunk,
  phantomTypesChunk,
  verdictsChunk,
  operatorsChunk,
  comparatorsChunk,
  assertionsChunk,
  patternsChunk,
  basicUsageChunk,
  typeLevelTestingChunk,
  advancedPatternsChunk,
  bestPracticesChunk,
  troubleshootingChunk,
  conclusionChunk
] = chunks