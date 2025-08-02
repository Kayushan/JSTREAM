import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession } from '../services/supabase';
import { getTrending, getPopularMovies, getPopularTVShows, getTopRatedMovies, getTopRatedTVShows, getUpcomingMovies, Movie, TVShow, getImageUrl } from '../services/tmdb';
import { getContinueWatching } from '../services/supabase';
import MediaGrid from '../components/media/MediaGrid';

import { toast } from 'react-hot-toast';
import { PlayIcon, InformationCircleIcon, MagnifyingGlassIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { getWatchUrl } from '../utils/mobileUtils';
import MobileNavigation from '../components/layout/MobileNavigation';
import TVShowEpisodes from '../components/media/TVShowEpisodes';

const MobileHome: React.FC = () => {
  const [trending, setTrending] = useState<(Movie | TVShow)[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<TVShow[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState<TVShow[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [continueWatching, setContinueWatching] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [apiError, setApiError] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const [showMenu, setShowMenu] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Movie | TVShow | null>(null);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [selectedTVShow, setSelectedTVShow] = useState<TVShow | null>(null);
  const navigate = useNavigate();

  // Get featured content for hero banner (top 3 trending for mobile)
  const featuredContent = trending.slice(0, 3);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const session = await getSession();
        if (session?.user?.id) {
          setUserId(session.user.id);
          
          // Fetch continue watching
          const continueData = await getContinueWatching(session.user.id);
          setContinueWatching(continueData);
        }

        // Fetch all content in parallel
        try {
          const [
            trendingData,
            moviesData,
            tvData,
            topRatedMoviesData,
            topRatedTVData,
            upcomingData
          ] = await Promise.all([
            getTrending('week'),
            getPopularMovies(),
            getPopularTVShows(),
            getTopRatedMovies(),
            getTopRatedTVShows(),
            getUpcomingMovies(),
          ]);

          setTrending(trendingData.results);
          setPopularMovies(moviesData.results as Movie[]);
          setPopularTVShows(tvData.results as TVShow[]);
          setTopRatedMovies(topRatedMoviesData.results as Movie[]);
          setTopRatedTVShows(topRatedTVData.results as TVShow[]);
          setUpcomingMovies(upcomingData.results as Movie[]);
        } catch (error) {
          console.error('Error fetching content:', error);
          toast.error('Failed to load content');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setApiError(true);
        toast.error('Failed to load content. Please check your TMDB API key.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Auto-rotate banner every 6 seconds (faster for mobile)
  useEffect(() => {
    if (featuredContent.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % featuredContent.length);
      }, 6000);

      return () => clearInterval(interval);
    }
  }, [featuredContent.length]);



  const handleToggleFavorite = async (_media: Movie | TVShow) => {
    if (!userId) {
      toast.error('Please sign in to save favorites');
      return;
    }
    toast.success('Favorite toggled!');
  };

  const getFavoritesSet = () => {
    return new Set<string>();
  };

  // Netflix-style direct navigation (no modal, no details)
  const handleMediaClick = (media: Movie | TVShow) => {
    const mediaType = 'title' in media ? 'movie' : 'tv';
    const watchUrl = getWatchUrl(mediaType, media.id.toString());
    navigate(watchUrl);
  };

  const handleBannerClick = (media: Movie | TVShow) => {
    handleMediaClick(media);
  };

  const handleInfoClick = (media: Movie | TVShow) => {
    setSelectedMedia(media);
    setShowInfoModal(true);
  };

  const handleEpisodesClick = (media: TVShow) => {
    setSelectedTVShow(media);
    setShowEpisodes(true);
  };

  const handleEpisodeSelect = (episode: any, seasonNumber: number) => {
    // Navigate to watch page with episode info
    const watchUrl = `/mobile/watch/tv/${selectedTVShow?.id}?season=${seasonNumber}&episode=${episode.episode_number}`;
    navigate(watchUrl);
    setShowEpisodes(false);
  };

  const handleCloseEpisodes = () => {
    setShowEpisodes(false);
    setSelectedTVShow(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-4">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-white mb-4">API Error</h1>
          <p className="text-gray-300 mb-6 text-sm">
            Unable to load content from TMDB. Please check your API key configuration.
          </p>
          <div className="bg-gray-800 rounded-lg p-4 text-left text-sm">
            <h3 className="text-white font-semibold mb-2">To fix this:</h3>
            <ol className="text-gray-300 space-y-1">
              <li>1. Get a TMDB API key from TMDB API Settings</li>
              <li>2. Update your .env.local file</li>
              <li>3. Restart the development server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-red-600 text-2xl font-bold">JSTREAM</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/search')}
              className="text-white p-2"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-white p-2"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>


      </div>

      {/* Mobile Hero Banner */}
      {featuredContent.length > 0 && (
        <div className="relative h-screen">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={getImageUrl(featuredContent[currentBannerIndex]?.backdrop_path || '', 'w1280')}
              alt={featuredContent[currentBannerIndex]?.title || featuredContent[currentBannerIndex]?.name}
              className="w-full h-full object-cover"
            />
            {/* Mobile gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>
          </div>

          {/* Mobile Banner Content */}
          <div className="absolute inset-0 flex items-end pb-20">
            <div className="w-full px-4">
              <div className="max-w-sm">
                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                  {featuredContent[currentBannerIndex]?.title || featuredContent[currentBannerIndex]?.name}
                </h1>

                {/* Mobile meta info */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center space-x-1">
                    <span className="text-green-400 font-semibold">●</span>
                    <span className="text-white font-medium text-sm">New</span>
                  </div>
                  <span className="text-white/80 text-sm">
                    {featuredContent[currentBannerIndex]?.vote_average?.toFixed(1)} Rating
                  </span>
                  <span className="text-white/80 text-sm">
                    {featuredContent[currentBannerIndex]?.release_date 
                      ? new Date(featuredContent[currentBannerIndex].release_date).getFullYear()
                      : new Date(featuredContent[currentBannerIndex]?.first_air_date || '').getFullYear()
                    }
                  </span>
                </div>

                {/* Mobile action buttons */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleBannerClick(featuredContent[currentBannerIndex])}
                    className="flex items-center space-x-2 bg-white text-black px-6 py-2 rounded font-semibold text-sm"
                  >
                    <PlayIcon className="h-5 w-5" />
                    <span>Play</span>
                  </button>
                  <button 
                    onClick={() => handleInfoClick(featuredContent[currentBannerIndex])}
                    className="flex items-center space-x-2 bg-gray-600/70 text-white px-6 py-2 rounded font-semibold text-sm backdrop-blur-sm"
                  >
                    <InformationCircleIcon className="h-5 w-5" />
                    <span>Info</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Banner Indicators */}
          {featuredContent.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {featuredContent.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentBannerIndex 
                      ? 'bg-white' 
                      : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile Content Sections */}
      <div className="relative z-10 bg-black pt-4">


        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <div className="mb-8">
            <MediaGrid
              media={continueWatching.map(item => ({
                id: item.tmdb_id,
                title: item.title,
                name: item.title,
                poster_path: item.poster_path,
                overview: '',
                backdrop_path: '',
                release_date: '',
                first_air_date: '',
                vote_average: 0,
                vote_count: 0,
                genre_ids: [],
                media_type: item.media_type,
              }))}
              title="Continue Watching"
              onToggleFavorite={handleToggleFavorite}
              favorites={getFavoritesSet()}
              onMediaClick={handleMediaClick}
              isMobile={true}
            />
          </div>
        )}

        {/* Trending Now */}
        <div className="mb-8">
          <MediaGrid
            media={trending}
            title="Trending Now"
            onToggleFavorite={handleToggleFavorite}
            favorites={getFavoritesSet()}
            onMediaClick={handleMediaClick}
            isMobile={true}
          />
        </div>

        {/* Popular Movies */}
        <div className="mb-8">
          <MediaGrid
            media={popularMovies}
            title="Popular Movies"
            onToggleFavorite={handleToggleFavorite}
            favorites={getFavoritesSet()}
            onMediaClick={handleMediaClick}
            isMobile={true}
          />
        </div>

        {/* Popular TV Shows */}
        <div className="mb-8">
          <MediaGrid
            media={popularTVShows}
            title="Popular TV Shows"
            onToggleFavorite={handleToggleFavorite}
            favorites={getFavoritesSet()}
            onMediaClick={handleMediaClick}
            onEpisodesClick={handleEpisodesClick}
            isMobile={true}
          />
        </div>

        {/* Top Rated Movies */}
        <div className="mb-8">
          <MediaGrid
            media={topRatedMovies}
            title="Top Rated Movies"
            onToggleFavorite={handleToggleFavorite}
            favorites={getFavoritesSet()}
            onMediaClick={handleMediaClick}
            isMobile={true}
          />
        </div>

        {/* Top Rated TV Shows */}
        <div className="mb-8">
          <MediaGrid
            media={topRatedTVShows}
            title="Top Rated TV Shows"
            onToggleFavorite={handleToggleFavorite}
            favorites={getFavoritesSet()}
            onMediaClick={handleMediaClick}
            onEpisodesClick={handleEpisodesClick}
            isMobile={true}
          />
        </div>

        {/* Upcoming Movies */}
        <div className="mb-20">
          <MediaGrid
            media={upcomingMovies}
            title="Coming Soon"
            onToggleFavorite={handleToggleFavorite}
            favorites={getFavoritesSet()}
            onMediaClick={handleMediaClick}
            isMobile={true}
          />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/90 z-50">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h1 className="text-red-600 text-2xl font-bold">JSTREAM</h1>
              <button
                onClick={() => setShowMenu(false)}
                className="text-white text-2xl"
              >
                ×
              </button>
            </div>
            <nav className="flex-1 p-4">
              <div className="space-y-6">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    navigate('/');
                  }}
                  className="block text-white text-lg py-2 text-left w-full hover:text-red-400 transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    navigate('/mobile/tv-shows');
                  }}
                  className="block text-white text-lg py-2 text-left w-full hover:text-red-400 transition-colors"
                >
                  Genre
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    navigate('/mobile/movies');
                  }}
                  className="block text-white text-lg py-2 text-left w-full hover:text-red-400 transition-colors"
                >
                  Movies
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    navigate('/mobile/library');
                  }}
                  className="block text-white text-lg py-2 text-left w-full hover:text-red-400 transition-colors"
                >
                  My List
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    toast('Downloads feature coming soon');
                  }}
                  className="block text-white text-lg py-2 text-left w-full hover:text-red-400 transition-colors"
                >
                  Downloads
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Info Modal */}
      {showInfoModal && selectedMedia && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-white text-lg font-semibold">Movie Info</h2>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-white p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6">
                {/* Backdrop Image */}
                <div className="relative h-48 rounded-xl overflow-hidden">
                  <img
                    src={selectedMedia.backdrop_path ? getImageUrl(selectedMedia.backdrop_path, 'w1280') : 'https://via.placeholder.com/1280x720/333/666?text=No+Image'}
                    alt={('title' in selectedMedia ? selectedMedia.title : selectedMedia.name) || ''}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/1280x720/333/666?text=No+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                </div>

                {/* Title and Basic Info */}
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {'title' in selectedMedia ? selectedMedia.title : selectedMedia.name}
                  </h1>
                  <p className="text-gray-400 mb-3">
                    {('title' in selectedMedia ? selectedMedia.release_date : selectedMedia.first_air_date)?.split('-')[0] || 'N/A'}
                    {' • '}
                    {('title' in selectedMedia ? 'Movie' : 'TV Show')}
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-white font-semibold">
                        {selectedMedia.vote_average?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">
                      {selectedMedia.vote_count?.toLocaleString() || 'N/A'} votes
                    </span>
                  </div>
                </div>

                {/* Overview */}
                {selectedMedia.overview && (
                  <div className="bg-gray-900 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-3">Overview</h3>
                    <p className="text-gray-300 leading-relaxed">{selectedMedia.overview}</p>
                  </div>
                )}

                {/* Additional Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm mb-1">Type</p>
                    <p className="text-white font-semibold">
                      {('title' in selectedMedia ? 'Movie' : 'TV Show')}
                    </p>
                  </div>
                  <div className="bg-gray-900 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm mb-1">Rating</p>
                    <p className="text-white font-semibold">
                      {selectedMedia.vote_average?.toFixed(1) || 'N/A'}/10
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    handleMediaClick(selectedMedia);
                    setShowInfoModal(false);
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 bg-red-600 text-white py-3 rounded-lg font-semibold"
                >
                  <PlayIcon className="h-5 w-5" />
                  <span>Play</span>
                </button>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />

      {/* TV Show Episodes Modal */}
      {showEpisodes && selectedTVShow && (
        <TVShowEpisodes
          tvShowId={selectedTVShow.id}
          tvShowTitle={selectedTVShow.name}
          tvShowPoster={selectedTVShow.poster_path}
          onEpisodeSelect={handleEpisodeSelect}
          onClose={handleCloseEpisodes}
        />
      )}
    </div>
  );
};

export default MobileHome; 