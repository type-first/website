# Modern Next.js Blog with Islands Architecture

A state-of-the-art Next.js 15 application showcasing modern web development patterns including App Router, Server Components, Islands Architecture, and advanced content management.

## 🚀 Features

### Core Architecture
- **Next.js 15 App Router** with server components by default
- **Islands Architecture** for optimal performance
- **Server-Side Rendering (SSR)** with static generation support
- **Incremental Static Regeneration (ISR)** with cache tags
- **Component Islands** for selective client-side hydration

### Content Management
- **Typed JSON Schema** for articles (not raw Markdown)
- **Automatic Content Derivation** (Markdown, plaintext, outline, embeddings)
- **PostgreSQL with pgvector** for semantic search
- **Section-level embeddings** for advanced search capabilities

### SEO & Performance
- **Dynamic OpenGraph images** per article
- **Comprehensive metadata** with proper canonical URLs
- **Environment-aware robots.txt**
- **Sitemap generation** with lastModified dates
- **Full-text and vector search** capabilities

### Testing & Quality
- **Playwright integration** for E2E testing
- **Component testing** with YAML fixtures
- **Lighthouse CI** for performance monitoring
- **TypeScript strict mode** with comprehensive type safety

## 🏗️ Project Structure

```
├── app/                          # Next.js App Router
│   ├── articles/                 # Article routes
│   │   ├── [slug]/              
│   │   │   ├── page.tsx         # Individual article page
│   │   │   └── opengraph-image.tsx # Dynamic OG images
│   │   └── page.tsx             # Articles listing
│   ├── api/                     # API routes
│   │   └── search/              # Search endpoints
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   ├── sitemap.ts               # Dynamic sitemap
│   └── robots.ts                # Environment-aware robots
├── components/                   # React components
│   ├── islands/                 # Client-side islands
│   └── ArticleRenderer.tsx      # Server-side article renderer
├── lib/                         # Core utilities
│   ├── content/                 # Content processing
│   ├── db/                      # Database access layer
│   ├── islands/                 # Island registry system
│   ├── schemas/                 # Zod schemas
│   └── utils.ts                 # Utility functions
├── lib/db/                      # DB layer + assets (cloud-only)
│   ├── migrations/              # SQL migrations
│   ├── fixtures/                # YAML seed data
│   └── scripts/                 # TS scripts: migrate/seed/test/reset
└── tests/                       # Playwright tests
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Cloud Postgres (Vercel Postgres / Neon)

### 1. Clone and Install
```bash
git clone <repository>
cd my-app
pnpm install
```

### 2. Environment Setup (cloud-only)
```bash
cp .env.example .env.local
# Set POSTGRES_URL from your Vercel/Neon database (include sslmode=require)
```

### 3. Database Setup (TypeScript scripts via tsx)
```bash
# Run migrations
pnpm run db:migrate

# Seed with sample data
pnpm run db:seed
```

### 4. Development
```bash
pnpm run dev
```

Visit `http://localhost:3000` to see the application.

### 5. Build & Deploy
```bash
pnpm run build
pnpm run start
```

## 🧪 Testing

### Run All Tests
```bash
pnpm run test
```

### Run Tests with UI
```bash
pnpm run test:ui
```

### Type Checking
```bash
pnpm run type-check
```

### DB Smoke Tests
```bash
pnpm run db:test
```

## 🏗️ Architecture Deep Dive

### Islands Architecture

The application implements a sophisticated islands architecture where:

1. **Server Components** render static content
2. **Island Components** provide selective interactivity
3. **Island Registry** manages component hydration
4. **Fallback Components** ensure graceful degradation

### Content Pipeline

Articles flow through a comprehensive processing pipeline:

1. **JSON Schema Validation** ensures content structure
2. **Automatic Derivation** generates multiple formats
3. **Embedding Generation** enables semantic search
4. **Cache Invalidation** maintains freshness

### Search System

Dual search capabilities:

- **Full-text Search** via PostgreSQL's built-in capabilities
- **Vector Search** using pgvector for semantic similarity
- **Hybrid Results** combining both approaches

## 📝 Content Schema

Articles use a structured JSON schema with typed sections:

```typescript
{
  "title": "Article Title",
  "slug": "article-slug", 
  "description": "Brief description",
  "content": [
    {
      "type": "text",
      "content": "Markdown-formatted text content"
    },
    {
      "type": "code", 
      "language": "typescript",
      "content": "code here"
    },
    {
      "type": "island",
      "component": "InteractiveChart",
      "textAlt": "Chart showing performance data",
      "props": { "data": [...] }
    }
  ],
  "tags": ["nextjs", "react"],
  "status": "published"
}
```

## 🎨 Available Islands

### Counter
Interactive counter with customizable step and initial value.

### InteractiveChart  
Data visualization with bar/line toggle and click interactions.

### CodePlayground
In-browser code editor and executor for JavaScript.

## 🚀 Deployment

### Vercel (Recommended)
1. Connect to GitHub
2. Set environment variables
3. Deploy

### Self-hosted
1. Build the application: `pnpm run build`
2. Set production environment variables
3. Run: `pnpm run start`

## 🔧 Environment Variables

```bash
# Database
POSTGRES_URL="postgresql://..."

# App Configuration  
NEXT_PUBLIC_BASE_URL="https://yoursite.com"
NODE_ENV="production"

# Optional: OpenAI for embeddings
OPENAI_API_KEY="sk-..."

# Optional: Vercel Auth
AUTH_SECRET="..."
```

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for excellent UX
- **Bundle Size**: Minimal JavaScript through islands architecture
- **SEO**: Comprehensive metadata and semantic HTML

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ using Next.js 15, React 19, TypeScript, and modern web standards.
