'use client';

import { useState } from 'react';
import Image from 'next/image';
import VibeSlider from '@/components/VibeSlider';
import BusinessCard from '@/components/BusinessCard';

interface Business {
  id: string;
  name: string;
  image_url: string;
  url: string;
  review_count: number;
  categories: { alias: string; title: string }[];
  rating: number;
  price?: string;
  location: {
    address1: string;
    city: string;
    state: string;
    formatted_address?: string;
  };
  display_phone: string;
  vibeScores?: {
    cozy: number;
    noise: number;
    focus: number;
  };
  vibeMatch?: {
    overall: number;
    breakdown: {
      noise: number;
      cozy: number;
      focus: number;
    };
  };
  summaries?: {
    short?: string;
    medium?: string;
    long?: string;
  };
  contextual_info?: {
    summary?: string | null;
    review_snippet?: string;
  };
}

interface AIResponse {
  text: string;
  chatId: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('San Francisco');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);

  // Vibe slider states
  const [noiseLevel, setNoiseLevel] = useState(50);
  const [cozyFactor, setCozyFactor] = useState(50);
  const [focusLevel, setFocusLevel] = useState(50);

  const handleSearch = async () => {
    if (!searchQuery) {
      setError('Please enter a location or search term');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use Yelp AI API
      const response = await fetch('/api/yelp/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerm: searchQuery,
          location: searchQuery,
          noiseLevel,
          cozyFactor,
          focusLevel,
          chatId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch businesses');
      }

      const data = await response.json();
      setBusinesses(data.businesses || []);

      if (data.aiResponse) {
        setAiResponse(data.aiResponse);
        setChatId(data.aiResponse.chatId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  // Get vibe scores from business data or calculate based on slider positions
  const getVibeScores = (business: Business) => {
    if (business.vibeScores) {
      return business.vibeScores;
    }
    // Fallback to slider-based calculation if no vibe scores available
    return {
      cozy: Math.floor((cozyFactor / 100) * 5),
      noise: Math.floor((noiseLevel / 100) * 5),
      focus: Math.floor((focusLevel / 100) * 5),
    };
  };

  // Get a review snippet or summary for the business
  const getBusinessQuote = (business: Business): string => {
    if (business.contextual_info?.review_snippet) {
      // Clean up the review snippet (remove highlight markers)
      return business.contextual_info.review_snippet
        .replace(/\[\[HIGHLIGHT\]\]/g, '')
        .replace(/\[\[ENDHIGHLIGHT\]\]/g, '');
    }
    if (business.summaries?.short) {
      return business.summaries.short;
    }
    if (business.summaries?.medium) {
      return business.summaries.medium;
    }
    return 'A great spot with wonderful vibes!';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <main className="container mx-auto px-6 py-5 max-w-7xl">
        {/* Logo */}
        <div className="mb-4">
          <div className="w-[100px] h-[40px] relative">
            <Image
              src="/yelp-logo.svg"
              alt="Yelp"
              width={100}
              height={40}
              priority
            />
          </div>
        </div>

        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 shadow-sm rounded-lg mb-0 pb-1">
          <div className="px-6 py-5">
            {/* Title */}
            <div className="flex flex-col gap-1 mb-5">
              <h1 className="text-base font-normal text-[#101828] tracking-tight text-center">
                Find the perfect vibe.
              </h1>
              <p className="text-sm text-[#4a5565] tracking-tight text-center">
                Adjust the vibes and explore matching places.
              </p>
            </div>

            {/* Search Input */}
            <div className="flex justify-center mb-2">
              <div className="relative w-[576px]">
                <svg
                  className="absolute left-3 top-3.5 w-4 h-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search city or place type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-[#d1d5dc] rounded-lg text-sm placeholder:text-[rgba(10,10,10,0.5)] focus:outline-none focus:ring-2 focus:ring-[#9810fa] focus:border-transparent"
                />
              </div>
            </div>

            {/* Vibe Sliders */}
            <div className="py-4 space-y-9 max-w-full">
              <VibeSlider
                label="Noise Level"
                icon={
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M7 3a.667.667 0 01.667.667v8.666a.667.667 0 01-1.334 0V3.667A.667.667 0 017 3zM4.333 5.667a.667.667 0 01.667.666v3.334a.667.667 0 01-1.333 0V6.333a.667.667 0 01.666-.666zM9.667 5.667a.667.667 0 01.666.666v3.334a.667.667 0 01-1.333 0V6.333a.667.667 0 01.667-.666zM12.333 7.333a.667.667 0 01.667.667v.667a.667.667 0 01-1.333 0V8a.667.667 0 01.666-.667z" />
                  </svg>
                }
                minLabel="Quiet"
                maxLabel="Lively"
                value={noiseLevel}
                onChange={setNoiseLevel}
              />

              <VibeSlider
                label="Cozy Factor"
                icon={
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 2.667a.667.667 0 01.667.666v.334a.667.667 0 01-1.334 0v-.334A.667.667 0 018 2.667zM3.757 4.343a.667.667 0 01.943 0l.236.236a.667.667 0 11-.943.943l-.236-.236a.667.667 0 010-.943zM11.3 4.343a.667.667 0 01.943.943l-.236.236a.667.667 0 11-.943-.943l.236-.236zM8 6a2 2 0 100 4 2 2 0 000-4zM2 12a.667.667 0 01.667-.667h10.666a.667.667 0 110 1.333H2.667A.667.667 0 012 12z" />
                  </svg>
                }
                minLabel="Low"
                maxLabel="High"
                value={cozyFactor}
                onChange={setCozyFactor}
              />

              <VibeSlider
                label="Focus / Work-Ready"
                icon={
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 3.333a4.667 4.667 0 100 9.334 4.667 4.667 0 000-9.334zM8 6a2 2 0 110 4 2 2 0 010-4z" />
                  </svg>
                }
                minLabel="Casual"
                maxLabel="Work-Friendly"
                value={focusLevel}
                onChange={setFocusLevel}
              />
            </div>

            {/* Apply Filters Button */}
            <div className="flex justify-center mt-2">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-[#9810fa] hover:bg-[#8610d9] text-white font-normal text-sm px-5 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed tracking-tight"
              >
                {loading ? 'Searching...' : 'Apply Filters'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto my-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        )}

        {/* Results Section */}
        {businesses.length > 0 && (
          <div className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#101828] mb-1">
                Vibe Matches Near You
              </h2>
              <p className="text-sm text-[#4a5565]">
                {businesses.length} results found
              </p>
            </div>

            {/* AI Response Summary */}
            {aiResponse && (
              <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-[#4a5565] italic">
                  <span className="font-medium text-purple-700">AI Insight:</span> {aiResponse.text}
                </p>
              </div>
            )}

            <div className="space-y-4">
              {businesses.map((business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  vibeScores={getVibeScores(business)}
                  vibeMatch={business.vibeMatch}
                  quote={getBusinessQuote(business)}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-10">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-2 bg-[#9810fa] text-white rounded-lg text-sm">
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                3
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && businesses.length === 0 && !error && (
          <div className="text-center py-16 mt-6">
            <p className="text-zinc-500 text-lg">
              Adjust your vibe preferences and click &ldquo;Apply Filters&rdquo; to discover amazing local businesses!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
