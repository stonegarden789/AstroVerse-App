import React, { useState, useEffect } from 'react';

const ZODIAC_SYMBOLS = [
  { name: 'Aries', symbol: '♈' },
  { name: 'Taurus', symbol: '♉' },
  { name: 'Gemini', symbol: '♊' },
  { name: 'Cancer', symbol: '♋' },
  { name: 'Leo', symbol: '♌' },
  { name: 'Virgo', symbol: '♍' },
  { name: 'Libra', symbol: '♎' },
  { name: 'Scorpio', symbol: '♏' },
  { name: 'Sagittarius', symbol: '♐' },
  { name: 'Capricorn', symbol: '♑' },
  { name: 'Aquarius', symbol: '♒' },
  { name: 'Pisces', symbol: '♓' },
];

const RING_RADIUS = 90; // in pixels
const NUM_SYMBOLS = ZODIAC_SYMBOLS.length;

export const ZodiacRotator: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % NUM_SYMBOLS);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-52 w-52 mb-4 flex items-center justify-center">
      {/* Rotating Ring of Glyphs */}
      <div className="absolute inset-0 animate-rotate-ring">
        {ZODIAC_SYMBOLS.map((sign, index) => {
          const angle = (index / NUM_SYMBOLS) * 2 * Math.PI - (Math.PI / 2); // Start from top
          const x = RING_RADIUS * Math.cos(angle);
          const y = RING_RADIUS * Math.sin(angle);
          
          const isActive = index === currentIndex;

          return (
            <div
              key={sign.name}
              className="absolute top-1/2 left-1/2"
              style={{ transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` }}
            >
              <span
                className={`text-2xl transition-all duration-1000 ${
                  isActive ? 'text-violet-200 scale-125' : 'text-violet-500/50'
                }`}
                title={sign.name}
              >
                {sign.symbol}
              </span>
            </div>
          );
        })}
      </div>

      {/* Central Symbol */}
      <div className="relative h-24 w-24">
        {ZODIAC_SYMBOLS.map((sign, index) => (
          <div
            key={sign.name}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span 
              className="text-7xl text-violet-300 animate-pulse-glow" 
              title={sign.name}
            >
              {sign.symbol}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};