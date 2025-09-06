import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { auth } from '@/auth';
import { getArticleBySlug, updateArticle } from '@/lib/db/articles';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: 'Blob token not configured' }, { status: 503 });
  }

  const form = await req.formData();
  const slug = String(form.get('slug') || '').trim();
  const file = form.get('file');

  if (!slug) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 });
  }

  try {
    // Validate article exists
    const article = await getArticleBySlug(slug);

    const contentType = file.type || 'application/octet-stream';

    // Store under covers/<slug>/<filename>
    const keyBase = `covers/${slug}`;
    const ext = file.name.includes('.') ? file.name.split('.').pop() : 'bin';
    const timestamp = Date.now();
    const objectName = `${keyBase}/${timestamp}.${ext}`;

    const blob = await put(objectName, file as File, {
      access: 'public',
      contentType,
      addRandomSuffix: false,
    });

    // Update article.cover_image
    await updateArticle(article.id, { coverImage: blob.url });

    return NextResponse.json({ ok: true, url: blob.url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Upload failed' }, { status: 500 });
  }
}
