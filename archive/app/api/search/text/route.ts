import { NextRequest, NextResponse } from 'next/server';
import { searchChunksRegistry } from '@/content/chunks.registry';
import { textSearch } from '@/lib/content/search/text';

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

    // Use centralized text search function
    const searchResults = textSearch(query, [...searchChunksRegistry]);

    // Apply limit
    const limitedResults = searchResults.slice(0, limit);

    return NextResponse.json({
      query,
      results: limitedResults,
      total: limitedResults.length,
      searchType: 'text',
      limit,
    });

  } catch (error) {
    console.error('Text search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query parameter is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Use centralized text search function
    const searchResults = textSearch(query, [...searchChunksRegistry]);

    return NextResponse.json({
      results: searchResults,
      meta: {
        total: searchResults.length,
        query: query.trim(),
        searchType: 'text'
      }
    });

  } catch (error) {
    console.error('Text search error:', error);
    return NextResponse.json(
      { error: 'Internal server error during text search' },
      { status: 500 }
    );
  }
}