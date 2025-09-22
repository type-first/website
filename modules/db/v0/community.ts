import { sql } from '@vercel/postgres';
import { posts as demoPosts } from '@/modules/community/v0/data';

function canUseDb() {
  return !!process.env.POSTGRES_URL;
} 

async function haveCommunityTables(): Promise<boolean> {
  try {
    const res = await sql`
      
      SELECT 
        to_regclass('public.community_posts') as p, 
        to_regclass('public.community_comments') as c
      
    `;
    const row = res.rows?.[0] as any;
    return !!row?.p && !!row?.c;
  } catch {
    return false;
  }
}

export type CommunityComment = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
  parentId?: string;
  replies: CommunityComment[];
};

export type CommunityPost = {
  id: string; // slug used for routing
  title: string;
  body: string;
  author: string;
  votes: number;
  comments: CommunityComment[];
  commentsCount?: number;
  createdAt: string;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Helper function to organize flat comments into hierarchical structure
function organizeCommentsHierarchically(flatComments: Array<{
  id: string;
  author: string;
  body: string;
  createdAt: string;
  parentId?: string;
}>): CommunityComment[] {
  const commentMap = new Map<string, CommunityComment>();
  const rootComments: CommunityComment[] = [];

  // First pass: create all comment objects
  flatComments.forEach(comment => {
    commentMap.set(comment.id, {
      id: comment.id,
      author: comment.author,
      body: comment.body,
      createdAt: comment.createdAt,
      parentId: comment.parentId,
      replies: []
    });
  });

  // Second pass: organize into hierarchy
  flatComments.forEach(comment => {
    const commentObj = commentMap.get(comment.id)!;
    if (comment.parentId && commentMap.has(comment.parentId)) {
      const parent = commentMap.get(comment.parentId)!;
      parent.replies.push(commentObj);
    } else {
      rootComments.push(commentObj);
    }
  });

  return rootComments;
}

export async function createCommunityPost({
  title,
  body,
  authorName,
}: { title: string; body: string; authorName: string }): Promise<{ slug: string }>{
  if (!canUseDb()) {
    throw new Error('Community DB not configured. Set POSTGRES_URL and run `npm run db:migrate`.');
  }
  const base = slugify(title);
  // Ensure unique slug by appending suffix if needed
  let slug = base;
  let suffix = 1;
  while (true) {
    const existing = await sql`SELECT 1 FROM community_posts WHERE slug = ${slug}`;
    if (existing.rowCount === 0) break;
    suffix += 1;
    slug = `${base}-${suffix}`;
  }

  await sql`
    INSERT INTO community_posts (slug, title, body, author_name)
    VALUES (${slug}, ${title}, ${body}, ${authorName})
  `;
  return { slug };
}

export async function listCommunityPosts(): Promise<CommunityPost[]> {
  if (!canUseDb()) {
    // Fallback to demo data when DB is not configured
    return demoPosts.map((p) => ({
      id: p.id,
      title: p.title,
      body: p.body,
      author: p.author,
      votes: p.votes,
      comments: p.comments.map((c) => ({ 
        id: c.id, 
        author: c.author, 
        body: c.body, 
        createdAt: c.createdAt,
        parentId: c.parentId,
        replies: c.replies || []
      })),
      commentsCount: p.comments.length,
      createdAt: p.createdAt,
    }));
  }
  try {
    if (!(await haveCommunityTables())) {
      return demoPosts.map((p) => ({
        id: p.id,
        title: p.title,
        body: p.body,
        author: p.author,
        votes: p.votes,
        comments: p.comments.map((c) => ({ 
          id: c.id, 
          author: c.author, 
          body: c.body, 
          createdAt: c.createdAt,
          parentId: c.parentId,
          replies: c.replies || []
        })),
        commentsCount: p.comments.length,
        createdAt: p.createdAt,
      }));
    }
    const result = await sql`
      SELECT p.id, p.slug, p.title, p.body, p.author_name, p.votes, p.created_at,
             COALESCE(c.cnt, 0) AS comments_count
      FROM community_posts p
      LEFT JOIN (
        SELECT post_id, COUNT(*)::int AS cnt
        FROM community_comments
        GROUP BY post_id
      ) c ON c.post_id = p.id
      ORDER BY p.created_at DESC
    `;

    return (result.rows as any[]).map((row) => ({
      id: row.slug,
      title: row.title,
      body: row.body,
      author: row.author_name,
      votes: row.votes,
      comments: [],
      commentsCount: row.comments_count ?? 0,
      createdAt: new Date(row.created_at).toISOString(),
    }));
  } catch (err: any) {
    console.warn('[community] DB error, falling back to demo posts:', err?.message || err);
    return demoPosts.map((p) => ({
      id: p.id,
      title: p.title,
      body: p.body,
      author: p.author,
      votes: p.votes,
      comments: p.comments.map((c) => ({ 
        id: c.id, 
        author: c.author, 
        body: c.body, 
        createdAt: c.createdAt,
        parentId: c.parentId,
        replies: c.replies || []
      })),
      commentsCount: p.comments.length,
      createdAt: p.createdAt,
    }));
  }
}

export async function getCommunityPostBySlug(slug: string): Promise<CommunityPost | null> {
  if (!canUseDb()) {
    const p = demoPosts.find((d) => d.id === slug);
    if (!p) return null;
    return {
      id: p.id,
      title: p.title,
      body: p.body,
      author: p.author,
      votes: p.votes,
      comments: p.comments.map((c) => ({ 
        id: c.id, 
        author: c.author, 
        body: c.body, 
        createdAt: c.createdAt,
        parentId: c.parentId,
        replies: c.replies || []
      })),
      createdAt: p.createdAt,
    };
  }
  try {
    if (!(await haveCommunityTables())) {
      const p = demoPosts.find((d) => d.id === slug);
      if (!p) return null;
      return {
        id: p.id,
        title: p.title,
        body: p.body,
        author: p.author,
        votes: p.votes,
        comments: p.comments.map((c) => ({ 
          id: c.id, 
          author: c.author, 
          body: c.body, 
          createdAt: c.createdAt,
          parentId: c.parentId,
          replies: c.replies || []
        })),
        createdAt: p.createdAt,
      };
    }
    const postRes = await sql`
      SELECT id, slug, title, body, author_name, votes, created_at
      FROM community_posts
      WHERE slug = ${slug}
    `;
    if (postRes.rowCount === 0) return null;
    const p = postRes.rows[0] as any;

    const commentsRes = await sql`
      SELECT id, author_name, body, created_at, parent_comment_id
      FROM community_comments
      WHERE post_id = ${p.id}
      ORDER BY created_at ASC
    `;

    const flatComments = (commentsRes.rows as any[]).map((c) => ({
      id: c.id,
      author: c.author_name,
      body: c.body,
      createdAt: new Date(c.created_at).toISOString(),
      parentId: c.parent_comment_id,
    }));

    const comments = organizeCommentsHierarchically(flatComments);

    return {
      id: p.slug,
      title: p.title,
      body: p.body,
      author: p.author_name,
      votes: p.votes,
      comments,
      createdAt: new Date(p.created_at).toISOString(),
    };
  } catch (err: any) {
    console.warn('[community] DB error, falling back to demo post:', err?.message || err);
    const p = demoPosts.find((d) => d.id === slug);
    if (!p) return null;
    return {
      id: p.id,
      title: p.title,
      body: p.body,
      author: p.author,
      votes: p.votes,
      comments: p.comments.map((c) => ({ 
        id: c.id, 
        author: c.author, 
        body: c.body, 
        createdAt: c.createdAt,
        parentId: c.parentId,
        replies: c.replies || []
      })),
      createdAt: p.createdAt,
    };
  }
}

export async function addCommunityComment({
  slug,
  authorName,
  body,
  parentId,
}: { slug: string; authorName: string; body: string; parentId?: string }): Promise<void> {
  if (!canUseDb()) {
    throw new Error('Community DB not configured. Set POSTGRES_URL and run `npm run db:migrate`.');
  }
  try {
    if (!(await haveCommunityTables())) {
      throw new Error('Community DB not initialized. Run `npm run db:migrate` to create tables.');
    }
    const postRes = await sql`SELECT id FROM community_posts WHERE slug = ${slug}`;
    if (postRes.rowCount === 0) throw new Error('Post not found');
    const postId = (postRes.rows[0] as any).id;

    // Validate parent comment exists if parentId is provided
    if (parentId) {
      const parentRes = await sql`SELECT id FROM community_comments WHERE id = ${parentId} AND post_id = ${postId}`;
      if (parentRes.rowCount === 0) throw new Error('Parent comment not found');
    }

    await sql`
      INSERT INTO community_comments (post_id, author_name, body, parent_comment_id)
      VALUES (${postId}, ${authorName}, ${body}, ${parentId || null})
    `;
  } catch (err: any) {
    throw new Error(
      err?.message?.includes('fetch failed')
        ? 'Community DB not reachable. Check POSTGRES_URL and network connectivity.'
        : (err?.message || 'Failed to add comment')
    );
  }
}
