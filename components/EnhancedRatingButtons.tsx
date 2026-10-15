'use client';

import { cn } from '@/lib/utils';
import { RATING_LABELS, RATING_COLORS, Rating } from '@/lib/types';

type EnhancedRatingButtonsProps = {
  onGuess: (rating: Rating) => void;
  disabled?: boolean;
  selectedRating?: Rating | null;
};

const RATINGS: readonly Rating[] = [0, 1, 2, 3] as const;

export function EnhancedRatingButtons({ 
  onGuess, 
  disabled = false, 
  selectedRating = null 
}: EnhancedRatingButtonsProps) {
  return (
    <div className="space-y-1 sm:space-y-2 max-w-2xl mx-auto">
      {RATINGS.map((rating) => (
        <button
          key={rating}
          onClick={() => onGuess(rating)}
          disabled={disabled}
          className={cn(
            // Base styles
            'relative w-full h-10 sm:h-11 md:h-12 text-left p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 group overflow-hidden',
            // Glassmorphism background
            'bg-white/10 backdrop-blur-md border border-white/20',
            // Interactive states
            'hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] hover:brightness-110',
            'focus:outline-none focus:ring-4 focus:ring-white/30',
            // Disabled state
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
            // Selected state
            selectedRating === rating && 'ring-4 ring-white/40 shadow-2xl scale-[1.02]'
          )}
          aria-label={`Rate as ${rating}: ${RATING_LABELS[rating]}`}
        >
          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 rounded-lg sm:rounded-xl" />
          
          {/* Hover glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl" />
          
          {/* Content */}
          <div className="relative z-10 flex items-center gap-1 sm:gap-2 h-full">
            <div className="flex-shrink-0">
              <span className="text-xs sm:text-sm md:text-base font-bold bg-white/20 backdrop-blur-sm rounded-full w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex items-center justify-center shadow-lg text-white">
                {rating}
              </span>
            </div>
            <div className="flex-1 min-w-0 ml-1 sm:ml-2">
              <div className="text-xs sm:text-xs md:text-sm font-medium leading-tight text-white drop-shadow-sm">
                {RATING_LABELS[rating]}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}