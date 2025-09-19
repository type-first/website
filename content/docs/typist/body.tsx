/**
 * Typist Documentation - Body Content
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
      Typist is a 
      <Bold>minimal, compositional, and debug-friendly</Bold> 
      suite of type-level utilities designed for 
      <Italic>static analysis</Italic>, 
      <Italic>symbolic testing</Italic>, and 
      <Italic>phantom type operations</Italic> 
      in TypeScript.
    </Paragraph>
    
    <Paragraph>
      It treats types as 
      <Bold>first-class values</Bold>, 
      leveraging TypeScript's structural type system to encode 
      <InlineCode>symbolic verdicts</InlineCode>, 
      <InlineCode>composable constraints</InlineCode>, and 
      <InlineCode>static proofs</InlineCode>.
    </Paragraph>
  </>
)

export const InstallationParagraph = () => (
  <>
    <Paragraph>
      Get started with typist by installing it in your TypeScript project. 
      Typist requires <Bold>TypeScript 4.5 or later</Bold> 
      for optimal type inference and error reporting.
    </Paragraph>
    
    <Paragraph>
      Install using your preferred package manager:
    </Paragraph>
  </>
)

export const QuickStartIntroduction = () => (
  <>
    <Paragraph>
      Get up and running with typist in minutes. 
      This guide covers the 
      <Bold>essential patterns</Bold> you'll use in everyday 
      <Italic>type-level programming</Italic>.
    </Paragraph>
    
    <Paragraph>
      Start by importing the core utilities: 
      <InlineCode>t_</InlineCode>, 
      <InlineCode>$Equal</InlineCode>, 
      <InlineCode>$Extends</InlineCode>, 
      <InlineCode>yes_</InlineCode>, 
      <InlineCode>no_</InlineCode>, and 
      <InlineCode>example_</InlineCode>.
    </Paragraph>
  </>
)

export const PhantomTypesExplanation = () => (
  <>
    <Paragraph>
      <Bold>Phantom types</Bold> 
      are the foundation of typist's approach to type-level programming.
      They allow you to work with types as if they were 
      <Italic>runtime values</Italic>, enabling powerful 
      <Bold>compile-time analysis</Bold> and validation.
    </Paragraph>
    
    <Paragraph>
      A phantom type carries information at the 
      <Bold>type level</Bold> but has no corresponding runtime representation. 
      In typist, we create phantom values that 
      <Italic>"lie to the compiler"</Italic> by casting 
      <InlineCode>null</InlineCode> to any type we want to work with.
    </Paragraph>
  </>
)

export const VerdictsExplanation = () => (
  <>
    <Paragraph>
      <Bold>Verdicts</Bold> 
      are symbolic markers that encode the results of type-level comparisons. 
      They provide <Italic>structured, debuggable feedback</Italic> 
      about type relationships.
    </Paragraph>
    
    <Paragraph>
      Every type comparison in typist returns a verdict - either 
      <InlineCode>$Yes</InlineCode> for successful comparisons or 
      <InlineCode>$No</InlineCode> for failures. 
      This system provides <Bold>rich debugging information</Bold> 
      when types don't match expectations.
    </Paragraph>
  </>
)

export const OperatorsIntroduction = () => (
  <>
    <Paragraph>
      Core operators are the <Bold>building blocks</Bold> 
      for all type-level operations in typist. 
      These utilities create and manipulate 
      <Italic>phantom values</Italic> that enable 
      <Bold>zero-cost abstractions</Bold>.
    </Paragraph>
    
    <Paragraph>
      The primary phantom value creator is 
      <InlineCode>t_&lt;T&gt;</InlineCode>, 
      which converts any value to the specified type 
      with <Bold>no runtime overhead</Bold>.
    </Paragraph>
  </>
)

export const ComparatorsIntroduction = () => (
  <>
    <Paragraph>
      Type-level comparison utilities test relationships 
      between types and return <Bold>structured verdicts</Bold>. 
      The core comparators are <InlineCode>$Extends&lt;L, R&gt;</InlineCode> 
      and <InlineCode>$Equal&lt;T1, T2&gt;</InlineCode>.
    </Paragraph>
    
    <Paragraph>
      <InlineCode>$Extends</InlineCode> tests whether type 
      <InlineCode>L</InlineCode> is assignable to type 
      <InlineCode>R</InlineCode>, while 
      <InlineCode>$Equal</InlineCode> tests for 
      <Italic>exact type equality</Italic> through mutual assignability.
    </Paragraph>
  </>
)

export const AssertionsIntroduction = () => (
  <>
    <Paragraph>
      Runtime stubs for <Bold>static type assertions</Bold> 
      enforce structural relationships and trigger inference flows. 
      These functions are designed to be invoked at the 
      <Italic>type level</Italic> rather than runtime.
    </Paragraph>
    
    <Paragraph>
      Key assertion functions include <InlineCode>extends_</InlineCode>, 
      <InlineCode>has_</InlineCode>, <InlineCode>yes_</InlineCode>, and 
      <InlineCode>no_</InlineCode> for testing different aspects 
      of type relationships.
    </Paragraph>
  </>
)

export const PatternsIntroduction = () => (
  <>
    <Paragraph>
      Test patterns and <Bold>symbolic evaluation frameworks</Bold> 
      help you build structured type-level test suites and documentation. 
      The core pattern functions are <InlineCode>example_</InlineCode>, 
      <InlineCode>test_</InlineCode>, and <InlineCode>proof_</InlineCode>.
    </Paragraph>
    
    <Paragraph>
      These utilities enable you to create <Italic>type-level examples</Italic> 
      that document behavior and validate type relationships with 
      <Bold>zero runtime cost</Bold>.
    </Paragraph>
  </>
)

export const BasicUsageIntroduction = () => (
  <>
    <Paragraph>
      Simple, practical examples to get you started 
      with typist's <Bold>core functionality</Bold>. 
      Learn the essential patterns through <Italic>hands-on examples</Italic> 
      with object shapes, arrays, functions, and type relationships.
    </Paragraph>
    
    <Paragraph>
      Start with <InlineCode>phantom values</InlineCode>, 
      move to <InlineCode>type comparisons</InlineCode>, 
      then explore <Bold>object validation</Bold> and 
      <Bold>API contract testing</Bold>.
    </Paragraph>
  </>
)

export const BestPracticesList = () => (
  <List>
    <ListItem>
      Use <Bold>descriptive variable names</Bold> - 
      <InlineCode>const userType = t_&lt;User&gt;()</InlineCode> 
      is clearer than <InlineCode>const u = t_&lt;User&gt;()</InlineCode>
    </ListItem>
    <ListItem>
      Prefer <InlineCode>t_</InlineCode> for brevity - 
      It's the most commonly used phantom creator
    </ListItem>
    <ListItem>
      <Bold>Start simple</Bold> - Begin with 
      basic assertions and build complexity gradually
    </ListItem>
    <ListItem>
      Use <InlineCode>decidable_()</InlineCode> first - Accept any verdict, 
      then narrow to <InlineCode>yes_()</InlineCode> or <InlineCode>no_()</InlineCode>
    </ListItem>
    <ListItem>
      <Bold>Break down complex types</Bold> - Test components separately before testing the whole
    </ListItem>
    <ListItem>
      Document complex phantom types with <Bold>JSDoc comments</Bold> explaining their purpose
    </ListItem>
  </List>
)

export const TroubleshootingIntroduction = () => (
  <>
    <Paragraph>
      Common issues and solutions when working with typist. Learn how to <Bold>debug type-level problems</Bold> and understand <Italic>error messages</Italic> from failed assertions.
    </Paragraph>
    
    <Paragraph>
      Use <InlineCode>decidable_()</InlineCode> to accept any verdict result, then examine the structured debugging information in <InlineCode>$No</InlineCode> verdicts.
    </Paragraph>
  </>
)

export const ConclusionParagraph = () => (
  <>
    <Paragraph>
      Typist provides the <Bold>foundation</Bold> for advanced type-level programming in TypeScript. By mastering phantom types, verdicts, and assertions, you'll write <Italic>safer code</Italic>, catch <Bold>more bugs at compile time</Bold>, and create <Italic>better developer experiences</Italic>.
    </Paragraph>
    
    <Paragraph>
      Continue exploring type-level patterns in our <InlineLink href="/docs">documentation series</InlineLink> and join our <InlineLink href="/community">community discussions</InlineLink> to share your own patterns and learn from others.
    </Paragraph>
  </>
)