import { NextRequest, NextResponse } from 'next/server';

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
      type: 'hybrid',
      query,
      message: 'Hybrid search functionality is currently unavailable. Backend implementation has been removed.'
    });
  } catch (error) {
    console.error('Hybrid search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform hybrid search' },
      { status: 500 }
    );
  }
}
