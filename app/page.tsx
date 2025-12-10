'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import VibeSlider from '@/components/VibeSlider';
import { FaRegCoffee, FaRegBriefcase, FaRegHeadphones } from '@/components/Icons';
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
  is_closed?: boolean;
  hours?: {
    hours_type: string;
    open: {
      day: number;
      start: string;
      end: string;
      is_overnight: boolean;
    }[];
    is_open_now?: boolean;
  }[];
  vibeScores?: {
    cozy: number;
    quiet: number;
    focus: number;
  };
  vibeMatch?: {
    overall: number;
    breakdown: {
      quiet: number;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);

  // Geolocation state
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Vibe slider states
  const [quietLevel, setquietLevel] = useState(50);
  const [cozyFactor, setCozyFactor] = useState(50);
  const [focusLevel, setFocusLevel] = useState(50);

  // Request geolocation on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationLoading(false);
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
          setLocationError(error.message);
          setLocationLoading(false);
        },
        {
          timeout: 10000,
          enableHighAccuracy: false,
        }
      );
    } else {
      setLocationError('Geolocation not supported');
      setLocationLoading(false);
    }
  }, []);

  const handleSearch = async () => {
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
          query: searchQuery,
          location: locationInput || undefined,
          latitude: userLocation?.latitude,
          longitude: userLocation?.longitude,
          quietLevel,
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
      quiet: Math.floor((quietLevel / 100) * 5),
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
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Logo only, no top bar */}
      <div className="px-6 pt-6">
        <div className="w-[80px] h-auto relative">
          <Image
            src="/yelp-logo.svg"
            alt="Yelp"
            width={80}
            height={32}
            priority
            className="w-auto h-auto"
          />
        </div>
      </div>

      <main className="container mx-auto px-6 pt-5 max-w-7xl">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 shadow-sm rounded-lg mb-0 pb-1">
          <div className="px-6 py-5">
            {/* Title */}
            <div className="flex flex-col gap-1 mb-5">
              <h1 className="font-['Poppins'] font-bold text-3xl leading-10 text-[#FA4848] text-center">
                Let's find the perfect vibe for you
              </h1>
              <p className="font-['Open_Sans'] font-normal text-l leading-6 text-[#6B6D6F] text-center">
                Adjust the vibes and explore matching places
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
                  placeholder="Describe your ideal vibe... (e.g., warm cozy cafe, quiet study spot)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F7F7F7] border border-[#E3E3E3] rounded-lg font-['Open_Sans'] text-base leading-6 placeholder:text-[#898A8B] focus:outline-none"
                />
              </div>
            </div>

            {/* Location Status & Manual Input */}
            <div className="flex justify-center mb-2">
              <div className="w-[576px]">
                {locationLoading ? (
                  <p className="text-xs text-[#898A8B] text-center">📍 Detecting your location...</p>
                ) : userLocation ? (
                  <p className="text-xs text-green-600 text-center">✓ Location detected</p>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs text-amber-600 text-center">⚠ Location not available</p>
                    <input
                      type="text"
                      placeholder="Enter location manually (e.g., San Francisco, CA)"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full px-3 py-1.5 bg-[#F7F7F7] border border-[#E3E3E3] rounded text-sm font-['Open_Sans'] placeholder:text-[#898A8B] focus:outline-none focus:border-[#FA4848]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Vibe Sliders */}
            <div className="py-4 space-y-9 max-w-full">
              <VibeSlider
                label="Quiet"
                icon={<FaRegHeadphones />}
                minLabel="Quiet"
                maxLabel="Lively"
                value={quietLevel}
                onChange={setquietLevel}
              />

              <VibeSlider
                label="Cozy"
                icon={<FaRegCoffee />}
                minLabel="Low"
                maxLabel="High"
                value={cozyFactor}
                onChange={setCozyFactor}
              />

              <VibeSlider
                label="Focus"
                icon={<FaRegBriefcase />}
                minLabel="Casual"
                maxLabel="Work-friendly"
                value={focusLevel}
                onChange={setFocusLevel}
              />
            </div>

            {/* Apply Filters Button */}
            <div className="flex justify-center mt-2">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-[#D71616] hover:bg-[#FA4848] text-white font-['Poppins'] font-bold text-base leading-6 px-6 py-2.5 rounded-md transition-colors disabled:bg-[#C8C9CA] disabled:text-white disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Apply Filters'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto my-6 bg-[#FFECEC] border border-[#FA4848]/30 rounded-lg p-4 text-[#D71616]">
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

            {/* AI Response Summary
            {aiResponse && (
              <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-[#4a5565] italic">
                  <span className="font-medium text-purple-700">AI Insight:</span> {aiResponse.text}
                </p>
              </div>
            )} */}

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
          </div>
        )}

        {/* Empty State */}
        {!loading && businesses.length === 0 && !error && (
          <div className="text-center py-16 mt-6">
            <p className="text-zinc-500 text-lg">
              Adjust your vibe preferences and click &ldquo;Apply Filters&rdquo; to discover amazing local businesses
            </p>
          </div>
        )}
      <div className="pb-20" />
    </main>
    </div>
  );
}
