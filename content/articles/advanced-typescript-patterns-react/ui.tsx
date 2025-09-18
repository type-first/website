/**
 * Advanced TypeScript Patterns for React Applications
 * Main article component using the new content system
 */

import React from "react";
import { Header } from "@/lib/content/ui/header.cmp.iso";
import { Navigation } from "@/lib/content/ui/navigation.cmp.iso";
import { Link } from "@/lib/content/ui/link.cmp.iso";
import { CoverImage } from "@/lib/content/ui/cover-image.cmp.iso";
import { ArticleHeader } from "@/lib/content/ui/article/article-header.cmp.iso";
import { ArticleMetadata } from "@/lib/content/ui/article/article-metadata.cmp.iso";
import { Heading } from "@/lib/content/ui/heading.cmp.iso";
import { CodeExplorerLink } from "@/lib/content/ui/link.code-explorer.cmp.iso";
import { Footer } from "@/lib/content/ui/footer.cmp.iso";
import { Container } from "@/lib/content/ui/container.cmp.iso";
import { TagsList } from "@/lib/content/ui/tags-list.cmp.iso";
import { JsonLd } from "@/lib/content/ui/json-ld.cmp.iso";
import { Section } from "@/lib/content/ui/section.cmp.iso";
import { Code } from "@/lib/content/ui/code.cmp.iso";

import { article } from "./meta";
import { 
  IntroductionParagraph,
  GenericsIntroduction,
  ConditionalTypesIntro,
  ConditionalTypesExample,
  ApiIntroduction,
  ApiExample,
  BestPracticesIntro,
  BestPracticesList,
  ConclusionParagraph
} from "./body";

// UI Components for interactive elements
export const PracticalExamplesIntro = () => (
  <Section>
    <p className="text-gray-600 mb-6">
      Before diving into advanced patterns, let's solidify your understanding with <strong>hands-on practice</strong>. 
      These interactive scenarios will help you <em>apply TypeScript concepts</em> in real code.
    </p>
  </Section>
);

export const BasicTypesScenarioLink = () => (
  <div className="my-6">
    <CodeExplorerLink
      slug="basic-types-and-functions"
      name="Basic Types and Functions"
      description="Learn TypeScript fundamentals through hands-on practice with basic types, interfaces, and function definitions in a multi-file project structure."
    />
  </div>
);

// Import snippet content
import { genericComponentsSnippet } from "./snippets/react-component.snippet.tsx";
import { deploymentConfigSnippet } from "./snippets/deployment-config.snippet.yml";

/**
 * Advanced TypeScript Patterns for React Applications
 * A comprehensive guide to advanced TypeScript patterns for React development
 */
export const AdvancedTypescriptPatternsReactArticle = async () => {
  // Load snippet content
  const snippets = {
    genericComponents: genericComponentsSnippet,
    deploymentConfig: deploymentConfigSnippet
  };

  return (
  <>
    {/* JSON-LD Structured Data */}
    <JsonLd 
      data={{
        '@type': 'Article',
        headline: article.name,
        description: article.blurb,
        image: article.coverImgUrl,
        datePublished: new Date(article.publishedTs).toISOString(),
        dateModified: new Date(article.publishedTs).toISOString(),
        author: {
          '@type': 'Person',
          name: article.author.name,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Type-First',
          logo: {
            '@type': 'ImageObject',
            url: 'https://type-first.com/logo.png',
          },
        },
        keywords: article.tags.join(', '),
      }}
    />

    <Header>
      <Container>
        <Navigation>
          <Link href="/articles">Articles</Link>
          <Link href="/labs">Labs</Link>
          <Link href="/community">Community</Link>
        </Navigation>

        {/* Cover Image */}
        <CoverImage 
          src={article.coverImgUrl}
          alt={article.name}
        />
      </Container>
    </Header>

    <Container>
      <ArticleHeader>
        <Heading level={1}>{article.name}</Heading>
        <ArticleMetadata publishedAt={new Date(article.publishedTs)} />
      </ArticleHeader>

      {/* Introduction */}
      <Section>
        <IntroductionParagraph />
      </Section>

      {/* Generic Components */}
      <Section>
        <Heading level={2}>Generic Components</Heading>
        <GenericsIntroduction />
        
        <Heading level={3}>Basic Generic Component Pattern</Heading>
        
        <Code language="typescript">{snippets.genericComponents}</Code>
      </Section>

      {/* Conditional Types */}
      <Section>
        <Heading level={2}>Conditional Types in Components</Heading>
        <ConditionalTypesIntro />
        
        <Heading level={3}>Advanced Conditional Type Example</Heading>
        <ConditionalTypesExample />
      </Section>

      {/* Type-Safe APIs */}
      <Section>
        <Heading level={2}>Type-Safe APIs</Heading>
        <ApiIntroduction />
        
        <Heading level={3}>API Client Pattern</Heading>
        <ApiExample />
      </Section>

      {/* Best Practices */}
      <Section>
        <Heading level={2}>Best Practices</Heading>
        <BestPracticesIntro />
        <BestPracticesList />
      </Section>

      {/* Deployment Configuration */}
      <Section>
        <Heading level={2}>Production Deployment</Heading>
        <p>Here's a sample GitHub Actions workflow for deploying TypeScript React applications:</p>
        
        <Code language="yaml">{snippets.deploymentConfig}</Code>
      </Section>

      {/* Conclusion */}
      <Section>
        <Heading level={2}>Conclusion</Heading>
        <ConclusionParagraph />
      </Section>

      <Footer>
        <TagsList 
          label="Tags"
          tags={[...article.tags]} 
        />
      </Footer>
    </Container>
  </>
  );
};

// Re-export metadata for compatibility
export const articleMetadata = {
  title: article.name,
  description: article.blurb,
  tags: article.tags,
  author: article.author.name,
  publishedAt: article.publishedTs,
  coverImage: article.coverImgUrl
};
