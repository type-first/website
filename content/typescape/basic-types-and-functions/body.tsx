/**
 * Basic Types and Functions Scenario - Body Content
 * Pure React components for each content section (lazy-loaded for bundle optimization)
 */

import React from 'react'
import fs from 'fs/promises'
import path from 'path'
import { Bold } from '@/lib/content/rich-text/components/bold'
import { Italic } from '@/lib/content/rich-text/components/italic'
import { InlineCode } from '@/lib/content/rich-text/components/inline-code'
import { List, ListItem } from '@/lib/content/rich-text/components/list'
import { Paragraph } from '@/lib/content/rich-text/components/paragraph'
import { Plain } from '@/lib/content/rich-text/components/plain'

// --- File Loading Utilities

export async function loadScenarioFiles() {
  const scenarioDir = path.join(process.cwd(), 'content/typescape/basic-types-and-functions/src')
  
  try {
    const indexContent = await fs.readFile(path.join(scenarioDir, 'index.ts'), 'utf-8')
    const stringsContent = await fs.readFile(path.join(scenarioDir, 'utils/strings.ts'), 'utf-8')
    
    return {
      'index.ts': indexContent,
      'utils/strings.ts': stringsContent
    }
  } catch (error) {
    console.warn('Failed to load scenario files:', error)
    return {}
  }
}

// --- Pure Component-based Content Definitions

export const OverviewContent = () => (
  <>
    <Paragraph>
      This scenario introduces <Bold>core TypeScript concepts</Bold> through a practical example. 
      You'll work with <Italic>type definitions</Italic>, <InlineCode>interfaces</InlineCode>, 
      and <Bold>function signatures</Bold> while building a simple greeting system with string utilities.
    </Paragraph>
    
    <Paragraph>
      The scenario demonstrates <InlineCode>module structure</InlineCode>, 
      <InlineCode>type safety</InlineCode>, and 
      <Bold>import/export patterns</Bold> essential for TypeScript development.
    </Paragraph>
  </>
)

export const LearningObjectivesContent = () => (
  <>
    <Paragraph>
      <Bold>What you'll learn in this scenario:</Bold>
    </Paragraph>
    <List>
      <ListItem>Define and use TypeScript interfaces and types</ListItem>
      <ListItem>Create type-safe functions with proper parameter and return types</ListItem>
      <ListItem>Work with TypeScript modules and imports/exports</ListItem>
      <ListItem>Understand basic type inference and annotation</ListItem>
      <ListItem>Practice with string manipulation and utility functions</ListItem>
    </List>
  </>
)

export const PrerequisitesContent = () => (
  <>
    <Paragraph>
      <Bold>Before starting this scenario, you should have:</Bold>
    </Paragraph>
    <List>
      <ListItem>Basic JavaScript knowledge</ListItem>
      <ListItem>Understanding of ES6 modules</ListItem>
    </List>
  </>
)

export const FileStructureContent = () => (
  <>
    <Paragraph>
      This scenario demonstrates <Bold>TypeScript module structure</Bold> with two files:
    </Paragraph>
    <List>
      <ListItem><InlineCode>index.ts</InlineCode>: Main entry point with User interface and greet function</ListItem>
      <ListItem><InlineCode>utils/strings.ts</InlineCode>: Utility module with string manipulation functions</ListItem>
    </List>
  </>
)

export const CodeExampleContent = () => (
  <>
    <Paragraph>
      <Bold>Key TypeScript features demonstrated:</Bold>
    </Paragraph>
    <List>
      <ListItem><InlineCode>Interface definition</InlineCode> with proper typing</ListItem>
      <ListItem><InlineCode>Type-safe functions</InlineCode> with parameter and return type inference</ListItem>
      <ListItem><InlineCode>Module imports/exports</InlineCode> for code organization</ListItem>
      <ListItem><InlineCode>String manipulation</InlineCode> with proper type annotations</ListItem>
    </List>
  </>
)

// --- File Content Components (using dynamic loading)

export const MainFileContent = ({ fileContent }: { fileContent: string }) => (
  <>
    <Paragraph>
      <Bold>Main implementation file (index.ts):</Bold>
    </Paragraph>
    <Paragraph>
      <Plain>Demonstrates TypeScript interfaces, function typing, and module imports. 
      Contains User interface definition, type-safe greet function, and example usage.</Plain>
    </Paragraph>
  </>
)

export const UtilsFileContent = ({ fileContent }: { fileContent: string }) => (
  <>
    <Paragraph>
      <Bold>String utilities file (utils/strings.ts):</Bold>
    </Paragraph>
    <Paragraph>
      <Plain>Contains utility functions for string manipulation with proper TypeScript typing. 
      Demonstrates function exports, string processing, and type annotations.</Plain>
    </Paragraph>
  </>
)