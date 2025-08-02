import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getPopularTVShows, 
  getTopRatedTVShows, 
  getAiringTodayTVShows, 
  getOnTheAirTVShows,
  getTVGenres,
  getTVShowsByGenre,
  getAnimeTVShows,
  Movie, 
  TVShow, 
  getImageUrl 
} from '../services/tmdb';
import { toast } from 'react-hot-toast';
import { PlayIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { getWatchUrl } from '../utils/mobileUtils';
import MobileNavigation from '../components/layout/MobileNavigation';
import MediaGrid from '../components/media/MediaGrid';
import TVShowEpisodes from '../components/media/TVShowEpisodes';

const MobileTVShows: React.FC = () => {
  const [popularTVShows, setPopularTVShows] = useState<TVShow[]>([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState<TVShow[]>([]);
  const [airingTodayTVShows, setAiringTodayTVShows] = useState<TVShow[]>([]);
  const [onTheAirTVShows, setOnTheAirTVShows] = useState<TVShow[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [genreTVShows, setGenreTVShows] = useState<TVShow[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [showAnime, setShowAnime] = useState(false);
  const [animeTVShows, setAnimeTVShows] = useState<TVShow[]>([]);
  const [genrePage, setGenrePage] = useState(1);
  const [animePage, setAnimePage] = useState(1);
  const [hasMoreGenre, setHasMoreGenre] = useState(true);
  const [hasMoreAnime, setHasMoreAnime] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [selectedTVShow, setSelectedTVShow] = useState<TVShow | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Fetch all TV show categories in parallel
        const [
          popularData,
          topRatedData,
          airingTodayData,
          onTheAirData,
          genresData
        ] = await Promise.all([
          getPopularTVShows(),
          getTopRatedTVShows(),
          getAiringTodayTVShows(),
          getOnTheAirTVShows(),
          getTVGenres(),
        ]);

        setPopularTVShows(popularData.results as TVShow[]);
        setTopRatedTVShows(topRatedData.results as TVShow[]);
        setAiringTodayTVShows(airingTodayData.results as TVShow[]);
        setOnTheAirTVShows(onTheAirData.results as TVShow[]);
        setGenres(genresData.genres);
      } catch (error) {
        console.error('Error fetching TV shows:', error);
        setApiError(true);
        toast.error('Failed to load TV shows. Please check your TMDB API key.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    const fetchGenreTVShows = async () => {
      if (selectedGenre) {
        try {
          setGenrePage(1);
          setHasMoreGenre(true);
          const data = await getTVShowsByGenre(selectedGenre, 1);
          setGenreTVShows(data.results as TVShow[]);
          setHasMoreGenre(data.page < data.total_pages);
        } catch (error) {
          console.error('Error fetching genre TV shows:', error);
          toast.error('Failed to load genre TV shows');
        }
      }
    };

    fetchGenreTVShows();
  }, [selectedGenre]);

  useEffect(() => {
    const fetchAnimeTVShows = async () => {
      if (showAnime) {
        try {
          setAnimePage(1);
          setHasMoreAnime(true);
          const data = await getAnimeTVShows(1);
          setAnimeTVShows(data.results as TVShow[]);
          setHasMoreAnime(data.page < data.total_pages);
        } catch (error) {
          console.error('Error fetching anime TV shows:', error);
          toast.error('Failed to load anime TV shows');
        }
      }
    };

    fetchAnimeTVShows();
  }, [showAnime]);

  const handleMediaClick = (media: Movie | TVShow) => {
    const mediaType = 'title' in media ? 'movie' : 'tv';
    const watchUrl = getWatchUrl(mediaType, media.id.toString());
    navigate(watchUrl);
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

  const loadMoreGenreTVShows = async () => {
    if (!selectedGenre || isLoadingMore || !hasMoreGenre) return;
    
    try {
      setIsLoadingMore(true);
      const nextPage = genrePage + 1;
      const data = await getTVShowsByGenre(selectedGenre, nextPage);
      setGenreTVShows(prev => [...prev, ...(data.results as TVShow[])]);
      setGenrePage(nextPage);
      setHasMoreGenre(data.page < data.total_pages);
    } catch (error) {
      console.error('Error loading more genre TV shows:', error);
      toast.error('Failed to load more TV shows');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const loadMoreAnimeTVShows = async () => {
    if (!showAnime || isLoadingMore || !hasMoreAnime) return;
    
    try {
      setIsLoadingMore(true);
      const nextPage = animePage + 1;
      const data = await getAnimeTVShows(nextPage);
      setAnimeTVShows(prev => [...prev, ...(data.results as TVShow[])]);
      setAnimePage(nextPage);
      setHasMoreAnime(data.page < data.total_pages);
    } catch (error) {
      console.error('Error loading more anime TV shows:', error);
      toast.error('Failed to load more anime TV shows');
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-white">Loading TV Shows...</p>
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
            Unable to load TV shows from TMDB. Please check your API key configuration.
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
          <h2 className="text-white text-lg font-semibold">TV Shows</h2>
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

        {/* Anime TV Shows */}
        {showAnime && (
          <div className="mb-8">
            <MediaGrid
              media={animeTVShows}
              title="Anime TV Shows"
              onToggleFavorite={handleToggleFavorite}
              favorites={getFavoritesSet()}
              onMediaClick={handleMediaClick}
              onEpisodesClick={handleEpisodesClick}
              isMobile={true}
              onLoadMore={loadMoreAnimeTVShows}
              hasMore={hasMoreAnime}
              isLoadingMore={isLoadingMore}
            />
          </div>
        )}

        {/* Genre-specific TV Shows */}
        {selectedGenre && (
          <div className="mb-8">
            <MediaGrid
              media={genreTVShows}
              title={`${genres.find(g => g.id === selectedGenre)?.name} TV Shows`}
              onToggleFavorite={handleToggleFavorite}
              favorites={getFavoritesSet()}
              onMediaClick={handleMediaClick}
              onEpisodesClick={handleEpisodesClick}
              isMobile={true}
              onLoadMore={loadMoreGenreTVShows}
              hasMore={hasMoreGenre}
              isLoadingMore={isLoadingMore}
            />
          </div>
        )}

        {/* All TV Show Categories (when no genre is selected) */}
        {!selectedGenre && !showAnime && (
          <>
            {/* Airing Today */}
            <div className="mb-8">
              <MediaGrid
                media={airingTodayTVShows}
                title="Airing Today"
                onToggleFavorite={handleToggleFavorite}
                favorites={getFavoritesSet()}
                onMediaClick={handleMediaClick}
                onEpisodesClick={handleEpisodesClick}
                isMobile={true}
              />
            </div>

            {/* On The Air */}
            <div className="mb-8">
              <MediaGrid
                media={onTheAirTVShows}
                title="On The Air"
                onToggleFavorite={handleToggleFavorite}
                favorites={getFavoritesSet()}
                onMediaClick={handleMediaClick}
                onEpisodesClick={handleEpisodesClick}
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
          </>
        )}
      </div>

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

export default MobileTVShows; 