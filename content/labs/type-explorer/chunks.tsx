/**
 * Type Explorer Lab - Content Chunks
 * Searchable content chunks for the type explorer lab
 */

import React from 'react'
import { chunker } from '@/lib/content/content.model'
import { extractPlainText } from '@/lib/content/rich-text/extract-text'
import { Paragraph } from '@/lib/content/rich-text/components/paragraph'
import { Plain } from '@/lib/content/rich-text/components/plain'
import { List, ListItem } from '@/lib/content/rich-text/components/list'
import { createLabVectorPath } from '@/lib/content/vector-paths'
import { typeExplorerLab } from './meta'
import { labDescription, labFeatures, learningObjectives } from './content.data'

const createChunk = chunker(typeExplorerLab)

// Helper to create vector file paths
const vectorPath = (filename: string) => 
  createLabVectorPath('type-explorer', filename)

// Description component using content.data
const LabDescription = () => (
  <Paragraph>
    <Plain space="none">{labDescription}</Plain>
  </Paragraph>
)

// Features component using content.data
const LabFeatures = () => (
  <List>
    {labFeatures.map((feature, index) => (
      <ListItem key={String(index)}>{feature}</ListItem>
    ))}
  </List>
)

// Learning objectives component using content.data
const LearningObjectives = () => (
  <List>
    {learningObjectives.map((objective, index) => (
      <ListItem key={String(index)}>{objective}</ListItem>
    ))}
  </List>
)

export const chunks = [
  // Lab overview chunk
  createChunk({
    id: 'type-explorer-lab:overview',
    label: 'Type Explorer Lab - Overview and Introduction',
    tags: [...typeExplorerLab.tags, 'Overview', 'Introduction'] as const,
    vectorFp: vectorPath('overview'),
    text: extractPlainText(
      <>
        <Plain space="none">{typeExplorerLab.blurb}</Plain>
        <LabDescription />
      </>
    ),
  }),

  // Features and capabilities chunk
  createChunk({
    id: 'type-explorer-lab:features',
    label: 'Type Explorer Lab - Features and Capabilities',
    tags: [...typeExplorerLab.tags, 'Features', 'Capabilities'] as const,
    vectorFp: vectorPath('features'),
    text: extractPlainText(<LabFeatures />),
  }),

  // Learning objectives chunk
  createChunk({
    id: 'type-explorer-lab:learning',
    label: 'Type Explorer Lab - Learning Objectives and Goals',
    tags: [...typeExplorerLab.tags, 'Learning', 'Objectives', 'Education'] as const,
    vectorFp: vectorPath('learning'),
    text: extractPlainText(<LearningObjectives />),
  }),
]
