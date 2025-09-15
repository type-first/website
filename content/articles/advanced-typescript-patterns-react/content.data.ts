/**
 * Advanced TypeScript Patterns for React Applications - Content Data
 * Structured content data for the article
 */

export const articleContentData = {
  // Article metadata (already exists in meta.tsx but included for completeness)
  metadata: {
    title: "Advanced TypeScript Patterns for React Applications",
    description: "Master advanced TypeScript patterns including generic components, conditional types, and type-safe APIs for robust React applications.",
    tags: ["patterns", "type-safety", "advanced"] as const,
    publishedAt: "2024-12-15",
    updatedAt: "2024-12-15",
    author: "Type-First Team",
    readingTime: "12 min read",
    coverImage: "/images/covers/advanced-typescript-patterns-react.png",
  },

  // Navigation links
  navigation: [
    { href: "/", label: "Home" },
    { href: "/articles", label: "Articles" },
    { href: "/community", label: "Community" },
  ] as const,

  // Introduction paragraph
  introduction: "TypeScript has revolutionized React development by providing static type checking and enhanced developer experience. In this comprehensive guide, we'll explore advanced TypeScript patterns that will elevate your React applications to new levels of type safety and maintainability.",

  // Code explorer section
  codeExplore: {
    slug: "starter",
    name: "the Multi-file Starter",
    description: "A minimal set of TypeScript files demonstrating basic functionality to start exploring with our editor.",
  },

  // Article sections
  sections: [
    {
      id: "genericComponents",
      title: "Generic Components",
      subtitle: "Basic Generic Component Pattern",
      content: "Generic components are one of the most powerful patterns in TypeScript React development. They allow you to create reusable components that work with different data types while maintaining type safety.",
      codeSnippet: {
        language: "typescript",
        filename: "components/GenericList.tsx",
        code: `interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor ? keyExtractor(item, index) : index}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

// Usage example
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

<List 
  items={users}
  keyExtractor={(user) => user.id}
  renderItem={(user) => <span>{user.name}</span>}
/>`,
      },
    },

    {
      id: "conditionalTypes",
      title: "Conditional Types in Components",
      subtitle: "Advanced Conditional Type Example",
      content: "Conditional types allow you to create components that adapt their behavior based on their props, enabling powerful type-driven patterns.",
      codeSnippet: {
        language: "typescript",
        filename: "components/ConditionalButton.tsx",
        code: /* tsx */`
type ButtonVariant = 'button' | 'link' | 'submit';

type ButtonProps<T extends ButtonVariant> = {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
} & (T extends 'link' 
  ? { 
      variant: 'link'; 
      href: string; 
      onClick?: never;
      type?: never;
    }
  : T extends 'submit'
  ? {
      variant: 'submit';
      type: 'submit';
      onClick?: () => void;
      href?: never;
    }
  : {
      variant: 'button';
      onClick: () => void;
      href?: never;
      type?: never;
    }
);

function Button<T extends ButtonVariant>(props: ButtonProps<T>) {
  const baseClasses = 'btn' + props.className || '';
  
  if (props.variant === 'link') {
    return (
      <a 
        href={props.href} 
        className={baseClasses}
        aria-disabled={props.disabled}
      >
        {props.children}
      </a>
    );
  }
  
  return (
    <button
      type={props.variant === 'submit' ? 'submit' : 'button'}
      onClick={props.onClick}
      disabled={props.disabled}
      className={baseClasses}
    >
      {props.children}
    </button>
  );
}

// Usage examples - all type-safe!
<Button variant="button" onClick={() => alert('clicked')}>
  Click me
</Button>

<Button variant="link" href="/about">
  Go to About
</Button>

<Button variant="submit">
  Submit Form
</Button>`,
      },
    },

    {
      id: "typeSafeApis",
      title: "Type-Safe APIs",
      subtitle: "API Client Pattern",
      content: "Creating type-safe APIs involves using TypeScript's type system to ensure that your API calls are correct at compile time.",
      codeSnippet: {
        language: "typescript",
        filename: "lib/ApiClient.ts",
        code: `// Define your API structure
interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
}

// Define endpoints and their methods
interface ApiEndpoints {
  '/users': { 
    GET: User[]; 
    POST: CreateUserRequest; 
  };
  '/users/:id': { 
    GET: User; 
    PUT: UpdateUserRequest; 
    DELETE: void; 
  };
  '/users/:id/avatar': {
    POST: FormData;
    GET: { url: string };
  };
}

// Extract path parameters from endpoint strings
type ExtractParams<T extends string> = 
  T extends \`\${infer Start}:\${infer Param}/\${infer Rest}\`
    ? { [K in Param]: string } & ExtractParams<\`\${Start}\${Rest}\`>
    : T extends \`\${infer Start}:\${infer Param}\`
    ? { [K in Param]: string }
    : {};

// Create the type-safe API client type
type ApiClient = {
  [K in keyof ApiEndpoints]: {
    [M in keyof ApiEndpoints[K]]: ExtractParams<K> extends Record<never, never>
      ? M extends 'GET' | 'DELETE'
        ? () => Promise<ApiEndpoints[K][M]>
        : (body: ApiEndpoints[K][M]) => Promise<void>
      : M extends 'GET' | 'DELETE'
        ? (params: ExtractParams<K>) => Promise<ApiEndpoints[K][M]>
        : (params: ExtractParams<K>, body: ApiEndpoints[K][M]) => Promise<void>
  }
};

// Implementation
class TypeSafeApiClient implements ApiClient {
  constructor(private baseUrl: string) {}

  '/users' = {
    GET: async (): Promise<User[]> => {
      const response = await fetch(\`\${this.baseUrl}/users\`);
      return response.json();
    },
    POST: async (body: CreateUserRequest): Promise<void> => {
      await fetch(\`\${this.baseUrl}/users\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    }
  };

  '/users/:id' = {
    GET: async (params: { id: string }): Promise<User> => {
      const response = await fetch(\`\${this.baseUrl}/users/\${params.id}\`);
      return response.json();
    },
    PUT: async (params: { id: string }, body: UpdateUserRequest): Promise<void> => {
      await fetch(\`\${this.baseUrl}/users/\${params.id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    },
    DELETE: async (params: { id: string }): Promise<void> => {
      await fetch(\`\${this.baseUrl}/users/\${params.id}\`, {
        method: 'DELETE'
      });
    }
  };

  '/users/:id/avatar' = {
    GET: async (params: { id: string }): Promise<{ url: string }> => {
      const response = await fetch(\`\${this.baseUrl}/users/\${params.id}/avatar\`);
      return response.json();
    },
    POST: async (params: { id: string }, body: FormData): Promise<void> => {
      await fetch(\`\${this.baseUrl}/users/\${params.id}/avatar\`, {
        method: 'POST',
        body
      });
    }
  };
}

// Usage - all type-safe!
const api = new TypeSafeApiClient('https://api.example.com');

// ✅ Type-safe calls
const users = await api['/users'].GET();
await api['/users'].POST({ name: 'Alice', email: 'alice@example.com' });
const user = await api['/users/:id'].GET({ id: '123' });
await api['/users/:id'].PUT({ id: '123' }, { name: 'Alice Smith' });

// ❌ TypeScript will catch these errors:
// await api['/users'].GET({ id: '123' }); // Error: GET doesn't take params
// await api['/users/:id'].GET(); // Error: missing required params
// await api['/users'].POST({ invalid: 'field' }); // Error: wrong body type`,
      },
    },

    {
      id: "bestPractices", 
      title: "Best Practices",
      content: "Here are the essential best practices for advanced TypeScript React development:",
      practices: [
        {
          title: "Use strict TypeScript configuration",
          description: "Enable all strict type checking options",
        },
        {
          title: "Leverage type inference",
          description: "Let TypeScript infer types when possible",
        },
        {
          title: "Create reusable type utilities",
          description: "Build a library of common type patterns",
        },
        {
          title: "Use branded types",
          description: "Create distinct types for similar data structures",
        },
        {
          title: "Implement proper error boundaries",
          description: "Handle errors at the type level",
        },
      ],
    },
  ],

  // Footer content
  footer: {
    title: "Conclusion",
    content: "Advanced TypeScript patterns provide the foundation for building robust, maintainable React applications. By mastering these patterns, you'll create code that is not only type-safe but also self-documenting and easier to refactor.",
  },

  // JSON-LD structured data
  jsonLd: {
    '@type': 'Article' as const,
    siteName: 'Type-First',
    organization: {
      '@type': 'Organization' as const,
      name: 'Type-First',
      logo: {
        '@type': 'ImageObject' as const,
        url: 'https://type-first.com/logo.png',
      },
    },
  },
} as const;
