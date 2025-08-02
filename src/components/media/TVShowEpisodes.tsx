import React, { useState, useEffect } from 'react';
import { 
  Season, 
  Episode, 
  SeasonDetails, 
  getTVShowSeasons, 
  getSeasonDetails,
  getImageUrl 
} from '../../services/tmdb';
import { ContinueWatching, updateContinueWatching, getSession } from '../../services/supabase';
import { toast } from 'react-hot-toast';
import { 
  PlayIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ClockIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface TVShowEpisodesProps {
  tvShowId: number;
  tvShowTitle: string;
  tvShowPoster: string;
  onEpisodeSelect: (episode: Episode, seasonNumber: number) => void;
  onClose: () => void;
}

const TVShowEpisodes: React.FC<TVShowEpisodesProps> = ({
  tvShowId,
  tvShowTitle,
  tvShowPoster,
  onEpisodeSelect,
  onClose
}) => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [seasonDetails, setSeasonDetails] = useState<SeasonDetails | null>(null);
  const [continueWatching, setContinueWatching] = useState<ContinueWatching | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSeason, setIsLoadingSeason] = useState(false);
  const [userSession, setUserSession] = useState<any>(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        
        // Get user session
        const session = await getSession();
        setUserSession(session);

        // Fetch seasons
        const seasonsData = await getTVShowSeasons(tvShowId);
        setSeasons(seasonsData.seasons);

        // Get continue watching data if user is logged in
        if (session?.user) {
          // This would need to be implemented in your continue watching logic
          // For now, we'll set it to null
          setContinueWatching(null);
        }

        // Load first season by default
        if (seasonsData.seasons.length > 0) {
          await loadSeasonDetails(1);
        }
      } catch (error) {
        console.error('Error initializing TV show episodes:', error);
        toast.error('Failed to load episodes');
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [tvShowId]);

  const loadSeasonDetails = async (seasonNumber: number) => {
    try {
      setIsLoadingSeason(true);
      const details = await getSeasonDetails(tvShowId, seasonNumber);
      setSeasonDetails(details);
      setSelectedSeason(seasonNumber);
    } catch (error) {
      console.error('Error loading season details:', error);
      toast.error('Failed to load season episodes');
    } finally {
      setIsLoadingSeason(false);
    }
  };

  const handleEpisodeClick = async (episode: Episode) => {
    try {
      // Update continue watching if user is logged in
      if (userSession?.user) {
        await updateContinueWatching({
          user_id: userSession.user.id,
          tmdb_id: tvShowId,
          media_type: 'tv',
          title: tvShowTitle,
          poster_path: tvShowPoster,
          progress: 0, // Will be updated when video starts
          last_watched: new Date().toISOString(),
          season_number: episode.season_number,
          episode_number: episode.episode_number,
          episode_id: episode.id,
        });
      }

      onEpisodeSelect(episode, episode.season_number);
    } catch (error) {
      console.error('Error updating continue watching:', error);
      // Still allow episode selection even if continue watching fails
      onEpisodeSelect(episode, episode.season_number);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-white">Loading Episodes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-md border-b border-gray-800 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-3">
              <img
                src={getImageUrl(tvShowPoster, 'w92')}
                alt={tvShowTitle}
                className="w-12 h-18 rounded object-cover"
              />
              <div>
                <h1 className="text-white font-semibold text-lg">{tvShowTitle}</h1>
                <p className="text-gray-400 text-sm">Episodes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-6xl mx-auto">
        {/* Season Selector */}
        <div className="mb-6">
          <h2 className="text-white text-xl font-bold mb-4">Seasons</h2>
          <div className="flex flex-wrap gap-2">
            {seasons.map((season) => (
              <button
                key={season.season_number}
                onClick={() => loadSeasonDetails(season.season_number)}
                disabled={isLoadingSeason}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedSeason === season.season_number
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                } ${isLoadingSeason ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Season {season.season_number}
              </button>
            ))}
          </div>
        </div>

        {/* Season Info */}
        {seasonDetails && (
          <div className="mb-6">
            <div className="flex items-start space-x-4">
              <img
                src={getImageUrl(seasonDetails.poster_path, 'w185')}
                alt={seasonDetails.name}
                className="w-32 h-48 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-white text-2xl font-bold mb-2">{seasonDetails.name}</h3>
                <p className="text-gray-300 text-sm mb-2">
                  {seasonDetails.episodes.length} Episodes • {formatDate(seasonDetails.air_date)}
                </p>
                {seasonDetails.overview && (
                  <p className="text-gray-400 text-sm leading-relaxed">{seasonDetails.overview}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Episodes Grid */}
        {seasonDetails && (
          <div className="space-y-4">
            <h3 className="text-white text-xl font-bold">Episodes</h3>
            <div className="grid gap-4">
              {seasonDetails.episodes.map((episode) => (
                <div
                  key={episode.id}
                  className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => handleEpisodeClick(episode)}
                >
                  <div className="flex">
                    {/* Episode Thumbnail */}
                    <div className="relative w-48 h-28 flex-shrink-0">
                      <img
                        src={getImageUrl(episode.still_path, 'w300')}
                        alt={episode.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <PlayIcon className="h-8 w-8 text-white" />
                      </div>
                      {continueWatching && 
                       continueWatching.season_number === episode.season_number &&
                       continueWatching.episode_number === episode.episode_number && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                          Continue
                        </div>
                      )}
                    </div>

                    {/* Episode Info */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-semibold text-lg">
                          {episode.episode_number}. {episode.name}
                        </h4>
                        <div className="flex items-center space-x-2 text-gray-400 text-sm">
                          <ClockIcon className="h-4 w-4" />
                          <span>{formatDuration(episode.runtime)}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-2">
                        {formatDate(episode.air_date)}
                      </p>
                      
                      {episode.overview && (
                        <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                          {episode.overview}
                        </p>
                      )}

                      {/* Progress indicator for continue watching */}
                      {continueWatching && 
                       continueWatching.season_number === episode.season_number &&
                       continueWatching.episode_number === episode.episode_number && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>{Math.round(continueWatching.progress)}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1">
                            <div 
                              className="bg-red-600 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${continueWatching.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoadingSeason && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent"></div>
            <span className="text-white ml-3">Loading episodes...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TVShowEpisodes; 