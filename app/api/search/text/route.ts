import { NextRequest, NextResponse } from 'next/server';
import { searchByText } from '@/lib/search/v0/search';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, limit = 10 } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'query string is required' },
        { status: 400 }
      );
    }

    const results = await searchByText(query, limit);
    
    return NextResponse.json({ 
      results,
      total: results.length,
      query,
      limit
    });
    
  } catch (error) {
    console.error('Text search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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

    const results = await searchByText(query, limit);
    
    return NextResponse.json({ 
      results,
      total: results.length,
      query,
      limit
    });
    
  } catch (error) {
    console.error('Text search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}