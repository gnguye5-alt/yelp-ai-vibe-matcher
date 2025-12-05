import React from 'react';

interface VibeIndicatorProps {
  label: string;
  icon: React.ReactNode;
  level: number; // 0-5 (out of 5)
  color?: 'green' | 'gray';
}

export default function VibeIndicator({
  label,
  icon,
  level,
  color = 'green',
}: VibeIndicatorProps) {
  const dots = Array.from({ length: 5 }, (_, i) => i);
  const activeColor = color === 'green' ? 'bg-[#00c950]' : 'bg-[#99a1af]';

  return (
    <div className="flex gap-1.5 items-center flex-1">
      {/* Icon */}
      <div className="w-3.5 h-3.5 text-[#4a5565] flex-shrink-0">{icon}</div>

      {/* Label */}
      <span className="text-xs text-[#4a5565] font-normal whitespace-nowrap">
        {label}
      </span>

      {/* Dots */}
      <div className="flex gap-0.5 items-center flex-1 min-w-0">
        {dots.map((i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${
              i < level ? activeColor : 'bg-gray-200'
            } ${i === dots.length - 1 ? 'flex-1' : 'flex-shrink-0'}`}
          />
        ))}
      </div>
    </div>
  );
}
