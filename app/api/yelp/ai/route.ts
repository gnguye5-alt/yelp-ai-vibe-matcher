import { NextRequest, NextResponse } from 'next/server';
import { searchWithYelpAI, buildVibeQuery, calculateVibeScores, calculateVibeMatch, VibePreferences, YelpBusiness } from '@/lib/yelp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      searchTerm,
      location,
      noiseLevel = 50,
      cozyFactor = 50,
      focusLevel = 50,
      chatId,
      latitude,
      longitude,
    } = body;

    if (!location && !latitude) {
      return NextResponse.json(
        { error: 'Location or coordinates are required' },
        { status: 400 }
      );
    }

    // Build vibe preferences
    const preferences: VibePreferences = {
      noiseLevel,
      cozyFactor,
      focusLevel,
    };

    // Build the natural language query
    const query = buildVibeQuery(
      searchTerm || '',
      location || 'current location',
      preferences
    );

    console.log('Yelp AI Query:', query);

    // Call Yelp AI API
    const aiResponse = await searchWithYelpAI(
      query,
      chatId,
      latitude && longitude ? { latitude, longitude } : undefined
    );

    // Extract businesses from the response
    const businesses: YelpBusiness[] = [];

    if (aiResponse.entities && aiResponse.entities.length > 0) {
      for (const entity of aiResponse.entities) {
        if (entity.businesses) {
          businesses.push(...entity.businesses);
        }
      }
    }

    // Calculate vibe scores and match percentage for each business
    const businessesWithVibes = businesses.map((business) => {
      const vibeScores = calculateVibeScores(business);
      const vibeMatch = calculateVibeMatch(vibeScores, preferences);

      return {
        ...business,
        vibeScores,
        vibeMatch,
      };
    });

    // Sort by match percentage (highest first)
    businessesWithVibes.sort((a, b) => b.vibeMatch.overall - a.vibeMatch.overall);

    return NextResponse.json({
      businesses: businessesWithVibes,
      total: businesses.length,
      aiResponse: {
        text: aiResponse.response.text,
        chatId: aiResponse.chat_id,
      },
      query,
    });
  } catch (error) {
    console.error('Yelp AI API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch from Yelp AI' },
      { status: 500 }
    );
  }
}
