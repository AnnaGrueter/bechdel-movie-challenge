export interface BechdelMovie {
  id: number;
  imdbid: string;
  title: string;
  year: number;
  rating: number;
}

export interface GameMovie {
  title: string;
  year: number;
  rating: Rating;
  imdbid: string;
  posterUrl: string | null;
  clue?: string;
}

export interface GameState {
  currentMovie: GameMovie | null;
  hasGuessed: boolean;
  userGuess: Rating | null;
  score: number;
  streak: number;
  isLoading: boolean;
}

export const RATING_LABELS = {
  0: "No two women ever share the screen.", // <- Edit this text here
  1: "Two women appear, but never speak to each other.", 
  2: "They talk — mostly about him.",
  3: "They talk — and it’s not about men."
} as const;

export const RATING_COLORS = {
  0: "bg-gradient-to-br from-red-500/80 to-red-700/80 backdrop-blur-sm text-white shadow-lg",
  1: "bg-gradient-to-br from-orange-400/80 to-yellow-500/80 backdrop-blur-sm text-white shadow-lg",
  2: "bg-gradient-to-br from-purple-400/80 to-pink-500/80 backdrop-blur-sm text-white shadow-lg", 
  3: "bg-gradient-to-br from-emerald-400/80 to-teal-500/80 backdrop-blur-sm text-white shadow-lg"
} as const;

export type Rating = 0 | 1 | 2 | 3;
