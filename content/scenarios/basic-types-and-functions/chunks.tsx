/**
 * Basic Types and Functions Scenario - Content Chunks
 * Using the new component-based content system following article patterns
 */

import React from 'react'
import { chunker } from '@/lib/content/content.model'
import { extractPlainText } from '@/lib/content/rich-text/extract-text'
import { createScenarioVectorPath } from '@/lib/content/vector-paths'
import { basicTypesAndFunctionsScenario } from './meta'
import { 
  OverviewContent,
  LearningObjectivesContent,
  PrerequisitesContent,
  FileStructureContent,
  CodeExampleContent,
  MainFileContent,
  UtilsFileContent,
  loadScenarioFiles
} from './body'

// Create chunker for this scenario
const createChunk = chunker(basicTypesAndFunctionsScenario)

// Helper to create vector file paths
const vectorPath = (filename: string) => 
  createScenarioVectorPath('basic-types-and-functions', filename)

export const chunks = [
  // Scenario overview chunk
  createChunk({
    id: 'basic-types-functions:overview',
    label: 'Basic Types and Functions - Overview',
    tags: [...basicTypesAndFunctionsScenario.tags, 'Overview', 'Introduction'] as const,
    vectorFp: vectorPath('overview'),
    text: extractPlainText(<OverviewContent />),
  }),

  // Learning objectives chunk
  createChunk({
    id: 'basic-types-functions:learning-objectives',
    label: 'Basic Types and Functions - Learning Objectives',
    tags: [...basicTypesAndFunctionsScenario.tags, 'Learning', 'Objectives', 'Goals'] as const,
    vectorFp: vectorPath('learning-objectives'),
    text: extractPlainText(<LearningObjectivesContent />),
  }),

  // Prerequisites chunk
  createChunk({
    id: 'basic-types-functions:prerequisites',
    label: 'Basic Types and Functions - Prerequisites',
    tags: [...basicTypesAndFunctionsScenario.tags, 'Prerequisites', 'Requirements'] as const,
    vectorFp: vectorPath('prerequisites'),
    text: extractPlainText(<PrerequisitesContent />),
  }),

  // File structure chunk
  createChunk({
    id: 'basic-types-functions:file-structure',
    label: 'Basic Types and Functions - File Structure',
    tags: [...basicTypesAndFunctionsScenario.tags, 'Files', 'Structure', 'Modules'] as const,
    vectorFp: vectorPath('file-structure'),
    text: extractPlainText(<FileStructureContent />),
  }),

  // Code examples chunk
  createChunk({
    id: 'basic-types-functions:code-examples',
    label: 'Basic Types and Functions - Code Examples',
    tags: [...basicTypesAndFunctionsScenario.tags, 'Code', 'Examples', 'TypeScript'] as const,
    vectorFp: vectorPath('code-examples'),
    text: extractPlainText(<CodeExampleContent />),
  }),

  // Main file implementation chunk
  createChunk({
    id: 'basic-types-functions:main-file',
    label: 'Basic Types and Functions - Main Implementation (index.ts)',
    tags: [...basicTypesAndFunctionsScenario.tags, 'Implementation', 'Main', 'User', 'Interface'] as const,
    vectorFp: vectorPath('main-file'),
    text: extractPlainText(<MainFileContent fileContent="" />),
  }),

  // Utilities file chunk
  createChunk({
    id: 'basic-types-functions:utils-file',
    label: 'Basic Types and Functions - String Utilities (utils/strings.ts)',
    tags: [...basicTypesAndFunctionsScenario.tags, 'Utilities', 'Strings', 'Functions'] as const,
    vectorFp: vectorPath('utils-file'),
    text: extractPlainText(<UtilsFileContent fileContent="" />),
  }),
] as const;