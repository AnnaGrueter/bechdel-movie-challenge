'use client';

import { Button } from '@/components/ui/button';
import { RATING_LABELS, RATING_COLORS, Rating } from '@/lib/types';

type RatingButtonsProps = {
  onGuess: (rating: Rating) => void;
  disabled?: boolean;
};

const RATINGS: readonly Rating[] = [0, 1, 2, 3] as const;

export function RatingButtons({ onGuess, disabled = false }: RatingButtonsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
      {RATINGS.map((r) => (
        <Button
          key={r}
          onClick={() => onGuess(r)}
          disabled={disabled}
          className={`h-20 text-left p-6 text-lg font-medium transition-all duration-200
            hover:scale-[1.02] hover:shadow-xl active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-4 focus:ring-indigo-200
            ${RATING_COLORS[r]}
          `}
          aria-label={`Rate as ${r}: ${RATING_LABELS[r]}`}
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold bg-black/10 rounded-full w-10 h-10 flex items-center justify-center">
              {r}
            </span>
            <span className="leading-tight">{RATING_LABELS[r]}</span>
          </div>
          <div className="text-sm opacity-75 mt-1">Press {r}</div>
        </Button>
      ))}
    </div>
  );
}
