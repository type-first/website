import { NextRequest, NextResponse } from 'next/server';

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

    // Placeholder implementation - backend functionality removed
    const results: any[] = [];
    
    return NextResponse.json({ 
      results,
      total: 0,
      type: 'vector',
      message: 'Vector search functionality is currently unavailable. Backend implementation has been removed.'
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

    // Placeholder implementation - backend functionality removed
    const results: any[] = [];
    
    return NextResponse.json({ 
      results,
      total: 0,
      type: 'vector',
      query,
      message: 'Vector search functionality is currently unavailable. Backend implementation has been removed.'
    });
  } catch (error) {
    console.error('Vector search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform vector search' },
      { status: 500 }
    );
  }
}
