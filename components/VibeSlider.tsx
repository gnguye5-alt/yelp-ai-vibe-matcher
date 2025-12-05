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
        <div className="w-4 h-4 text-[#364153]">{icon}</div>
        <span className="text-sm text-[#364153] font-normal tracking-tight">
          {label}
        </span>
      </div>

      {/* Slider container */}
      <div className="flex-1 flex gap-2 items-center">
        <span className="text-xs text-[#6a7282] w-16">{minLabel}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer range-slider"
          style={{
            background: `linear-gradient(to right, #9810fa 0%, #9810fa ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`
          }}
        />
        <span className="text-xs text-[#6a7282] w-16 text-right">{maxLabel}</span>
      </div>
    </div>
  );
}
