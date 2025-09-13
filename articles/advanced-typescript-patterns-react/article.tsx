/**
 * Advanced TypeScript Patterns for React Applications
 * Main article component that combines all sections
 */

import React from "react";
import { Article } from "@/lib/multimodal/v1/article.mm.srv";
import { Header } from "@/lib/multimodal/v1/header.mm.srv";
import { Navigation } from "@/lib/multimodal/v1/navigation.mm.srv";
import { Link as SemanticLink } from "@/lib/multimodal/v1/link.mm.srv";
import { CoverImage } from "@/lib/multimodal/v1/cover-image.mm.srv";
import { ArticleHeader } from "@/lib/multimodal/v1/article-header.mm.srv";
import { ArticleMetadata } from "@/lib/multimodal/v1/article-metadata.mm.srv";
import { Heading } from "@/lib/multimodal/v1/heading.mm.srv";
import { Paragraph } from "@/lib/multimodal/v1/paragraph.mm.srv";
import { CodeExplore } from "@/lib/multimodal/v1/code-explore.mm.srv";
import { Footer } from "@/lib/multimodal/v1/footer.mm.srv";
import { Container } from "@/lib/multimodal/v1/container.mm.srv";
import { TagsList } from "@/lib/multimodal/v1/tags-list.mm.srv";
import { JsonLd } from "@/lib/multimodal/v1/json-dl.mm.srv";
import { type MultiModalComponent, multimodal } from "@/lib/multimodal/v1/multimodal-model";

import { articleMetadata } from "./meta";
import { SectionGenericComponents } from "./section.generic-components";
import { SectionConditionalTypes } from "./section.conditional-types";
import { SectionTypeSafeApis } from "./section.type-safe-apis";
import { SectionBestPractices } from "./section.best-practices";
import { ArticleFooter } from "./footer";

type ArticleProps = {
  // Article has no additional props beyond modality
};

/**
 * Advanced TypeScript Patterns for React Applications
 * A comprehensive guide to advanced TypeScript patterns for React development
 */
export const AdvancedTypescriptPatternsReactArticle: MultiModalComponent<ArticleProps> = multimodal<ArticleProps>()(({ modality }) => (
  <Article modality={modality}>
    {/* JSON-LD Structured Data */}
    <JsonLd 
      modality={modality}
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

    <Header modality={modality}>
      <Container modality={modality}>
        <Navigation modality={modality}>
          <SemanticLink href="/" modality={modality}>Home</SemanticLink>
          <SemanticLink href="/articles" modality={modality}>Articles</SemanticLink>
          <SemanticLink href="/community" modality={modality}>Community</SemanticLink>
        </Navigation>

        {/* Cover Image */}
        <CoverImage 
          src={articleMetadata.coverImage}
          alt={articleMetadata.title}
          modality={modality}
        />
      </Container>
    </Header>

    <Container modality={modality}>
      <ArticleHeader modality={modality}>
        <Heading level={1} modality={modality}>{articleMetadata.title}</Heading>
        <ArticleMetadata 
          publishedAt={articleMetadata.publishedAt}
          modality={modality}
        />
      </ArticleHeader>

      <Paragraph modality={modality}>
        TypeScript has revolutionized React development by providing static type checking and 
        enhanced developer experience. In this comprehensive guide, we'll explore advanced 
        TypeScript patterns that will elevate your React applications to new levels of type 
        safety and maintainability.
      </Paragraph>

      <CodeExplore 
        modality={modality}
        slug="starter"
        name="the Multi-file Starter"
        description="A minimal set of TypeScript files demonstrating basic functionality to start exploring with our editor."
      />

      <SectionGenericComponents modality={modality} />
      <SectionConditionalTypes modality={modality} />
      <SectionTypeSafeApis modality={modality} />
      <SectionBestPractices modality={modality} />
      <ArticleFooter modality={modality} />

      <Footer modality={modality}>
        <TagsList 
          label="Tags"
          tags={articleMetadata.tags} 
          modality={modality} 
        />
      </Footer>
    </Container>
  </Article>
));

// Re-export metadata for compatibility
export { articleMetadata };
