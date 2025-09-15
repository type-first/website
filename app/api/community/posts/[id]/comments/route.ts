import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { addCommunityComment } from '@/lib/db/v0/community';

type RouteContext = { params: Promise<{ id: string }> } | { params: { id: string } };

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { body } = await req.json();
    if (typeof body !== 'string' || !body.trim()) {
      return NextResponse.json({ error: 'Comment body required' }, { status: 400 });
    }

    const authorName = (session.user.name || session.user.email || 'user').toString();
    const params = 'then' in (context.params as any) ? await (context.params as Promise<{ id: string }>) : (context.params as { id: string });
    await addCommunityComment({ slug: params.id, authorName, body: body.trim() });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err: any) {
    console.error('Add comment error', err);
    const message = (err?.message as string) || 'Failed to add comment';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'POST to add a comment' });
}
