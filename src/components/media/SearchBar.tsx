import React, { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search movies, TV shows... (Press Enter)',
  className = '',
}) => {
  const [query, setQuery] = useState('');

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim().length >= 2) {
        onSearch(query);
      }
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
                            className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {query && (
            <button
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-gray-700 transition-colors duration-200"
            >
              <XMarkIcon className="h-4 w-4 text-gray-400" />
            </button>
          )}
          <button
            onClick={() => {
              if (query.trim().length >= 2) {
                onSearch(query);
              }
            }}
                                className="p-2 rounded-full bg-pink-500 hover:bg-pink-600 transition-colors duration-200"
          >
            <MagnifyingGlassIcon className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar; 