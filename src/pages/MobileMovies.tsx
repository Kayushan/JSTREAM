import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getPopularMovies, 
  getTopRatedMovies, 
  getUpcomingMovies,
  getNowPlayingMovies,
  getMovieGenres,
  getMoviesByGenre,
  getAnimeMovies,
  Movie, 
  TVShow, 
  getImageUrl 
} from '../services/tmdb';
import { toast } from 'react-hot-toast';
import { PlayIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { getWatchUrl } from '../utils/mobileUtils';
import MobileNavigation from '../components/layout/MobileNavigation';
import MediaGrid from '../components/media/MediaGrid';

const MobileMovies: React.FC = () => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [genreMovies, setGenreMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [showAnime, setShowAnime] = useState(false);
  const [animeMovies, setAnimeMovies] = useState<Movie[]>([]);
  const [genrePage, setGenrePage] = useState(1);
  const [animePage, setAnimePage] = useState(1);
  const [hasMoreGenre, setHasMoreGenre] = useState(true);
  const [hasMoreAnime, setHasMoreAnime] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Fetch all movie categories in parallel
        const [
          popularData,
          topRatedData,
          upcomingData,
          nowPlayingData,
          genresData
        ] = await Promise.all([
          getPopularMovies(),
          getTopRatedMovies(),
          getUpcomingMovies(),
          getNowPlayingMovies(),
          getMovieGenres(),
        ]);

        setPopularMovies(popularData.results as Movie[]);
        setTopRatedMovies(topRatedData.results as Movie[]);
        setUpcomingMovies(upcomingData.results as Movie[]);
        setNowPlayingMovies(nowPlayingData.results as Movie[]);
        setGenres(genresData.genres);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setApiError(true);
        toast.error('Failed to load movies. Please check your TMDB API key.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    const fetchGenreMovies = async () => {
      if (selectedGenre) {
        try {
          setGenrePage(1);
          setHasMoreGenre(true);
          const data = await getMoviesByGenre(selectedGenre, 1);
          setGenreMovies(data.results as Movie[]);
          setHasMoreGenre(data.page < data.total_pages);
        } catch (error) {
          console.error('Error fetching genre movies:', error);
          toast.error('Failed to load genre movies');
        }
      }
    };

    fetchGenreMovies();
  }, [selectedGenre]);

  useEffect(() => {
    const fetchAnimeMovies = async () => {
      if (showAnime) {
        try {
          setAnimePage(1);
          setHasMoreAnime(true);
          const data = await getAnimeMovies(1);
          setAnimeMovies(data.results as Movie[]);
          setHasMoreAnime(data.page < data.total_pages);
        } catch (error) {
          console.error('Error fetching anime movies:', error);
          toast.error('Failed to load anime movies');
        }
      }
    };

    fetchAnimeMovies();
  }, [showAnime]);

  const handleMediaClick = (media: Movie | TVShow) => {
    const mediaType = 'title' in media ? 'movie' : 'tv';
    const watchUrl = getWatchUrl(mediaType, media.id.toString());
    navigate(watchUrl);
  };

  const handleToggleFavorite = async (_media: Movie | TVShow) => {
    toast.success('Favorite toggled!');
  };

  const getFavoritesSet = () => {
    return new Set<string>();
  };

  const handleGenreSelect = (genreId: number) => {
    setSelectedGenre(genreId);
    setShowAnime(false);
  };

  const handleAnimeSelect = () => {
    setShowAnime(true);
    setSelectedGenre(null);
  };

  const loadMoreGenreMovies = async () => {
    if (!selectedGenre || isLoadingMore || !hasMoreGenre) return;
    
    try {
      setIsLoadingMore(true);
      const nextPage = genrePage + 1;
      const data = await getMoviesByGenre(selectedGenre, nextPage);
      setGenreMovies(prev => [...prev, ...(data.results as Movie[])]);
      setGenrePage(nextPage);
      setHasMoreGenre(data.page < data.total_pages);
    } catch (error) {
      console.error('Error loading more genre movies:', error);
      toast.error('Failed to load more movies');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const loadMoreAnimeMovies = async () => {
    if (!showAnime || isLoadingMore || !hasMoreAnime) return;
    
    try {
      setIsLoadingMore(true);
      const nextPage = animePage + 1;
      const data = await getAnimeMovies(nextPage);
      setAnimeMovies(prev => [...prev, ...(data.results as Movie[])]);
      setAnimePage(nextPage);
      setHasMoreAnime(data.page < data.total_pages);
    } catch (error) {
      console.error('Error loading more anime movies:', error);
      toast.error('Failed to load more anime movies');
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-white">Loading Movies...</p>
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
            Unable to load movies from TMDB. Please check your API key configuration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-gray-800 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/')}
              className="text-white p-2"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-red-600 text-xl font-bold">JSTREAM</h1>
          </div>
          <h2 className="text-white text-lg font-semibold">Movies</h2>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 pb-20 px-4">
        {/* Genre Filter */}
        <div className="mb-6">
          <h3 className="text-white text-lg font-semibold mb-3">Filter by Genre</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedGenre(null);
                setShowAnime(false);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedGenre === null && !showAnime
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={handleAnimeSelect}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                showAnime
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              Anime
            </button>
            {genres.slice(0, 9).map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleGenreSelect(genre.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedGenre === genre.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        {/* Anime Movies */}
        {showAnime && (
          <div className="mb-8">
            <MediaGrid
              media={animeMovies}
              title="Anime Movies"
              onToggleFavorite={handleToggleFavorite}
              favorites={getFavoritesSet()}
              onMediaClick={handleMediaClick}
              isMobile={true}
              onLoadMore={loadMoreAnimeMovies}
              hasMore={hasMoreAnime}
              isLoadingMore={isLoadingMore}
            />
          </div>
        )}

        {/* Genre-specific Movies */}
        {selectedGenre && (
          <div className="mb-8">
            <MediaGrid
              media={genreMovies}
              title={`${genres.find(g => g.id === selectedGenre)?.name} Movies`}
              onToggleFavorite={handleToggleFavorite}
              favorites={getFavoritesSet()}
              onMediaClick={handleMediaClick}
              isMobile={true}
              onLoadMore={loadMoreGenreMovies}
              hasMore={hasMoreGenre}
              isLoadingMore={isLoadingMore}
            />
          </div>
        )}

        {/* All Movie Categories (when no genre is selected) */}
        {!selectedGenre && !showAnime && (
          <>
            {/* Now Playing */}
            <div className="mb-8">
              <MediaGrid
                media={nowPlayingMovies}
                title="Now Playing"
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

            {/* Coming Soon */}
            <div className="mb-8">
              <MediaGrid
                media={upcomingMovies}
                title="Coming Soon"
                onToggleFavorite={handleToggleFavorite}
                favorites={getFavoritesSet()}
                onMediaClick={handleMediaClick}
                isMobile={true}
              />
            </div>
          </>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />
    </div>
  );
};

export default MobileMovies; 