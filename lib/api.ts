import { GameMovie, Rating } from './types';
import { generateClue } from './scoring';
import he from 'he';

// TMDB API configuration
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Bechdel Test API configuration
const BECHDEL_API_BASE_URL = 'https://bechdeltest.com/api/v1';

interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  imdb_id?: string;
  overview: string;
}

interface TMDBResponse {
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

interface BechdelTestResponse {
  title: string;
  imdbid: string;
  year: string;
  rating: number;
  id: number;
}

// Simulate Bechdel Test rating based on movie ID for consistency
function simulateBechdelRating(movieId: number): Rating {
  // Use movie ID as seed for consistent but pseudo-random ratings
  // This ensures the same movie always gets the same rating across sessions
  const seed = movieId;
  return (seed % 4) as Rating;
}

async function fetchBechdelRating(imdbId: string): Promise<Rating | null> {
  try {
    console.log('🎭 Fetching Bechdel rating for IMDb ID:', imdbId);
    
    // Clean IMDb ID (remove 'tt' prefix if present)
    const cleanImdbId = imdbId.replace(/^tt/, '');
    const url = `${BECHDEL_API_BASE_URL}/getMovieByImdbId/${cleanImdbId}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn('⚠️ Bechdel API request failed:', response.status, response.statusText);
      return null;
    }
    
    const data: BechdelTestResponse = await response.json();
    console.log('✅ Bechdel API response:', data);
    
    // Validate rating is within expected range
    if (typeof data.rating === 'number' && data.rating >= 0 && data.rating <= 3) {
      return data.rating as Rating;
    } else {
      console.warn('⚠️ Invalid rating from Bechdel API:', data.rating);
      return null;
    }
  } catch (error) {
    console.warn('⚠️ Error fetching from Bechdel API:', error);
    return null;
  }
}

async function fetchTMDBMovies(endpoint: string): Promise<TMDBMovie[]> {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  
  if (!apiKey) {
    throw new Error('TMDB API key not found. Please set NEXT_PUBLIC_TMDB_API_KEY in your .env.local file.');
  }

  const url = `${TMDB_BASE_URL}${endpoint}?api_key=${apiKey}`;
  
  console.log('🎬 Fetching movies from TMDB:', endpoint);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(`TMDB API authentication failed (401). Please verify your NEXT_PUBLIC_TMDB_API_KEY is valid and has the necessary permissions.`);
      }
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }
    
    const data: TMDBResponse = await response.json();
    console.log('✅ TMDB response received:', data.results.length, 'movies');
    
    return data.results;
  } catch (error) {
    console.error('❌ Error fetching from TMDB:', error);
    throw error;
  }
}

async function fetchMovieDetails(movieId: number): Promise<{ imdb_id: string | null }> {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  
  if (!apiKey) {
    return { imdb_id: null };
  }

  try {
    const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn('⚠️ Could not fetch movie details for ID:', movieId);
      return { imdb_id: null };
    }
    
    const data = await response.json();
    return { imdb_id: data.imdb_id || null };
  } catch (error) {
    console.warn('⚠️ Error fetching movie details:', error);
    return { imdb_id: null };
  }
}

export async function getRandomMovie(): Promise<GameMovie> {
  console.log('🎬 Starting to load new movie from TMDB...');
  const startTime = Date.now();
  
  try {
    const maxAttempts = 5;
    let attempts = 0;
    let movieWithPoster: GameMovie | null = null;
    
    // Try different TMDB endpoints as fallbacks
    const endpoints = [
      '/movie/popular',
      '/trending/movie/week',
      '/movie/top_rated'
    ];
    
    while (attempts < maxAttempts && !movieWithPoster) {
      attempts++;
      console.log(`🎲 Attempt ${attempts}/${maxAttempts}: Fetching movies...`);
      
      // Cycle through different endpoints for variety
      const endpointIndex = (attempts - 1) % endpoints.length;
      const endpoint = endpoints[endpointIndex];
      
      try {
        // Fetch movies from TMDB
        const movies = await fetchTMDBMovies(endpoint);
        
        if (movies.length === 0) {
          console.log('⚠️ No movies returned from TMDB, trying next endpoint...');
          continue;
        }
        
        // Filter movies with posters and valid release dates
        const validMovies = movies.filter(movie => 
          movie.poster_path && 
          movie.release_date && 
          movie.title &&
          movie.title.trim() !== ''
        );
        
        if (validMovies.length === 0) {
          console.log('⚠️ No valid movies with posters found, trying next endpoint...');
          continue;
        }
        
        // Select a random movie from the valid ones
        const randomIndex = Math.floor(Math.random() * validMovies.length);
        const selectedMovie = validMovies[randomIndex];
        
        console.log('🎬 Selected movie:', selectedMovie.title, `(${selectedMovie.release_date?.substring(0, 4)})`);
        
        // Get additional movie details (like IMDb ID)
        const movieDetails = await fetchMovieDetails(selectedMovie.id);
        
        // Extract year from release_date
        const year = selectedMovie.release_date ? parseInt(selectedMovie.release_date.substring(0, 4)) : new Date().getFullYear();
        
        // Try to get real Bechdel rating, fallback to simulation
        let bechdelRating: Rating;
        if (movieDetails.imdb_id) {
          console.log('🎭 Attempting to fetch real Bechdel rating...');
          const realRating = await fetchBechdelRating(movieDetails.imdb_id);
          if (realRating !== null) {
            bechdelRating = realRating;
            console.log('✅ Using real Bechdel rating:', bechdelRating);
          } else {
            bechdelRating = simulateBechdelRating(selectedMovie.id);
            console.log('⚠️ Falling back to simulated rating:', bechdelRating);
          }
        } else {
          bechdelRating = simulateBechdelRating(selectedMovie.id);
          console.log('⚠️ No IMDb ID available, using simulated rating:', bechdelRating);
        }
        
        // Create game movie object
        movieWithPoster = {
          title: he.decode(selectedMovie.title), // decode HTML entities
          year: year,
          rating: bechdelRating,
          imdbid: movieDetails.imdb_id || `tmdb_${selectedMovie.id}`, // fallback to TMDB ID if no IMDb ID
          posterUrl: `${TMDB_IMAGE_BASE_URL}${selectedMovie.poster_path}`,
          clue: generateClue({ title: selectedMovie.title, year: year })
        };
        
        console.log('✅ Movie with poster created:', movieWithPoster.title, `(Rating: ${bechdelRating})`);
        
      } catch (endpointError) {
        console.warn(`⚠️ Error with endpoint ${endpoint}:`, endpointError);
        // Continue to next attempt/endpoint
      }
    }
    
    if (!movieWithPoster) {
      console.error(`❌ Failed to find a movie with poster after ${maxAttempts} attempts`);
      throw new Error('Failed to find a movie with poster after multiple attempts');
    }
    
    console.log('📡 Response time:', Date.now() - startTime, 'ms');
    return movieWithPoster;
    
  } catch (error: any) {
    console.error('❌ Failed to fetch movie from TMDB:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw new Error(`Failed to fetch movie from TMDB: ${error.message}`);
  }
}