import React, { useState, useEffect, useRef } from 'react';
import { config } from '../../config/env';
import { MovieDetails, TVShowDetails } from '../../services/tmdb';

interface VideoPlayerProps {
  mediaType: 'movie' | 'tv';
  tmdbId: number;
  mediaDetails?: MovieDetails | TVShowDetails;
  onProgressUpdate?: (progress: number) => void;
  initialProgress?: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  mediaType,
  tmdbId,
  mediaDetails,
  onProgressUpdate,
  initialProgress = 0,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const vidsrcUrl = `${config.vidsrc.baseUrl}/${mediaType}/${tmdbId}?autoPlay=true${
    showSubtitles ? '&subtitles=true' : ''
  }`;

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [tmdbId, mediaType]);

  useEffect(() => {
    // Simulate progress tracking (in a real app, you'd track actual video progress)
    if (onProgressUpdate) {
      progressIntervalRef.current = setInterval(() => {
        // This is a simplified progress tracking
        // In a real implementation, you'd get actual video progress from the iframe
        const randomProgress = Math.random() * 100;
        onProgressUpdate(randomProgress);
      }, 30000); // Update every 30 seconds
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [onProgressUpdate]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load video. Please try again later.');
  };

  const title = mediaDetails ? ('title' in mediaDetails ? mediaDetails.title : mediaDetails.name) : '';

  return (
    <div className="relative w-full h-full min-h-[300px] sm:min-h-[400px] bg-black">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-pink-500 mx-auto mb-3 sm:mb-4"></div>
            <p className="text-white text-sm sm:text-base">Loading video...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="text-center px-4">
            <div className="text-pink-500 text-4xl sm:text-6xl mb-3 sm:mb-4">⚠️</div>
            <p className="text-white text-base sm:text-lg mb-3 sm:mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary text-sm sm:text-base px-4 py-2"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Video Controls */}
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20 flex space-x-1 sm:space-x-2">
        <button
          onClick={() => setShowSubtitles(!showSubtitles)}
          className={`px-2 py-1 sm:px-3 sm:py-1 rounded text-xs sm:text-sm font-medium transition-colors duration-200 ${
            showSubtitles
              ? 'bg-red-600 text-white'
              : 'bg-black/70 text-white hover:bg-black/90'
          }`}
        >
          CC
        </button>
      </div>

      {/* Video Title */}
      {title && (
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-20 max-w-[60%] sm:max-w-none">
          <h1 className="text-white text-sm sm:text-xl font-bold drop-shadow-lg truncate">
            {title}
          </h1>
        </div>
      )}

      {/* VidSrc Iframe */}
      <iframe
        ref={iframeRef}
        src={vidsrcUrl}
        className="w-full h-full border-0"
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        style={{ minHeight: '300px' }}
      />

      {/* Progress Bar */}
      {initialProgress > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                     <div
             className="h-full bg-red-600 transition-all duration-300"
             style={{ width: `${initialProgress}%` }}
           />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer; 