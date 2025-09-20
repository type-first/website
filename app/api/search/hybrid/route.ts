import { NextRequest, NextResponse } from 'next/server';
import { searchChunksRegistry } from '@/content/chunks.registry';
import { hybridSearch } from '@/lib/content/search/hybrid';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');
    const textWeight = parseFloat(searchParams.get('textWeight') || '0.4');
    const vectorWeight = parseFloat(searchParams.get('vectorWeight') || '0.6');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Use centralized hybrid search function
    const searchResults = await hybridSearch(
      query, 
      [...searchChunksRegistry], 
      { 
        limit,
        textWeight,
        vectorWeight 
      }
    );

    return NextResponse.json({
      query,
      results: searchResults,
      totalResults: searchResults.length,
      searchType: 'hybrid',
      meta: {
        textWeight,
        vectorWeight,
        total: searchResults.length
      }
    });
  } catch (error) {
    console.error('Hybrid search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, limit = 10, textWeight = 0.3, vectorWeight = 0.7 } = body;
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required in request body' },
        { status: 400 }
      );
    }

    const searchResults = await hybridSearch(
      query, 
      [...searchChunksRegistry], 
      { 
        limit,
        textWeight,
        vectorWeight 
      }
    );

    return NextResponse.json({
      query,
      results: searchResults,
      totalResults: searchResults.length,
      searchType: 'hybrid',
      meta: {
        textWeight,
        vectorWeight,
        total: searchResults.length
      }
    });
  } catch (error) {
    console.error('Hybrid search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
