# YML Modality for Multimodal Components

This document describes the YML modality implementation for the multimodal component system.

## Overview

The YML modality allows multimodal components to render as valid YML (YAML) strings, creating a serializable representation of the component tree structure. This is useful for:

- Content export and backup
- API responses that need structured data
- Configuration file generation
- Data analysis and processing
- Integration with systems that consume YML/YAML

## Features

### YML Primitives

The implementation provides several primitive components for building YML structures:

- **YMLString**: Renders string values with proper escaping
- **YMLNumber**: Renders numeric values
- **YMLBoolean**: Renders boolean values (true/false)
- **YMLNull**: Renders null values
- **YMLList**: Renders arrays/lists with proper indentation
- **YMLMap**: Renders objects/maps with key-value pairs

### Indentation Handling

All YML components accept an `indentLevel` prop that controls the nesting depth:

```typescript
type YMLProps = {
  indentLevel?: number;
}
```

The system uses 2-space indentation for each level.

### String Escaping

The YML implementation automatically handles string escaping for:

- Special characters (`:`, `#`, `|`, `>`, etc.)
- YAML reserved words (`true`, `false`, `null`, etc.)
- Strings that need quoting
- Multi-line content

## Supported Components

The following multimodal components have been updated to support YML rendering:

### Content Components
- **Article**: Renders as article structure with nested content
- **Section**: Renders as section object with content
- **Container**: Renders as container with nested elements
- **Heading**: Renders with level and text properties
- **Paragraph**: Renders with text content
- **Strong**: Renders as emphasized text object
- **Text**: Renders as inline text (falls back to string content)

### List Components
- **List**: Renders as unordered list structure
- **OrderedList**: Renders as ordered list with numbered items
- **ListItem**: Renders as list item content

### Interactive Components
- **Link**: Renders with text and href properties
- **Code**: Renders with language, filename, and content
- **CoverImage**: Renders with src and alt properties

## Usage Examples

### Basic Usage

```typescript
import { renderYML, Heading } from '@/lib/multimodal/v1';

// Render a heading as YML
const ymlOutput = renderYML(Heading, {
  level: 1,
  children: "My Title",
  indentLevel: 0
});

// Output:
// heading:
//   level: 1
//   text: "My Title"
```

### Complex Structure

```typescript
const articleYML = renderYML(Article, {
  children: [
    <Heading level={1} modality="yml">Advanced TypeScript</Heading>,
    <Paragraph modality="yml">This article explores patterns...</Paragraph>,
    <List modality="yml">
      <ListItem modality="yml">Generic Components</ListItem>
      <ListItem modality="yml">Conditional Types</ListItem>
    </List>
  ],
  indentLevel: 0
});
```

### Using YML Primitives Directly

```typescript
import { valueToYML } from '@/lib/multimodal/v1';

const data = {
  title: "My Article",
  tags: ["typescript", "react"],
  published: true,
  metadata: {
    author: "John Doe",
    date: "2024-01-15"
  }
};

const yml = valueToYML(data, 0);
console.log(yml);
```

Output:
```yml
title: My Article
tags:
  - typescript
  - react
published: true
metadata:
  author: John Doe
  date: 2024-01-15
```

## API Reference

### Core Functions

#### `renderYML<T>(Component, props): string`
Renders a multimodal component in YML mode.

#### `valueToYML(value, indentLevel): string`
Converts a JavaScript value to YML string representation.

#### `createIndent(level): string`
Creates indentation string for the given level.

#### `escapeYMLString(value): string`
Escapes a string value for safe YML output.

### YML Primitive Components

All primitives accept `modality: 'yml'` prop and return strings.

#### `YMLString({ value })`
#### `YMLNumber({ value })`
#### `YMLBoolean({ value })`
#### `YMLNull({})`
#### `YMLList({ items, indentLevel })`
#### `YMLMap({ entries, indentLevel })`

## Implementation Details

### Type System

The YML modality extends the existing multimodal type system:

```typescript
export type Modality = null | 'markdown' | 'yml';

export type YMLModalComponent<P extends object> = 
  (props: ModalProps<'yml'> & P) => string;
```

### Component Factory

Components support YML through the multimodal factory:

```typescript
export const MyComponent = multimodal<MyProps>({
  markdown: ({ children }) => `# ${children}`,
  yml: ({ children, indentLevel = 0 }) => {
    const indent = createIndent(indentLevel);
    return `${indent}component: ${escapeYMLString(String(children))}`;
  }
})(({ children }) => <div>{children}</div>);
```

### Indentation Propagation

The YML system automatically propagates indentation levels through the component tree:

1. Root components start with `indentLevel: 0`
2. Child components receive `indentLevel + 1`
3. Each level adds 2 spaces of indentation
4. Components handle their own indentation formatting

## Testing

Run the YML implementation test:

```bash
node lib/multimodal/v1/test-yml-simple.js
```

This test demonstrates:
- Basic YML conversion
- Complex nested structures
- Proper indentation
- String escaping
- All supported data types

## Integration

The YML modality integrates seamlessly with the existing multimodal system:

- All existing components continue to work unchanged
- New YML support is additive (optional)
- Components without YML implementations fall back to standard rendering
- Type safety is maintained throughout

## Future Enhancements

Potential improvements:
- Schema validation for generated YML
- Custom YML formatters for specific component types
- YML-to-component deserialization
- Integration with YAML processing pipelines
- Performance optimizations for large documents
