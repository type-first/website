import { NextRequest, NextResponse } from 'next/server';
import { searchHybrid } from '@/lib/search';

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

    const results = await searchHybrid(query, limit);
    
    return NextResponse.json({ 
      results,
      total: results.length,
      type: 'hybrid',
      query 
    });
  } catch (error) {
    console.error('Hybrid search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform hybrid search' },
      { status: 500 }
    );
  }
}
