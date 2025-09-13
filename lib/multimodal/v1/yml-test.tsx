/**
 * YML Modality Test
 * Test and demonstration of the YML modality for multimodal components
 */

import React from 'react';
import { 
  Article, 
  Heading, 
  Paragraph, 
  List, 
  ListItem, 
  Link, 
  Strong, 
  Text,
  Code,
  Section,
  Container,
  renderYML,
  type MultiModalComponent,
  multimodal
} from './index';

type TestArticleProps = {};

// Example multimodal component tree
export const TestArticle: MultiModalComponent<TestArticleProps> = multimodal<TestArticleProps>()(({ modality }) => (
  <Article modality={modality}>
    <Container modality={modality}>
      <Heading level={1} modality={modality}>Advanced TypeScript Patterns</Heading>
      <Paragraph modality={modality}>
        This article explores <Strong modality={modality}>advanced TypeScript patterns</Strong> that can help you build more
        <Text modality={modality}> robust applications</Text>.
      </Paragraph>
    </Container>
    
    <Section modality={modality}>
      <Heading level={2} modality={modality}>Key Topics</Heading>
      <List modality={modality}>
        <ListItem modality={modality}>Generic Components</ListItem>
        <ListItem modality={modality}>Conditional Types</ListItem>
        <ListItem modality={modality}>Type-Safe APIs</ListItem>
      </List>
      
      <Paragraph modality={modality}>
        For more details, check out our <Link href="/docs" modality={modality}>documentation</Link>.
      </Paragraph>
      
      <Code language="typescript" filename="example.ts" modality={modality}>
{`interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  return fetch(\`/api/users/\${id}\`).then(res => res.json());
}`}
      </Code>
    </Section>
  </Article>
));

// Test function to render the component as YML
export function testYMLRendering() {
  try {
    const ymlOutput = renderYML(TestArticle, { indentLevel: 0 });
    console.log('YML Output:');
    console.log(ymlOutput);
    return ymlOutput;
  } catch (error) {
    console.error('Error rendering YML:', error);
    return null;
  }
}

// Also test regular and markdown rendering for comparison
export function testAllRenderings() {
  console.log('=== YML Rendering ===');
  const ymlOutput = testYMLRendering();
  
  console.log('\n=== Standard Rendering ===');
  // Standard rendering would be done server-side in actual usage
  console.log('<TestArticle modality={null} />');
  
  console.log('\n=== Markdown Rendering ===');
  // This would need renderMarkdown utility
  console.log('Would render as markdown...');
  
  return {
    yml: ymlOutput,
    standard: 'React Component',
    markdown: 'Markdown String'
  };
}

// Export for easy import
export { testYMLRendering as default };
