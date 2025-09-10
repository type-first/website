import { ArticleModule } from '@/lib/article-modules/types';
import { Counter } from '@/components/islands/Counter';
import { InteractiveChart } from '@/components/islands/InteractiveChart';
import { renderToPlainText, renderToMarkdown } from '@/lib/article-modules/renderer';

const article: ArticleModule = {
  metadata: {
    title: "Module-Based Articles: A New Approach",
    description: "Exploring the benefits of treating articles as TypeScript modules instead of database documents.",
    tags: ["architecture", "nextjs", "typescript", "content-management"],
    publishedAt: new Date('2024-01-20T10:00:00Z'),
    updatedAt: new Date('2024-01-20T10:00:00Z'),
    seoTitle: "Module-Based Articles - TypeScript Content Management",
    seoDescription: "Learn how to build a type-safe, flexible content system using TypeScript modules instead of traditional CMS approaches.",
    author: "Your Name",
  },

  sections: [
    {
      type: 'text',
      content: `
        <h1>Module-Based Articles: A New Approach</h1>
        
        <p>Traditional content management systems treat articles as database documents, but what if we treated them as TypeScript modules instead? This approach offers several compelling advantages.</p>
        
        <h2>Type Safety</h2>
        
        <p>By defining articles as modules, we gain compile-time type checking for all content. This means:</p>
        
        <ul>
          <li>Metadata is validated at build time</li>
          <li>Section types are enforced</li>
          <li>Props for interactive components are type-checked</li>
        </ul>
      `,
      id: 'introduction',
    },

    {
      type: 'code',
      language: 'typescript',
      filename: 'article.ts',
      content: `interface ArticleModule {
  metadata: ArticleMetadata;
  sections: Section[];
  getPlainText?: () => string;
  getMarkdown?: () => string;
}

const article: ArticleModule = {
  metadata: {
    title: "My Article",
    tags: ["typescript", "content"],
  },
  sections: [
    {
      type: 'text',
      content: '<p>Hello, world!</p>',
    },
  ],
};

export default article;`,
      id: 'code-example',
    },

    {
      type: 'text',
      content: `
        <h2>Interactive Islands</h2>
        
        <p>Islands can be imported directly as components, giving us full type safety and IDE support:</p>
      `,
      id: 'islands-intro',
    },

    {
      type: 'island',
      component: Counter,
      props: { initialValue: 42, label: "Module-based counter" },
      textAlt: "An interactive counter component that demonstrates client-side hydration in a module-based article system. The counter starts at 42 and can be incremented or decremented.",
      id: 'counter-demo',
    },

    {
      type: 'text',
      content: `
        <h2>Multiple Rendering Contexts</h2>
        
        <p>The same article can be rendered in different contexts:</p>
        
        <ul>
          <li><strong>Web:</strong> Full interactive experience with hydrated islands</li>
          <li><strong>Static:</strong> Pre-rendered HTML for SEO and performance</li>
          <li><strong>Plain text:</strong> For RAG pipelines and search indexing</li>
          <li><strong>Markdown:</strong> For export or documentation</li>
        </ul>
      `,
      id: 'contexts',
    },

    {
      type: 'quote',
      content: "The best content management system is the one that gets out of your way and lets you focus on creating great content.",
      author: "A wise developer",
      id: 'wisdom-quote',
    },

    {
      type: 'text',
      content: `
        <h2>Performance Benefits</h2>
        
        <p>Since articles are modules, they benefit from:</p>
        
        <ul>
          <li>Tree shaking - unused components aren't bundled</li>
          <li>Code splitting - articles load only when needed</li>
          <li>Static analysis - build-time optimizations</li>
          <li>Caching - TypeScript compilation cache</li>
        </ul>
      `,
      id: 'performance',
    },

    {
      type: 'island',
      component: InteractiveChart,
      props: {
        data: [
          { name: 'Database Articles', loadTime: 150, complexity: 80 },
          { name: 'Module Articles', loadTime: 90, complexity: 40 },
        ],
        title: 'Performance Comparison',
      },
      textAlt: "A chart comparing database-driven articles vs module-based articles, showing that module-based articles have 40% faster load times and 50% less complexity.",
      id: 'performance-chart',
    },
  ],

  // Optional utility functions
  getPlainText() {
    return renderToPlainText(this.sections);
  },

  getMarkdown() {
    return renderToMarkdown(this.sections);
  },

  getOutline() {
    return [
      { level: 1, title: "Module-Based Articles: A New Approach", id: "introduction" },
      { level: 2, title: "Type Safety", id: "introduction" },
      { level: 2, title: "Interactive Islands", id: "islands-intro" },
      { level: 2, title: "Multiple Rendering Contexts", id: "contexts" },
      { level: 2, title: "Performance Benefits", id: "performance" },
    ];
  },

  getSearchableContent() {
    const plainText = this.getPlainText?.() || renderToPlainText(this.sections);
    const metadata = `${this.metadata.title} ${this.metadata.description} ${this.metadata.tags.join(' ')}`;
    return `${metadata}\n\n${plainText}`;
  },

  generateMetadata() {
    const { metadata } = this;
    return {
      title: `${metadata.seoTitle || metadata.title} | Our Blog`,
      description: metadata.seoDescription || metadata.description,
      openGraph: {
        title: metadata.seoTitle || metadata.title,
        description: metadata.seoDescription || metadata.description,
        type: 'article',
        publishedTime: metadata.publishedAt?.toISOString(),
        modifiedTime: metadata.updatedAt?.toISOString(),
        tags: metadata.tags,
      },
    };
  },

  getJsonLd() {
    const { metadata } = this;
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metadata.title,
      description: metadata.description,
      datePublished: metadata.publishedAt?.toISOString(),
      dateModified: metadata.updatedAt?.toISOString(),
      author: {
        '@type': 'Person',
        name: metadata.author || 'Unknown Author',
      },
      keywords: metadata.tags.join(', '),
    };
  },
};

export default article;
