import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession } from '../services/supabase';
import { getTrending, getPopularMovies, getPopularTVShows, getTopRatedMovies, getTopRatedTVShows, getUpcomingMovies, searchMulti, Movie, TVShow, getImageUrl } from '../services/tmdb';
import { getContinueWatching } from '../services/supabase';
import MediaGrid from '../components/media/MediaGrid';
import SearchBar from '../components/media/SearchBar';
import { toast } from 'react-hot-toast';
import { PlayIcon, InformationCircleIcon, ChevronLeftIcon, ChevronRightIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';
import { getWatchUrl } from '../utils/mobileUtils';

// Helper functions to safely access properties
const getMediaTitle = (media: Movie | TVShow): string => {
  return 'title' in media ? media.title : media.name;
};

const getMediaReleaseDate = (media: Movie | TVShow): string => {
  return 'release_date' in media ? media.release_date : media.first_air_date;
};

const Home: React.FC = () => {
  const [trending, setTrending] = useState<(Movie | TVShow)[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<TVShow[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState<TVShow[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [continueWatching, setContinueWatching] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<(Movie | TVShow)[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [apiError, setApiError] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Movie | TVShow | null>(null);
  const navigate = useNavigate();

  // Get featured content for hero banner (top 5 trending)
  const featuredContent = trending.slice(0, 5);

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

  // Auto-rotate banner every 8 seconds (Netflix timing)
  useEffect(() => {
    if (featuredContent.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % featuredContent.length);
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [featuredContent.length]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    if (query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchMulti(query);
      setSearchResults(results.results || []);
    } catch (error) {
      console.error('Error searching:', error);
      toast.error('Search failed. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

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

  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % featuredContent.length);
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + featuredContent.length) % featuredContent.length);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 mx-auto mb-6"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">API Error</h1>
          <p className="text-gray-300 mb-6">
            Unable to load content from TMDB. Please check your API key configuration.
          </p>
          <div className="bg-gray-800 rounded-lg p-4 text-left">
            <h3 className="text-white font-semibold mb-2">To fix this:</h3>
            <ol className="text-gray-300 text-sm space-y-1">
              <li>1. Get a TMDB API key from <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">TMDB API Settings</a></li>
              <li>2. Update your <code className="bg-gray-700 px-1 rounded">.env.local</code> file</li>
              <li>3. Restart the development server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Netflix-Style Hero Banner */}
      {featuredContent.length > 0 && (
        <div className="relative h-screen">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={getImageUrl(featuredContent[currentBannerIndex]?.backdrop_path || '', 'original')}
              alt={getMediaTitle(featuredContent[currentBannerIndex])}
              className="w-full h-full object-cover"
            />
            {/* Netflix-style gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          </div>

          {/* Top Navigation Bar */}
          <div className="absolute top-0 left-0 right-0 z-30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <h1 className="text-red-600 text-3xl font-bold">JSTREAM</h1>
                <nav className="hidden md:flex space-x-6 text-white">
                  <a href="#" className="hover:text-gray-300 transition-colors">Home</a>
                  <a href="#" className="hover:text-gray-300 transition-colors">TV Shows</a>
                  <a href="#" className="hover:text-gray-300 transition-colors">Movies</a>
                  <a href="#" className="hover:text-gray-300 transition-colors">My List</a>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="Search..."
                  className="w-64 backdrop-blur-md bg-black/30 border-white/20"
                />
                                 <button
                   onClick={toggleMute}
                   className="text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                 >
                   {isMuted ? (
                     <SpeakerXMarkIcon className="h-5 w-5" />
                   ) : (
                     <SpeakerWaveIcon className="h-5 w-5" />
                   )}
                 </button>
              </div>
            </div>
          </div>

          {/* Banner Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                {/* Title */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                  {getMediaTitle(featuredContent[currentBannerIndex])}
                </h1>

                {/* Netflix-style meta info */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-1">
                    <span className="text-green-400 font-semibold">●</span>
                    <span className="text-white font-medium">New</span>
                  </div>
                  <span className="text-white/80">
                    {featuredContent[currentBannerIndex]?.vote_average?.toFixed(1)} Rating
                  </span>
                  <span className="text-white/80">
                    {new Date(getMediaReleaseDate(featuredContent[currentBannerIndex])).getFullYear()}
                  </span>
                  <span className="text-white/80">HD</span>
                </div>

                {/* Overview */}
                <p className="text-lg text-white/90 mb-8 line-clamp-3 max-w-xl">
                  {featuredContent[currentBannerIndex]?.overview}
                </p>

                {/* Netflix-style action buttons */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleBannerClick(featuredContent[currentBannerIndex])}
                    className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded font-semibold hover:bg-white/90 transition-all duration-200 shadow-lg"
                  >
                    <PlayIcon className="h-6 w-6" />
                    <span>Play</span>
                  </button>
                  <button 
                    onClick={() => handleInfoClick(featuredContent[currentBannerIndex])}
                    className="flex items-center space-x-2 bg-gray-600/70 text-white px-8 py-3 rounded font-semibold hover:bg-gray-600/90 transition-all duration-200 backdrop-blur-sm"
                  >
                    <InformationCircleIcon className="h-6 w-6" />
                    <span>More Info</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {featuredContent.length > 1 && (
            <>
              <button
                onClick={prevBanner}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all duration-200 backdrop-blur-sm z-20"
              >
                <ChevronLeftIcon className="h-8 w-8" />
              </button>
              <button
                onClick={nextBanner}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all duration-200 backdrop-blur-sm z-20"
              >
                <ChevronRightIcon className="h-8 w-8" />
              </button>
            </>
          )}

          {/* Banner Indicators */}
          {featuredContent.length > 1 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {featuredContent.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentBannerIndex 
                      ? 'bg-white' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content Sections */}
      <div className="relative z-10 bg-black">
        {/* Search Results */}
        {searchResults && searchResults.length > 0 && (
          <div className="pt-8">
            <MediaGrid
              media={searchResults}
              title="Search Results"
              isLoading={isSearching}
              onToggleFavorite={handleToggleFavorite}
              favorites={getFavoritesSet()}
              onMediaClick={handleMediaClick}
            />
          </div>
        )}
        
        {/* Search Loading State */}
        {isSearching && (
          <div className="pt-8 space-y-6">
            <h2 className="text-2xl font-bold text-white px-4">Search Results</h2>
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-400">Searching...</p>
            </div>
          </div>
        )}
        
        {/* No Search Results */}
        {!isSearching && searchResults && searchResults.length === 0 && searchResults.length !== undefined && (
          <div className="pt-8 space-y-6">
            <h2 className="text-2xl font-bold text-white px-4">Search Results</h2>
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No movies or TV shows found</p>
              <p className="text-gray-500 text-sm mt-2">Try searching for something else</p>
            </div>
          </div>
        )}

        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <div className="pt-8">
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
            />
          </div>
        )}

        {/* Trending Now */}
        <div className="pt-8">
          <MediaGrid
            media={trending}
            title="Trending Now"
            onToggleFavorite={handleToggleFavorite}
            favorites={getFavoritesSet()}
            onMediaClick={handleMediaClick}
          />
        </div>

        {/* Popular Movies */}
        <div className="pt-8">
          <MediaGrid
            media={popularMovies}
            title="Popular Movies"
            onToggleFavorite={handleToggleFavorite}
            favorites={getFavoritesSet()}
            onMediaClick={handleMediaClick}
          />
        </div>

        {/* Popular TV Shows */}
        <div className="pt-8">
          <MediaGrid
            media={popularTVShows}
            title="Popular TV Shows"
            onToggleFavorite={handleToggleFavorite}
            favorites={getFavoritesSet()}
            onMediaClick={handleMediaClick}
          />
        </div>

        {/* Top Rated Movies */}
        <div className="pt-8">
          <MediaGrid
            media={topRatedMovies}
            title="Top Rated Movies"
            onToggleFavorite={handleToggleFavorite}
            favorites={getFavoritesSet()}
            onMediaClick={handleMediaClick}
          />
        </div>

        {/* Top Rated TV Shows */}
        <div className="pt-8">
          <MediaGrid
            media={topRatedTVShows}
            title="Top Rated TV Shows"
            onToggleFavorite={handleToggleFavorite}
            favorites={getFavoritesSet()}
            onMediaClick={handleMediaClick}
          />
        </div>

        {/* Upcoming Movies */}
        <div className="pt-8 pb-16">
          <MediaGrid
            media={upcomingMovies}
            title="Coming Soon"
            onToggleFavorite={handleToggleFavorite}
            favorites={getFavoritesSet()}
            onMediaClick={handleMediaClick}
          />
        </div>
      </div>

      {/* Movie Info Modal */}
      {showInfoModal && selectedMedia && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Backdrop Image */}
              <div className="relative h-64 rounded-t-xl overflow-hidden">
                <img
                  src={selectedMedia.backdrop_path ? getImageUrl(selectedMedia.backdrop_path, 'w1280') : 'https://via.placeholder.com/1280x720/333/666?text=No+Image'}
                  alt={('title' in selectedMedia ? selectedMedia.title : selectedMedia.name) || ''}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/1280x720/333/666?text=No+Image';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                
                {/* Close Button */}
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  {/* Poster */}
                  <img
                    src={selectedMedia.poster_path ? getImageUrl(selectedMedia.poster_path, 'w342') : 'https://via.placeholder.com/342x513/333/666?text=No+Image'}
                    alt={('title' in selectedMedia ? selectedMedia.title : selectedMedia.name) || ''}
                    className="w-24 h-36 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/342x513/333/666?text=No+Image';
                    }}
                  />
                  
                  {/* Title and Basic Info */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {'title' in selectedMedia ? selectedMedia.title : selectedMedia.name}
                    </h2>
                    <p className="text-gray-400 mb-2">
                      {('title' in selectedMedia ? selectedMedia.release_date : selectedMedia.first_air_date)?.split('-')[0] || 'N/A'}
                      {' • '}
                      {('title' in selectedMedia ? 'Movie' : 'TV Show')}
                    </p>
                    <div className="flex items-center space-x-2 mb-3">
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
                </div>

                {/* Overview */}
                {selectedMedia.overview && (
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-2">Overview</h3>
                    <p className="text-gray-300 leading-relaxed">{selectedMedia.overview}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      handleMediaClick(selectedMedia);
                      setShowInfoModal(false);
                    }}
                    className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded font-semibold hover:bg-red-700 transition-colors"
                  >
                    <PlayIcon className="h-5 w-5" />
                    <span>Play</span>
                  </button>
                  <button
                    onClick={() => setShowInfoModal(false)}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded font-semibold hover:bg-gray-700 transition-colors"
                  >
                    <span>Close</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 