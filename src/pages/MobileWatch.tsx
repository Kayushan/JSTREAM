import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSession } from '../services/supabase';
import { getMovieDetails, getTVShowDetails, Episode } from '../services/tmdb';
import { updateContinueWatching, getContinueWatching } from '../services/supabase';
import { 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
  XMarkIcon,
  ListBulletIcon,
  ShareIcon,
  HeartIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowsPointingOutIcon,
  StarIcon,
  CalendarIcon,
  ClockIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import { config } from '../config/env';
import TVShowEpisodes from '../components/media/TVShowEpisodes';
import TrailerButton from '../components/media/TrailerButton';
import { MovieData } from '../stores/trailerModalStore';

const MobileWatch: React.FC = () => {
  const { mediaType, tmdbId } = useParams<{ mediaType: 'movie' | 'tv'; tmdbId: string }>();
  const [mediaDetails, setMediaDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, _setCurrentTime] = useState(0);
  const [duration, _setDuration] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('Auto');
  const [lastTapTime, setLastTapTime] = useState(0);
  const [showSeekIndicator, setShowSeekIndicator] = useState(false);
  const [seekDirection, setSeekDirection] = useState<'forward' | 'backward'>('forward');
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [currentSeason, setCurrentSeason] = useState<number>(1);
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const detailsPanelRef = useRef<HTMLDivElement>(null);

  const getVidsrcUrl = (episodeId?: number) => {
    if (mediaType === 'tv' && episodeId) {
      return `${config.vidsrc.baseUrl}/tv/${tmdbId}/${currentSeason}/${episodeId}?autoPlay=true`;
    }
    return `${config.vidsrc.baseUrl}/${mediaType}/${tmdbId}?autoPlay=true`;
  };

  const vidsrcUrl = getVidsrcUrl(currentEpisode?.episode_number);

  useEffect(() => {
    const fetchData = async () => {
      if (!mediaType || !tmdbId) {
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        
        // Get session
        const session = await getSession();
        if (session?.user?.id) {
          setUserId(session.user.id);
        }

        // Fetch media details
        const details = mediaType === 'movie' 
          ? await getMovieDetails(parseInt(tmdbId))
          : await getTVShowDetails(parseInt(tmdbId));
        
        setMediaDetails(details);

        // For TV shows, check for continue watching data
        if (mediaType === 'tv' && session?.user?.id) {
          try {
            const continueWatching = await getContinueWatching(session.user.id);
            const tvShowProgress = continueWatching.find(
              item => item.tmdb_id === parseInt(tmdbId) && item.media_type === 'tv'
            );
            
            if (tvShowProgress && tvShowProgress.season_number && tvShowProgress.episode_number) {
              setCurrentSeason(tvShowProgress.season_number);
              // Note: We'll need to fetch episode details here if we want to show the exact episode
              // For now, we'll just set the season
            }
          } catch (error) {
            console.error('Error fetching continue watching:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching media details:', error);
        toast.error('Failed to load media details');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [mediaType, tmdbId, navigate]);

  const handleToggleFavorite = async () => {
    if (!userId) {
      toast.error('Please sign in to save favorites');
      return;
    }
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleVideoTap = (e: React.MouseEvent) => {
    e.preventDefault();
    const now = Date.now();
    const timeDiff = now - lastTapTime;
    
    if (timeDiff < 300 && timeDiff > 0) {
      // Double tap detected
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const centerX = rect.width / 2;
      
      if (x < centerX) {
        // Left side - seek backward
        setSeekDirection('backward');
        setShowSeekIndicator(true);
        setTimeout(() => setShowSeekIndicator(false), 1000);
      } else {
        // Right side - seek forward
        setSeekDirection('forward');
        setShowSeekIndicator(true);
        setTimeout(() => setShowSeekIndicator(false), 1000);
      }
    }
    
    setLastTapTime(now);
    setShowControls(!showControls);
    
    // Auto-hide controls after 3 seconds
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    if (!showControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, you would control the iframe video
    toast.success(isPlaying ? 'Paused' : 'Playing');
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    toast.success(isMuted ? 'Unmuted' : 'Muted');
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (iframeRef.current) {
      if (!isFullscreen) {
        iframeRef.current.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    }
  };

  // Touch gesture handling for mobile
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let startY = 0;
    let startTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      const timeDiff = Date.now() - startTime;

      // Swipe up gesture (fast upward swipe)
      if (deltaY < -50 && timeDiff < 300) {
        handleSwipeUp();
      }
      
      // Swipe down gesture (fast downward swipe)
      if (deltaY > 50 && timeDiff < 300) {
        handleSwipeDown();
      }
    };

    const handleTouchEnd = () => {
      startY = 0;
      startTime = 0;
    };

    iframe.addEventListener('touchstart', handleTouchStart);
    iframe.addEventListener('touchmove', handleTouchMove);
    iframe.addEventListener('touchend', handleTouchEnd);

    return () => {
      iframe.removeEventListener('touchstart', handleTouchStart);
      iframe.removeEventListener('touchmove', handleTouchMove);
      iframe.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDetailsToggle = () => {
    setShowDetails(!showDetails);
  };

  const handleSwipeUp = () => {
    setShowDetails(true);
  };

  const handleSwipeDown = () => {
    setShowDetails(false);
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
    if (navigator.share) {
      navigator.share({
        title: 'title' in mediaDetails ? mediaDetails.title : mediaDetails.name,
        text: `Watch "${'title' in mediaDetails ? mediaDetails.title : mediaDetails.name}" on JStream`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleEpisodesClick = () => {
    setShowEpisodes(true);
  };

  const handleEpisodeSelect = (episode: any, seasonNumber: number) => {
    setCurrentEpisode(episode);
    setCurrentSeason(seasonNumber);
    setShowEpisodes(false);
    setShowDetails(false);
    setShowControls(false);
    
    // Update continue watching
    if (userId && mediaDetails) {
      updateContinueWatching({
        user_id: userId,
        tmdb_id: parseInt(tmdbId!),
        media_type: 'tv',
        title: mediaDetails.name || mediaDetails.title,
        poster_path: mediaDetails.poster_path,
        progress: 0,
        last_watched: new Date().toISOString(),
        season_number: seasonNumber,
        episode_number: episode.episode_number,
        episode_id: episode.id,
      }).catch(error => {
        console.error('Error updating continue watching:', error);
      });
    }
  };

  const handleCloseEpisodes = () => {
    setShowEpisodes(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500/30 mx-auto mb-6"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-red-500 mx-auto"></div>
          </div>
          <p className="text-white/80 text-lg font-medium">Loading your movie...</p>
          <div className="mt-4 w-32 h-1 bg-gray-700 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!mediaDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XMarkIcon className="h-10 w-10 text-red-400" />
          </div>
          <p className="text-white text-xl font-semibold mb-4">Media not found</p>
          <button 
            onClick={handleBack} 
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-full font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const title = 'title' in mediaDetails ? mediaDetails.title : mediaDetails.name;
  const releaseDate = 'release_date' in mediaDetails ? mediaDetails.release_date : mediaDetails.first_air_date;
  const runtime = 'runtime' in mediaDetails ? mediaDetails.runtime : mediaDetails.episode_run_time?.[0];
  const genres = mediaDetails.genres?.map((g: any) => g.name).join(', ');
  const voteAverage = mediaDetails.vote_average;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Video Player Container */}
      <div className="relative w-full h-screen">
        {/* VidSrc Iframe */}
        <iframe
          ref={iframeRef}
          src={vidsrcUrl}
          className="w-full h-full border-0"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          onClick={handleVideoTap}
        />

        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"></div>

        {/* Video Overlay Controls */}
        {showControls && (
          <>
            {/* Top Controls Bar */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/95 via-black/70 to-transparent p-4 z-20">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleBack}
                  className="flex items-center space-x-2 bg-black/50 text-white px-3 py-2 rounded-full backdrop-blur-md border border-white/20 hover:bg-black/70 transition-all duration-200"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Back</span>
                </button>

                <div className="flex items-center space-x-2">
                  <TrailerButton
                    movie={mediaDetails as MovieData}
                    size="sm"
                    variant="secondary"
                  />
                  {mediaType === 'tv' && (
                    <button
                      onClick={handleEpisodesClick}
                      className="p-2 rounded-full bg-black/50 text-white border border-white/20 hover:bg-black/70 transition-all duration-200"
                      title="Episodes"
                    >
                      <ListBulletIcon className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-black/50 text-white border border-white/20 hover:bg-black/70 transition-all duration-200"
                  >
                    <ShareIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-2 rounded-full transition-all duration-300 backdrop-blur-md border ${
                      isFavorite 
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400 shadow-lg shadow-red-500/25' 
                        : 'bg-black/50 text-white border-white/20 hover:bg-black/70'
                    }`}
                  >
                    {isFavorite ? (
                      <HeartSolidIcon className="h-4 w-4" />
                    ) : (
                      <HeartIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Center Play/Pause Button */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <button
                onClick={handlePlayPause}
                className="bg-black/60 text-white p-4 rounded-full backdrop-blur-md border border-white/20 hover:bg-black/80 transition-all duration-200 hover:scale-110 shadow-2xl"
              >
                {isPlaying ? (
                  <PauseIcon className="h-8 w-8" />
                ) : (
                  <PlayIcon className="h-8 w-8 ml-1" />
                )}
              </button>
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 z-20">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-600/50 rounded-full h-1.5 backdrop-blur-sm">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-red-600 h-1.5 rounded-full transition-all duration-300 shadow-lg"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-white/90 text-xs mt-2 font-medium">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleMuteToggle}
                    className="text-white/90 p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all duration-200"
                  >
                    {isMuted ? (
                      <SpeakerXMarkIcon className="h-5 w-5" />
                    ) : (
                      <SpeakerWaveIcon className="h-5 w-5" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setShowSubtitles(!showSubtitles)}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      showSubtitles 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                        : 'bg-black/40 text-white/90 hover:bg-black/60'
                    }`}
                  >
                    {showSubtitles ? (
                      <EyeIcon className="h-5 w-5" />
                    ) : (
                      <EyeSlashIcon className="h-5 w-5" />
                    )}
                  </button>
                  
                  {/* Quality Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowQualityMenu(!showQualityMenu)}
                      className="text-white/90 p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all duration-200"
                    >
                      <span className="text-xs font-medium">{selectedQuality}</span>
                    </button>
                    
                    {showQualityMenu && (
                      <div className="absolute bottom-full left-0 mb-2 bg-black/90 backdrop-blur-md rounded-lg p-2 border border-white/20">
                        {['Auto', '1080p', '720p', '480p'].map((quality) => (
                          <button
                            key={quality}
                            onClick={() => {
                              setSelectedQuality(quality);
                              setShowQualityMenu(false);
                            }}
                            className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                              selectedQuality === quality 
                                ? 'text-red-400 bg-red-500/20' 
                                : 'text-white/80 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            {quality}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleFullscreen}
                    className="text-white/90 p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all duration-200"
                  >
                    <ArrowsPointingOutIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Video Title Overlay */}
        {!showControls && (
          <div className="absolute top-6 left-6 right-6 z-10">
            <h1 className="text-white text-lg font-bold drop-shadow-lg truncate">
              {title}
            </h1>
          </div>
        )}

        {/* Seek Indicator */}
        {showSeekIndicator && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="bg-black/90 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className={`text-3xl ${seekDirection === 'forward' ? 'text-green-400' : 'text-red-400'}`}>
                  {seekDirection === 'forward' ? '⏩' : '⏪'}
                </div>
                <div className="text-white text-base font-semibold">
                  {seekDirection === 'forward' ? '+10s' : '-10s'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Movie Details Panel */}
      <div 
        ref={detailsPanelRef}
        className={`fixed bottom-0 left-0 right-0 bg-gradient-to-b from-gray-900/98 via-gray-900/95 to-gray-900 rounded-t-3xl transition-all duration-500 z-30 backdrop-blur-xl border-t border-white/10 shadow-2xl ${
          showDetails ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          maxHeight: '85vh',
          minHeight: showDetails ? '70vh' : '0'
        }}
      >
        <div className="p-6">
          {/* Drag Handle */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-1 bg-gray-600 rounded-full"></div>
          </div>

          {/* Movie Info - Enhanced Layout */}
          <div className="space-y-6">
            {/* Title Section */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{title}</h2>
              {mediaDetails.tagline && (
                <p className="text-gray-400 italic text-sm">"{mediaDetails.tagline}"</p>
              )}
            </div>
            
            {/* Meta Info - Enhanced Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {voteAverage && (
                <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-3 py-1.5 rounded-full border border-yellow-500/30">
                  <StarIcon className="h-4 w-4 text-yellow-400" />
                  <span className="font-bold text-yellow-400 text-sm">{voteAverage.toFixed(1)}</span>
                </div>
              )}
              
              {releaseDate && (
                <div className="flex items-center space-x-1 bg-gray-700/50 px-3 py-1.5 rounded-full border border-gray-600/50">
                  <CalendarIcon className="h-4 w-4 text-gray-300" />
                  <span className="text-gray-200 font-medium text-sm">{new Date(releaseDate).getFullYear()}</span>
                </div>
              )}
              
              {runtime && (
                <div className="flex items-center space-x-1 bg-gray-700/50 px-3 py-1.5 rounded-full border border-gray-600/50">
                  <ClockIcon className="h-4 w-4 text-gray-300" />
                  <span className="text-gray-200 font-medium text-sm">{Math.floor(runtime / 60)}h {runtime % 60}m</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {genres && (
              <div className="text-center">
                <p className="text-gray-300 text-sm font-medium">{genres}</p>
              </div>
            )}

            {/* Plot/Synopsis - Enhanced */}
            {mediaDetails.overview && (
              <div className="space-y-3">
                <h3 className="text-white font-bold text-base text-center">Synopsis</h3>
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                  <p className="text-gray-300 text-sm leading-relaxed text-center">
                    {mediaDetails.overview}
                  </p>
                </div>
              </div>
            )}

            {/* Additional Info Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="text-center bg-gray-800/30 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">Status</p>
                <p className="text-white font-semibold text-sm">{mediaDetails.status || 'Released'}</p>
              </div>
              <div className="text-center bg-gray-800/30 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">Language</p>
                <p className="text-white font-semibold text-sm">{mediaDetails.original_language?.toUpperCase() || 'EN'}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => {
                  setShowDetails(false);
                  // Focus back to the video player
                  iframeRef.current?.focus();
                }}
                className="flex-1 flex items-center justify-center space-x-2 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                <PlayIcon className="h-4 w-4" />
                <span>Continue Watching</span>
              </button>
              <button
                onClick={handleToggleFavorite}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  isFavorite 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                    : 'bg-gray-700/50 text-white hover:bg-gray-600/50'
                }`}
              >
                {isFavorite ? (
                  <HeartSolidIcon className="h-5 w-5" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Details Toggle Button */}
      <button
        onClick={handleDetailsToggle}
        className={`fixed bottom-6 right-6 bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-full shadow-2xl z-40 transition-all duration-300 hover:scale-110 hover:shadow-red-500/25 ${
          showDetails ? 'rotate-180' : ''
        }`}
      >
        {showDetails ? (
          <ChevronDownIcon className="h-5 w-5" />
        ) : (
          <InformationCircleIcon className="h-5 w-5" />
        )}
      </button>

      {/* TV Show Episodes Modal */}
      {showEpisodes && mediaType === 'tv' && mediaDetails && (
        <TVShowEpisodes
          tvShowId={parseInt(tmdbId!)}
          tvShowTitle={mediaDetails.name || mediaDetails.title}
          tvShowPoster={mediaDetails.poster_path}
          onEpisodeSelect={handleEpisodeSelect}
          onClose={handleCloseEpisodes}
        />
      )}

    </div>
  );
};

export default MobileWatch; 