# Quick Start Guide

## Database Setup (Cloud)

### Use Vercel Postgres (Neon)
1. Create a Postgres database in your Vercel dashboard (powered by Neon) or via Neon directly
2. Copy the connection string to `.env.local`:
```bash
POSTGRES_URL="postgresql://user:password@host/db?sslmode=require"
```
3. Run migrations and seed data:
```bash
npm run db:migrate
npm run db:seed
npm run dev
```

## Available Commands

- `npm run db:migrate` - Run database migrations (cloud)
- `npm run db:seed` - Add sample data
- `npm run db:reset` - Reset cloud DB (drop + migrate + seed)
- `npm run db:test` - Run DB smoke tests
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

### Connection issues
- Ensure `POSTGRES_URL` is set and includes `sslmode=require`
- Check Neon/Vercel IP allowlists if applicable
