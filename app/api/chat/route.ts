import { NextRequest, NextResponse } from 'next/server';
import { searchByString, searchByVector, getArticleById } from '@/lib/db/articles';

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 503 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const system: string | undefined = typeof body?.system === 'string' ? body.system : undefined;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'messages array is required' }, { status: 400 });
    }

    // Keep last 20 messages to control token size
    const history = messages.slice(-20).map((m: any) => ({
      role: m?.role === 'assistant' ? 'assistant' : 'user',
      content: typeof m?.content === 'string' ? m.content : String(m?.content ?? ''),
    }));

    // Retrieve relevant articles based on the latest user message
    const lastUser = [...history].reverse().find((m) => m.role === 'user');
    let suggestionList: Array<{ id: string; title: string; slug: string; snippet: string }> = [];
    if (lastUser && typeof lastUser.content === 'string' && lastUser.content.trim().length > 0) {
      const q = lastUser.content.trim();
      try {
        // Start with fast string search
        const text = await searchByString(q, 5);
        const seen = new Set<string>();
        for (const r of text) {
          try {
            const a = await getArticleById(r.articleId);
            if (a && !seen.has(a.id)) {
              seen.add(a.id);
              suggestionList.push({ id: a.id, title: a.title, slug: a.slug, snippet: r.snippet });
            }
          } catch {}
        }

        // Optionally add vector suggestions if embedding budget allows
        if (suggestionList.length < 5) {
          // Embed query via OpenAI
          const embRes = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ input: q, model: 'text-embedding-3-small' }),
          });
          if (embRes.ok) {
            const embData: any = await embRes.json();
            const embedding = embData?.data?.[0]?.embedding as number[] | undefined;
            if (Array.isArray(embedding)) {
              const vec = await searchByVector(embedding, 5, 0.3);
              for (const r of vec) {
                try {
                  if (seen.has(r.articleId)) continue;
                  const a = await getArticleById(r.articleId);
                  if (a) {
                    seen.add(a.id);
                    const snippet = r.content.length > 200 ? `${r.content.slice(0, 200)}...` : r.content;
                    suggestionList.push({ id: a.id, title: a.title, slug: a.slug, snippet });
                  }
                } catch {}
              }
            }
          }
        }
      } catch {}
    }

    // Build a short context block listing suggestions with internal links
    const cleaned = (s: string) => s.replace(/\n/g, ' ').replace(/<[^>]+>/g, '');
    const available = suggestionList.slice(0, 5)
      .map((s, i) => `- ${s.title} | slug: ${s.slug} | link: /articles/${s.slug} | blurb: ${cleaned(s.snippet)}`)
      .join('\n');
    const suggestionsContext = suggestionList.length > 0
      ? `AvailableArticles (choose from these only):\n${available}`
      : 'AvailableArticles: (none)';

    const payload = {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            system ||
            'You are a concise, friendly assistant for a Next.js/React/TypeScript blog. '
            + 'If user intent is unclear, first ask a short clarifying question. '
            + 'When recommending articles, you MUST ONLY choose from the list under "AvailableArticles". '
            + 'Suggest at most 3 items and format links exactly as /articles/slug. '
            + 'Do NOT invent or reference articles that are not in AvailableArticles. '
            + 'Be brief and actionable. If AvailableArticles is (none), ask a clarifying question.',
        },
        { role: 'system', content: suggestionsContext },
        ...history,
      ],
      temperature: 0.7,
      max_tokens: 500,
    };

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return NextResponse.json({ error: 'OpenAI error', detail: text }, { status: 502 });
    }

    const data: any = await res.json();
    const reply: string = data?.choices?.[0]?.message?.content || '';
    return NextResponse.json({ reply, suggestions: suggestionList.slice(0, 3) });
  } catch (e: any) {
    return NextResponse.json({ error: 'Internal error', detail: e?.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'POST messages to chat with the assistant.' });
}
