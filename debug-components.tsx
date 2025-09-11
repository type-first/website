import React from 'react';
import { renderToString } from 'react-dom/server';
import { 
  CoverImage, 
  ArticleMetadata, 
  Heading, 
  ArticleHeader
} from './lib/multimodal/v1';
import { renderToMarkdown } from './lib/multimodal/v1';

console.log('Testing components that might cause [object Object]...');

// Test CoverImage
const coverImage = <CoverImage modality="markdown" src="/test.jpg" alt="Test" />;
console.log('CoverImage raw:', renderToString(coverImage));
console.log('CoverImage clean:', renderToMarkdown(coverImage));

// Test ArticleMetadata
const metadata = <ArticleMetadata modality="markdown" publishedAt={new Date("2024-12-15")} />;
console.log('ArticleMetadata raw:', renderToString(metadata));
console.log('ArticleMetadata clean:', renderToMarkdown(metadata));

// Test Heading
const heading = <Heading modality="markdown" level={1}>Test Title</Heading>;
console.log('Heading raw:', renderToString(heading));
console.log('Heading clean:', renderToMarkdown(heading));

// Test combination that appears in the article
const articleHeader = (
  <ArticleHeader modality="markdown">
    <Heading modality="markdown" level={1}>Test Title</Heading>
    <ArticleMetadata 
      modality="markdown"
      publishedAt={new Date("2024-12-15")}
      updatedAt={new Date("2024-12-15")}
    />
  </ArticleHeader>
);
console.log('ArticleHeader raw:', renderToString(articleHeader));
console.log('ArticleHeader clean:', renderToMarkdown(articleHeader));
