# Testing Strategy & Implementation

**Comprehensive testing framework for ensuring code quality, reliability, and maintainability**

## Current Testing State Analysis

### Existing Testing Infrastructure

**Current Test Files Found:**
```
plays/
├── basic.test.ts          # Basic testing setup
├── islands.test.ts        # Interactive component tests
```

**Current Testing Dependencies (package.json analysis):**
```json
{
  "devDependencies": {
    "@playwright/test": "^1.40.0",    # E2E testing
    "playwright": "^1.40.0"
  }
}
```

**Testing Gaps Identified:**
1. **No Unit Testing Framework** - Missing Jest/Vitest setup
2. **Limited Component Testing** - No React Testing Library integration
3. **No API Testing** - Missing API route testing
4. **No Integration Testing** - Database operations untested
5. **No Visual Regression Testing** - UI changes not tracked
6. **No Performance Testing** - Load and stress testing missing

## Comprehensive Testing Architecture

### 1. Multi-Layer Testing Strategy

#### Testing Pyramid Implementation
```typescript
// Test strategy overview:
//
// E2E Tests (Playwright)           [Few - High Value]
//   ├── Critical user journeys
//   ├── Cross-browser compatibility  
//   └── Performance benchmarks
//
// Integration Tests (Vitest)       [Some - Medium Value]  
//   ├── API route testing
//   ├── Database operations
//   └── Service layer integration
//
// Unit Tests (Vitest)             [Many - Fast Feedback]
//   ├── Pure function testing
//   ├── Component logic testing
//   └── Utility function testing
//
// Component Tests (Testing Library) [Many - UI Logic]
//   ├── Component behavior
//   ├── User interaction
//   └── Accessibility testing
```

### 2. Unit Testing Framework Setup

#### Vitest Configuration with TypeScript
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.*',
        '**/*.d.ts',
        '**/types/**'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    watch: false,
    testTimeout: 10000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/components': path.resolve(__dirname, './components'),
      '@/app': path.resolve(__dirname, './app')
    }
  }
});

// tests/setup.ts
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

// Mock server for API testing
export const server = setupServer(...handlers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Global test setup
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Custom matchers
expect.extend({
  toBeValidDate(received: any) {
    const pass = received instanceof Date && !isNaN(received.getTime());
    return {
      message: () => `expected ${received} to be a valid Date`,
      pass
    };
  },
  
  toMatchSearchResult(received: any, expected: Partial<SearchResult>) {
    const pass = (
      typeof received === 'object' &&
      received.article &&
      received.snippet &&
      typeof received.score === 'number' &&
      (!expected.article || received.article.slug === expected.article.slug)
    );
    
    return {
      message: () => `expected ${JSON.stringify(received)} to match search result structure`,
      pass
    };
  }
});
```

#### Unit Test Examples
```typescript
// tests/unit/lib/search/search-utils.test.ts
import { describe, it, expect } from 'vitest';
import { 
  highlightSearchTerms,
  calculateRelevanceScore,
  normalizeSearchQuery,
  extractSearchTerms
} from '@/lib/search/utils';

describe('Search Utilities', () => {
  describe('highlightSearchTerms', () => {
    it('should highlight exact matches', () => {
      const text = 'TypeScript is a programming language';
      const terms = ['TypeScript', 'language'];
      
      const result = highlightSearchTerms(text, terms);
      
      expect(result).toContain('<mark>TypeScript</mark>');
      expect(result).toContain('<mark>language</mark>');
    });

    it('should handle case-insensitive matching', () => {
      const text = 'React components are powerful';
      const terms = ['REACT', 'components'];
      
      const result = highlightSearchTerms(text, terms);
      
      expect(result).toContain('<mark>React</mark>');
      expect(result).toContain('<mark>components</mark>');
    });

    it('should not highlight partial word matches', () => {
      const text = 'JavaScript and Java are different';
      const terms = ['Java'];
      
      const result = highlightSearchTerms(text, terms);
      
      expect(result).toContain('<mark>Java</mark> are different');
      expect(result).not.toContain('<mark>Java</mark>Script');
    });
  });

  describe('calculateRelevanceScore', () => {
    it('should give higher scores for title matches', () => {
      const article = {
        title: 'Advanced TypeScript Patterns',
        description: 'Learn advanced patterns',
        content: { plainText: 'TypeScript content here' }
      };
      
      const titleScore = calculateRelevanceScore(article, 'TypeScript', ['title']);
      const contentScore = calculateRelevanceScore(article, 'TypeScript', ['content']);
      
      expect(titleScore).toBeGreaterThan(contentScore);
    });

    it('should handle multiple term matches', () => {
      const article = {
        title: 'React TypeScript Guide',
        description: 'Complete guide',
        content: { plainText: 'React and TypeScript work together' }
      };
      
      const score = calculateRelevanceScore(article, 'React TypeScript', ['title', 'content']);
      
      expect(score).toBeGreaterThan(0.5);
    });
  });

  describe('normalizeSearchQuery', () => {
    it('should trim whitespace and convert to lowercase', () => {
      expect(normalizeSearchQuery('  React Components  ')).toBe('react components');
    });

    it('should remove special characters', () => {
      expect(normalizeSearchQuery('React.js & TypeScript!')).toBe('reactjs typescript');
    });

    it('should handle empty queries', () => {
      expect(normalizeSearchQuery('')).toBe('');
      expect(normalizeSearchQuery('   ')).toBe('');
    });
  });
});

// tests/unit/lib/multimodal/multimodal.test.ts
import { describe, it, expect } from 'vitest';
import { 
  createMultimodalContent,
  renderMultimodalComponent,
  validateMultimodalElement
} from '@/lib/multimodal/v1';

describe('Multimodal System', () => {
  describe('createMultimodalContent', () => {
    it('should create valid multimodal content', () => {
      const elements = [
        { type: 'heading', level: 1, children: 'Test Heading' },
        { type: 'paragraph', children: 'Test paragraph content' },
        { type: 'code-block', language: 'typescript', code: 'const x = 1;' }
      ];
      
      const content = createMultimodalContent(elements);
      
      expect(content.elements).toHaveLength(3);
      expect(content.metadata.elementCount).toBe(3);
      expect(content.metadata.hasCode).toBe(true);
    });

    it('should handle empty content', () => {
      const content = createMultimodalContent([]);
      
      expect(content.elements).toHaveLength(0);
      expect(content.metadata.elementCount).toBe(0);
      expect(content.metadata.hasCode).toBe(false);
    });
  });

  describe('validateMultimodalElement', () => {
    it('should validate heading elements', () => {
      const validHeading = { type: 'heading', level: 2, children: 'Valid Heading' };
      const invalidHeading = { type: 'heading', level: 7, children: 'Invalid Level' };
      
      expect(validateMultimodalElement(validHeading)).toBe(true);
      expect(validateMultimodalElement(invalidHeading)).toBe(false);
    });

    it('should validate code block elements', () => {
      const validCodeBlock = { 
        type: 'code-block', 
        language: 'typescript', 
        code: 'const x: number = 1;' 
      };
      const invalidCodeBlock = { 
        type: 'code-block', 
        language: '', 
        code: 'const x = 1;' 
      };
      
      expect(validateMultimodalElement(validCodeBlock)).toBe(true);
      expect(validateMultimodalElement(invalidCodeBlock)).toBe(false);
    });
  });
});
```

### 3. Component Testing Framework

#### React Testing Library Integration
```typescript
// tests/component/components/SearchDialog.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchDialog } from '@/components/SearchDialog';
import { TestProviders } from '../test-utils';

const mockSearchResults = [
  {
    article: {
      slug: 'test-article',
      title: 'Test Article',
      description: 'Test description',
      tags: ['test'],
      publishedAt: new Date(),
      readingTime: 5
    },
    snippet: 'Test snippet content',
    score: 0.95,
    matches: []
  }
];

describe('SearchDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    onSearch: vi.fn().mockResolvedValue(mockSearchResults)
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render search input when open', () => {
    render(
      <TestProviders>
        <SearchDialog {...defaultProps} />
      </TestProviders>
    );

    expect(screen.getByPlaceholderText(/search articles/i)).toBeInTheDocument();
  });

  it('should call onSearch when user types', async () => {
    const user = userEvent.setup();
    
    render(
      <TestProviders>
        <SearchDialog {...defaultProps} />
      </TestProviders>
    );

    const searchInput = screen.getByPlaceholderText(/search articles/i);
    await user.type(searchInput, 'typescript');

    await waitFor(() => {
      expect(defaultProps.onSearch).toHaveBeenCalledWith('typescript');
    });
  });

  it('should display search results', async () => {
    render(
      <TestProviders>
        <SearchDialog {...defaultProps} />
      </TestProviders>
    );

    const searchInput = screen.getByPlaceholderText(/search articles/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });

    await waitFor(() => {
      expect(screen.getByText('Test Article')).toBeInTheDocument();
      expect(screen.getByText('Test snippet content')).toBeInTheDocument();
    });
  });

  it('should handle empty search results', async () => {
    const emptySearchProps = {
      ...defaultProps,
      onSearch: vi.fn().mockResolvedValue([])
    };

    render(
      <TestProviders>
        <SearchDialog {...emptySearchProps} />
      </TestProviders>
    );

    const searchInput = screen.getByPlaceholderText(/search articles/i);
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(screen.getByText(/no articles found/i)).toBeInTheDocument();
    });
  });

  it('should handle search errors gracefully', async () => {
    const errorSearchProps = {
      ...defaultProps,
      onSearch: vi.fn().mockRejectedValue(new Error('Search failed'))
    };

    render(
      <TestProviders>
        <SearchDialog {...errorSearchProps} />
      </TestProviders>
    );

    const searchInput = screen.getByPlaceholderText(/search articles/i);
    fireEvent.change(searchInput, { target: { value: 'error' } });

    await waitFor(() => {
      expect(screen.getByText(/search error/i)).toBeInTheDocument();
    });
  });

  it('should be keyboard accessible', async () => {
    const user = userEvent.setup();
    
    render(
      <TestProviders>
        <SearchDialog {...defaultProps} />
      </TestProviders>
    );

    // Test escape key closes dialog
    await user.keyboard('{Escape}');
    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);

    // Test arrow key navigation through results
    const searchInput = screen.getByPlaceholderText(/search articles/i);
    await user.type(searchInput, 'test');

    await waitFor(() => {
      expect(screen.getByText('Test Article')).toBeInTheDocument();
    });

    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('Test Article')).toHaveClass('focused');
  });
});

// tests/component/test-utils.tsx
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/components/AuthProvider';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
});

export function TestProviders({ children }: { children: ReactNode }) {
  const queryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}

export function renderWithProviders(component: ReactNode) {
  return render(
    <TestProviders>
      {component}
    </TestProviders>
  );
}

// Custom testing utilities
export const mockUser = {
  id: 'test-user-id',
  name: 'Test User',
  email: 'test@example.com',
  avatar: 'https://example.com/avatar.jpg'
};

export function createMockArticle(overrides: Partial<Article> = {}): Article {
  return {
    metadata: {
      title: 'Test Article',
      description: 'Test description',
      tags: ['test'],
      publishedAt: new Date(),
      updatedAt: new Date(),
      slug: 'test-article',
      status: 'published',
      readingTime: 5,
      author: mockUser
    },
    content: {
      html: '<p>Test content</p>',
      markdown: 'Test content',
      plainText: 'Test content',
      wordCount: 100
    },
    ...overrides
  };
}
```

### 4. API Testing Framework

#### API Route Testing with MSW
```typescript
// tests/integration/api/search.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/search/route';
import { setupTestDatabase, teardownTestDatabase } from '../test-database';

describe('/api/search', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('GET /api/search', () => {
    it('should return search results for valid query', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/search?q=typescript&limit=10'
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      
      const data = JSON.parse(res._getData());
      expect(data).toHaveProperty('results');
      expect(data).toHaveProperty('total');
      expect(Array.isArray(data.results)).toBe(true);
      
      if (data.results.length > 0) {
        expect(data.results[0]).toMatchSearchResult({
          article: expect.objectContaining({
            slug: expect.any(String),
            title: expect.any(String)
          })
        });
      }
    });

    it('should handle empty search query', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/search?q='
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      
      const data = JSON.parse(res._getData());
      expect(data.error).toContain('query');
    });

    it('should respect pagination parameters', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/search?q=test&limit=5&offset=10'
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      
      const data = JSON.parse(res._getData());
      expect(data.results.length).toBeLessThanOrEqual(5);
    });

    it('should filter by tags', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/search?q=test&tags=typescript,react'
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      
      const data = JSON.parse(res._getData());
      
      // All results should have at least one of the specified tags
      data.results.forEach((result: any) => {
        const hasRequiredTag = result.article.tags.some((tag: string) => 
          ['typescript', 'react'].includes(tag.toLowerCase())
        );
        expect(hasRequiredTag).toBe(true);
      });
    });

    it('should handle database errors gracefully', async () => {
      // Mock database failure
      vi.mocked(searchService.search).mockRejectedValueOnce(
        new Error('Database connection failed')
      );

      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/search?q=test'
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(500);
      
      const data = JSON.parse(res._getData());
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('POST /api/search', () => {
    it('should handle advanced search with body parameters', async () => {
      const searchBody = {
        query: 'advanced typescript',
        tags: ['typescript'],
        sortBy: 'relevance',
        limit: 20
      };

      const { req, res } = createMocks({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: searchBody
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      
      const data = JSON.parse(res._getData());
      expect(data.results.length).toBeLessThanOrEqual(20);
    });
  });
});

// tests/integration/test-database.ts
import { createTestDatabase } from '@/lib/db/test-utils';

let testDb: any;

export async function setupTestDatabase() {
  testDb = await createTestDatabase();
  
  // Seed test data
  await testDb.query(`
    INSERT INTO articles_v2 (slug, title, description, content, tags, status, created_at, updated_at)
    VALUES 
      ('test-typescript-article', 'Advanced TypeScript Patterns', 'Learn advanced TypeScript', 
       '{"html": "<p>TypeScript content</p>", "markdown": "TypeScript content", "plainText": "TypeScript content", "wordCount": 100}',
       ARRAY['typescript', 'programming'], 'published', NOW(), NOW()),
      ('test-react-article', 'React Best Practices', 'React development guide',
       '{"html": "<p>React content</p>", "markdown": "React content", "plainText": "React content", "wordCount": 150}',
       ARRAY['react', 'javascript'], 'published', NOW(), NOW())
  `);
}

export async function teardownTestDatabase() {
  if (testDb) {
    await testDb.query('TRUNCATE articles_v2 CASCADE');
    await testDb.end();
  }
}
```

### 5. End-to-End Testing with Playwright

#### E2E Test Suite
```typescript
// tests/e2e/search-functionality.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open search dialog when clicking search button', async ({ page }) => {
    await page.click('[data-testid="search-launcher"]');
    
    await expect(page.locator('[data-testid="search-dialog"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="Search"]')).toBeFocused();
  });

  test('should perform search and display results', async ({ page }) => {
    await page.click('[data-testid="search-launcher"]');
    await page.fill('input[placeholder*="Search"]', 'typescript');
    
    // Wait for search results
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
    
    const results = page.locator('[data-testid="search-result-item"]');
    await expect(results.first()).toBeVisible();
    
    // Check result structure
    const firstResult = results.first();
    await expect(firstResult.locator('h3')).toBeVisible(); // Title
    await expect(firstResult.locator('p')).toBeVisible(); // Snippet
  });

  test('should navigate to article when clicking search result', async ({ page }) => {
    await page.click('[data-testid="search-launcher"]');
    await page.fill('input[placeholder*="Search"]', 'typescript');
    
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
    
    const firstResult = page.locator('[data-testid="search-result-item"]').first();
    const articleTitle = await firstResult.locator('h3').textContent();
    
    await firstResult.click();
    
    // Should navigate to article page
    await expect(page).toHaveURL(/\/article\/.+/);
    await expect(page.locator('h1')).toContainText(articleTitle!);
  });

  test('should handle empty search results', async ({ page }) => {
    await page.click('[data-testid="search-launcher"]');
    await page.fill('input[placeholder*="Search"]', 'nonexistentquery12345');
    
    await expect(page.locator('[data-testid="no-results"]')).toBeVisible();
    await expect(page.locator('[data-testid="no-results"]')).toContainText('No articles found');
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.click('[data-testid="search-launcher"]');
    await page.fill('input[placeholder*="Search"]', 'typescript');
    
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
    
    // Test arrow key navigation
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('[data-testid="search-result-item"]:first-child')).toHaveClass(/focused|selected/);
    
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('[data-testid="search-result-item"]:nth-child(2)')).toHaveClass(/focused|selected/);
    
    // Test Enter key navigation
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/article\/.+/);
  });
});

// tests/e2e/type-explorer.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Type Explorer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/labs/type-explorer');
  });

  test('should load Monaco editor', async ({ page }) => {
    await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.monaco-editor textarea')).toBeFocused();
  });

  test('should display TypeScript diagnostics', async ({ page }) => {
    // Clear editor and add TypeScript code with error
    await page.locator('.monaco-editor textarea').fill(`
      const x: string = 123; // Type error
      console.log(x);
    `);

    // Wait for diagnostics to appear
    await expect(page.locator('[data-testid="diagnostics-panel"]')).toBeVisible();
    await expect(page.locator('.diagnostic-error')).toBeVisible();
    
    const errorMessage = await page.locator('.diagnostic-error').textContent();
    expect(errorMessage).toContain('Type \'number\' is not assignable to type \'string\'');
  });

  test('should support multiple files', async ({ page }) => {
    // Add new file
    await page.click('[data-testid="add-file-button"]');
    await page.fill('[data-testid="file-name-input"]', 'utils.ts');
    await page.click('[data-testid="confirm-add-file"]');
    
    // Should show new file in file explorer
    await expect(page.locator('[data-testid="file-item"][data-file="utils.ts"]')).toBeVisible();
    
    // Should be able to switch between files
    await page.click('[data-testid="file-item"][data-file="utils.ts"]');
    await expect(page.locator('.monaco-editor')).toBeVisible();
  });

  test('should persist changes across page reloads', async ({ page }) => {
    const testCode = 'const message: string = "Hello, TypeScript!";';
    
    await page.locator('.monaco-editor textarea').fill(testCode);
    
    // Reload page
    await page.reload();
    
    // Code should be persisted
    await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
    
    const editorContent = await page.locator('.monaco-editor textarea').inputValue();
    expect(editorContent).toContain(testCode);
  });
});
```

### 6. Performance Testing

#### Load Testing Framework
```typescript
// tests/performance/load-test.ts
import { describe, it, expect } from 'vitest';
import { performance } from 'perf_hooks';

describe('Performance Tests', () => {
  describe('Search Performance', () => {
    it('should complete search within performance budget', async () => {
      const start = performance.now();
      
      const response = await fetch('/api/search?q=typescript&limit=20');
      const data = await response.json();
      
      const duration = performance.now() - start;
      
      expect(response.ok).toBe(true);
      expect(duration).toBeLessThan(1000); // 1 second budget
      expect(data.results.length).toBeGreaterThan(0);
    });

    it('should handle concurrent search requests', async () => {
      const queries = ['typescript', 'react', 'javascript', 'python', 'node'];
      const concurrentRequests = 10;
      
      const start = performance.now();
      
      const promises = Array.from({ length: concurrentRequests }, (_, i) => 
        fetch(`/api/search?q=${queries[i % queries.length]}&limit=10`)
      );
      
      const responses = await Promise.all(promises);
      const duration = performance.now() - start;
      
      // All requests should succeed
      responses.forEach(response => {
        expect(response.ok).toBe(true);
      });
      
      // Should handle concurrent load within reasonable time
      expect(duration).toBeLessThan(5000); // 5 second budget for 10 concurrent requests
    });
  });

  describe('Bundle Size Performance', () => {
    it('should meet bundle size budgets', async () => {
      const bundleAnalysis = await analyzeBundleSize();
      
      expect(bundleAnalysis.initialBundle).toBeLessThan(500 * 1024); // 500KB
      expect(bundleAnalysis.typeExplorer).toBeLessThan(250 * 1024); // 250KB
      expect(bundleAnalysis.totalBundle).toBeLessThan(2 * 1024 * 1024); // 2MB
    });
  });
});

// Performance monitoring utilities
export class PerformanceTestRunner {
  async measureRenderTime(component: string): Promise<number> {
    const start = performance.now();
    
    // Simulate component render
    await new Promise(resolve => setTimeout(resolve, 0));
    
    return performance.now() - start;
  }

  async measureAPIResponse(endpoint: string): Promise<{
    responseTime: number;
    success: boolean;
    dataSize: number;
  }> {
    const start = performance.now();
    
    try {
      const response = await fetch(endpoint);
      const data = await response.text();
      const responseTime = performance.now() - start;
      
      return {
        responseTime,
        success: response.ok,
        dataSize: data.length
      };
    } catch (error) {
      return {
        responseTime: performance.now() - start,
        success: false,
        dataSize: 0
      };
    }
  }
}
```

### 7. Testing CI/CD Integration

#### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run unit tests
        run: pnpm test:unit --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Setup test database
        run: pnpm db:setup:test
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/test
      
      - name: Run integration tests
        run: pnpm test:integration
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/test

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Install Playwright browsers
        run: pnpm playwright install --with-deps
      
      - name: Build application
        run: pnpm build
      
      - name: Run E2E tests
        run: pnpm test:e2e
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-results
          path: test-results/

  performance-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build application
        run: pnpm build
      
      - name: Run performance tests
        run: pnpm test:performance
      
      - name: Check bundle size
        run: pnpm analyze:bundle
      
      - name: Comment bundle size
        uses: actions/github-script@v6
        if: github.event_name == 'pull_request'
        with:
          script: |
            const fs = require('fs');
            const bundleReport = JSON.parse(fs.readFileSync('bundle-analysis.json', 'utf8'));
            
            const comment = `
            ## Bundle Size Report
            
            | Bundle | Size | Change |
            |--------|------|--------|
            | Initial | ${bundleReport.initial} | ${bundleReport.initialChange} |
            | Total | ${bundleReport.total} | ${bundleReport.totalChange} |
            `;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

This comprehensive testing strategy provides multiple layers of quality assurance, from fast unit tests to thorough E2E scenarios, ensuring code reliability and maintainability while supporting rapid development cycles.
