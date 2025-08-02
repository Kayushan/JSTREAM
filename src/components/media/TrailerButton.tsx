import React from 'react';
import { FilmIcon } from '@heroicons/react/24/outline';
import { useTrailerModalStore } from '../../stores/trailerModalStore';
import { MovieData } from '../../stores/trailerModalStore';

interface TrailerButtonProps {
  movie: MovieData;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'overlay';
}

const TrailerButton: React.FC<TrailerButtonProps> = ({
  movie,
  className = '',
  size = 'md',
  variant = 'primary'
}) => {
  const { actions: { openModal } } = useTrailerModalStore();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openModal(movie);
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  // Use FilmIcon for trailer button to distinguish from play button
  const TrailerIcon = FilmIcon;

  const variantClasses = {
    primary: 'bg-pink-500 text-white hover:bg-pink-600',
    secondary: 'bg-gray-700 text-white hover:bg-gray-600',
    overlay: 'bg-black/70 text-white hover:bg-black/90 backdrop-blur-sm'
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-full transition-all duration-200
        hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900
        ${className}
      `}
             title="Watch Trailer"
     >
       <TrailerIcon className={iconSizes[size]} />
     </button>
  );
};

export default TrailerButton; 