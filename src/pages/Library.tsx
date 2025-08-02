import React, { useState, useEffect } from 'react';
import { getSession } from '../services/supabase';
import { getFavorites, getContinueWatching, removeFromFavorites } from '../services/supabase';
import { getImageUrl } from '../services/tmdb';
import { toast } from 'react-hot-toast';
import { TrashIcon, PlayIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

interface LibraryItem {
  id: string;
  tmdb_id: number;
  media_type: 'movie' | 'tv';
  title: string;
  poster_path: string;
  overview: string;
  created_at: string;
  progress?: number;
  last_watched?: string;
}

const Library: React.FC = () => {
  const [favorites, setFavorites] = useState<LibraryItem[]>([]);
  const [continueWatching, setContinueWatching] = useState<LibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'favorites' | 'continue'>('favorites');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const session = await getSession();
        if (!session?.user?.id) {
          toast.error('Please sign in to view your library');
          return;
        }

        setUserId(session.user.id);

        // Fetch favorites and continue watching
        const [favoritesData, continueData] = await Promise.all([
          getFavorites(session.user.id),
          getContinueWatching(session.user.id),
        ]);

        setFavorites(favoritesData);
        setContinueWatching(continueData.map(item => ({
          ...item,
          overview: '',
          created_at: item.last_watched || new Date().toISOString(),
        })));
      } catch (error) {
        console.error('Error fetching library:', error);
        toast.error('Failed to load your library');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  const handleRemoveFavorite = async (item: LibraryItem) => {
    if (!userId) return;

    try {
      await removeFromFavorites(userId, item.tmdb_id, item.media_type);
      setFavorites(prev => prev.filter(fav => fav.id !== item.id));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatProgress = (progress: number) => {
    return `${Math.round(progress)}%`;
  };

  if (isLoading) {
    return (
             <div className="min-h-screen bg-gray-900 flex items-center justify-center">
         <div className="text-center">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
           <p className="text-white">Loading your library...</p>
         </div>
       </div>
    );
  }

  return (
         <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-4xl font-bold text-white mb-8">My JStream Library</h1>

        {/* Tabs */}
        <div className="flex space-x-8 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('favorites')}
                         className={`pb-4 px-2 text-lg font-medium transition-colors duration-200 ${
               activeTab === 'favorites'
                 ? 'text-pink-500 border-b-2 border-pink-500'
                 : 'text-gray-400 hover:text-white'
             }`}
          >
            Favorites ({favorites.length})
          </button>
          <button
            onClick={() => setActiveTab('continue')}
                         className={`pb-4 px-2 text-lg font-medium transition-colors duration-200 ${
               activeTab === 'continue'
                 ? 'text-pink-500 border-b-2 border-pink-500'
                 : 'text-gray-400 hover:text-white'
             }`}
          >
            Continue Watching ({continueWatching.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'favorites' && (
          <div className="space-y-6">
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">❤️</div>
                <h3 className="text-xl text-white mb-2">No favorites yet</h3>
                <p className="text-gray-400">
                  Start adding movies and TV shows to your favorites to see them here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200"
                  >
                    <div className="relative">
                      <img
                        src={getImageUrl(item.poster_path, 'w500')}
                        alt={item.title}
                        className="w-full aspect-[2/3] object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200">
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                          <Link
                            to={`/watch/${item.media_type}/${item.tmdb_id}`}
                            className="bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 transition-colors duration-200"
                          >
                            <PlayIcon className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleRemoveFavorite(item)}
                            className="bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors duration-200"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        Added {formatDate(item.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'continue' && (
          <div className="space-y-6">
            {continueWatching.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">▶️</div>
                <h3 className="text-xl text-white mb-2">Nothing to continue</h3>
                <p className="text-gray-400">
                  Start watching movies and TV shows to see your progress here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {continueWatching.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200"
                  >
                    <div className="relative">
                      <img
                        src={getImageUrl(item.poster_path, 'w500')}
                        alt={item.title}
                        className="w-full aspect-[2/3] object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200">
                        <div className="absolute bottom-4 left-4 right-4">
                          <Link
                            to={`/watch/${item.media_type}/${item.tmdb_id}`}
                            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors duration-200 inline-block"
                          >
                            <PlayIcon className="h-5 w-5" />
                          </Link>
                        </div>
                      </div>
                      {/* Progress Bar */}
                      {item.progress && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                          <div
                            className="h-full bg-red-600 transition-all duration-300"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        {item.progress && (
                          <span>{formatProgress(item.progress)} watched</span>
                        )}
                        {item.last_watched && (
                          <span>{formatDate(item.last_watched)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library; 