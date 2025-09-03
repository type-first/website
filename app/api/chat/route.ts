import { NextRequest, NextResponse } from 'next/server';

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

    const payload = {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            system ||
            'You are a concise, friendly coding assistant for a blog about Next.js, React, and TypeScript. Keep replies short and actionable.',
        },
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
    return NextResponse.json({ reply });
  } catch (e: any) {
    return NextResponse.json({ error: 'Internal error', detail: e?.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'POST messages to chat with the assistant.' });
}

