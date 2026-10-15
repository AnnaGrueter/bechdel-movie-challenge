export type Rating = 0 | 1 | 2 | 3;

// Use direct Pexels URLs for rating illustrations
export const AI_POSTER_BY_RATING: Record<Rating, string> = {
  0: "/posters/0.jpeg",
  1: "/posters/1.jpeg",
  2: "/posters/2.jpeg",
  3: "/posters/3.jpeg",
};

export const RATING_SUMMARY: Record<Rating, string> = {
  0: "No two women ever share the screen.",
  1: "Two women appear, but never speak to each other.",
  2: "They talk — mostly about him.",
  3: "They talk — and it’s not about men. It passes.",
};
