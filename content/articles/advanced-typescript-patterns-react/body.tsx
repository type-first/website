/**
 * Advanced TypeScript Patterns for React - Article Body Content
 * Pure React components for each content section (lazy-loaded for bundle optimization)
 */

import React from 'react'
import { Bold } from '@/lib/content/rich-text/components/bold'
import { Italic } from '@/lib/content/rich-text/components/italic'
import { InlineCode } from '@/lib/content/rich-text/components/inline-code'
import { InlineLink } from '@/lib/content/rich-text/components/inline-link'
import { LineBreak } from '@/lib/content/rich-text/components/line-break'
import { List, ListItem } from '@/lib/content/rich-text/components/list'
import { Paragraph } from '@/lib/content/rich-text/components/paragraph'

// --- Pure Component-based Content Definitions

export const IntroductionParagraph = () => (
  <>
    <Paragraph>
      TypeScript has revolutionized React development by providing 
      <Bold space="after">static type checking</Bold> 
      and enhanced developer experience. In this comprehensive guide, we'll explore 
      <Italic space="after">advanced TypeScript patterns</Italic> 
      that will elevate your React applications to new levels of 
      <Bold space="after">type safety</Bold> and 
      <Bold>maintainability</Bold>.
    </Paragraph>
    
    <Paragraph>
      We'll cover essential patterns like 
      <InlineCode>Generic Components</InlineCode>, 
      <InlineCode space="after">Conditional Types</InlineCode>, and 
      <InlineLink href="#type-safe-apis" space="after">Type-Safe APIs</InlineLink> 
      that every TypeScript React developer should master.
    </Paragraph>
  </>
)

export const GenericsIntroduction = () => (
  <>
    <Paragraph>
      Generic components are the foundation of flexible, <Bold space="after">reusable React components</Bold> in TypeScript. They allow us to create components that work with <Italic space="after">multiple data types</Italic> while maintaining <Bold>full type safety</Bold>.
    </Paragraph>
    
    <Paragraph>
      Let's start with a simple <InlineCode space="after">List</InlineCode> component that can render items of any type:
    </Paragraph>
  </>
)

export const ContentHeadingTwo = () => (
  <Paragraph>
    The <InlineCode>T</InlineCode> type parameter allows the <InlineCode>DataList</InlineCode> component to accept an array of any type, while the <InlineCode>renderItem</InlineCode> function is properly typed to receive the correct item type.
  </Paragraph>
)

export const ConditionalTypesIntro = () => (
  <Paragraph>
    Conditional types allow you to create <Bold space="after">dynamic type relationships</Bold> based on type conditions. This enables more <Italic space="after">flexible</Italic> and <Italic space="after">expressive</Italic> component APIs.
  </Paragraph>
)

export const ConditionalTypesExample = () => (
  <Paragraph>
    Advanced conditional type example demonstrates how you can use <InlineCode space="after">extends</InlineCode> keyword to create type-level logic that adapts based on the input types, providing <Bold space="after">maximum type safety</Bold> with <Bold>minimal boilerplate</Bold>.
  </Paragraph>
)

export const ApiIntroduction = () => (
  <Paragraph>
    Creating <Bold space="after">type-safe APIs</Bold> involves using TypeScript's type system to ensure that your <Italic>API calls</Italic>, <Italic>responses</Italic>, and <Italic space="after">error handling</Italic> are all properly typed from end to end.
  </Paragraph>
)

export const ApiExample = () => (
  <Paragraph>
    API client pattern provides <Bold space="after">compile-time guarantees</Bold> that your API calls match your backend contracts, reducing runtime errors and improving <Italic>developer confidence</Italic>.
  </Paragraph>
)

export const BestPracticesIntro = () => (
  <Paragraph>
    Here are the essential <Bold space="after">best practices</Bold> for advanced TypeScript React development:
  </Paragraph>
)

export const BestPracticesList = () => (
  <List>
    <ListItem>
      Use <InlineCode>strict</InlineCode> mode for maximum type safety
    </ListItem>
    <ListItem>
      Leverage <InlineCode>utility types</InlineCode> like <InlineCode>Pick</InlineCode>, <InlineCode>Omit</InlineCode>, and <InlineCode>Partial</InlineCode>
    </ListItem>
    <ListItem>
      Implement proper <InlineCode>error boundaries</InlineCode> with typed error handling
    </ListItem>
    <ListItem>
      Use <InlineCode>React.memo</InlineCode> for complex state management
    </ListItem>
    <ListItem>
      Document complex types with <InlineCode>JSDoc</InlineCode> comments
    </ListItem>
  </List>
)

export const ConclusionParagraph = () => (
  <>
    <Paragraph>
      Advanced TypeScript patterns provide the <Bold>foundation</Bold> for building <Italic>robust</Italic>, <Italic>maintainable</Italic> React applications. By mastering these patterns, you'll write <Bold>safer code</Bold>, catch <Bold>more bugs at compile time</Bold>, and create <Italic>better developer experiences</Italic> for your team.
    </Paragraph>
    
    <Paragraph>
      Continue exploring advanced patterns in our <InlineLink href="/articles?tag=typescript">TypeScript Deep Dive series</InlineLink> and join our <InlineLink href="/community">community discussions</InlineLink> to share your own patterns and learn from others.
    </Paragraph>
  </>
)
