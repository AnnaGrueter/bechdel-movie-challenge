export function calculateScore(userGuess: number, actualRating: number): number {
  const difference = Math.abs(userGuess - actualRating);
  
  if (difference === 0) {
    return 100; // Exact match
  } else if (difference === 1) {
    return 40; // Off by 1
  } else {
    return 0; // Off by 2 or 3
  }
}

export function updateStreak(userGuess: number, actualRating: number, currentStreak: number): number {
  const isExact = userGuess === actualRating;
  return isExact ? currentStreak + 1 : 0;
}

export function generateClue(movie: { title: string; year: number }): string {
  const clues = [
    `A cinematic journey from ${movie.year} that explores human connections.`,
    `This ${movie.year} film examines relationships and social dynamics.`,
    `A story from ${movie.year} that delves into character interactions.`,
    `This ${movie.year} production focuses on interpersonal relationships.`,
    `A ${movie.year} film exploring themes of communication and connection.`,
    `From ${movie.year}, a tale examining social bonds and dialogue.`,
    `This ${movie.year} story investigates human interaction and conversation.`,
    `A ${movie.year} narrative centered on character relationships.`
  ];
  
  return clues[Math.floor(Math.random() * clues.length)];
}

export function getWittyLine(userGuess: number, actualRating: number): string {
  const difference = Math.abs(userGuess - actualRating);
  
  if (difference === 0) {
    return "Spot on! You know your representation!";
  } else if (difference === 1) {
    return "Close call! Almost had it.";
  } else if (difference === 2) {
    return "Not quite there, but keep trying!";
  } else {
    return "Way off the mark! Better luck next time.";
  }
}