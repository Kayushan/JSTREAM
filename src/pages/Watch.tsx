import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSession } from '../services/supabase';
import { getMovieDetails, getTVShowDetails, getImageUrl } from '../services/tmdb';
import { updateContinueWatching } from '../services/supabase';
import VideoPlayer from '../components/player/VideoPlayer';
import { toast } from 'react-hot-toast';
import { HeartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import TrailerButton from '../components/media/TrailerButton';
import { MovieData } from '../stores/trailerModalStore';

const Watch: React.FC = () => {
  const { mediaType, tmdbId } = useParams<{ mediaType: 'movie' | 'tv'; tmdbId: string }>();
  const [mediaDetails, setMediaDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!mediaType || !tmdbId) {
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        
        // Get session
        const session = await getSession();
        if (session?.user?.id) {
          setUserId(session.user.id);
        }

        // Fetch media details
        const details = mediaType === 'movie' 
          ? await getMovieDetails(parseInt(tmdbId))
          : await getTVShowDetails(parseInt(tmdbId));
        
        setMediaDetails(details);
      } catch (error) {
        console.error('Error fetching media details:', error);
        toast.error('Failed to load media details');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [mediaType, tmdbId, navigate]);

  const handleProgressUpdate = async (newProgress: number) => {
    setProgress(newProgress);
    
    if (userId && mediaDetails) {
      try {
        await updateContinueWatching({
          user_id: userId,
          tmdb_id: parseInt(tmdbId!),
          media_type: mediaType!,
          title: 'title' in mediaDetails ? mediaDetails.title : mediaDetails.name,
          poster_path: mediaDetails.poster_path,
          progress: newProgress,
          last_watched: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  const handleToggleFavorite = async () => {
    if (!userId) {
      toast.error('Please sign in to save favorites');
      return;
    }

    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
             <div className="min-h-screen bg-gray-900 flex items-center justify-center">
         <div className="text-center">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
           <p className="text-white">Loading...</p>
         </div>
       </div>
    );
  }

  if (!mediaDetails) {
    return (
             <div className="min-h-screen bg-gray-900 flex items-center justify-center">
         <div className="text-center">
           <p className="text-white text-lg">Media not found</p>
           <button onClick={handleBack} className="btn-primary mt-4">
             Go Back
           </button>
         </div>
       </div>
    );
  }

  const title = 'title' in mediaDetails ? mediaDetails.title : mediaDetails.name;
  const releaseDate = 'release_date' in mediaDetails ? mediaDetails.release_date : mediaDetails.first_air_date;
  const runtime = 'runtime' in mediaDetails ? mediaDetails.runtime : mediaDetails.episode_run_time?.[0];
  const genres = mediaDetails.genres?.map((g: any) => g.name).join(', ');

  return (
         <div className="min-h-screen bg-gray-900">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-30">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 bg-black/70 text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-colors duration-200"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 z-30 flex items-center space-x-2">
        <TrailerButton
          movie={mediaDetails as MovieData}
          size="lg"
          variant="secondary"
        />
        <button
          onClick={handleToggleFavorite}
                     className={`p-3 rounded-full transition-all duration-200 ${
             isFavorite 
               ? 'bg-pink-500 text-white' 
               : 'bg-black/70 text-white hover:bg-black/90'
           }`}
        >
          {isFavorite ? (
            <HeartSolidIcon className="h-6 w-6" />
          ) : (
            <HeartIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Video Player */}
      <div className="w-full h-screen sm:h-screen md:h-screen lg:h-screen">
        <VideoPlayer
          mediaType={mediaType!}
          tmdbId={parseInt(tmdbId!)}
          mediaDetails={mediaDetails}
          onProgressUpdate={handleProgressUpdate}
          initialProgress={progress}
        />
      </div>

      {/* Media Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Poster */}
          <div className="lg:col-span-1 flex justify-center lg:justify-start">
            <img
              src={getImageUrl(mediaDetails.poster_path, 'w500')}
              alt={title}
              className="w-32 h-48 sm:w-40 sm:h-60 md:w-48 md:h-72 lg:w-full lg:h-auto rounded-lg shadow-lg object-cover"
            />
          </div>

          {/* Details */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">{title}</h1>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
              {releaseDate && (
                <span>{new Date(releaseDate).getFullYear()}</span>
              )}
              {runtime && (
                <span>{Math.floor(runtime / 60)}h {runtime % 60}m</span>
              )}
              {genres && (
                <span className="truncate">{genres}</span>
              )}
            </div>

            {mediaDetails.tagline && (
              <p className="text-gray-400 italic mb-3 sm:mb-4 text-sm sm:text-base">"{mediaDetails.tagline}"</p>
            )}

            <p className="text-gray-300 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
              {mediaDetails.overview}
            </p>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mediaDetails.status && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Status</h3>
                  <p className="text-gray-300">{mediaDetails.status}</p>
                </div>
              )}

              {mediaDetails.production_companies?.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Production</h3>
                  <p className="text-gray-300">
                    {mediaDetails.production_companies.map((company: any) => company.name).join(', ')}
                  </p>
                </div>
              )}

              {'budget' in mediaDetails && mediaDetails.budget > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Budget</h3>
                  <p className="text-gray-300">
                    ${(mediaDetails.budget / 1000000).toFixed(1)}M
                  </p>
                </div>
              )}

              {'revenue' in mediaDetails && mediaDetails.revenue > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Revenue</h3>
                  <p className="text-gray-300">
                    ${(mediaDetails.revenue / 1000000).toFixed(1)}M
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch; 