import React from 'react';
import { Movie, TVShow } from '../../services/tmdb';
import MediaCard from './MediaCard';

interface MediaGridProps {
  media: (Movie | TVShow)[];
  title?: string;
  isLoading?: boolean;
  onToggleFavorite?: (media: Movie | TVShow) => void;
  favorites?: Set<string>;
  showFavoriteButton?: boolean;
  onMediaClick?: (media: Movie | TVShow) => void;
  onEpisodesClick?: (media: TVShow) => void;
  isMobile?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

const MediaGrid: React.FC<MediaGridProps> = ({
  media,
  title,
  isLoading = false,
  onToggleFavorite,
  favorites = new Set(),
  showFavoriteButton = true,
  onMediaClick,
  onEpisodesClick,
  isMobile = false,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
}) => {
  const isFavorite = (item: Movie | TVShow) => {
    const mediaType = 'title' in item ? 'movie' : 'tv';
    return favorites.has(`${mediaType}-${item.id}`);
  };

  const handleToggleFavorite = (item: Movie | TVShow) => {
    onToggleFavorite?.(item);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {title && (
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg aspect-[2/3] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!media.length) {
    return (
      <div className="space-y-6">
        {title && (
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        )}
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No content found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && (
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      )}
      <div className={`grid gap-4 ${
        isMobile 
          ? 'grid-cols-3 sm:grid-cols-4' 
          : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
      }`}>
        {media.map((item) => (
          <MediaCard
            key={`${'title' in item ? 'movie' : 'tv'}-${item.id}`}
            media={item}
            isFavorite={isFavorite(item)}
            onToggleFavorite={() => handleToggleFavorite(item)}
            showFavoriteButton={showFavoriteButton}
            onMediaClick={onMediaClick}
            onEpisodesClick={onEpisodesClick}
            isMobile={isMobile}
          />
        ))}
      </div>
      
      {/* Load More Section */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isLoadingMore
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700 hover:scale-105'
            }`}
          >
            {isLoadingMore ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Loading...</span>
              </div>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaGrid; 