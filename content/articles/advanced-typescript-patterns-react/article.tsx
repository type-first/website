/**
 * Advanced TypeScript Patterns for React Applications
 * Main article component that combines all sections
 */

import React from "react";
import { 
  Header, 
  Navigation, 
  Link, 
  CoverImage, 
  ArticleHeader, 
  ArticleMetadata, 
  Heading, 
  Paragraph, 
  CodeExplore, 
  Footer, 
  Container, 
  TagsList, 
  JsonLd,
  Section,
  Code
} from "@/lib/articles/ui";

import { articleMetadata } from "./meta";
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
        headline: articleMetadata.title,
        description: articleMetadata.description,
        image: articleMetadata.coverImage,
        datePublished: articleMetadata.publishedAt.toISOString(),
        dateModified: articleMetadata.updatedAt.toISOString(),
        author: {
          '@type': 'Person',
          name: articleMetadata.author,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Type-First',
          logo: {
            '@type': 'ImageObject',
            url: 'https://type-first.com/logo.png',
          },
        },
        keywords: articleMetadata.tags.join(', '),
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
          src={articleMetadata.coverImage}
          alt={articleMetadata.title}
        />
      </Container>
    </Header>

    <Container>
      <ArticleHeader>
        <Heading level={1}>{articleContentData.metadata.title}</Heading>
        <ArticleMetadata publishedAt={articleMetadata.publishedAt} />
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
          tags={articleMetadata.tags} 
        />
      </Footer>
    </Container>
  </>
);

// Re-export metadata for compatibility
export { articleMetadata };
