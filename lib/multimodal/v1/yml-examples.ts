/**
 * YML Modality Example
 * Simple demonstration of YML rendering for multimodal components
 */

import { 
  YMLString, 
  YMLNumber, 
  YMLBoolean, 
  YMLNull, 
  YMLList, 
  YMLMap, 
  valueToYML,
  createIndent,
  escapeYMLString 
} from './yml-primitives';

// Example: Render a simple article structure as YML
export function createSampleArticleYML(): string {
  const articleData = {
    title: "Advanced TypeScript Patterns",
    author: "John Doe",
    publishedAt: "2024-01-15",
    tags: ["typescript", "react", "patterns"],
    content: {
      sections: [
        {
          type: "heading",
          level: 1,
          text: "Introduction"
        },
        {
          type: "paragraph", 
          text: "This article explores advanced TypeScript patterns that can help you build more robust applications."
        },
        {
          type: "list",
          items: [
            "Generic Components",
            "Conditional Types", 
            "Type-Safe APIs"
          ]
        },
        {
          type: "code",
          language: "typescript",
          filename: "example.ts",
          content: `interface User {
  id: string;
  name: string;
  email: string;
}`
        }
      ]
    },
    metadata: {
      readingTime: 15,
      wordCount: 1200,
      published: true
    }
  };

  // Convert to YML using our primitives
  return valueToYML(articleData, 0);
}

// Example: Test individual YML primitives
export function testYMLPrimitives(): string {
  const examples = [];
  
  // String primitive
  examples.push("# String Examples");
  examples.push(`simple_string: ${YMLString({ value: "Hello World", modality: 'yml' })}`);
  examples.push(`string_with_quotes: ${YMLString({ value: 'He said "Hello"', modality: 'yml' })}`);
  examples.push(`string_with_special_chars: ${YMLString({ value: "Key: Value & More", modality: 'yml' })}`);
  
  examples.push("");
  examples.push("# Number Examples");
  examples.push(`integer: ${YMLNumber({ value: 42, modality: 'yml' })}`);
  examples.push(`float: ${YMLNumber({ value: 3.14159, modality: 'yml' })}`);
  
  examples.push("");
  examples.push("# Boolean Examples");
  examples.push(`is_published: ${YMLBoolean({ value: true, modality: 'yml' })}`);
  examples.push(`is_draft: ${YMLBoolean({ value: false, modality: 'yml' })}`);
  
  examples.push("");
  examples.push("# Null Example");
  examples.push(`deleted_at: ${YMLNull({ modality: 'yml' })}`);
  
  examples.push("");
  examples.push("# List Example");
  const listItems = [
    { value: "TypeScript", type: "string" as const },
    { value: "React", type: "string" as const },
    { value: "Node.js", type: "string" as const }
  ];
  examples.push(YMLList({ items: listItems, modality: 'yml', indentLevel: 0 }));
  
  examples.push("");
  examples.push("# Map Example");
  const mapEntries = [
    { key: "name", value: "Advanced TypeScript", type: "string" as const },
    { key: "version", value: "1.0", type: "string" as const },
    { key: "pages", value: 45, type: "number" as const },
    { key: "published", value: true, type: "boolean" as const }
  ];
  examples.push(YMLMap({ entries: mapEntries, modality: 'yml', indentLevel: 0 }));
  
  return examples.join('\n');
}

// Example: Simple component-like YML structure
export function createComponentStructureYML(): string {
  const indent0 = createIndent(0);
  const indent1 = createIndent(1);
  const indent2 = createIndent(2);
  
  return `${indent0}component:
${indent1}type: "article"
${indent1}props:
${indent2}title: ${escapeYMLString("Advanced TypeScript Patterns")}
${indent2}author: ${escapeYMLString("John Doe")}
${indent1}children:
${indent2}- type: "heading"
${indent2}  level: 1
${indent2}  text: ${escapeYMLString("Introduction")}
${indent2}- type: "paragraph"
${indent2}  text: ${escapeYMLString("This article explores advanced patterns.")}
${indent2}- type: "list"
${indent2}  items:
${indent2}    - ${escapeYMLString("Generic Components")}
${indent2}    - ${escapeYMLString("Conditional Types")}
${indent2}    - ${escapeYMLString("Type-Safe APIs")}`;
}

// Run all examples
export function runAllYMLExamples(): void {
  console.log("=== YML Primitives Test ===");
  console.log(testYMLPrimitives());
  
  console.log("\n=== Sample Article YML ===");
  console.log(createSampleArticleYML());
  
  console.log("\n=== Component Structure YML ===");
  console.log(createComponentStructureYML());
}

// Export the main function
export default runAllYMLExamples;
