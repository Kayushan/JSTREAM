import axios from 'axios';
import { config } from '../config/env';

// Create axios instance with Bearer token authentication
const tmdbApi = axios.create({
  baseURL: config.tmdb.baseUrl,
  headers: {
    'Authorization': `Bearer ${config.tmdb.bearerToken}`,
    'Content-Type': 'application/json',
  },
});

// Types
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  media_type?: 'movie';
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  media_type?: 'tv';
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string; logo_path: string | null }[];
  spoken_languages: { english_name: string; iso_639_1: string }[];
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
}

export interface TVShowDetails extends TVShow {
  episode_run_time: number[];
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string; logo_path: string | null }[];
  spoken_languages: { english_name: string; iso_639_1: string }[];
  status: string;
  tagline: string;
  number_of_seasons: number;
  number_of_episodes: number;
}

export interface SearchResponse {
  page: number;
  results: (Movie | TVShow)[];
  total_pages: number;
  total_results: number;
}

export interface TrendingResponse {
  page: number;
  results: (Movie | TVShow)[];
  total_pages: number;
  total_results: number;
}

// Helper function to get image URL
export const getImageUrl = (path: string, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500') => {
  if (!path) return '';
  return `${config.tmdb.imageBaseUrl}/${size}${path}`;
};

// API functions
export const searchMulti = async (query: string, page: number = 1): Promise<SearchResponse> => {
  try {
    console.log('TMDB search request:', { query, page });
    const response = await tmdbApi.get('/search/multi', {
      params: {
        query,
        page,
        include_adult: false,
      },
    });
    console.log('TMDB search response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error searching multi:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    throw error;
  }
};

export const getTrending = async (timeWindow: 'day' | 'week' = 'week', page: number = 1): Promise<TrendingResponse> => {
  try {
    const response = await tmdbApi.get(`/trending/all/${timeWindow}`, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trending:', error);
    throw error;
  }
};

export const getMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export const getTVShowDetails = async (tvId: number): Promise<TVShowDetails> => {
  try {
    const response = await tmdbApi.get(`/tv/${tvId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching TV show details:', error);
    throw error;
  }
};

export const getPopularMovies = async (page: number = 1): Promise<SearchResponse> => {
  try {
    const response = await tmdbApi.get('/movie/popular', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const getPopularTVShows = async (page: number = 1): Promise<SearchResponse> => {
  try {
    const response = await tmdbApi.get('/tv/popular', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    throw error;
  }
};

export const getTopRatedMovies = async (page: number = 1): Promise<SearchResponse> => {
  try {
    const response = await tmdbApi.get('/movie/top_rated', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    throw error;
  }
};

export const getTopRatedTVShows = async (page: number = 1): Promise<SearchResponse> => {
  try {
    const response = await tmdbApi.get('/tv/top_rated', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top rated TV shows:', error);
    throw error;
  }
};

export const getUpcomingMovies = async (page: number = 1): Promise<SearchResponse> => {
  try {
    const response = await tmdbApi.get('/movie/upcoming', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    throw error;
  }
};

// Additional TV Show categories
export const getAiringTodayTVShows = async (page: number = 1): Promise<SearchResponse> => {
  try {
    const response = await tmdbApi.get('/tv/airing_today', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching airing today TV shows:', error);
    throw error;
  }
};

export const getOnTheAirTVShows = async (page: number = 1): Promise<SearchResponse> => {
  try {
    const response = await tmdbApi.get('/tv/on_the_air', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching on the air TV shows:', error);
    throw error;
  }
};

// Additional Movie categories
export const getNowPlayingMovies = async (page: number = 1): Promise<SearchResponse> => {
  try {
    const response = await tmdbApi.get('/movie/now_playing', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    throw error;
  }
};

// Genre-based functions
export const getMoviesByGenre = async (genreId: number, page: number = 1): Promise<SearchResponse> => {
  try {
    const response = await tmdbApi.get('/discover/movie', {
      params: { 
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc'
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    throw error;
  }
};

export const getTVShowsByGenre = async (genreId: number, page: number = 1): Promise<SearchResponse> => {
  try {
    const response = await tmdbApi.get('/discover/tv', {
      params: { 
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc'
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching TV shows by genre:', error);
    throw error;
  }
};

// Get genres
export const getMovieGenres = async () => {
  try {
    const response = await tmdbApi.get('/genre/movie/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching movie genres:', error);
    throw error;
  }
};

export const getTVGenres = async () => {
  try {
    const response = await tmdbApi.get('/genre/tv/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching TV genres:', error);
    throw error;
  }
};

// Anime-specific functions
export const getAnimeMovies = async (page: number = 1): Promise<SearchResponse> => {
  try {
    const response = await tmdbApi.get('/discover/movie', {
      params: { 
        with_genres: '16', // Animation genre ID
        with_keywords: '210024', // Anime keyword ID
        page,
        sort_by: 'popularity.desc'
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching anime movies:', error);
    throw error;
  }
};

export const getAnimeTVShows = async (page: number = 1): Promise<SearchResponse> => {
  try {
    const response = await tmdbApi.get('/discover/tv', {
      params: { 
        with_genres: '16', // Animation genre ID
        with_keywords: '210024', // Anime keyword ID
        page,
        sort_by: 'popularity.desc'
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching anime TV shows:', error);
    throw error;
  }
};

export const getAllAnime = async (page: number = 1): Promise<SearchResponse> => {
  try {
    // Fetch both anime movies and TV shows
    const [animeMovies, animeTVShows] = await Promise.all([
      getAnimeMovies(page),
      getAnimeTVShows(page)
    ]);

    // Combine and sort by popularity
    const combinedResults = [
      ...animeMovies.results,
      ...animeTVShows.results
    ].sort((a, b) => b.vote_average - a.vote_average);

    return {
      page,
      results: combinedResults,
      total_pages: Math.max(animeMovies.total_pages, animeTVShows.total_pages),
      total_results: animeMovies.total_results + animeTVShows.total_results
    };
  } catch (error) {
    console.error('Error fetching all anime:', error);
    throw error;
  }
}; 

// TV Show Season and Episode functions
export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  air_date: string;
  episode_count: number;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string;
  episode_number: number;
  air_date: string;
  runtime: number;
  season_number: number;
  show_id: number;
}

export interface SeasonDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  air_date: string;
  episodes: Episode[];
}

export interface EpisodeDetails extends Episode {
  crew: Array<{
    id: number;
    name: string;
    job: string;
  }>;
  guest_stars: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string;
  }>;
}

// Get TV show seasons
export const getTVShowSeasons = async (tvId: number): Promise<{ seasons: Season[] }> => {
  try {
    const response = await tmdbApi.get(`/tv/${tvId}`);
    return { seasons: response.data.seasons };
  } catch (error) {
    console.error('Error fetching TV show seasons:', error);
    throw error;
  }
};

// Get season details with episodes
export const getSeasonDetails = async (tvId: number, seasonNumber: number): Promise<SeasonDetails> => {
  try {
    const response = await tmdbApi.get(`/tv/${tvId}/season/${seasonNumber}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching season details:', error);
    throw error;
  }
};

// Get episode details
export const getEpisodeDetails = async (tvId: number, seasonNumber: number, episodeNumber: number): Promise<EpisodeDetails> => {
  try {
    const response = await tmdbApi.get(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching episode details:', error);
    throw error;
  }
}; 