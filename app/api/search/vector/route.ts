import { NextRequest, NextResponse } from 'next/server';
import { searchByVector } from '@/lib/search';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { embedding, limit = 10 } = body;

    if (!embedding || !Array.isArray(embedding)) {
      return NextResponse.json(
        { error: 'embedding array is required' },
        { status: 400 }
      );
    }

    const results = await searchByVector(embedding, limit);
    
    return NextResponse.json({ 
      results,
      total: results.length,
      type: 'vector' 
    });
  } catch (error) {
    console.error('Vector search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform vector search' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query) {
      return NextResponse.json(
        { error: 'query parameter is required' },
        { status: 400 }
      );
    }

    // Generate embedding for the query
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: query.slice(0, 8000),
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const embedding = data.data[0].embedding;

    const results = await searchByVector(embedding, limit);
    
    return NextResponse.json({ 
      results,
      total: results.length,
      type: 'vector',
      query 
    });
  } catch (error) {
    console.error('Vector search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform vector search' },
      { status: 500 }
    );
  }
}
