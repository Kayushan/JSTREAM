import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchMulti, Movie, TVShow, getImageUrl } from '../services/tmdb';
import { toast } from 'react-hot-toast';
import { MagnifyingGlassIcon, XMarkIcon, PlayIcon } from '@heroicons/react/24/outline';
import { getWatchUrl } from '../utils/mobileUtils';
import MobileNavigation from '../components/layout/MobileNavigation';

const MobileSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<(Movie | TVShow)[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  // Popular search suggestions
  const popularSearches = [
    'Avengers', 'Stranger Things', 'Breaking Bad', 'Game of Thrones',
    'The Office', 'Friends', 'Marvel', 'DC', 'Star Wars', 'Harry Potter'
  ];

  useEffect(() => {
    const handleSearch = async () => {
      if (!searchQuery.trim() || searchQuery.trim().length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        setHasSearched(false);
        return;
      }

      setIsSearching(true);
      setHasSearched(true);
      
      try {
        const results = await searchMulti(searchQuery);
        setSearchResults(results.results || []);
      } catch (error) {
        console.error('Error searching:', error);
        toast.error('Search failed. Please try again.');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(handleSearch, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleMediaClick = (media: Movie | TVShow) => {
    const mediaType = 'title' in media ? 'movie' : 'tv';
    const watchUrl = getWatchUrl(mediaType, media.id.toString());
    navigate(watchUrl);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-gray-800 z-40">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-red-600 text-xl font-bold">JSTREAM</h1>
          <button
            onClick={() => navigate('/')}
            className="text-white p-2"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies and TV shows..."
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-40 pb-20 px-4">
        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-6">
            {isSearching ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-400">Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">
                  Search Results ({searchResults.length})
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {searchResults.map((item) => (
                    <div
                      key={`${'title' in item ? 'movie' : 'tv'}-${item.id}`}
                      onClick={() => handleMediaClick(item)}
                      className="relative group cursor-pointer"
                    >
                      <img
                        src={item.poster_path ? getImageUrl(item.poster_path, 'w342') : 'https://via.placeholder.com/342x513/333/666?text=No+Image'}
                        alt={('title' in item ? item.title : item.name) || ''}
                        className="w-full aspect-[2/3] object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/342x513/333/666?text=No+Image';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <PlayIcon className="h-8 w-8 text-white" />
                      </div>
                      <div className="mt-2">
                        <p className="text-white text-sm font-medium truncate">
                          {'title' in item ? item.title : item.name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {'title' in item ? 'Movie' : 'TV Show'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No results found</p>
                <p className="text-gray-500 text-sm mt-2">Try searching for something else</p>
              </div>
            )}
          </div>
        )}

        {/* Popular Searches */}
        {!hasSearched && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Popular Searches</h2>
            <div className="grid grid-cols-2 gap-3">
              {popularSearches.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="bg-gray-800 text-white px-4 py-3 rounded-lg text-left hover:bg-gray-700 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />
    </div>
  );
};

export default MobileSearch; 