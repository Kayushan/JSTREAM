import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession } from '../services/supabase';
import { getContinueWatching } from '../services/supabase';
import { getImageUrl } from '../services/tmdb';
import { toast } from 'react-hot-toast';
import { PlayIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline';
import { getWatchUrl } from '../utils/mobileUtils';
import MobileNavigation from '../components/layout/MobileNavigation';

const MobileLibrary: React.FC = () => {
  const [continueWatching, setContinueWatching] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeData = async () => {
      try {
        const session = await getSession();
        if (session?.user?.id) {
          setUserId(session.user.id);
          
          // Fetch continue watching
          const continueData = await getContinueWatching(session.user.id);
          setContinueWatching(continueData);
          
          // TODO: Fetch favorites from Supabase
          // For now, using mock data
          setFavorites([]);
        }
      } catch (error) {
        console.error('Error fetching library data:', error);
        toast.error('Failed to load your library');
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  const handleMediaClick = (item: any) => {
    const watchUrl = getWatchUrl(item.media_type, item.tmdb_id.toString());
    navigate(watchUrl);
  };

  const handleRemoveFromList = (item: any, listType: 'continue' | 'favorites') => {
    // TODO: Implement remove functionality with Supabase
    toast.success('Removed from list');
    
    if (listType === 'continue') {
      setContinueWatching(prev => prev.filter(i => i.tmdb_id !== item.tmdb_id));
    } else {
      setFavorites(prev => prev.filter(i => i.tmdb_id !== item.tmdb_id));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-white">Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-gray-800 z-40">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-red-600 text-xl font-bold">JSTREAM</h1>
          <h2 className="text-white text-lg font-semibold">My List</h2>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 pb-20 px-4">
        {!userId ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">Sign in to access your library</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Continue Watching */}
            {continueWatching.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <h3 className="text-xl font-bold text-white">Continue Watching</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {continueWatching.map((item) => (
                    <div
                      key={`continue-${item.tmdb_id}`}
                      className="relative group"
                    >
                      <div
                        onClick={() => handleMediaClick(item)}
                        className="cursor-pointer"
                      >
                        <img
                          src={getImageUrl(item.poster_path, 'w342')}
                          alt={item.title}
                          className="w-full aspect-[2/3] object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/342x513/333/666?text=No+Image';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <PlayIcon className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFromList(item, 'continue')}
                        className="absolute top-2 right-2 bg-black/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                      <div className="mt-2">
                        <p className="text-white text-sm font-medium truncate">
                          {item.title}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {item.progress ? `${Math.round(item.progress)}% watched` : 'In progress'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* My List (Favorites) */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">My List</h3>
              {favorites.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {favorites.map((item) => (
                    <div
                      key={`favorite-${item.tmdb_id}`}
                      className="relative group"
                    >
                      <div
                        onClick={() => handleMediaClick(item)}
                        className="cursor-pointer"
                      >
                        <img
                          src={getImageUrl(item.poster_path, 'w342')}
                          alt={item.title}
                          className="w-full aspect-[2/3] object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/342x513/333/666?text=No+Image';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <PlayIcon className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFromList(item, 'favorites')}
                        className="absolute top-2 right-2 bg-black/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                      <div className="mt-2">
                        <p className="text-white text-sm font-medium truncate">
                          {item.title}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg mb-4">Your list is empty</p>
                  <p className="text-gray-500 text-sm">
                    Add movies and TV shows to your list to see them here
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />
    </div>
  );
};

export default MobileLibrary; 