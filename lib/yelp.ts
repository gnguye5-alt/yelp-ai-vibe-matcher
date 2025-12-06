// Yelp API types
export interface YelpBusiness {
  id: string;
  name: string;
  image_url?: string;
  url: string;
  review_count: number;
  categories: { alias: string; title: string }[];
  rating: number;
  coordinates: { latitude: number; longitude: number };
  price?: string;
  location: {
    address1: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    formatted_address?: string;
  };
  phone: string;
  display_phone?: string;
  distance?: number;
  attributes?: {
    NoiseLevel?: string | null;
    WiFi?: string | null;
    Ambience?: {
      cozy?: boolean | null;
      casual?: boolean | null;
      trendy?: boolean | null;
      intimate?: boolean | null;
      romantic?: boolean | null;
    } | null;
    GoodForKids?: boolean | null;
    RestaurantsGoodForGroups?: boolean | null;
    HasTV?: boolean | null;
  };
  summaries?: {
    short?: string;
    medium?: string;
    long?: string;
  };
  contextual_info?: {
    summary?: string | null;
    review_snippet?: string;
    photos?: {
      original_url: string;
    }[];
  };
}

export interface YelpSearchResponse {
  businesses: YelpBusiness[];
  total: number;
  region: {
    center: { latitude: number; longitude: number };
  };
}

export interface YelpSearchParams {
  term?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  categories?: string;
  limit?: number;
  offset?: number;
  sort_by?: 'best_match' | 'rating' | 'review_count' | 'distance';
}

// Yelp AI API types
export interface YelpAIChatRequest {
  query: string;
  chat_id?: string;
  user_context?: {
    locale?: string;
    latitude?: number;
    longitude?: number;
  };
}

export interface YelpAIChatResponse {
  response: {
    text: string;
    tags?: {
      tag_type: string;
      start: number;
      end: number;
      meta?: {
        business_id?: string;
      };
    }[];
  };
  types: string[];
  entities: {
    businesses?: YelpBusiness[];
  }[];
  chat_id: string;
}

export interface VibePreferences {
  noiseLevel: number; // 0-100: 0 = quiet, 100 = lively
  cozyFactor: number; // 0-100: 0 = minimal, 100 = very cozy
  focusLevel: number; // 0-100: 0 = casual, 100 = work-friendly
}

/**
 * Search for businesses using the Yelp API
 */
export async function searchYelpBusinesses(
  params: YelpSearchParams
): Promise<YelpSearchResponse> {
  const apiKey = process.env.YELP_API_KEY;

  if (!apiKey) {
    throw new Error('YELP_API_KEY is not set in environment variables');
  }

  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  const response = await fetch(
    `https://api.yelp.com/v3/businesses/search?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Don't cache API responses
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Yelp API error: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * Get details for a specific business
 */
export async function getYelpBusiness(businessId: string): Promise<YelpBusiness> {
  const apiKey = process.env.YELP_API_KEY;

  if (!apiKey) {
    throw new Error('YELP_API_KEY is not set in environment variables');
  }

  const response = await fetch(
    `https://api.yelp.com/v3/businesses/${businessId}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Yelp API error: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * Convert vibe preferences to a natural language query
 */
export function buildVibeQuery(
  searchTerm: string,
  location: string,
  preferences: VibePreferences
): string {
  const parts: string[] = [];

  // Add search term context
  if (searchTerm && searchTerm !== location) {
    parts.push(searchTerm);
  }

  // Add noise level preference
  if (preferences.noiseLevel < 30) {
    parts.push('quiet');
  } else if (preferences.noiseLevel > 70) {
    parts.push('lively');
    parts.push('vibrant atmosphere');
  }

  // Add cozy factor preference
  if (preferences.cozyFactor > 70) {
    parts.push('cozy');
    parts.push('warm ambiance');
  } else if (preferences.cozyFactor < 30) {
    parts.push('modern');
    parts.push('minimalist');
  }

  // Add focus/work preference
  if (preferences.focusLevel > 70) {
    parts.push('good for working');
    parts.push('has WiFi');
    parts.push('quiet enough to focus');
  } else if (preferences.focusLevel < 30) {
    parts.push('casual hangout spot');
    parts.push('social atmosphere');
  }

  // Build the query
  const vibeDescription = parts.length > 0 ? parts.join(', ') : 'restaurant or cafe';
  return `Find me ${vibeDescription} places in ${location}`;
}

/**
 * Search for businesses using the Yelp AI Chat API
 */
export async function searchWithYelpAI(
  query: string,
  chatId?: string,
  userContext?: { latitude?: number; longitude?: number }
): Promise<YelpAIChatResponse> {
  const apiKey = process.env.YELP_API_KEY;

  if (!apiKey) {
    throw new Error('YELP_API_KEY is not set in environment variables');
  }

  const requestBody: YelpAIChatRequest = {
    query,
    user_context: {
      locale: 'en_US',
      ...userContext,
    },
  };

  if (chatId) {
    requestBody.chat_id = chatId;
  }

  const response = await fetch('https://api.yelp.com/ai/chat/v2', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Yelp AI API error: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * Keywords and weights for vibe analysis from reviews/summaries
 */
const VIBE_KEYWORDS = {
  noise: {
    quiet: ['quiet', 'peaceful', 'calm', 'serene', 'tranquil', 'silent', 'relaxed', 'chill', 'mellow', 'soft music'],
    moderate: ['moderate', 'ambient', 'background music', 'comfortable noise'],
    lively: ['lively', 'vibrant', 'bustling', 'energetic', 'loud', 'noisy', 'crowded', 'busy', 'happening', 'upbeat', 'buzzing', 'packed', 'hopping'],
  },
  cozy: {
    high: ['cozy', 'warm', 'intimate', 'comfortable', 'homey', 'welcoming', 'charming', 'snug', 'inviting', 'rustic', 'quaint', 'cute', 'adorable', 'lovely ambiance', 'fireplace'],
    moderate: ['nice', 'pleasant', 'decent', 'comfortable'],
    low: ['sterile', 'cold', 'industrial', 'minimalist', 'modern', 'sleek', 'clinical', 'bare', 'sparse'],
  },
  focus: {
    high: ['work', 'working', 'laptop', 'laptops', 'wifi', 'wi-fi', 'study', 'studying', 'productive', 'focus', 'remote work', 'freelancer', 'outlet', 'outlets', 'power outlets', 'workspace', 'meetings', 'quiet corner', 'good for work'],
    moderate: ['tables', 'seating', 'spacious'],
    low: ['social', 'hangout', 'party', 'date night', 'groups', 'loud music', 'bar scene', 'nightlife', 'dancing'],
  },
};

/**
 * Analyze text for keyword occurrences and calculate a weighted score
 */
function analyzeTextForKeywords(
  text: string,
  keywords: { high?: string[]; low?: string[]; quiet?: string[]; lively?: string[]; moderate?: string[] }
): number {
  const lowerText = text.toLowerCase();
  let score = 50; // Start at neutral (middle)

  // Check for high/lively keywords (increase score)
  const highKeywords = keywords.high || keywords.lively || [];
  for (const keyword of highKeywords) {
    if (lowerText.includes(keyword)) {
      score += 15;
    }
  }

  // Check for low/quiet keywords (decrease score)
  const lowKeywords = keywords.low || keywords.quiet || [];
  for (const keyword of lowKeywords) {
    if (lowerText.includes(keyword)) {
      score -= 15;
    }
  }

  // Check for moderate keywords (slight adjustment toward middle)
  const moderateKeywords = keywords.moderate || [];
  for (const keyword of moderateKeywords) {
    if (lowerText.includes(keyword)) {
      score += (50 - score) * 0.1; // Move slightly toward middle
    }
  }

  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate vibe scores from business attributes and review text analysis
 * Returns scores on 0-100 scale for better precision
 */
export function calculateVibeScores(business: YelpBusiness): {
  cozy: number;
  noise: number;
  focus: number;
} {
  // Combine all available text for analysis
  const textSources = [
    business.summaries?.long || '',
    business.summaries?.medium || '',
    business.summaries?.short || '',
    business.contextual_info?.summary || '',
    business.contextual_info?.review_snippet || '',
  ];
  const combinedText = textSources.join(' ').toLowerCase();

  // Start with text analysis scores (0-100 scale)
  let noiseScore = analyzeTextForKeywords(combinedText, VIBE_KEYWORDS.noise);
  let cozyScore = analyzeTextForKeywords(combinedText, VIBE_KEYWORDS.cozy);
  let focusScore = analyzeTextForKeywords(combinedText, VIBE_KEYWORDS.focus);

  // Adjust based on business attributes if available
  const attributes = business.attributes;

  if (attributes) {
    // Noise level from attributes
    if (attributes.NoiseLevel) {
      const noiseMap: Record<string, number> = {
        quiet: 20,
        average: 50,
        loud: 75,
        very_loud: 95,
      };
      const attrNoise = noiseMap[attributes.NoiseLevel];
      if (attrNoise !== undefined) {
        // Blend attribute score with text analysis (attributes are more reliable)
        noiseScore = (noiseScore * 0.4) + (attrNoise * 0.6);
      }
    }

    // Cozy from ambience attributes
    if (attributes.Ambience) {
      const ambience = attributes.Ambience;
      let cozyBoost = 0;
      if (ambience.cozy) cozyBoost += 25;
      if (ambience.intimate) cozyBoost += 20;
      if (ambience.romantic) cozyBoost += 15;
      if (ambience.casual) cozyBoost += 10;
      cozyScore = Math.min(100, cozyScore + cozyBoost);
    }

    // Focus from WiFi and noise
    if (attributes.WiFi === 'free') {
      focusScore = Math.min(100, focusScore + 25);
    } else if (attributes.WiFi === 'paid') {
      focusScore = Math.min(100, focusScore + 15);
    }

    // Quiet places are better for focus
    if (attributes.NoiseLevel === 'quiet') {
      focusScore = Math.min(100, focusScore + 15);
    } else if (attributes.NoiseLevel === 'loud' || attributes.NoiseLevel === 'very_loud') {
      focusScore = Math.max(0, focusScore - 20);
    }

    // TV can be distracting
    if (attributes.HasTV) {
      focusScore = Math.max(0, focusScore - 10);
    }
  }

  // Round to integers
  return {
    cozy: Math.round(cozyScore),
    noise: Math.round(noiseScore),
    focus: Math.round(focusScore),
  };
}

/**
 * Calculate how well a business matches user's vibe preferences
 * Returns a percentage (0-100) indicating match quality
 */
export function calculateVibeMatch(
  businessVibes: { cozy: number; noise: number; focus: number },
  userPreferences: VibePreferences
): {
  overall: number;
  breakdown: {
    noise: number;
    cozy: number;
    focus: number;
  };
} {
  // Calculate individual match percentages (100 = perfect match)
  // The closer the business vibe is to user preference, the higher the match

  const noiseMatch = 100 - Math.abs(userPreferences.noiseLevel - businessVibes.noise);
  const cozyMatch = 100 - Math.abs(userPreferences.cozyFactor - businessVibes.cozy);
  const focusMatch = 100 - Math.abs(userPreferences.focusLevel - businessVibes.focus);

  // Calculate weighted overall match (equal weights for now)
  const overall = Math.round((noiseMatch + cozyMatch + focusMatch) / 3);

  return {
    overall,
    breakdown: {
      noise: Math.round(noiseMatch),
      cozy: Math.round(cozyMatch),
      focus: Math.round(focusMatch),
    },
  };
}
