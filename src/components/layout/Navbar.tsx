import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

interface NavbarProps {
  session: Session;
  onSignOut: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ session, onSignOut }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const location = useLocation();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/library', label: 'Library' },
    { path: '/about', label: 'About' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-pink-400 font-bold text-2xl">JSTREAM</div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side - Dark mode toggle and user menu */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5 text-white" />
              ) : (
                <MoonIcon className="h-5 w-5 text-white" />
              )}
            </button>

            {/* User Menu */}
            <div className="relative group">
                              <button className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-200">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-sm font-bold">
                  {session.user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:block text-sm">
                  {session.user.email}
                </span>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                    {session.user.email}
                  </div>
                  <button
                    onClick={onSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 