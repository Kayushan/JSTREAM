import React, { useEffect, useRef, useState } from 'react';
import { 
  XMarkIcon, 
  PlayIcon, 
  ExclamationTriangleIcon,
  StarIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import YouTube from 'react-youtube';
import { useNavigate } from 'react-router-dom';
import { useTrailerModalStore } from '../../stores/trailerModalStore';
import { getTrailer } from '../../services/trailerService';
import { 
  isValidTrailer
} from '../../utils/trailerUtils';
import { config } from '../../config/env';

const TrailerModal: React.FC = () => {
  const {
    isOpen,
    currentMovie,
    trailerData,
    isLoading,
    error,
    actions: { closeModal, setTrailerData, setLoading, setError }
  } = useTrailerModalStore();

  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  // Handle modal visibility animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Fetch trailer when modal opens
  useEffect(() => {
    if (isOpen && currentMovie && !trailerData) {
      fetchTrailer();
    }
  }, [isOpen, currentMovie]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeModal]);

  // Handle click outside modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeModal();
    }
  };

  const fetchTrailer = async () => {
    if (!currentMovie) return;

    setLoading(true);
    setError(null);

    try {
      const mediaType = currentMovie.media_type as 'movie' | 'tv' || 'movie';
      const trailer = await getTrailer(mediaType, currentMovie.id);
      
      if (trailer && isValidTrailer(trailer)) {
        setTrailerData(trailer);
      } else {
        setError('No trailer available for this title');
      }
    } catch (err) {
      console.error('Error fetching trailer:', err);
      setError('Failed to load trailer. Please try again.');
    }
  };

  const handleRetry = () => {
    fetchTrailer();
  };

  const handleWatchNow = () => {
    if (currentMovie) {
      const mediaType = currentMovie.media_type as 'movie' | 'tv' || 'movie';
      closeModal();
      navigate(`/watch/${mediaType}/${currentMovie.id}`);
    }
  };

  const handleVideoReady = () => {
    // setVideoReady(true); // This line is removed
  };

  const formatRuntime = (runtime?: number) => {
    if (!runtime) return '';
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
  };

  const formatReleaseDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).getFullYear();
  };

  if (!isOpen) return null;

  const movieTitle = currentMovie?.title || currentMovie?.name || 'Unknown Title';
  const posterPath = currentMovie?.poster_path;
  const posterUrl = posterPath ? `${config.tmdb.imageBaseUrl}/w500${posterPath}` : '';
  const releaseDate = currentMovie?.release_date || currentMovie?.first_air_date;
  const runtime = currentMovie?.runtime || currentMovie?.episode_run_time?.[0];
  const voteAverage = currentMovie?.vote_average;
  const overview = currentMovie?.overview;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md"></div>
      
      {/* Modal Container */}
      <div 
        ref={modalRef}
        className={`relative w-full max-w-6xl mx-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 transform ${
          isVisible ? 'scale-100' : 'scale-95'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-20 p-3 bg-black/60 text-white hover:bg-black/80 rounded-full transition-all duration-200 backdrop-blur-sm hover:scale-110"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
          {/* Left Side - Video Player */}
          <div className="flex-1 relative">
            {/* Loading State */}
            {isLoading && (
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mx-auto mb-6"></div>
                  <h3 className="text-xl font-bold text-white mb-3">Loading Trailer</h3>
                  <p className="text-gray-400 text-sm">Please wait while we fetch the trailer...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center max-w-sm mx-auto px-6">
                  <div className="bg-pink-500/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <ExclamationTriangleIcon className="h-10 w-10 text-pink-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Trailer Unavailable</h3>
                  <p className="text-gray-400 mb-8 text-sm leading-relaxed">{error}</p>
                  <div className="flex flex-col gap-4 justify-center">
                    <button
                      onClick={handleWatchNow}
                      className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <PlayIcon className="h-5 w-5 inline mr-2" />
                      Watch Now
                    </button>
                    <button
                      onClick={handleRetry}
                      className="bg-gray-700 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-all duration-200 font-medium text-sm"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

                         {/* YouTube Player */}
             {trailerData && !isLoading && !error && (
               <div className="relative aspect-video">
                 <YouTube
                   videoId={trailerData.key}
                   opts={{
                     width: '100%',
                     height: '100%',
                     playerVars: {
                       autoplay: 1,
                       modestbranding: 1,
                       rel: 0,
                       showinfo: 0,
                       controls: 1,
                       fs: 1,
                       color: 'white',
                       iv_load_policy: 3,
                       disablekb: 0,
                       cc_load_policy: 0,
                       playsinline: 1,
                     },
                   }}
                   className="aspect-video w-full h-full"
                   onReady={handleVideoReady}
                   onError={(error) => {
                     console.error('YouTube player error:', error);
                     setError('Failed to load video player');
                   }}
                 />
               </div>
             )}
          </div>

                     {/* Right Side - Movie Details */}
           <div className="w-full lg:w-96 bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-sm p-4 sm:p-6 lg:p-8">
             {/* Movie Header */}
             <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
               {/* Poster */}
               {posterUrl && (
                 <div className="flex-shrink-0">
                   <img 
                     src={posterUrl} 
                     alt={movieTitle}
                     className="w-12 h-18 sm:w-16 sm:h-24 md:w-20 md:h-28 lg:w-24 lg:h-36 object-cover rounded-lg sm:rounded-xl shadow-lg sm:shadow-2xl"
                   />
                 </div>
               )}
               
               {/* Title and Meta */}
               <div className="flex-1 min-w-0">
                 <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3 leading-tight">
                   {movieTitle}
                 </h1>
                 
                 {/* Meta Information */}
                 <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-gray-300 text-xs sm:text-sm">
                   {voteAverage && (
                     <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                       <StarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                       <span className="font-semibold text-xs sm:text-sm">{voteAverage.toFixed(1)}</span>
                     </div>
                   )}
                   
                   {releaseDate && (
                     <div className="flex items-center space-x-1 bg-gray-700/50 px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                       <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                       <span className="text-xs sm:text-sm">{formatReleaseDate(releaseDate)}</span>
                     </div>
                   )}
                   
                   {runtime && (
                     <div className="flex items-center space-x-1 bg-gray-700/50 px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                       <ClockIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                       <span className="text-xs sm:text-sm">{formatRuntime(runtime)}</span>
                     </div>
                   )}
                 </div>
               </div>
             </div>

                         {/* Movie Overview */}
             {overview && (
               <div className="mb-4 sm:mb-6 lg:mb-8">
                 <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3 flex items-center">
                   <span className="w-1 h-4 sm:h-6 bg-gradient-to-b from-pink-500 to-pink-600 rounded-full mr-2 sm:mr-3"></span>
                   Overview
                 </h3>
                 <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none">
                   {overview}
                 </p>
               </div>
             )}

             {/* Watch Now Button */}
             <div className="mt-auto">
               <button
                 onClick={handleWatchNow}
                 className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-200 font-semibold text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 sm:space-x-3"
               >
                 <PlayIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                 <span>Watch Now</span>
               </button>
               
               {/* Additional Info */}
               {trailerData && (
                 <div className="mt-3 sm:mt-4 text-center">
                   <p className="text-gray-400 text-xs">
                     Trailer loaded successfully
                   </p>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal; 