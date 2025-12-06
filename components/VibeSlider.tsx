import React from 'react';

interface VibeSliderProps {
  label: string;
  icon: React.ReactNode;
  minLabel: string;
  maxLabel: string;
  value: number;
  onChange: (value: number) => void;
}

export default function VibeSlider({
  label,
  icon,
  minLabel,
  maxLabel,
  value,
  onChange,
}: VibeSliderProps) {
  return (
    <div className="flex gap-3 items-center w-full">
      {/* Label with icon */}
      <div className="flex gap-2 items-center min-w-[128px]">
        <div className="w-6 h-6 text-[#6B6D6F] flex items-center justify-center">{icon}</div>
        <span className="font-['Open_Sans'] font-semibold text-[18px] leading-7 text-[#2D2E2F]">
          {label}
        </span>
      </div>

      {/* Slider container */}
      <div className="flex-1 flex gap-2 items-center">
        <span className="font-['Open_Sans'] font-normal text-base leading-6 text-[#6B6D6F] w-16 text-left">{minLabel}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-1.5 bg-[#E3E3E3] rounded-full appearance-none cursor-pointer range-slider"
          style={{
            background: `linear-gradient(to right, #0396BC 0%, #0396BC ${value}%, #E3E3E3 ${value}%, #E3E3E3 100%)`
          }}
        />
        <span className="font-['Open_Sans'] font-normal text-base leading-6 text-[#6B6D6F] w-[120px] text-left whitespace-nowrap ml-4">{maxLabel}</span>
      </div>
    </div>
  );
}
