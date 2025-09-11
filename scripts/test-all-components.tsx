/**
 * Test each multimodal component individually
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  Article,
  Header,
  ArticleHeader,
  ArticleMetadata,
  Navigation,
  Link,
  CoverImage,
  Tags,
  TagsList,
  Heading,
  Paragraph,
  Section,
  Code,
  Footer,
  Container,
  Text,
  JsonLd,
  JsonLdComponents
} from '../lib/multimodal/v1';

console.log('Testing each multimodal component...\n');

const testComponent = (name: string, component: React.ReactElement) => {
  try {
    const result = renderToString(component);
    console.log(`✅ ${name}: ${result.length} chars - ${result.substring(0, 100)}...`);
  } catch (error) {
    console.error(`❌ ${name}: ${error}`);
  }
};

// Test each component in standard mode
console.log('=== STANDARD MODE ===');
testComponent('Article', <Article modality={null}>Content</Article>);
testComponent('Header', <Header modality={null}>Header content</Header>);
testComponent('ArticleHeader', <ArticleHeader modality={null}>Article header</ArticleHeader>);
testComponent('ArticleMetadata', <ArticleMetadata modality={null} publishedAt={new Date()} />);
testComponent('Navigation', <Navigation modality={null}>Nav content</Navigation>);
testComponent('Link', <Link modality={null} href="/test">Link text</Link>);
testComponent('CoverImage', <CoverImage modality={null} src="/test.jpg" alt="Test" />);
testComponent('Tags', <Tags modality={null} tags={['tag1', 'tag2']} />);
testComponent('TagsList', <TagsList modality={null} label="Tags:" tags={['tag1', 'tag2']} />);
testComponent('Heading', <Heading modality={null} level={1}>Test Heading</Heading>);
testComponent('Paragraph', <Paragraph modality={null}>Test paragraph</Paragraph>);
testComponent('Section', <Section modality={null}>Section content</Section>);
testComponent('Code', <Code modality={null} language="js">console.log('test');</Code>);
testComponent('Footer', <Footer modality={null}>Footer content</Footer>);
testComponent('Container', <Container modality={null}>Container content</Container>);
testComponent('Text', <Text modality={null}>Text content</Text>);
testComponent('JsonLd', <JsonLd modality={null} data={{ "@type": "Thing" }} />);

console.log('\n=== MARKDOWN MODE ===');
testComponent('Article', <Article modality="markdown">Content</Article>);
testComponent('Header', <Header modality="markdown">Header content</Header>);
testComponent('ArticleHeader', <ArticleHeader modality="markdown">Article header</ArticleHeader>);
testComponent('ArticleMetadata', <ArticleMetadata modality="markdown" publishedAt={new Date()} />);
testComponent('Navigation', <Navigation modality="markdown">Nav content</Navigation>);
testComponent('Link', <Link modality="markdown" href="/test">Link text</Link>);
testComponent('CoverImage', <CoverImage modality="markdown" src="/test.jpg" alt="Test" />);
testComponent('Tags', <Tags modality="markdown" tags={['tag1', 'tag2']} />);
testComponent('TagsList', <TagsList modality="markdown" label="Tags:" tags={['tag1', 'tag2']} />);
testComponent('Heading', <Heading modality="markdown" level={1}>Test Heading</Heading>);
testComponent('Paragraph', <Paragraph modality="markdown">Test paragraph</Paragraph>);
testComponent('Section', <Section modality="markdown">Section content</Section>);
testComponent('Code', <Code modality="markdown" language="js">console.log('test');</Code>);
testComponent('Footer', <Footer modality="markdown">Footer content</Footer>);
testComponent('Container', <Container modality="markdown">Container content</Container>);
testComponent('Text', <Text modality="markdown">Text content</Text>);
testComponent('JsonLd', <JsonLd modality="markdown" data={{ "@type": "Thing" }} />);

console.log('\nTest completed!');
