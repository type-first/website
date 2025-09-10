import React from "react";
import Link from "next/link";
import { ARTICLE_TAGS } from "@/lib/article-compiler/tags";
import ComparisonCounter from "@/components/ComparisonCounter";
import { Heading, Paragraph, Text, List, ListItem, Callout, Separator, useModality } from "@/lib/article-components";

export const articleMetadata = {
  title: "Designing AI-Driven User Interfaces in React",
  description: "Patterns for AI-first UX: suggestions, corrections, and confirmations without overwhelming users.",
  tags: [ARTICLE_TAGS.AI, ARTICLE_TAGS.REACT, "ui", "ux", "patterns"],
  publishedAt: new Date("2024-02-24T16:20:00Z"),
  updatedAt: new Date("2024-02-24T16:20:00Z"),
  seoTitle: "Designing AI-Driven User Interfaces in React",
  seoDescription: "Patterns for AI-first UX: suggestions, corrections, and confirmations without overwhelming users.",
  author: "Your Name",
  coverImage: "/images/covers/ai-driven-interfaces-react.png",
};

export async function generateMetadata() {
  return {
    title: `${articleMetadata.seoTitle || articleMetadata.title} | Our Blog`,
    description: articleMetadata.seoDescription || articleMetadata.description,
    openGraph: {
      title: articleMetadata.seoTitle || articleMetadata.title,
      description: articleMetadata.seoDescription || articleMetadata.description,
      type: 'article',
      publishedTime: articleMetadata.publishedAt?.toISOString(),
      modifiedTime: articleMetadata.updatedAt?.toISOString(),
      tags: articleMetadata.tags,
      images: articleMetadata.coverImage ? [articleMetadata.coverImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: articleMetadata.seoTitle || articleMetadata.title,
      description: articleMetadata.seoDescription || articleMetadata.description,
      images: articleMetadata.coverImage ? [articleMetadata.coverImage] : [],
    },
  };
}

export default function AiDrivenInterfacesReactPage() {
  const modality = useModality();
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: articleMetadata.title,
    description: articleMetadata.description,
    image: articleMetadata.coverImage,
    datePublished: articleMetadata.publishedAt?.toISOString(),
    dateModified: articleMetadata.updatedAt?.toISOString(),
    author: {
      '@type': 'Person',
      name: articleMetadata.author || 'Unknown Author',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Our Blog',
      logo: {
        '@type': 'ImageObject',
        url: 'https://yoursite.com/logo.png',
      },
    },
    keywords: articleMetadata.tags.join(', '),
  };

  return (
    <>
      {modality !== 'markdown' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      
      <Paragraph>
        Great AI UX treats the model as a <Text bold>collaborator</Text>. Focus on clarity, 
        reversible actions, and graceful failure states.
      </Paragraph>

      <Heading level={2}>Core Design Principles</Heading>
      
      <Paragraph>
        When building AI-driven interfaces, these principles ensure users maintain control 
        while benefiting from intelligent assistance:
      </Paragraph>

      <List>
        <ListItem>
          <Text bold>Inline suggestions with accept/edit:</Text> Present AI recommendations 
          directly in context with clear accept/reject actions
        </ListItem>
        <ListItem>
          <Text bold>Explanations on demand:</Text> Provide optional explanations for AI 
          decisions without cluttering the interface
        </ListItem>
        <ListItem>
          <Text bold>Optimistic updates with server confirmation:</Text> Update the UI 
          immediately while validating in the background
        </ListItem>
      </List>

      <Callout type="info" title="Pro Tip">
        Always provide undo functionality for AI-generated actions. Users need to feel 
        they can safely explore AI suggestions without fear of irreversible changes.
      </Callout>

      <Heading level={2}>Implementation Patterns</Heading>
      
      <Paragraph>
        Here are practical patterns for implementing these principles in React applications:
      </Paragraph>

      <Heading level={3}>Optimistic UI Updates</Heading>
      
      <Paragraph>
        The following component demonstrates <Text italic>optimistic UI patterns</Text> 
        for AI-driven interfaces. It updates immediately while confirming with the server:
      </Paragraph>

      {modality !== 'markdown' && (
        <ComparisonCounter 
          initialValue={42} 
          label="Interactive Demo" 
        />
      )}

      <Separator />

      <Heading level={3}>Progressive Disclosure</Heading>
      
      <Paragraph>
        Start with simple AI suggestions and reveal more complex options progressively. 
        This prevents cognitive overload while maintaining access to advanced features.
      </Paragraph>

      <Callout type="success" title="Best Practice">
        Use progressive disclosure to introduce AI features gradually. Start with basic 
        suggestions and introduce more advanced capabilities as users become comfortable.
      </Callout>

      <Heading level={2}>Conclusion</Heading>
      
      <Paragraph>
        Building AI-driven interfaces requires careful balance between automation and user 
        control. By following these patterns, you can create interfaces that feel both 
        intelligent and predictable.
      </Paragraph>
    </>
  );
}