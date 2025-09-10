import React from "react";
import Link from "next/link";
import { ARTICLE_TAGS } from "@/lib/article-compiler/tags";
import { Text, List, ListItem, Callout, Separator, Code, InlineCode, useModality, Section, Container, Footer } from "@/lib/article-components";
import { JsonLdComponents } from "@/lib/multimodal/v1/json-dl.mm.srv";
import { Article } from "@/lib/multimodal/v1/article.mm.srv";
import { Header } from "@/lib/multimodal/v1/header.mm.srv";
import { Navigation } from "@/lib/multimodal/v1/navigation.mm.srv";
import { Link as SemanticLink } from "@/lib/multimodal/v1/link.mm.srv";
import { CoverImage } from "@/lib/multimodal/v1/cover-image.mm.srv";
import { Tags } from "@/lib/multimodal/v1/tags.mm.srv";
import { ArticleHeader } from "@/lib/multimodal/v1/article-header.mm.srv";
import { Heading } from "@/lib/multimodal/v1/heading.mm.srv";
import { Paragraph } from "@/lib/multimodal/v1/paragraph.mm.srv";

export const articleMetadata = {
  title: "Advanced TypeScript Patterns for React Applications",
  description: "Master advanced TypeScript patterns including generic components, conditional types, and type-safe APIs for robust React applications.",
  tags: [ARTICLE_TAGS.TYPESCRIPT, ARTICLE_TAGS.REACT, "patterns", "type-safety", "advanced"],
  publishedAt: new Date("2024-01-25T09:15:00Z"),
  updatedAt: new Date("2024-01-25T09:15:00Z"),
  seoTitle: "Advanced TypeScript Patterns for React Applications",
  seoDescription: "Master advanced TypeScript patterns including generic components, conditional types, and type-safe APIs for robust React applications.",
  author: "Your Name",
  coverImage: "/images/covers/advanced-typescript-patterns-react.png",
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

export default function AdvancedTypescriptPatternsReactPage() {
  const modality = useModality();

  return (
    <>
      <JsonLdComponents.Article 
        metadata={articleMetadata}
        url={`https://yoursite.com/articles/advanced-typescript-patterns-react`}
        siteName="Our Blog"
        siteUrl="https://yoursite.com"
        logoUrl="https://yoursite.com/logo.png"
        modality={modality === 'markdown' ? 'markdown' : null}
      />
      <JsonLdComponents.Breadcrumbs
        breadcrumbs={[
          { name: "Home", url: "https://yoursite.com" },
          { name: "Articles", url: "https://yoursite.com/articles" },
          { name: articleMetadata.title, url: "https://yoursite.com/articles/advanced-typescript-patterns-react" }
        ]}
        modality={modality === 'markdown' ? 'markdown' : null}
      />
      <Article modality={modality === 'markdown' ? 'markdown' : null}>
        <Header modality={modality === 'markdown' ? 'markdown' : null}>
          <Navigation modality={modality === 'markdown' ? 'markdown' : null}>
            <SemanticLink modality={modality === 'markdown' ? 'markdown' : null} href="/articles">
              ← Back to articles
            </SemanticLink>
          </Navigation>

          <CoverImage
            modality={modality === 'markdown' ? 'markdown' : null}
            src={articleMetadata.coverImage}
            alt={articleMetadata.title}
          />

          <ArticleHeader modality={modality === 'markdown' ? 'markdown' : null}>
            <Tags 
              modality={modality === 'markdown' ? 'markdown' : null}
              tags={articleMetadata.tags}
            />
            
            <Heading modality={modality === 'markdown' ? 'markdown' : null} level={1}>
              {articleMetadata.title}
            </Heading>
            
            <Paragraph modality={modality === 'markdown' ? 'markdown' : null}>
              {articleMetadata.description}
            </Paragraph>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <time dateTime={articleMetadata.publishedAt.toISOString()}>
                Published {articleMetadata.publishedAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              
              {articleMetadata.updatedAt && articleMetadata.updatedAt > articleMetadata.publishedAt && (
                <span>
                  • Updated {articleMetadata.updatedAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>
          </ArticleHeader>
        </Header>

        <Section>
          <Paragraph modality={modality === 'markdown' ? 'markdown' : null}>
            TypeScript provides powerful type system features that can make your React applications more robust, maintainable, and developer-friendly. Let's explore some advanced patterns.
          </Paragraph>

          <Heading modality={modality === 'markdown' ? 'markdown' : null} level={2}>Generic Components</Heading>

          <Paragraph modality={modality === 'markdown' ? 'markdown' : null}>
            Generic components allow you to create reusable components that work with different data types while maintaining type safety.
          </Paragraph>

          <Code language="tsx">
{`interface DataTableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T;
    label: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
  }>;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick
}: DataTableProps<T>) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={String(col.key)} className="border p-2">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr 
            key={index} 
            onClick={() => onRowClick?.(row)}
            className="hover:bg-gray-50 cursor-pointer"
          >
            {columns.map(col => (
              <td key={String(col.key)} className="border p-2">
                {col.render ? col.render(row[col.key], row) : String(row[col.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}`}
          </Code>

          <Heading modality={modality === 'markdown' ? 'markdown' : null} level={2}>Conditional Types and Utility Types</Heading>

          <Paragraph modality={modality === 'markdown' ? 'markdown' : null}>
            Conditional types allow you to create types that change based on conditions, enabling powerful type transformations.
          </Paragraph>

          <Code language="ts">
{`// API Response wrapper
type ApiResponse<T> = {
  data: T;
  success: true;
  error: null;
} | {
  data: null;
  success: false;
  error: string;
};

// Extract success data type
type SuccessData<T> = T extends ApiResponse<infer U> 
  ? U 
  : never;

// Form field types
type FormField<T> = {
  value: T;
  error?: string;
  touched: boolean;
};

type FormState<T> = {
  [K in keyof T]: FormField<T[K]>;
};

// Usage example
interface LoginForm {
  email: string;
  password: string;
}

type LoginFormState = FormState<LoginForm>;
// Result: {
//   email: FormField<string>;
//   password: FormField<string>;
// }`}
          </Code>

        </Section>

        <Footer>
          <Container>
            <Text>Tags:</Text>
            {articleMetadata.tags.map((tag: string) => (
              <SemanticLink
                key={tag}
                modality={modality === 'markdown' ? 'markdown' : null}
                href={`/articles?tag=${encodeURIComponent(tag)}`}
              >
                {tag}
              </SemanticLink>
            ))}
          </Container>
          
          <Container>
            <SemanticLink modality={modality === 'markdown' ? 'markdown' : null} href="/articles">
              ← Read more articles
            </SemanticLink>
          </Container>
        </Footer>
      </Article>
    </>
  );
}