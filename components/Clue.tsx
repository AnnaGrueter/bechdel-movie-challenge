'use client';

import { GameMovie } from '@/lib/types';

interface ClueProps {
  movie: GameMovie | null;
  showTitle: boolean;
}

export function Clue({ movie, showTitle }: ClueProps) {
  if (!movie) {
    return (
      <div className="text-center space-y-2 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-1 sm:space-y-1.5 max-w-2xl mx-auto">
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
        {showTitle ? movie.title : `Mystery Film #${Math.floor(Math.random() * 999) + 1}`}
      </h1>
      
      <div className="flex justify-center items-center gap-1 sm:gap-2 text-xs text-gray-600 flex-wrap">
        <span className="bg-yellow-400 px-2 py-0.5 sm:py-1 rounded-xl font-medium">{movie.year}</span>
        <span className="bg-pink-400 px-2 py-0.5 sm:py-1 rounded-xl font-medium">Classic Film</span>
      </div>
      
      <p className="text-xs sm:text-sm md:text-base text-gray-700 italic leading-relaxed px-2 sm:px-4 mt-1 sm:mt-2">
        "{movie.clue}"
      </p>
    </div>
  );
}