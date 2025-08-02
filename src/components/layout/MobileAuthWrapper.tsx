import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSession } from '../../services/supabase';
import { Session } from '@supabase/supabase-js';
import { Toaster } from 'react-hot-toast';

interface MobileAuthWrapperProps {
  children: React.ReactNode;
}

const MobileAuthWrapper: React.FC<MobileAuthWrapperProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session && location.pathname !== '/unauthorized' && location.pathname !== '/login') {
    return null; // Will redirect to login
  }

  return (
    <>
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
      {children}
    </>
  );
};

export default MobileAuthWrapper; 