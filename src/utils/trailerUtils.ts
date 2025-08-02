import { TrailerData } from '../stores/trailerModalStore';

/**
 * Generate YouTube embed URL from video key
 */
export const getYouTubeEmbedUrl = (videoKey: string, autoplay: boolean = false): string => {
  const baseUrl = 'https://www.youtube.com/embed/';
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    modestbranding: '1',
    rel: '0',
    showinfo: '0',
    controls: '1',
    fs: '1',
  });
  
  return `${baseUrl}${videoKey}?${params.toString()}`;
};

/**
 * Generate YouTube watch URL from video key
 */
export const getYouTubeWatchUrl = (videoKey: string): string => {
  return `https://www.youtube.com/watch?v=${videoKey}`;
};

/**
 * Get video thumbnail URL from YouTube video key
 */
export const getYouTubeThumbnailUrl = (videoKey: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string => {
  return `https://img.youtube.com/vi/${videoKey}/${quality}default.jpg`;
};

/**
 * Validate if a trailer is playable
 */
export const isValidTrailer = (trailer: TrailerData | null): boolean => {
  if (!trailer) return false;
  
  return (
    trailer.site === 'YouTube' &&
    trailer.type === 'Trailer' &&
    !!trailer.key &&
    trailer.key.length > 0
  );
};

/**
 * Get trailer display name
 */
export const getTrailerDisplayName = (trailer: TrailerData): string => {
  if (trailer.name) {
    return trailer.name;
  }
  
  if (trailer.official) {
    return 'Official Trailer';
  }
  
  return 'Trailer';
};

/**
 * Format trailer duration (if available)
 */
export const formatTrailerDuration = (duration?: number): string => {
  if (!duration) return '';
  
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Get trailer quality based on available sizes
 */
export const getTrailerQuality = (trailer: TrailerData): string => {
  if (trailer.size >= 1080) return '1080p';
  if (trailer.size >= 720) return '720p';
  if (trailer.size >= 480) return '480p';
  return '360p';
}; 