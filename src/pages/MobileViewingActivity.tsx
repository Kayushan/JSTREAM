import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, getContinueWatching } from '../services/supabase';
import { getImageUrl } from '../services/tmdb';
import { toast } from 'react-hot-toast';
import { 
  EyeIcon,
  PlayIcon,
  TrashIcon,
  ChevronLeftIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { getWatchUrl } from '../utils/mobileUtils';
import MobileNavigation from '../components/layout/MobileNavigation';

const MobileViewingActivity: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [viewingHistory, setViewingHistory] = useState<any[]>([]);
  const [completedContent, setCompletedContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'history' | 'completed'>('history');
  const navigate = useNavigate();

  useEffect(() => {
    const initializeData = async () => {
      try {
        const session = await getSession();
        if (session?.user) {
          setUser(session.user);
          
          // Fetch viewing history (continue watching)
          const history = await getContinueWatching(session.user.id);
          setViewingHistory(history);
          
          // Filter completed content (progress >= 90%)
          const completed = history.filter(item => item.progress >= 90);
          setCompletedContent(completed);
        }
      } catch (error) {
        console.error('Error fetching viewing activity:', error);
        toast.error('Failed to load viewing activity');
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

  const handleRemoveFromHistory = (item: any) => {
    // TODO: Implement remove from history functionality
    setViewingHistory(prev => prev.filter(i => i.tmdb_id !== item.tmdb_id));
    setCompletedContent(prev => prev.filter(i => i.tmdb_id !== item.tmdb_id));
    toast.success('Removed from viewing history');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'text-green-400';
    if (progress >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-white">Loading viewing activity...</p>
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
              onClick={() => navigate('/mobile/profile')}
              className="text-white p-2"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-red-600 text-xl font-bold">JSTREAM</h1>
          </div>
          <h2 className="text-white text-lg font-semibold">Viewing Activity</h2>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 pb-20 px-4">
        {!user ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">Sign in to view your activity</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex bg-gray-900 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <ClockIcon className="h-4 w-4" />
                  <span>History ({viewingHistory.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === 'completed'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Completed ({completedContent.length})</span>
                </div>
              </button>
            </div>

            {/* Content List */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                {viewingHistory.length > 0 ? (
                  viewingHistory.map((item) => (
                    <div
                      key={`history-${item.tmdb_id}`}
                      className="bg-gray-900 rounded-xl p-4"
                    >
                      <div className="flex space-x-4">
                        <div
                          onClick={() => handleMediaClick(item)}
                          className="relative flex-shrink-0 cursor-pointer"
                        >
                          <img
                            src={getImageUrl(item.poster_path, 'w154')}
                            alt={item.title}
                            className="w-16 h-24 object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/154x231/333/666?text=No+Image';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <PlayIcon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-semibold truncate">
                                {item.title}
                              </h3>
                              <p className="text-gray-400 text-sm">
                                {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
                              </p>
                              <p className="text-gray-500 text-xs">
                                Last watched: {formatDate(item.last_watched)}
                              </p>
                            </div>
                            
                            <button
                              onClick={() => handleRemoveFromHistory(item)}
                              className="text-gray-400 hover:text-red-400 p-1"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-400 text-sm">Progress</span>
                              <span className={`text-sm font-medium ${getProgressColor(item.progress)}`}>
                                {Math.round(item.progress)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  item.progress >= 90 ? 'bg-green-500' :
                                  item.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <EyeIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No viewing history yet</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Start watching content to see it here
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'completed' && (
              <div className="space-y-4">
                {completedContent.length > 0 ? (
                  completedContent.map((item) => (
                    <div
                      key={`completed-${item.tmdb_id}`}
                      className="bg-gray-900 rounded-xl p-4"
                    >
                      <div className="flex space-x-4">
                        <div
                          onClick={() => handleMediaClick(item)}
                          className="relative flex-shrink-0 cursor-pointer"
                        >
                          <img
                            src={getImageUrl(item.poster_path, 'w154')}
                            alt={item.title}
                            className="w-16 h-24 object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/154x231/333/666?text=No+Image';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <PlayIcon className="h-6 w-6 text-white" />
                          </div>
                          <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1">
                            <CheckCircleIcon className="h-3 w-3 text-white" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-semibold truncate">
                                {item.title}
                              </h3>
                              <p className="text-gray-400 text-sm">
                                {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
                              </p>
                              <p className="text-green-400 text-sm font-medium">
                                ✓ Completed
                              </p>
                              <p className="text-gray-500 text-xs">
                                Finished: {formatDate(item.last_watched)}
                              </p>
                            </div>
                            
                            <button
                              onClick={() => handleRemoveFromHistory(item)}
                              className="text-gray-400 hover:text-red-400 p-1"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <CheckCircleIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No completed content yet</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Finish watching content to see it here
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />
    </div>
  );
};

export default MobileViewingActivity; 