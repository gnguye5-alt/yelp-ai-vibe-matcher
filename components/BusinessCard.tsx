import React from 'react';
import Image from 'next/image';

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

// Helper to get match color based on percentage - using official Yelp colors
function getMatchColor(percentage: number): string {
  if (percentage >= 80) return 'bg-[#029E6A]'; // Yelp Green Regular
  if (percentage >= 60) return 'bg-[#419D28]'; // Yelp Lime Regular
  if (percentage >= 40) return 'bg-[#E4622E]'; // Yelp Orange Regular
  if (percentage >= 20) return 'bg-[#C04214]'; // Yelp Orange Dark
  return 'bg-[#D71616]'; // Yelp Red Dark
}

function getMatchTextColor(percentage: number): string {
  if (percentage >= 80) return 'text-[#007C52]'; // Green Dark
  if (percentage >= 60) return 'text-[#327C1E]'; // Lime Dark
  if (percentage >= 40) return 'text-[#C04214]'; // Orange Dark
  if (percentage >= 20) return 'text-[#C04214]'; // Orange Dark
  return 'text-[#D71616]'; // Red Dark
}

function getMatchBgColor(percentage: number): string {
  if (percentage >= 80) return 'bg-[#DEF6E7] border-[#029E6A]/30'; // Green Light
  if (percentage >= 60) return 'bg-[#E1F7DC] border-[#419D28]/30'; // Lime Light
  if (percentage >= 40) return 'bg-[#FFEDDD] border-[#E4622E]/30'; // Orange Light
  if (percentage >= 20) return 'bg-[#FFEDDD] border-[#C04214]/30'; // Orange Light
  return 'bg-[#FFECEC] border-[#D71616]/30'; // Red Light
}

export default function BusinessCard({ business, vibeMatch, quote }: BusinessCardProps) {
  // Generate star rating
  const fullStars = Math.floor(business.rating);
  const hasHalfStar = business.rating % 1 >= 0.5;

  return (
    <a
      href={business.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_6px_rgba(0,0,0,0.12),0_2px_4px_rgba(0,0,0,0.08)] transition-shadow flex gap-5 items-start relative"
    >
      {/* Match Percentage Badge */}
      {vibeMatch && (
        <div className={`absolute -top-2 -right-2 ${getMatchColor(vibeMatch.overall)} text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md`}>
          {vibeMatch.overall}% Vibe Match
        </div>
      )}

      {/* Image */}
      <div className="w-[200px] h-[200px] rounded-lg overflow-hidden flex-shrink-0 relative bg-[#F0F0F0]">
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
      <div className="flex-1 flex flex-col gap-2 min-w-0 py-1">
        {/* Business Name */}
        <h3 className="font-['Poppins'] font-bold text-[20px] leading-7 text-[#2D2E2F]">
          {business.name}
        </h3>

        {/* Rating and Reviews - Yelp style star ribbon */}
        <div className="flex gap-2 items-center">
          {/* Stars - Yelp review ribbon style */}
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => {
              const isFullStar = i < fullStars;
              const isHalfStar = i === fullStars && hasHalfStar;
              const isEmpty = !isFullStar && !isHalfStar;

              return (
                <div
                  key={i}
                  className="w-5 h-5 rounded-sm flex items-center justify-center overflow-hidden relative"
                  style={{ backgroundColor: isEmpty ? '#C8C9CA' : undefined }}
                >
                  {isHalfStar ? (
                    // Half star: left half red, right half gray
                    <>
                      <div className="absolute inset-0 w-1/2 bg-[#FA4848]" />
                      <div className="absolute inset-0 left-1/2 w-1/2 bg-[#C8C9CA]" />
                      <svg className="w-4 h-4 text-white relative z-10" viewBox="0 0 14 14" fill="currentColor">
                        <path d="M7 1l1.753 3.553 3.922.57-2.838 2.767.67 3.91L7 10.188 3.493 11.8l.67-3.91L1.325 5.123l3.922-.57L7 1z" />
                      </svg>
                    </>
                  ) : (
                    // Full or empty star
                    <div className={`w-full h-full flex items-center justify-center ${isFullStar ? 'bg-[#FA4848]' : 'bg-[#C8C9CA]'}`}>
                      <svg className="w-4 h-4 text-white" viewBox="0 0 14 14" fill="currentColor">
                        <path d="M7 1l1.753 3.553 3.922.57-2.838 2.767.67 3.91L7 10.188 3.493 11.8l.67-3.91L1.325 5.123l3.922-.57L7 1z" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* Rating number */}
          <span className="font-['Open_Sans'] font-semibold text-base leading-6 text-[#2D2E2F]">
            {business.rating}
          </span>
          {/* Review count */}
          <span className="font-['Open_Sans'] font-normal text-base leading-6 text-[#6B6D6F]">
            ({business.review_count} reviews)
          </span>
        </div>

        {/* Categories - Yelp style pills */}
        <div className="flex gap-2 items-center flex-wrap">
          {business.categories.slice(0, 3).map((cat) => (
            <span
              key={cat.alias}
              className="bg-[#F5F5F5] text-[#2D2E2F] px-2 py-1 rounded font-['Poppins'] font-medium text-[14px] leading-5"
            >
              {cat.title}
            </span>
          ))}
        </div>

        {/* Location and Details */}
        <div className="flex gap-2 items-center text-base">
          <svg
            className="w-4 h-4 text-[#898A8B] flex-shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="font-['Open_Sans'] text-[14px] leading-5 text-[#2D2E2F]">
            <span>{business.location.address1 || business.location.city}</span>
            {business.price && (
              <span> • {business.price}</span>
            )}
          </p>
        </div>

        {/* Quote */}
        {quote && (
          <p className="font-['Open_Sans'] text-xs leading-4 text-[#898A8B] italic line-clamp-2">
            &ldquo;{quote}&rdquo;
          </p>
        )}

        {/* Vibe Match Breakdown */}
        {vibeMatch && (
          <div className={`flex items-center gap-3 mt-1 px-2 py-1.5 rounded-lg border ${getMatchBgColor(vibeMatch.overall)}`}>
            <span className={`font-['Open_Sans'] font-bold text-xs leading-4 ${getMatchTextColor(vibeMatch.overall)}`}>
              Vibe Match:
            </span>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1">
                <span className="text-[#898A8B]">Noise</span>
                <span className={`font-medium ${getMatchTextColor(vibeMatch.breakdown.noise)}`}>
                  {vibeMatch.breakdown.noise}%
                </span>
              </span>
              <span className="text-[#C8C9CA]">|</span>
              <span className="flex items-center gap-1">
                <span className="text-[#898A8B]">Cozy</span>
                <span className={`font-medium ${getMatchTextColor(vibeMatch.breakdown.cozy)}`}>
                  {vibeMatch.breakdown.cozy}%
                </span>
              </span>
              <span className="text-[#C8C9CA]">|</span>
              <span className="flex items-center gap-1">
                <span className="text-[#898A8B]">Focus</span>
                <span className={`font-medium ${getMatchTextColor(vibeMatch.breakdown.focus)}`}>
                  {vibeMatch.breakdown.focus}%
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
    </a>
  );
}
