import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';
import path from 'path';

// Load env from project root .env.local
dotenv.config({ path: path.join(__dirname, '../../../.env.local') });

type SeedPost = {
  slug: string;
  title: string;
  body: string;
  author: string;
  votes?: number;
  comments?: Array<{ author: string; body: string }>;
};

const seedPosts: SeedPost[] = [
  {
    slug: 'welcome-to-community',
    title: 'Welcome to Community',
    body: 'Share ideas, questions, and tips about TypeScript and our labs. This forum is SSR-rendered and public to browse. Sign in to post or vote.',
    author: 'moderator',
    votes: 12,
    comments: [
      { author: 'alex', body: 'Stoked to try the Type Explorer lab — type hovers are slick!' },
      { author: 'sam', body: 'Could we get TSX support in the sidebar type info?' },
    ],
  },
  {
    slug: 'feature-requests',
    title: 'Feature Requests',
    body: 'What would you like to see in future labs? Add your ideas here.',
    author: 'jordan',
    votes: 7,
    comments: [],
  },
];

async function haveCommunityTables() {
  const res = await sql`SELECT to_regclass('public.community_posts') as p, to_regclass('public.community_comments') as c`;
  const row: any = res.rows?.[0] || {};
  return !!row.p && !!row.c;
}

export async function seedCommunity() {
  if (!process.env.POSTGRES_URL) {
    console.log('POSTGRES_URL not set; skipping community seed.');
    return;
  }

  if (!(await haveCommunityTables())) {
    console.log('Community tables not found; run migrations first. Skipping.');
    return;
  }

  // Check if anything exists already
  const count = await sql`SELECT COUNT(*)::int AS cnt FROM community_posts`;
  if ((count.rows[0] as any).cnt > 0) {
    console.log('Community posts already present; skipping community seed.');
    return;
  }

  console.log('Seeding community posts...');

  for (const p of seedPosts) {
    // Avoid duplicates by slug
    const exists = await sql`SELECT 1 FROM community_posts WHERE slug = ${p.slug}`;
    if (exists.rowCount > 0) {
      console.log(`Skipping existing post: ${p.slug}`);
      continue;
    }

    await sql`
      INSERT INTO community_posts (slug, title, body, author_name, votes)
      VALUES (${p.slug}, ${p.title}, ${p.body}, ${p.author}, ${p.votes || 0})
    `;

    const idRes = await sql`SELECT id FROM community_posts WHERE slug = ${p.slug}`;
    const postId = (idRes.rows[0] as any).id as string;

    for (const c of p.comments || []) {
      await sql`
        INSERT INTO community_comments (post_id, author_name, body)
        VALUES (${postId}, ${c.author}, ${c.body})
      `;
    }

    console.log(`✅ Seeded post: ${p.slug}`);
  }

  console.log('✅ Community seed completed.');
}

const invokedDirectly = process.argv[1]?.endsWith('seed-community.ts') || process.argv[1]?.endsWith('seed-community.js');
if (invokedDirectly) {
  seedCommunity().catch((err) => {
    console.error('❌ Community seed failed:', err);
    process.exit(1);
  });
}

