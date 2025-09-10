import { ModalityProvider, Heading, Paragraph, Text, List, ListItem, Code, InlineCode, Link, BlockQuote } from '@/lib/article-components';

export const metadata = {
  title: 'Introduction to TypeScript Generics',
  description: 'A comprehensive guide to understanding and using TypeScript generics',
  slug: 'typescript-generics-guide',
  publishedAt: '2024-01-15',
  updatedAt: '2024-01-15',
  tags: ['typescript', 'generics', 'programming'],
  readingTime: 8
};

export default function Article() {
  return (
    <article>
      <Heading level={1}>Introduction to TypeScript Generics</Heading>
      
      <Paragraph>
        TypeScript generics are one of the most powerful features of the language, allowing you to write 
        <Text bold> reusable and type-safe code</Text>. In this guide, we'll explore how generics work 
        and why they're essential for modern TypeScript development.
      </Paragraph>

      <Heading level={2}>What Are Generics?</Heading>
      
      <Paragraph>
        Generics provide a way to make components work with any data type and not restrict to one data type. 
        They allow you to create <Text italic>flexible</Text> and <Text italic>reusable</Text> functions, 
        classes, and interfaces.
      </Paragraph>

      <BlockQuote author="Anders Hejlsberg" source="TypeScript Documentation">
        Generics are the heart of what makes TypeScript so powerful for large-scale applications.
      </BlockQuote>

      <Heading level={2}>Basic Generic Function</Heading>
      
      <Paragraph>
        Let's start with a simple example. Here's how you can create a generic function using the 
        <InlineCode>T</InlineCode> type parameter:
      </Paragraph>

      <Code lang="typescript" filename="identity.ts">
{`function identity<T>(arg: T): T {
  return arg;
}

// Usage examples
const numberResult = identity<number>(42);
const stringResult = identity<string>("Hello TypeScript");
const boolResult = identity(true); // Type inference`}
      </Code>

      <Paragraph>
        The <InlineCode>T</InlineCode> is a type variable that represents any type. When you call the function, 
        TypeScript can either infer the type from the argument or you can explicitly specify it.
      </Paragraph>

      <Heading level={2}>Generic Constraints</Heading>
      
      <Paragraph>
        Sometimes you want to constrain the types that can be used with generics. You can do this using the 
        <InlineCode>extends</InlineCode> keyword:
      </Paragraph>

      <Code lang="typescript">
{`interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // Now we know it has a .length property
  return arg;
}`}
      </Code>

      <Heading level={2}>Common Use Cases</Heading>
      
      <Paragraph>Here are some common scenarios where generics shine:</Paragraph>

      <List>
        <ListItem>
          <Text bold>API Response Types:</Text> Creating type-safe wrappers for API responses
        </ListItem>
        <ListItem>
          <Text bold>Data Structures:</Text> Building reusable collections like arrays, maps, and sets
        </ListItem>
        <ListItem>
          <Text bold>Utility Functions:</Text> Creating helper functions that work with multiple types
        </ListItem>
        <ListItem>
          <Text bold>React Components:</Text> Building flexible component props interfaces
        </ListItem>
      </List>

      <Heading level={2}>Advanced Example: Generic Repository</Heading>
      
      <Paragraph>
        Here's a more complex example showing how you might use generics to create a type-safe repository pattern:
      </Paragraph>

      <Code lang="typescript" filename="repository.ts">
{`interface Entity {
  id: string;
}

class Repository<T extends Entity> {
  private items: T[] = [];

  findById(id: string): T | undefined {
    return this.items.find(item => item.id === id);
  }

  save(item: T): void {
    const existingIndex = this.items.findIndex(i => i.id === item.id);
    if (existingIndex >= 0) {
      this.items[existingIndex] = item;
    } else {
      this.items.push(item);
    }
  }

  findAll(): T[] {
    return [...this.items];
  }
}

// Usage
interface User extends Entity {
  name: string;
  email: string;
}

const userRepo = new Repository<User>();
userRepo.save({ id: "1", name: "John", email: "john@example.com" });`}
      </Code>

      <Heading level={2}>Best Practices</Heading>
      
      <Paragraph>When working with generics, keep these best practices in mind:</Paragraph>

      <List>
        <ListItem>Use descriptive names for type parameters beyond just <InlineCode>T</InlineCode></ListItem>
        <ListItem>Apply constraints when you need specific properties or methods</ListItem>
        <ListItem>Leverage type inference when possible to reduce verbosity</ListItem>
        <ListItem>Consider using utility types like <InlineCode>Partial&lt;T&gt;</InlineCode> and <InlineCode>Pick&lt;T, K&gt;</InlineCode></ListItem>
      </List>

      <Heading level={2}>Conclusion</Heading>
      
      <Paragraph>
        Generics are essential for writing maintainable TypeScript code. They provide type safety while 
        maintaining flexibility, making your code more robust and easier to refactor. Start with simple 
        generic functions and gradually work your way up to more complex patterns.
      </Paragraph>

      <Paragraph>
        For more advanced topics, check out the 
        <Link href="https://www.typescriptlang.org/docs/handbook/2/generics.html">
          official TypeScript documentation
        </Link> on generics.
      </Paragraph>
    </article>
  );
}
