import { NextRequest, NextResponse } from 'next/server';
import { searchYelpBusinesses } from '@/lib/yelp';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const params = {
      term: searchParams.get('term') || undefined,
      location: searchParams.get('location') || undefined,
      latitude: searchParams.get('latitude')
        ? parseFloat(searchParams.get('latitude')!)
        : undefined,
      longitude: searchParams.get('longitude')
        ? parseFloat(searchParams.get('longitude')!)
        : undefined,
      radius: searchParams.get('radius')
        ? parseInt(searchParams.get('radius')!)
        : undefined,
      categories: searchParams.get('categories') || undefined,
      limit: searchParams.get('limit')
        ? parseInt(searchParams.get('limit')!)
        : 20,
      offset: searchParams.get('offset')
        ? parseInt(searchParams.get('offset')!)
        : undefined,
      sort_by: (searchParams.get('sort_by') as any) || 'best_match',
    };

    const data = await searchYelpBusinesses(params);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Yelp API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch businesses' },
      { status: 500 }
    );
  }
}
