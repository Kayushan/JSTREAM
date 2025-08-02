import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { getSession, signOut } from '../../services/supabase';
import { Session } from '@supabase/supabase-js';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';
import { isMobileDevice, isMobileScreen } from '../../utils/mobileUtils';

const Layout: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is on mobile
  const isMobile = isMobileDevice() || isMobileScreen();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentSession = await getSession();
        setSession(currentSession);
        
        if (!currentSession && location.pathname !== '/unauthorized' && location.pathname !== '/login') {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        navigate('/unauthorized');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate, location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setSession(null);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if there's an error, we should still clear the session and navigate
      setSession(null);
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session && location.pathname !== '/unauthorized' && location.pathname !== '/login') {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#141414',
            color: '#fff',
            border: '1px solid #333',
          },
        }}
      />
      {/* Only show Navbar for desktop users */}
      {session && !isMobile && <Navbar session={session} onSignOut={handleSignOut} />}
      <main className={isMobile ? "" : "pt-16"}>
        <Outlet />
      </main>
      {/* Footer with Legal Disclaimer */}
      <footer className="bg-black/50 border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">
              This platform is for content discovery only. We do not host, store, or distribute any video content.
            </p>
            <p className="text-gray-500 text-xs">
              No copyrighted content is supported. Users are responsible for ensuring proper authorization to access content.
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <Link to="/about" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                About
              </Link>
              <span className="text-gray-600">•</span>
                             <span className="text-gray-500 text-sm">© 2024 JStream - Personal Streaming Platform</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 