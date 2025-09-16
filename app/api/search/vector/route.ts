import { NextRequest, NextResponse } from 'next/server';
import { searchChunksRegistry } from '@/content/chunks.registry';
import { vectorSearch } from '@/lib/content/search/vector';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Use centralized vector search function
    const searchResults = await vectorSearch(query, [...searchChunksRegistry], { limit });
    
    return NextResponse.json({
      query,
      results: searchResults,
      totalResults: searchResults.length,
      searchType: 'vector'
    });
  } catch (error) {
    console.error('Vector search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required in request body' },
        { status: 400 }
      );
    }

    const searchResults = await vectorSearch(query, [...searchChunksRegistry]);
    
    return NextResponse.json({
      query,
      results: searchResults,
      totalResults: searchResults.length,
      searchType: 'vector'
    });
  } catch (error) {
    console.error('Vector search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
