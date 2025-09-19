/**
 * Getting Started Documentation Library - UI Components
 * React components for rendering the getting-started documentation
 */

import React from "react";
import { Header } from "@/lib/content/ui/header.cmp.iso";
import { Navigation } from "@/lib/content/ui/navigation.cmp.iso";
import { Link } from "@/lib/content/ui/link.cmp.iso";
import { Heading } from "@/lib/content/ui/heading.cmp.iso";
import { Footer } from "@/lib/content/ui/footer.cmp.iso";
import { Container } from "@/lib/content/ui/container.cmp.iso";
import { library } from './meta';

// Export metadata for external use
export const libraryMetadata = {
  title: library.name,
  description: library.description,
  slug: library.slug
};

// Individual page components
export const IntroductionPage = () => (
  <div className="prose prose-lg max-w-none">
    <Heading level={2}>Welcome to Our Platform</Heading>
    <p>
      Welcome to our comprehensive development platform! We're excited to help you build
      amazing applications with modern tools and best practices.
    </p>
    
    <Heading level={3}>What You'll Learn</Heading>
    <ul>
      <li>How to install and set up your development environment</li>
      <li>Core concepts that power our platform</li>
      <li>Best practices for building scalable applications</li>
      <li>Real-world examples and use cases</li>
    </ul>
    
    <Heading level={3}>Prerequisites</Heading>
    <p>
      Before getting started, make sure you have:
    </p>
    <ul>
      <li>Node.js 18+ installed</li>
      <li>Basic knowledge of TypeScript and React</li>
      <li>A code editor (we recommend VS Code)</li>
    </ul>
  </div>
);

export const InstallationPage = () => (
  <div className="prose prose-lg max-w-none">
    <Heading level={2}>Installation Guide</Heading>
    <p>
      Follow these steps to install our platform and get your development environment ready.
    </p>
    
    <Heading level={3}>Using npm</Heading>
    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
      <code>npm install @type-first/platform</code>
    </pre>
    
    <Heading level={3}>Using yarn</Heading>
    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
      <code>yarn add @type-first/platform</code>
    </pre>
    
    <Heading level={3}>Using pnpm</Heading>
    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
      <code>pnpm add @type-first/platform</code>
    </pre>
    
    <Heading level={3}>Verify Installation</Heading>
    <p>
      After installation, verify everything is working:
    </p>
    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
      <code>{`import { createApp } from '@type-first/platform';

const app = createApp();
console.log('Platform ready!', app.version);`}</code>
    </pre>
  </div>
);

export const QuickStartPage = () => (
  <div className="prose prose-lg max-w-none">
    <Heading level={2}>Quick Start Guide</Heading>
    <p>
      Get up and running in just 5 minutes with this quick start guide.
    </p>
    
    <Heading level={3}>Step 1: Create a New Project</Heading>
    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
      <code>npx @type-first/create-app my-awesome-app</code>
    </pre>
    
    <Heading level={3}>Step 2: Navigate to Your Project</Heading>
    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
      <code>cd my-awesome-app</code>
    </pre>
    
    <Heading level={3}>Step 3: Start Development Server</Heading>
    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
      <code>npm run dev</code>
    </pre>
    
    <p>
      Your application will be available at <code>http://localhost:3000</code>
    </p>
    
    <Heading level={3}>Next Steps</Heading>
    <ul>
      <li><Link href="/docs/getting-started/concepts">Learn about core concepts</Link></li>
      <li><Link href="/docs/getting-started/examples">Explore examples</Link></li>
      <li><Link href="/docs/api-reference">Check out the API reference</Link></li>
    </ul>
  </div>
);

export const TypeSystemPage = () => (
  <div className="prose prose-lg max-w-none">
    <Heading level={2}>Understanding the Type System</Heading>
    <p>
      Our platform leverages TypeScript's powerful type system to provide excellent
      developer experience and runtime safety.
    </p>
    
    <Heading level={3}>Core Types</Heading>
    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
      <code>{`// Basic content types
type ContentMeta<T extends string> = {
  kind: T;
  slug: string;
  name: string;
  blurb: string;
  tags: readonly string[];
};

// Specific implementations
type ArticleMeta = ContentMeta<'article'> & {
  author: ContributorMeta;
  publishedTs: number;
  coverImgUrl: string;
};`}</code>
    </pre>
    
    <Heading level={3}>Type Safety Benefits</Heading>
    <ul>
      <li>Compile-time error detection</li>
      <li>IntelliSense and autocomplete</li>
      <li>Refactoring safety</li>
      <li>Self-documenting code</li>
    </ul>
  </div>
);

export const ComponentsPage = () => (
  <div className="prose prose-lg max-w-none">
    <Heading level={2}>Working with Components</Heading>
    <p>
      Components are the building blocks of our platform. Learn how to create,
      compose, and optimize them.
    </p>
    
    <Heading level={3}>Creating a Component</Heading>
    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
      <code>{`import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button 
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}`}</code>
    </pre>
    
    <Heading level={3}>Component Guidelines</Heading>
    <ul>
      <li>Use TypeScript interfaces for props</li>
      <li>Provide sensible defaults</li>
      <li>Follow the single responsibility principle</li>
      <li>Make components composable</li>
    </ul>
  </div>
);

// Main library component (if needed for full-page rendering)
export const GettingStartedLibrary = () => (
  <>
    <Header>
      <Container>
        <Navigation>
          <Link href="/docs">Documentation</Link>
          <Link href="/articles">Articles</Link>
          <Link href="/labs">Labs</Link>
        </Navigation>
      </Container>
    </Header>

    <Container>
      <IntroductionPage />
    </Container>

    <Footer>
      <Container>
        <p className="text-center text-gray-500">
          © 2024 Type-First. All rights reserved.
        </p>
      </Container>
    </Footer>
  </>
);