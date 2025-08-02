import axios from 'axios';
import { config } from '../config/env';
import { TrailerData } from '../stores/trailerModalStore';

const tmdbApi = axios.create({
  baseURL: config.tmdb.baseUrl,
  headers: {
    'Authorization': `Bearer ${config.tmdb.bearerToken}`,
    'Content-Type': 'application/json',
  },
});

export interface TMDBVideo {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface TMDBVideoResponse {
  id: number;
  results: TMDBVideo[];
}

/**
 * Fetch videos (trailers, teasers, etc.) for a movie
 */
export const getMovieVideos = async (movieId: number): Promise<TMDBVideoResponse> => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/videos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    throw new Error('Failed to fetch movie videos');
  }
};

/**
 * Fetch videos (trailers, teasers, etc.) for a TV show
 */
export const getTVShowVideos = async (tvId: number): Promise<TMDBVideoResponse> => {
  try {
    const response = await tmdbApi.get(`/tv/${tvId}/videos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching TV show videos:', error);
    throw new Error('Failed to fetch TV show videos');
  }
};

/**
 * Find the best trailer from a list of videos
 * Priority: Official Trailer > Trailer > Teaser > Other
 */
export const findBestTrailer = (videos: TMDBVideo[]): TrailerData | null => {
  if (!videos || videos.length === 0) {
    return null;
  }

  // Filter for YouTube videos only
  const youtubeVideos = videos.filter(video => video.site === 'YouTube');

  if (youtubeVideos.length === 0) {
    return null;
  }

  // Priority order: Official Trailer > Trailer > Teaser > Other
  const priorityOrder = ['Official Trailer', 'Trailer', 'Teaser'];
  
  for (const priority of priorityOrder) {
    const officialTrailer = youtubeVideos.find(video => 
      video.type === 'Trailer' && 
      video.name.toLowerCase().includes(priority.toLowerCase())
    );
    
    if (officialTrailer) {
      return officialTrailer as TrailerData;
    }
  }

  // If no priority trailer found, return the first trailer
  const firstTrailer = youtubeVideos.find(video => video.type === 'Trailer');
  if (firstTrailer) {
    return firstTrailer as TrailerData;
  }

  // If no trailer found, return the first video
  return youtubeVideos[0] as TrailerData;
};

/**
 * Get trailer for a movie or TV show
 */
export const getTrailer = async (
  mediaType: 'movie' | 'tv',
  mediaId: number
): Promise<TrailerData | null> => {
  try {
    let videos: TMDBVideo[];
    
    if (mediaType === 'movie') {
      const response = await getMovieVideos(mediaId);
      videos = response.results;
    } else {
      const response = await getTVShowVideos(mediaId);
      videos = response.results;
    }

    const bestTrailer = findBestTrailer(videos);
    return bestTrailer ? {
      key: bestTrailer.key,
      name: bestTrailer.name,
      site: bestTrailer.site,
      size: bestTrailer.size,
      type: bestTrailer.type,
      official: bestTrailer.official,
      published_at: bestTrailer.published_at,
      id: bestTrailer.id,
    } : null;
  } catch (error) {
    console.error('Error getting trailer:', error);
    throw error;
  }
}; 