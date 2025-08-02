import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, PlayIcon, MagnifyingGlassIcon, UserIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeSolidIcon, PlayIcon as PlaySolidIcon, MagnifyingGlassIcon as SearchSolidIcon, UserIcon as UserSolidIcon, InformationCircleIcon as InformationCircleSolidIcon } from '@heroicons/react/24/solid';

const MobileNavigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
      <div className="flex items-center justify-around py-2">
        <Link
          to="/"
          className="flex flex-col items-center space-y-1 p-2"
        >
          {isActive('/') ? (
            <HomeSolidIcon className="h-6 w-6 text-white" />
          ) : (
            <HomeIcon className="h-6 w-6 text-gray-400" />
          )}
          <span className={`text-xs ${isActive('/') ? 'text-white' : 'text-gray-400'}`}>
            Home
          </span>
        </Link>

                 <Link
           to="/mobile/library"
           className="flex flex-col items-center space-y-1 p-2"
         >
           {isActive('/mobile/library') ? (
             <PlaySolidIcon className="h-6 w-6 text-white" />
           ) : (
             <PlayIcon className="h-6 w-6 text-gray-400" />
           )}
           <span className={`text-xs ${isActive('/mobile/library') ? 'text-white' : 'text-gray-400'}`}>
             My List
           </span>
         </Link>

        <Link
          to="/search"
          className="flex flex-col items-center space-y-1 p-2"
        >
          {isActive('/search') ? (
            <SearchSolidIcon className="h-6 w-6 text-white" />
          ) : (
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
          )}
          <span className={`text-xs ${isActive('/search') ? 'text-white' : 'text-gray-400'}`}>
            Search
          </span>
        </Link>

                 <Link
           to="/mobile/profile"
           className="flex flex-col items-center space-y-1 p-2"
         >
           {isActive('/mobile/profile') ? (
             <UserSolidIcon className="h-6 w-6 text-white" />
           ) : (
             <UserIcon className="h-6 w-6 text-gray-400" />
           )}
           <span className={`text-xs ${isActive('/mobile/profile') ? 'text-white' : 'text-gray-400'}`}>
             Profile
           </span>
         </Link>

        <Link
          to="/mobile/about"
          className="flex flex-col items-center space-y-1 p-2"
        >
          {isActive('/mobile/about') ? (
            <InformationCircleSolidIcon className="h-6 w-6 text-white" />
          ) : (
            <InformationCircleIcon className="h-6 w-6 text-gray-400" />
          )}
          <span className={`text-xs ${isActive('/mobile/about') ? 'text-white' : 'text-gray-400'}`}>
            About
          </span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavigation; 