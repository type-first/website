/**
 * Advanced TypeScript Patterns for React Applications
 * Main article component that combines all sections
 */

import React from "react";
import { Header } from "@/modules/articles/ui/header.cmp.iso";
import { Navigation } from "@/modules/articles/ui/navigation.cmp.iso";
import { Link } from "@/modules/articles/ui/link.cmp.iso";
import { CoverImage } from "@/modules/articles/ui/cover-image.cmp.iso";
import { ArticleHeader } from "@/modules/articles/ui/article-header.cmp.iso";
import { ArticleMetadata } from "@/modules/articles/ui/article-metadata.cmp.iso";
import { Heading } from "@/modules/articles/ui/heading.cmp.iso";
import { Paragraph } from "@/modules/articles/ui/paragraph.cmp.iso";
import { CodeExplore } from "@/modules/articles/ui/code-explore.cmp.iso";
import { Footer } from "@/modules/articles/ui/footer.cmp.iso";
import { Container } from "@/modules/articles/ui/container.cmp.iso";
import { TagsList } from "@/modules/articles/ui/tags-list.cmp.iso";
import { JsonLd } from "@/modules/articles/ui/json-ld.cmp.iso";
import { Section } from "@/modules/articles/ui/section.cmp.iso";
import { Code } from "@/modules/articles/ui/code.cmp.iso";

import { articleContentData } from "./content.data";

type ArticleProps = {};

/**
 * Advanced TypeScript Patterns for React Applications
 * A comprehensive guide to advanced TypeScript patterns for React development
 */
export const AdvancedTypescriptPatternsReactArticle: React.FC<ArticleProps> = () => (
  <>
    {/* JSON-LD Structured Data */}
    <JsonLd 
      data={{
        '@type': 'Article',
        headline: articleContentData.metadata.title,
        description: articleContentData.metadata.description,
        image: articleContentData.metadata.coverImage,
        datePublished: new Date(articleContentData.metadata.publishedAt).toISOString(),
        dateModified: new Date(articleContentData.metadata.updatedAt).toISOString(),
        author: {
          '@type': 'Person',
          name: articleContentData.metadata.author,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Type-First',
          logo: {
            '@type': 'ImageObject',
            url: 'https://type-first.com/logo.png',
          },
        },
        keywords: articleContentData.metadata.tags.join(', '),
      }}
    />

    <Header>
      <Container>
        <Navigation>
          {articleContentData.navigation.map((link) => (
            <Link key={link.href} href={link.href}>{link.label}</Link>
          ))}
        </Navigation>

        {/* Cover Image */}
        <CoverImage 
          src={articleContentData.metadata.coverImage}
          alt={articleContentData.metadata.title}
        />
      </Container>
    </Header>

    <Container>
      <ArticleHeader>
        <Heading level={1}>{articleContentData.metadata.title}</Heading>
        <ArticleMetadata publishedAt={new Date(articleContentData.metadata.publishedAt)} />
      </ArticleHeader>

      <Paragraph>
        {articleContentData.introduction}
      </Paragraph>

      <CodeExplore 
        slug={articleContentData.codeExplore.slug}
        name={articleContentData.codeExplore.name}
        description={articleContentData.codeExplore.description}
      />

      {/* Generic Components Section */}
      <Section>
        <Heading level={2}>{articleContentData.sections.genericComponents.title}</Heading>
        <Paragraph>{articleContentData.sections.genericComponents.content}</Paragraph>
        
        <Heading level={3}>{articleContentData.sections.genericComponents.subtitle}</Heading>
        <Code 
          language={articleContentData.sections.genericComponents.codeSnippet.language}
        >
          {articleContentData.sections.genericComponents.codeSnippet.code}
        </Code>
      </Section>

      {/* Conditional Types Section */}
      <Section>
        <Heading level={2}>{articleContentData.sections.conditionalTypes.title}</Heading>
        <Paragraph>{articleContentData.sections.conditionalTypes.content}</Paragraph>
        
        <Heading level={3}>{articleContentData.sections.conditionalTypes.subtitle}</Heading>
        <Code 
          language={articleContentData.sections.conditionalTypes.codeSnippet.language}
        >
          {articleContentData.sections.conditionalTypes.codeSnippet.code}
        </Code>
      </Section>

      {/* Type-Safe APIs Section */}
      <Section>
        <Heading level={2}>{articleContentData.sections.typeSafeApis.title}</Heading>
        <Paragraph>{articleContentData.sections.typeSafeApis.content}</Paragraph>
        
        <Heading level={3}>{articleContentData.sections.typeSafeApis.subtitle}</Heading>
        <Code 
          language={articleContentData.sections.typeSafeApis.codeSnippet.language}
        >
          {articleContentData.sections.typeSafeApis.codeSnippet.code}
        </Code>
      </Section>

      {/* Best Practices Section */}
      <Section>
        <Heading level={2}>{articleContentData.sections.bestPractices.title}</Heading>
        <ul>
          {articleContentData.sections.bestPractices.content.map((practice, index) => (
            <li key={index}>
              <strong>{practice.title}:</strong> {practice.description}
            </li>
          ))}
        </ul>
      </Section>

      {/* Footer */}
      <Section>
        <Heading level={2}>{articleContentData.footer.title}</Heading>
        <Paragraph>{articleContentData.footer.content}</Paragraph>
      </Section>

      <Footer>
        <TagsList 
          label="Tags"
          tags={[...articleContentData.metadata.tags]} 
        />
      </Footer>
    </Container>
  </>
);

// Re-export metadata for compatibility
export const articleMetadata = articleContentData.metadata;
