import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie, TVShow, getImageUrl } from '../../services/tmdb';
import { HeartIcon, PlayIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { getWatchUrl } from '../../utils/mobileUtils';

interface MediaCardProps {
  media: Movie | TVShow;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  showFavoriteButton?: boolean;
  onMediaClick?: (media: Movie | TVShow) => void;
  onEpisodesClick?: (media: TVShow) => void;
  isMobile?: boolean;
}

const MediaCard: React.FC<MediaCardProps> = ({
  media,
  isFavorite = false,
  onToggleFavorite,
  showFavoriteButton = true,
  onMediaClick,
  onEpisodesClick,
  isMobile = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const title = 'title' in media ? media.title : media.name || 'Unknown Title';
  const releaseDate = 'release_date' in media ? media.release_date : media.first_air_date;
  const posterUrl = getImageUrl(media.poster_path || '', 'w500');
  const mediaType = 'title' in media ? 'movie' : 'tv';

  const handleImageError = () => {
    setImageError(true);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Netflix-style direct navigation (no modal, no details)
    if (onMediaClick) {
      onMediaClick(media);
    } else {
      const watchUrl = getWatchUrl(mediaType, media.id.toString());
      navigate(watchUrl);
    }
  };

  const handleEpisodesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (mediaType === 'tv' && onEpisodesClick) {
      onEpisodesClick(media as TVShow);
    }
  };

  return (
    <div
      className="group relative bg-gray-900 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
              <div onClick={handleCardClick} className="cursor-pointer" title={isMobile ? "Tap to play" : "Click to play"}>
        {/* Poster Image */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {!imageError && posterUrl ? (
            <img
              src={posterUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Hover Overlay */}
                  {isHovered && !isMobile && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-center space-y-4">
                      <div className="flex space-x-4">
                        <button
                          onClick={handleCardClick}
                          className="bg-white rounded-full p-4 shadow-2xl transform scale-110 transition-all duration-200 hover:scale-125"
                          title="Play"
                        >
                          <PlayIcon className="h-7 w-7 text-black" />
                        </button>
                        {mediaType === 'tv' && onEpisodesClick && (
                          <button
                            onClick={handleEpisodesClick}
                            className="bg-gray-800 rounded-full p-4 shadow-2xl transform scale-110 transition-all duration-200 hover:scale-125 hover:bg-gray-700"
                            title="Episodes"
                          >
                            <ListBulletIcon className="h-7 w-7 text-white" />
                          </button>
                        )}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
                          <div className="flex justify-center space-x-4 text-white text-sm font-medium">
                            <span>Play</span>
                            {mediaType === 'tv' && onEpisodesClick && <span>Episodes</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

          {/* Favorite Button */}
          {showFavoriteButton && onToggleFavorite && (
            <button
              onClick={handleToggleFavorite}
              className={clsx(
                'absolute top-2 right-2 p-2 rounded-full transition-all duration-200',
                'hover:bg-black/50 backdrop-blur-sm',
                                 isFavorite ? 'text-pink-500' : 'text-white'
              )}
            >
              {isFavorite ? (
                <HeartSolidIcon className="h-5 w-5" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
            </button>
          )}

          {/* Rating Badge */}
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            ⭐ {media.vote_average ? media.vote_average.toFixed(1) : 'N/A'}
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
            {title}
          </h3>
          <p className="text-gray-400 text-xs">
            {releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MediaCard; 