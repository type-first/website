import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createCommunityPost } from '@/lib/db/v0/community';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, body } = await req.json();
    if (typeof title !== 'string' || !title.trim() || typeof body !== 'string' || !body.trim()) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const authorName = (session.user.name || session.user.email || 'user').toString();
    const { slug } = await createCommunityPost({ title: title.trim(), body: body.trim(), authorName });
    return NextResponse.json({ slug }, { status: 201 });
  } catch (err: any) {
    console.error('Create post error', err);
    const message = (err?.message as string) || 'Failed to create post';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'POST to create a community post' });
}
