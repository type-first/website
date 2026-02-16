import React from 'react'
import { Bold } from '@/lib/content/rich-text/components/bold'
import { Italic } from '@/lib/content/rich-text/components/italic'
import { InlineCode } from '@/lib/content/rich-text/components/inline-code'
import { InlineLink } from '@/lib/content/rich-text/components/inline-link'
import { LineBreak } from '@/lib/content/rich-text/components/line-break'
import { List, ListItem } from '@/lib/content/rich-text/components/list'
import { Paragraph } from '@/lib/content/rich-text/components/paragraph'
import { Code } from '@/lib/content/ui/code.cmp.iso'

export const Intro
  = () => 
    <>
      <Paragraph>
        types are first-class values in typist. 
        this minimal suite of logical operators yields 
        a highly expressive logic for
        <Bold>zero-cost compiler-enforced</Bold>
        <Italic>symbolic evaluations</Italic> and
        <Italic>static proofs</Italic> at the type-level.
      </Paragraph>
    </>

export const keyBenefitsTitle = 'Key Benefits'

export const KeyBenefits = () => (
  <List>
    <ListItem><Bold>Compile-time Safety</Bold> - Catch errors before they reach production</ListItem>
    <ListItem><Bold>Zero Runtime Cost</Bold> - All type operations happen at build time</ListItem>
    <ListItem><Bold>Expressive APIs</Bold> - Build self-documenting interfaces with rich type information</ListItem>
    <ListItem><Bold>Developer Experience</Bold> - Clear error messages and excellent IDE integration</ListItem>
  </List>
)

export const foTLPTitle 
  = 'foundations of type-level programming in typescript'

export const FoTLPIntro 
  = () => 
    <>
      <Paragraph>
        type-level programming (fotlp) is an advanced technique in typescript 
        that leverages the type system to perform computations, 
        enforce constraints, and validate structures at compile time.
      </Paragraph>
    </>

export const foTLPNegAssertTitle 
  = 'negative assertions using @ts-expect-error'

export const FoTLPNegAssert 
  = () => 
    <>
      <Paragraph>
        <Italic>asserting what isnt</Italic> is often as important as asserting what is.
        we know this from runtime testing, where negative assertions are common. 
        at the type level, this principle holds true as well. 
        we can use them to ensure that specific conditions are not satisfied by some given type, 
        or that a given typescript expression is disallowed by the compiler. 
      </Paragraph>
      <Paragraph>
        typescript's <InlineCode>@ts-expect-error</InlineCode> directive makes this possible by
        allowing us to assert that a line of code produces a type error. it effectively inverts 
        the usual positive assertion paradigm,<Italic space="before">throwing a compilation error 
        only if the annotated line does <Bold>not</Bold> produce an error</Italic>, 
        and otherwise suppressing the expected error.
      </Paragraph>
      <Paragraph>
        this allows us to write statements like:
      </Paragraph>
      <Code language="ts">
{/*typescript*/`
type AnimalGroup 
  = 'mammals'|'reptiles'|'fish'
// @ts-expect-error
const group0:AnimalGroup = 'fungus'
`}    </Code>
      <Paragraph>
        this code compiles with no errors. 
        our assignment to <InlineCode>group0</InlineCode> is invalid, but `@ts-expect-error` serves to catch and suppress the error.
        changing our code so that `AnimalGroup` includes 'fungus' would make the assignment valid and
        thus produce a compilation error (<InlineCode>"unused @ts-expect-error"</InlineCode>)
        alerting us that we expected to find a compiler error at this line and none was present.
      </Paragraph>
    </>

export const FoTLPPhantTitle
  = 'manipulating types as phantom values'

export const FoTLPhant
  = () =>
    <>
      {/* ... */}
    </>

export const operatorsTitle = 'Core Operators'

export const OperatorsIntroduction = () => (
  <>
    <Paragraph>
      Core operators are the<Bold>building blocks</Bold> 
      for all type-level operations in typist. 
      These utilities create and manipulate<Italic>phantom values</Italic> that enable<Bold>zero-cost abstractions</Bold>.
    </Paragraph>
    
    <Paragraph>
      The primary phantom value creator is
      <InlineCode>t_&lt;T&gt;</InlineCode>, 
      which converts any value to the specified type 
      with<Bold>no runtime overhead</Bold>.
    </Paragraph>
  </>
)

export const comparatorsTitle = 'Type Comparators'

export const ComparatorsIntroduction = () => (
  <>
    <Paragraph>
      Type-level comparison utilities test relationships 
      between types and return<Bold>structured verdicts</Bold>. 
      The core comparators are <InlineCode>$Extends&lt;L, R&gt;</InlineCode> 
      and <InlineCode>$Equal&lt;T1, T2&gt;</InlineCode>.
    </Paragraph>
    
    <Paragraph>
      <InlineCode>$Extends</InlineCode> tests whether type 
      <InlineCode>L</InlineCode> is assignable to type 
      <InlineCode>R</InlineCode>, while 
      <InlineCode>$Equal</InlineCode> tests for<Italic>exact type equality</Italic> through mutual assignability.
    </Paragraph>
  </>
)

export const assertionsTitle = 'Type Assertions'

export const AssertionsIntroduction = () => (
  <>
    <Paragraph>
      Runtime stubs for<Bold>static type assertions</Bold> 
      enforce structural relationships and trigger inference flows. 
      These functions are designed to be invoked at the<Italic>type level</Italic> rather than runtime.
    </Paragraph>
    
    <Paragraph>
      Key assertion functions include <InlineCode>extends_</InlineCode>, 
      <InlineCode>has_</InlineCode>, <InlineCode>yes_</InlineCode>, and 
      <InlineCode>no_</InlineCode> for testing different aspects 
      of type relationships.
    </Paragraph>
  </>
)

export const patternsTitle = 'Advanced Patterns'

export const PatternsIntroduction = () => (
  <>
    <Paragraph>
      Test patterns and<Bold>symbolic evaluation frameworks</Bold> 
      help you build structured type-level test suites and documentation. 
      The core pattern functions are <InlineCode>example_</InlineCode>, 
      <InlineCode>test_</InlineCode>, and <InlineCode>proof_</InlineCode>.
    </Paragraph>
    
    <Paragraph>
      These utilities enable you to create<Italic>type-level examples</Italic> 
      that document behavior and validate type relationships with<Bold>zero runtime cost</Bold>.
    </Paragraph>
  </>
)

export const basicUsageTitle = 'Basic Usage'

export const BasicUsageIntroduction = () => (
  <>
    <Paragraph>
      Simple, practical examples to get you started 
      with typist's<Bold>core functionality</Bold>. 
      Learn the essential patterns through<Italic>hands-on examples</Italic> 
      with object shapes, arrays, functions, and type relationships.
    </Paragraph>
    
    <Paragraph>
      Start with <InlineCode>phantom values</InlineCode>, 
      move to <InlineCode>type comparisons</InlineCode>, 
      then explore<Bold>object validation</Bold> and<Bold>API contract testing</Bold>.
    </Paragraph>
  </>
)

export const bestPracticesTitle = 'Best Practices'

export const BestPracticesList = () => (
  <List>
    <ListItem>
      Use<Bold>descriptive variable names</Bold> - 
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
      Document complex phantom types with<Bold>JSDoc comments</Bold> explaining their purpose
    </ListItem>
  </List>
)

export const troubleshootingTitle = 'Troubleshooting'

export const TroubleshootingIntroduction = () => (
  <>
    <Paragraph>
      Common issues and solutions when working with typist. Learn how to<Bold>debug type-level problems</Bold> and understand<Italic>error messages</Italic> from failed assertions.
    </Paragraph>
    
    <Paragraph>
      Use <InlineCode>decidable_()</InlineCode> to accept any verdict result, then examine the structured debugging information in <InlineCode>$No</InlineCode> verdicts.
    </Paragraph>
  </>
)

export const conclusionTitle = 'Conclusion'

export const ConclusionParagraph = () => (
  <>
    <Paragraph>
      Typist provides the<Bold>foundation</Bold> for advanced type-level programming in TypeScript. By mastering phantom types, verdicts, and assertions, you'll write<Italic space="before">safer code</Italic>, catch<Bold>more bugs at compile time</Bold>, and create<Italic space="before">better developer experiences</Italic>.
    </Paragraph>
    
    <Paragraph>
      Continue exploring type-level patterns in our <InlineLink href="/docs">documentation series</InlineLink> and join our <InlineLink href="/community">community discussions</InlineLink> to share your own patterns and learn from others.
    </Paragraph>
  </>
)