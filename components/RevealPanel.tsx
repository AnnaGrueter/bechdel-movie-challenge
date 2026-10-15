'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { AI_POSTER_BY_RATING, RATING_SUMMARY } from '@/lib/ratingAssets';


type Props = {
  userGuess: number;                // keeping your current prop types
  actualRating: number;
  pointsAwarded: number;
  wittyLine: string;
  onNextFilm: () => void;
};

export function RevealPanel({
  userGuess,
  actualRating,
  pointsAwarded,
  wittyLine,
  onNextFilm,
}: Props) {
  const [showConfetti, setShowConfetti] = useState(false);

  // Trigger confetti for winning scenarios
  useEffect(() => {
    if (pointsAwarded > 0) {
      setShowConfetti(true);
      // Remove confetti after animation completes
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [pointsAwarded]);

  // Clamp to [0..3] in case types drift
  const r = Math.max(0, Math.min(3, actualRating)) as 0 | 1 | 2 | 3;

  // Calculate difference for conditional messaging
  const difference = Math.abs(userGuess - actualRating);
  
  // Determine heading text based on points awarded
  const getHeadingText = () => {
    if (pointsAwarded > 0) {
      return "Congratulations!";
    } else {
      // 0 points scenarios
      if (difference === 2) {
        return "Try Again!";
      } else if (difference === 3) {
        return "Better Luck Next Time!";
      }
      return "Try Again!"; // fallback
    }
  };
  
  // Determine circle color based on points awarded
  const getCircleColorClasses = () => {
    if (pointsAwarded > 0) {
      return "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600";
    } else {
      return "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500";
    }
  };
  return (
    <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 min-h-[280px] sm:min-h-[300px] grid grid-cols-1 md:grid-cols-2 gap-6 items-center overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1}s`,
                animationDuration: `${1 + Math.random() * 1}s`,
              }}
            >
              <div
                className="w-12 h-12 bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 transform animate-spin shadow-2xl"
                style={{
                  clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${0.8 + Math.random() * 0.4}s`,
                  filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 20px rgba(255, 215, 0, 0.6))',
                }}
              />
              {/* Additional sparkle layers */}
              <div
                className="absolute inset-0 w-12 h-12 bg-gradient-to-br from-white via-yellow-300 to-transparent opacity-60 animate-ping"
                style={{
                  clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                  animationDelay: `${Math.random() * 0.3}s`,
                  animationDuration: `${1.2 + Math.random() * 0.6}s`,
                }}
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Left: AI Rating Poster */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-xs">
          <Image
            src={AI_POSTER_BY_RATING[r]}
            alt={`Bechdel Test Rating ${r} illustration`}
            width={300}
            height={450}
            className="w-full h-auto rounded-2xl shadow-lg object-contain"
            priority
          />
        </div>
      </div>
      
      {/* Right: Content */}
      <div className="text-center space-y-6 flex flex-col justify-center">
        {/* Gold circle with points */}
        <div className="flex justify-center">
          <div className={`w-20 h-20 sm:w-24 sm:h-24 ${getCircleColorClasses()} rounded-full flex items-center justify-center shadow-lg`}>
            <span className="text-white font-bold text-base sm:text-lg">+{pointsAwarded}pts</span>
          </div>
        </div>
        
        {/* Congratulations heading */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {getHeadingText()}
        </h2>
        
        {/* Witty line - italic and grey */}
        <p className="text-sm sm:text-base text-gray-500 font-normal italic">
          {wittyLine}
        </p>
        
        {/* Rating summary */}
        <div className="max-w-md mx-auto">
          <p className="text-xs sm:text-sm text-gray-700 font-normal bg-gray-50 rounded-lg p-2 border border-gray-200/50">
            {RATING_SUMMARY[r]}
          </p>
        </div>
        
        {/* Guess and actual rating */}
        <div className="space-y-1">
          <div className="text-xs sm:text-sm font-medium text-gray-600">
            You guessed: <span className="text-gray-900 font-semibold">{userGuess}</span>
          </div>
          <div className="text-xs sm:text-sm font-medium text-gray-600">
            Actual rating: <span className="text-gray-900 font-semibold">{actualRating}</span>
          </div>
        </div>
        
        {/* Next Film button */}
        <div className="pt-2">
          <button
            onClick={onNextFilm}
            className="bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 hover:from-purple-600 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-16 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-sm sm:text-base"
            aria-label="Load next film"
          >
            Next Film
          </button>
        </div>
      </div>
    </div>
  );
}
