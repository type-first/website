/**
 * Typist Documentation
 * Specialized UI components for typist library documentation
 */

import React from "react";
import { Header } from "@/lib/content/ui/header.cmp.iso";
import { Navigation } from "@/lib/content/ui/navigation.cmp.iso";
import { Link } from "@/lib/content/ui/link.cmp.iso";
import { Footer } from "@/lib/content/ui/footer.cmp.iso";
import { Container } from "@/lib/content/ui/container.cmp.iso";
import { TagsList } from "@/lib/content/ui/tags-list.cmp.iso";
import { JsonLd } from "@/lib/content/ui/json-ld.cmp.iso";
import { Section } from "@/lib/content/ui/section.cmp.iso";
import { Code } from "@/lib/content/ui/code.cmp.iso";
import { Heading } from "@/lib/content/ui/heading.cmp.iso";

import { library } from "./meta";
import { 
  IntroductionParagraph,
  InstallationParagraph,
  QuickStartIntroduction,
  PhantomTypesExplanation,
  VerdictsExplanation,
  AssertionsIntroduction,
  ComparatorsIntroduction,
  OperatorsIntroduction,
  PatternsIntroduction,
  BasicUsageIntroduction,
  BestPracticesList,
  TroubleshootingIntroduction,
  ConclusionParagraph
} from "./body";

// UI Components for interactive elements
export const TypeExamplesIntro = () => (
  <Section>
    <p className="text-gray-600 mb-6">
      Let's explore <strong>practical examples</strong> of typist utilities in action. 
      These code snippets demonstrate how to <em>leverage type-level programming</em> for safer TypeScript.
    </p>
  </Section>
);

export const PhantomTypesDemo = () => (
  <div className="my-6 p-4 bg-gray-50 rounded-lg">
    <h4 className="font-semibold mb-3">Phantom Types Example</h4>
    <p className="text-sm text-gray-600">
      Phantom types allow you to create nominal types without runtime overhead, 
      perfect for domain modeling and type safety.
    </p>
  </div>
);

export const VerdictsDemo = () => (
  <div className="my-6 p-4 bg-blue-50 rounded-lg">
    <h4 className="font-semibold mb-3">Verdict System</h4>
    <p className="text-sm text-gray-600">
      Verdicts enable compile-time validation and error reporting through 
      TypeScript's type system.
    </p>
  </div>
);

// Import snippet content
import { phantomValuesSnippet } from "./snippets/phantom-values";
import { comparisonsSnippet } from "./snippets/comparisons";
import { assertionsSnippet } from "./snippets/assertions";
import { advancedPatternsSnippet } from "./snippets/advanced-patterns";
import { testPatternsSnippet } from "./snippets/test-patterns";
import { installationSnippet } from "./snippets/installation.yml";

/**
 * Typist Documentation
 * A comprehensive guide to type-level utilities for TypeScript
 */
export const TypistDocumentation = async () => {
  // Load snippet content
  const snippets = {
    phantomValues: phantomValuesSnippet,
    comparisons: comparisonsSnippet,
    assertions: assertionsSnippet,
    installation: installationSnippet
  };

  return (
  <>
    {/* JSON-LD Structured Data */}
    <JsonLd 
      data={{
        '@type': 'TechArticle',
        headline: library.name,
        description: library.blurb,
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        author: {
          '@type': 'Organization',
          name: 'Type-First',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Type-First',
          logo: {
            '@type': 'ImageObject',
            url: 'https://type-first.com/logo.png',
          },
        },
        keywords: ['TypeScript', 'Type-level Programming', 'Phantom Types', 'Static Analysis'].join(', '),
      }}
    />

    <Header>
      <Container>
        <Navigation>
          <Link href="/docs">Documentation</Link>
          <Link href="/articles">Articles</Link>
          <Link href="/labs">Labs</Link>
          <Link href="/community">Community</Link>
        </Navigation>
      </Container>
    </Header>

    <Container>
      <header className="mb-8">
        <Heading level={1}>{library.name}</Heading>
        <p className="text-xl text-gray-600 mt-2">{library.blurb}</p>
      </header>

      {/* Introduction */}
      <Section>
        <IntroductionParagraph />
      </Section>

      {/* Installation */}
      <Section>
        <Heading level={2}>Installation</Heading>
        <InstallationParagraph />
        
        <Code language="bash">{snippets.installation}</Code>
      </Section>

      {/* Quick Start */}
      <Section>
        <Heading level={2}>Quick Start</Heading>
        <QuickStartIntroduction />
        <BasicUsageIntroduction />
      </Section>

      {/* Phantom Types */}
      <Section>
        <Heading level={2}>Phantom Types</Heading>
        <PhantomTypesExplanation />
        <PhantomTypesDemo />
        
        <Code language="typescript">{snippets.phantomValues}</Code>
      </Section>

      {/* Verdicts */}
      <Section>
        <Heading level={2}>Verdict System</Heading>
        <VerdictsExplanation />
        <VerdictsDemo />
      </Section>

      {/* Type Operators */}
      <Section>
        <Heading level={2}>Type Operators</Heading>
        <OperatorsIntroduction />
        
        <Heading level={3}>Comparators</Heading>
        <ComparatorsIntroduction />
        
        <Code language="typescript">{snippets.comparisons}</Code>
      </Section>

      {/* Assertions */}
      <Section>
        <Heading level={2}>Assertions</Heading>
        <AssertionsIntroduction />
        
        <Code language="typescript">{snippets.assertions}</Code>
      </Section>

      {/* Advanced Patterns */}
      <Section>
        <Heading level={2}>Advanced Patterns</Heading>
        <PatternsIntroduction />
        <TypeExamplesIntro />
      </Section>

      {/* Best Practices */}
      <Section>
        <Heading level={2}>Best Practices</Heading>
        <BestPracticesList />
      </Section>

      {/* Troubleshooting */}
      <Section>
        <Heading level={2}>Troubleshooting</Heading>
        <TroubleshootingIntroduction />
      </Section>

      {/* Conclusion */}
      <Section>
        <Heading level={2}>Conclusion</Heading>
        <ConclusionParagraph />
      </Section>

      <Footer>
        <TagsList 
          label="Topics"
          tags={['TypeScript', 'Type-level Programming', 'Phantom Types', 'Static Analysis', 'Utilities']} 
        />
      </Footer>
    </Container>
  </>
  );
};

// Re-export metadata for compatibility
export const documentationMetadata = {
  title: library.name,
  description: library.blurb,
  tags: ['TypeScript', 'Type-level Programming', 'Phantom Types', 'Static Analysis'],
  library: library.name
};