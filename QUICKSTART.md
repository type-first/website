# Quick Start Guide

## Database Setup Options

### Option 1: Docker (Recommended)
```bash
# Install Docker Desktop from https://www.docker.com/products/docker-desktop
# Then run:
npm run db:docker      # Start PostgreSQL with pgvector
npm run db:migrate     # Run database migrations  
npm run db:seed        # Add sample data
npm run dev           # Start development server
```

### Option 2: Use Vercel Postgres (Cloud)
1. Create a Vercel account at https://vercel.com
2. Create a new Postgres database in your dashboard
3. Copy the connection string to `.env.local`:
```bash
POSTGRES_URL="your_vercel_postgres_url_here"
```
4. Run migrations and seed data:
```bash
npm run db:migrate
npm run db:seed
npm run dev
```

### Option 3: Local PostgreSQL Installation
If you have PostgreSQL installed locally:
```bash
# Create database and user
createuser -s my_app_user
createdb -O my_app_user my_app_dev

# Enable pgvector (if available)
psql -d my_app_dev -c 'CREATE EXTENSION IF NOT EXISTS vector;'

# Update .env.local
echo 'POSTGRES_URL="postgresql://my_app_user@localhost:5432/my_app_dev"' > .env.local

# Run setup
npm run db:migrate
npm run db:seed
npm run dev
```

### Option 4: Development without Database
For testing the build process without a database:
```bash
# Create minimal .env.local
echo 'POSTGRES_URL="postgresql://localhost:5432/fake"' > .env.local
echo 'NEXT_PUBLIC_BASE_URL="http://localhost:3000"' >> .env.local

# Build will skip static generation gracefully
npm run build
```

## Available Commands

- `npm run db:setup` - Interactive database setup
- `npm run db:docker` - Start Docker PostgreSQL  
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Add sample data
- `npm run db:reset` - Full reset (setup + migrate + seed)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run Playwright tests

## Troubleshooting

### Build fails with database errors
The app gracefully handles missing database connections during build by:
- Skipping static generation for database-dependent pages
- Showing empty states instead of crashing
- Logging warnings instead of throwing errors

### pgvector extension not available
The app will work without pgvector, but vector search features will be disabled. Text search will still work via PostgreSQL's full-text search.

### Docker issues
- Make sure Docker Desktop is installed and running
- On macOS, Docker Desktop needs to be started from Applications
- Check `docker --version` and `docker-compose --version`
