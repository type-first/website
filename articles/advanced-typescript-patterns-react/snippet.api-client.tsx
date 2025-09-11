/**
 * Snippet: Type-Safe API Client
 * Complete type-safe API client implementation
 */

import React from "react";
import { Code, type MultiModalComponent, multimodal } from "@/lib/multimodal/v1";

// Raw snippet string for reuse
export const apiClientSnippet = `// Define your API structure
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
// await api['/users'].POST({ invalid: 'field' }); // Error: wrong body type`;

type ApiClientCodeProps = {
  filename?: string;
};

// Full code component for direct use in articles
export const ApiClientCode: MultiModalComponent<ApiClientCodeProps> = multimodal<ApiClientCodeProps>()(({ modality, filename }) => (
  <Code language="typescript" filename={filename || "lib/ApiClient.ts"} modality={modality}>
    {apiClientSnippet}
  </Code>
));
