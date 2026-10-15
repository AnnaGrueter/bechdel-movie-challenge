'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameState, GameMovie } from '@/lib/types';
import { calculateScore, updateStreak, getWittyLine, generateClue } from '@/lib/scoring';
import { getRandomMovie } from '@/lib/api';
import { Clue } from '@/components/Clue';
import { PosterCard } from '@/components/PosterCard';
import { EnhancedRatingButtons } from '@/components/EnhancedRatingButtons';
import { RevealPanel } from '@/components/RevealPanel';
import { EnhancedButton } from '@/components/EnhancedButton';
import { EnhancedContainer } from '@/components/EnhancedContainer';
import { Info, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Rating } from "@/lib/types";
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { Title3D } from '@/components/Title3D';

export default function Home() {
  const { toast } = useToast();
  const [debugMode, setDebugMode] = useState(false); // Set to false to return to normal game
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [debugScenario, setDebugScenario] = useState(0); // 0=perfect, 1=close, 2=off by 2, 3=off by 3
  
  // Debug scenarios: [userGuess, actualRating, expectedPoints]
  const debugScenarios = [
    { userGuess: 2, actualRating: 2, points: 100, description: "Perfect match" },
    { userGuess: 1, actualRating: 2, points: 40, description: "Close (off by 1)" },
    { userGuess: 0, actualRating: 2, points: 0, description: "Off by 2" },
    { userGuess: 0, actualRating: 3, points: 0, description: "Off by 3" },
  ];
  
  const currentScenario = debugScenarios[debugScenario];
  
  const [gameState, setGameState] = useState<GameState>({
    currentMovie: debugMode ? {
      title: "The Shawshank Redemption",
      year: 1994,
      rating: currentScenario.actualRating as Rating,
      imdbid: "tt0111161",
      posterUrl: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
      clue: "A story of hope and friendship in the most unlikely of places."
    } : null,
    hasGuessed: debugMode ? true : false,
    userGuess: debugMode ? currentScenario.userGuess as Rating : null,
    score: 0,
    streak: 0,
    isLoading: debugMode ? false : false
  });

  // Load persisted data on mount
  useEffect(() => {
    const savedScore = localStorage.getItem('bechdel_score');
    const savedStreak = localStorage.getItem('bechdel_streak');
    
    if (savedScore) {
      setGameState(prev => ({ ...prev, score: parseInt(savedScore) }));
    }
    if (savedStreak) {
      setGameState(prev => ({ ...prev, streak: parseInt(savedStreak) }));
    }
  }, []);

  // Check if user has seen onboarding on mount
  useEffect(() => {
    if (debugMode) {
      console.log('🐛 Debug mode enabled - skipping onboarding check');
      setIsInitialLoadComplete(true);
      return;
    }
    
    console.log('Checking onboarding status...');
    const seen = localStorage.getItem('bechdel_seen_onboarding');
    console.log('Onboarding seen value:', seen);
    
    if (!seen || seen !== '1') {
      console.log('Showing onboarding...');
    } else {
      console.log('Onboarding already seen, not showing');
    }
    
    setIsInitialLoadComplete(true);
  }, [debugMode]);

  // Persist score and streak
  useEffect(() => {
    localStorage.setItem('bechdel_score', gameState.score.toString());
    localStorage.setItem('bechdel_streak', gameState.streak.toString());
  }, [gameState.score, gameState.streak]);

  const loadNewMovie = async () => {
    console.log('🎬 Starting to load new movie...');
    
    if (debugMode) {
      // Cycle through debug scenarios
      const nextScenario = (debugScenario + 1) % debugScenarios.length;
      setDebugScenario(nextScenario);
      const scenario = debugScenarios[nextScenario];
      
      setGameState(prev => ({
        ...prev,
        currentMovie: {
          title: "The Shawshank Redemption",
          year: 1994,
          rating: scenario.actualRating as Rating,
          imdbid: "tt0111161",
          posterUrl: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
          clue: "A story of hope and friendship in the most unlikely of places."
        },
        hasGuessed: true,
        userGuess: scenario.userGuess as Rating,
        isLoading: false
      }));
      
      toast({
        title: `Debug: ${scenario.description}`,
        description: `User: ${scenario.userGuess}, Actual: ${scenario.actualRating}, Points: ${scenario.points}`,
      });
      return;
    }
    
    setGameState(prev => ({ ...prev, isLoading: true }));
    
    const maxAttempts = 5;
    let attempts = 0;
    let movieWithPoster = null;
    
    try {
      while (attempts < maxAttempts && !movieWithPoster) {
        attempts++;
        console.log(`📡 Attempt ${attempts}/${maxAttempts}: Calling getRandomMovie API...`);
        
        const movie = await getRandomMovie();
        console.log('✅ Movie received:', movie);
        
        // Check if movie has a valid poster URL
        if (movie.posterUrl && movie.posterUrl.trim() !== '') {
          console.log('🖼️ Movie has poster URL:', movie.posterUrl);
          movieWithPoster = movie;
        } else {
          console.log(`⚠️ Movie "${movie.title}" (${movie.year}) has no poster URL, retrying...`);
          if (attempts < maxAttempts) {
            console.log(`🔄 Retrying... (${attempts}/${maxAttempts})`);
          }
        }
      }
      
      if (!movieWithPoster) {
        console.error(`❌ Failed to find a movie with poster after ${maxAttempts} attempts`);
        toast({
          title: "Error",
          description: "Failed to load a new movie. Please try again.",
          variant: "destructive",
        });
        setGameState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      const gameMovie: GameMovie = {
        ...movieWithPoster,
        clue: generateClue(movieWithPoster)
      };
      console.log('🎯 Game movie created with poster:', gameMovie);
      
      setGameState(prev => ({
        ...prev,
        currentMovie: gameMovie,
        hasGuessed: false,
        userGuess: null,
        isLoading: false
      }));
      console.log('✅ Movie with poster loaded successfully');
    } catch (error) {
      console.error('Failed to load movie:', error);
      toast({
        title: "Error",
        description: "Failed to load a new movie. Please try again.",
        variant: "destructive",
      });
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  console.log('🔄 Current game state:', gameState);
  console.log('👁️ Show onboarding:', showOnboarding);
  console.log('✅ Initial load complete:', isInitialLoadComplete);

  // Keyboard shortcuts
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (gameState.hasGuessed) {
      if (event.key.toLowerCase() === 'n') {
        loadNewMovie();
      }
      return;
    }
    
    const key = event.key;
    if (['0', '1', '2', '3'].includes(key)) {
      const rating = parseInt(key) as Rating;
      handleGuess(rating);
    }
  }, [gameState.hasGuessed, loadNewMovie]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const handleGuess = (rating: Rating) => {
    if (!gameState.currentMovie || gameState.hasGuessed) return;

    // (Guard is optional since the type already constrains it)
    if (rating < 0 || rating > 3) return;

    const pointsAwarded = calculateScore(rating, gameState.currentMovie.rating);
    const newStreak = updateStreak(rating, gameState.currentMovie.rating, gameState.streak);

    setGameState(prev => ({
      ...prev,
      hasGuessed: true,
      userGuess: rating,
      score: prev.score + pointsAwarded,
      streak: newStreak
    }));

    if (pointsAwarded === 100) {
      toast({
        title: "Perfect! 🎉",
        description: "Exact match! You're on fire!",
      });
    }
  };

  const resetGame = () => {
    localStorage.removeItem('bechdel_score');
    localStorage.removeItem('bechdel_streak');
    setGameState(prev => ({
      ...prev,
      score: 0,
      streak: 0
    }));
    toast({
      title: "Game Reset",
      description: "Score and streak have been reset to zero.",
    });
  };

  const handleOnboardingClose = () => {
    console.log('🚪 Closing onboarding...');
    setShowOnboarding(false);
    localStorage.setItem('bechdel_seen_onboarding', '1');
    console.log('✅ Onboarding closed and localStorage updated');
  };

  // Load initial movie when conditions are met
  useEffect(() => {
    if (debugMode) {
      console.log('🐛 Debug mode enabled - skipping movie load');
      return;
    }
    
    console.log('🎬 Movie load effect triggered');
    console.log('isInitialLoadComplete:', isInitialLoadComplete);
    console.log('showOnboarding:', showOnboarding);
    console.log('currentMovie:', gameState.currentMovie);
    
    // Only load movie if initial setup is complete, onboarding is closed, and no movie is loaded
    if (isInitialLoadComplete && !showOnboarding && !gameState.currentMovie) {
      console.log('🚀 Loading movie...');
      loadNewMovie();
    } else {
      console.log('⏳ Waiting for conditions to be met...');
    }
  }, [isInitialLoadComplete, showOnboarding, gameState.currentMovie, debugMode]);

  if (gameState.isLoading && !gameState.currentMovie) {
    console.log('⏳ Showing loading screen...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-indigo-700 to-purple-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" aria-label="Loading"></div>
          <p className="text-white">Loading your next challenge...</p>
        </div>
      </div>
    );
  }

  console.log('🎨 Rendering main app...');
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-700 to-purple-900">
      <Toaster />
      <OnboardingFlow open={showOnboarding} onClose={handleOnboardingClose} />

      {/* Header */}
      {!showOnboarding && (
        <header className="max-w-screen-lg mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
          <div className="flex justify-between items-center flex-wrap gap-2 sm:gap-4">
            <EnhancedButton
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              onClick={() => setShowOnboarding(true)}
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline text-white">About</span>
            </EnhancedButton>
            
            <div className="text-center flex-1 min-w-0">
              <Title3D />
              <p className="text-white/80 mt-1 font-medium text-xs sm:text-sm">Bechdel Movie Challenge</p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-right space-y-1 min-w-0">
                <div className="font-bold text-white text-sm sm:text-base md:text-lg">
                  {gameState.score.toLocaleString()}
                </div>
                <div className="text-white/80 text-xs sm:text-sm font-medium">
                  {gameState.streak} streak
                </div>
              </div>
              <EnhancedButton 
                variant="ghost" 
                size="sm" 
                onClick={resetGame}
                className="p-2"
                aria-label="Reset game points"
              >
                <RotateCcw className="w-4 h-4" />
              </EnhancedButton>
            </div>
          </div>
        </header>
      )}

      {/* Main Game Area */}
      {!showOnboarding && (
        <main className="max-w-screen-lg mx-auto px-3 sm:px-4 md:px-6 pb-6 sm:pb-8 space-y-4 sm:space-y-6 md:space-y-8">
          {/* Debug Info */}
          {debugMode && (
            <div className="text-center">
              <div className="inline-block bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-2 text-sm text-yellow-800">
                <strong>Debug Mode:</strong> {currentScenario.description} 
                <span className="ml-2">({debugScenario + 1}/{debugScenarios.length})</span>
              </div>
            </div>
          )}
          
          {/* Clue Section */}
          <section>
            <EnhancedContainer variant="elevated" className="px-4 sm:px-6 md:px-8 py-1 sm:py-2 md:py-3">
              <Clue movie={gameState.currentMovie} showTitle={true} />
            </EnhancedContainer>
          </section>

          {/* Poster and Game Controls Side by Side */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 items-center justify-center max-w-4xl mx-auto">
            {/* Poster and Panel Container */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-6 col-span-1 md:col-span-2">
              {/* Movie Poster */}
              <PosterCard 
                hasGuessed={gameState.hasGuessed}
                actualRating={gameState.hasGuessed ? gameState.currentMovie?.rating || null : null}
                posterUrl={gameState.currentMovie?.posterUrl ?? null}
                title={gameState.currentMovie?.title ?? ""}
              />
              
              {/* Game Controls */}
              <div className="space-y-3 sm:space-y-4 md:space-y-5 flex flex-col">
                {!gameState.hasGuessed ? (
                  <EnhancedContainer variant="gradient" className="p-2 sm:p-3 md:p-4 flex flex-col justify-center h-[317px] sm:h-[317px] md:h-[317px]">
                    <h2 className="text-sm sm:text-base md:text-lg font-bold text-center mb-1 sm:mb-2 md:mb-3 text-white drop-shadow-lg">
                      What's this film's Bechdel Test rating?
                    </h2>
                    <EnhancedRatingButtons 
                      onGuess={handleGuess} 
                      disabled={gameState.isLoading || gameState.hasGuessed}
                      selectedRating={gameState.userGuess}
                    />
                    <p className="text-center text-xs text-white/80 mt-1 sm:mt-2 font-medium">
                      Keyboard shortcuts: 0-3 to guess, N for next film
                    </p>
                  </EnhancedContainer>
                ) : (
                  gameState.currentMovie && gameState.userGuess !== null && (
                    <RevealPanel
                      userGuess={gameState.userGuess}
                      actualRating={gameState.currentMovie.rating}
                      pointsAwarded={calculateScore(gameState.userGuess, gameState.currentMovie.rating)}
                      wittyLine={getWittyLine(gameState.userGuess, gameState.currentMovie.rating)}
                      onNextFilm={loadNewMovie}
                    />
                  )
                )}
              </div>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}