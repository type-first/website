import Link from "next/link";
import { ARTICLE_TAGS } from "@/lib/article-compiler/tags";
import { CodeBlock } from "@/components/CodeBlock";

export const articleMetadata = {
  title: "Building Interactive Components with Islands Architecture",
  description: "Explore how islands architecture enables optimal performance by combining server-rendered content with selective client-side hydration.",
  tags: ["islands", ARTICLE_TAGS.ARCHITECTURE, "performance", ARTICLE_TAGS.REACT, "ssr"],
  publishedAt: new Date("2024-01-20T14:30:00Z"),
  updatedAt: new Date("2024-01-20T14:30:00Z"),
  seoTitle: "Building Interactive Components with Islands Architecture",
  seoDescription: "Explore how islands architecture enables optimal performance by combining server-rendered content with selective client-side hydration.",
  author: "Your Name",
  coverImage: "/images/covers/interactive-components-islands-architecture.png",
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

export default function InteractiveComponentsIslandsArchitecturePage() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <article className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-12">
          <nav className="mb-6">
            <Link 
              href="/articles"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ← Back to articles
            </Link>
          </nav>

          {articleMetadata.coverImage && (
            <div className="w-full bg-gray-100 rounded-lg overflow-hidden mb-8" style={{ aspectRatio: '2.7/1' }}>
              <img 
                src={articleMetadata.coverImage}
                alt={articleMetadata.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {articleMetadata.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/articles?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {articleMetadata.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              {articleMetadata.description}
            </p>
            
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
          </div>
        </header>

        <div className="mb-12">
          <p className="text-gray-700 leading-relaxed mb-6">
            Islands architecture is a paradigm that allows you to build fast, interactive web applications by strategically hydrating only the parts of your page that need interactivity.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">The Core Concept</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Think of your page as mostly static HTML with small "islands" of interactivity. These islands are hydrated on the client, while the rest of the page remains as lightweight server-rendered HTML.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Benefits of Islands Architecture</h2>

          <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Performance</h3>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700 ml-4">
            <li><strong className="text-gray-900">Reduced JavaScript</strong>: Only interactive components are hydrated</li>
            <li><strong className="text-gray-900">Faster Initial Load</strong>: Most content is static HTML</li>
            <li><strong className="text-gray-900">Progressive Enhancement</strong>: Works even with JavaScript disabled</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Developer Experience</h3>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700 ml-4">
            <li><strong className="text-gray-900">Component Isolation</strong>: Each island is self-contained</li>
            <li><strong className="text-gray-900">Easier Debugging</strong>: Clear separation between static and dynamic content</li>
            <li><strong className="text-gray-900">Selective Optimization</strong>: Focus performance efforts where needed</li>
          </ul>

          <CodeBlock
            language="tsx"
            code={`'use client';

import { useState } from 'react';

export function MyIsland({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  
  return (
    <div className="p-4 border rounded-lg">
      <h3>Interactive Island</h3>
      <button 
        onClick={() => setData({ ...data, count: data.count + 1 })}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Count: {data.count}
      </button>
    </div>
  );
}`}
          />

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Implementation Strategies</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            1. <strong className="text-gray-900">Start Static</strong>: Begin with server-rendered HTML
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            2. <strong className="text-gray-900">Identify Interactions</strong>: Mark components that need client-side behavior
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            3. <strong className="text-gray-900">Progressive Enhancement</strong>: Add interactivity where needed
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            4. <strong className="text-gray-900">Optimize Loading</strong>: Use dynamic imports and code splitting
          </p>

        </div>

        <footer className="border-t border-gray-200 pt-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-sm text-gray-500">Tags:</span>
            {articleMetadata.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/articles?tag=${encodeURIComponent(tag)}`}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              href="/articles"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Read more articles
            </Link>
          </div>
        </footer>
      </article>
    </>
  );
}