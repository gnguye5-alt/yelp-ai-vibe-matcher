import React from 'react';
import Image from 'next/image';
import VibeIndicator from './VibeIndicator';

interface BusinessCardProps {
  business: {
    id: string;
    name: string;
    image_url: string;
    rating: number;
    review_count: number;
    categories: { alias: string; title: string }[];
    location: {
      address1?: string;
      city: string;
      state: string;
      formatted_address?: string;
    };
    price?: string;
    display_phone?: string;
    url: string;
  };
  vibeScores?: {
    cozy: number; // 0-100
    noise: number; // 0-100
    focus: number; // 0-100
  };
  vibeMatch?: {
    overall: number;
    breakdown: {
      noise: number;
      cozy: number;
      focus: number;
    };
  };
  quote?: string;
}

// Helper to get match color based on percentage
function getMatchColor(percentage: number): string {
  if (percentage >= 80) return 'bg-green-500';
  if (percentage >= 60) return 'bg-lime-500';
  if (percentage >= 40) return 'bg-yellow-500';
  if (percentage >= 20) return 'bg-orange-500';
  return 'bg-red-500';
}

function getMatchTextColor(percentage: number): string {
  if (percentage >= 80) return 'text-green-700';
  if (percentage >= 60) return 'text-lime-700';
  if (percentage >= 40) return 'text-yellow-700';
  if (percentage >= 20) return 'text-orange-700';
  return 'text-red-700';
}

function getMatchBgColor(percentage: number): string {
  if (percentage >= 80) return 'bg-green-50 border-green-200';
  if (percentage >= 60) return 'bg-lime-50 border-lime-200';
  if (percentage >= 40) return 'bg-yellow-50 border-yellow-200';
  if (percentage >= 20) return 'bg-orange-50 border-orange-200';
  return 'bg-red-50 border-red-200';
}

export default function BusinessCard({ business, vibeScores, vibeMatch, quote }: BusinessCardProps) {
  // Generate star rating
  const fullStars = Math.floor(business.rating);
  const hasHalfStar = business.rating % 1 >= 0.5;

  // Convert 0-100 scores to 0-4 for VibeIndicator display
  const normalizeScore = (score: number) => Math.round((score / 100) * 4);

  return (
    <div className="bg-white border border-[rgba(0,0,0,0.25)] rounded-2xl p-2 shadow-sm flex gap-4 items-start relative">
      {/* Match Percentage Badge */}
      {vibeMatch && (
        <div className={`absolute -top-2 -right-2 ${getMatchColor(vibeMatch.overall)} text-white text-xs font-bold px-2 py-1 rounded-full shadow-md`}>
          {vibeMatch.overall}% Vibe Match
        </div>
      )}

      {/* Image */}
      <div className="w-[123px] h-[139px] rounded-lg overflow-hidden flex-shrink-0 relative bg-gray-100">
        {business.image_url && (
          <Image
            src={business.image_url}
            alt={business.name}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        {/* Business Name */}
        <h3 className="font-bold text-base text-[#101828] tracking-tight leading-tight">
          {business.name}
        </h3>

        {/* Rating and Reviews */}
        <div className="flex gap-2 items-center">
          {/* Stars */}
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-base ${
                  i < fullStars
                    ? 'text-[#ff6b00]'
                    : i === fullStars && hasHalfStar
                    ? 'text-[#ff6b00]'
                    : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          {/* Rating number */}
          <span className="text-sm font-medium text-[#101828]">
            {business.rating}
          </span>
          {/* Review count */}
          <span className="text-sm text-[#6a7282]">
            ({business.review_count} reviews)
          </span>
        </div>

        {/* Categories */}
        <div className="flex gap-4 items-center">
          {business.categories.slice(0, 2).map((cat) => (
            <span
              key={cat.alias}
              className="bg-neutral-200 px-1 py-0.5 rounded text-sm font-semibold text-[#364153]"
            >
              {cat.title}
            </span>
          ))}
        </div>

        {/* Location and Details */}
        <div className="flex gap-2 items-start text-sm">
          <svg
            className="w-5 h-5 text-[#364153] flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-[#364153] leading-6">
            <span className="font-semibold">{business.location.city}</span>
            {business.price && (
              <>
                <span className="font-normal"> • {business.price} • </span>
              </>
            )}
            <span className="text-[#00a63e]">Open</span>
            <span className="font-normal"> until 2:00 AM</span>
          </p>
        </div>

        {/* Quote */}
        {quote && (
          <p className="text-sm text-[#4a5565] italic line-clamp-2 leading-5">
            &ldquo;{quote}&rdquo;
          </p>
        )}

        {/* Vibe Match Breakdown */}
        {vibeMatch && (
          <div className={`flex items-center gap-3 mt-1 px-2 py-1.5 rounded-lg border ${getMatchBgColor(vibeMatch.overall)}`}>
            <span className={`text-xs font-semibold ${getMatchTextColor(vibeMatch.overall)}`}>
              Vibe Match:
            </span>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1">
                <span className="text-gray-500">Noise</span>
                <span className={`font-medium ${getMatchTextColor(vibeMatch.breakdown.noise)}`}>
                  {vibeMatch.breakdown.noise}%
                </span>
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">
                <span className="text-gray-500">Cozy</span>
                <span className={`font-medium ${getMatchTextColor(vibeMatch.breakdown.cozy)}`}>
                  {vibeMatch.breakdown.cozy}%
                </span>
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">
                <span className="text-gray-500">Focus</span>
                <span className={`font-medium ${getMatchTextColor(vibeMatch.breakdown.focus)}`}>
                  {vibeMatch.breakdown.focus}%
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Vibe Indicators */}
        {vibeScores && (
          <div className="flex gap-10 mt-1">
            <VibeIndicator
              label="Cozy"
              icon={
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2.667a.667.667 0 01.667.666v.334a.667.667 0 01-1.334 0v-.334A.667.667 0 018 2.667zM3.757 4.343a.667.667 0 01.943 0l.236.236a.667.667 0 11-.943.943l-.236-.236a.667.667 0 010-.943zM11.3 4.343a.667.667 0 01.943.943l-.236.236a.667.667 0 11-.943-.943l.236-.236zM8 6a2 2 0 100 4 2 2 0 000-4zM2 12a.667.667 0 01.667-.667h10.666a.667.667 0 110 1.333H2.667A.667.667 0 012 12z" />
                </svg>
              }
              level={normalizeScore(vibeScores.cozy)}
              color="green"
            />
            <VibeIndicator
              label="Noise"
              icon={
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M7 3a.667.667 0 01.667.667v8.666a.667.667 0 01-1.334 0V3.667A.667.667 0 017 3zM4.333 5.667a.667.667 0 01.667.666v3.334a.667.667 0 01-1.333 0V6.333a.667.667 0 01.666-.666zM9.667 5.667a.667.667 0 01.666.666v3.334a.667.667 0 01-1.333 0V6.333a.667.667 0 01.667-.666zM12.333 7.333a.667.667 0 01.667.667v.667a.667.667 0 01-1.333 0V8a.667.667 0 01.666-.667z" />
                </svg>
              }
              level={normalizeScore(vibeScores.noise)}
              color="gray"
            />
            <VibeIndicator
              label="Focus"
              icon={
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 3.333a4.667 4.667 0 100 9.334 4.667 4.667 0 000-9.334zM8 6a2 2 0 110 4 2 2 0 010-4z" />
                </svg>
              }
              level={normalizeScore(vibeScores.focus)}
              color="green"
            />
          </div>
        )}
      </div>
    </div>
  );
}
