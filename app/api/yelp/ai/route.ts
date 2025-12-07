import { NextRequest, NextResponse } from 'next/server';
import { searchWithYelpAI, buildVibeQuery, calculateVibeScores, calculateVibeMatch, VibePreferences, YelpBusiness } from '@/lib/yelp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      query: userQuery = '',
      location,
      noiseLevel = 50,
      cozyFactor = 50,
      focusLevel = 50,
      chatId,
      latitude,
      longitude,
    } = body;

    // Require either coordinates or location text, or allow searches with neither (Yelp AI will handle)
    // This is flexible to support various use cases

    // Build vibe preferences
    const preferences: VibePreferences = {
      noiseLevel,
      cozyFactor,
      focusLevel,
    };

    // Build the natural language query from user input and vibe preferences
    const enhancedQuery = buildVibeQuery(
      userQuery,
      preferences,
      location
    );

    console.log('Yelp AI Query:', enhancedQuery);

    // Call Yelp AI API
    const aiResponse = await searchWithYelpAI(
      enhancedQuery,
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

    // Log sample business data to understand structure
    if (businesses.length > 0) {
      console.log('Sample business data:', {
        name: businesses[0].name,
        is_closed: businesses[0].is_closed,
        hours: businesses[0].hours,
        allKeys: Object.keys(businesses[0])
      });
    }

    // Calculate vibe scores and match percentage for each business
    const businessesWithVibes = businesses.map((business) => {
      const vibeScores = calculateVibeScores(business);
      const vibeMatch = calculateVibeMatch(vibeScores, preferences);

      // Extract image_url from contextual_info.photos if not directly available
      let imageUrl = business.image_url;
      if (!imageUrl && business.contextual_info?.photos?.length) {
        imageUrl = business.contextual_info.photos[0].original_url;
      }

      return {
        ...business,
        image_url: imageUrl || '',
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
      query: enhancedQuery,
    });
  } catch (error) {
    console.error('Yelp AI API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch from Yelp AI' },
      { status: 500 }
    );
  }
}
