export const testPatternsSnippet 
  = /* ts */ `
// Test patterns and example frameworks
import { example_, test_, proof_, t_ } from '@type-first/typist';

// Basic example pattern
const stringTest = example_(() => {
  extends_<"hello", string>();
  return t_<string>();
});

// Named test pattern
const userTypeTest = test_('User type validation', () => {
  type User = { name: string; age: number };
  
  has_<"name", string>({ name: "John", age: 30 });
  has_<"age", number>({ name: "John", age: 30 });
  
  yes_<$Equal<User['name'], string>>();
  
  return t_<User>();
});

// Mathematical-style proof
const distributivityProof = proof_('Union distributivity', () => {
  type Distribute<T, U> = T extends any ? T | U : never;
  
  yes_<$Equal<
    Distribute<'a' | 'b', 'c'>,
    'a' | 'c' | 'b' | 'c'
  >>();
  
  return t_<boolean>();
});

// API contract testing
example_('API contract validation', () => {
  type CreateUserRequest = {
    name: string;
    email: string;
    age?: number;
  };
  
  type CreateUserResponse = {
    id: string;
    user: User;
    success: boolean;
  };
  
  // Validate request structure
  has_<"name", string>({ name: "John", email: "john@example.com" });
  has_<"email", string>({ name: "John", email: "john@example.com" });
  
  // Validate response structure
  extends_<CreateUserResponse, { id: string }>();
  extends_<CreateUserResponse, { success: boolean }>();
});

// Generic constraint testing
function createRepository<T extends { id: string }>() {
  return {
    save: (entity: T) => entity,
    findById: (id: string): T | null => null as any
  };
}

example_('Repository constraints', () => {
  type ValidEntity = { id: string; name: string };
  
  // Test valid entity
  extends_<ValidEntity, { id: string }>();
  
  // Test repository methods
  const repo = createRepository<ValidEntity>();
  extends_<Parameters<typeof repo.save>[0], ValidEntity>();
  extends_<ReturnType<typeof repo.findById>, ValidEntity | null>();
});
`