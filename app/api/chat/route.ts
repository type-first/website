import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'messages array is required' }, { status: 400 });
    }

    // Placeholder implementation - backend functionality removed
    const reply = "I'm sorry, but the chat functionality is currently unavailable. The backend implementation has been removed.";
    const suggestions: Array<{ id: string; title: string; slug: string; snippet: string }> = [];

    return NextResponse.json({ reply, suggestions });
  } catch (e: any) {
    return NextResponse.json({ error: 'Internal error', detail: e?.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'POST messages to chat with the assistant.' });
}
