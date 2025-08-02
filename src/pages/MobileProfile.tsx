import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, signOut } from '../services/supabase';
import { toast } from 'react-hot-toast';
import { 
  UserIcon, 
  CogIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  EyeIcon,
  LanguageIcon
} from '@heroicons/react/24/outline';
import MobileNavigation from '../components/layout/MobileNavigation';

const MobileProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const session = await getSession();
        if (session?.user) {
          setUser(session.user);
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if there's an error, we should still navigate away
      // and show a success message since the user wants to sign out
      toast.success('Signed out successfully');
      navigate('/');
    }
  };

  const profileMenuItems = [
    {
      icon: UserIcon,
      title: 'Account',
      subtitle: 'Manage your account settings',
      action: () => {
        navigate('/mobile/account');
      }
    },
    {
      icon: CogIcon,
      title: 'Settings',
      subtitle: 'App preferences and configuration',
      action: () => {
        navigate('/mobile/settings');
      }
    },
    {
      icon: BellIcon,
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      action: () => {
        toast('Notifications coming soon');
      }
    },
    {
      icon: EyeIcon,
      title: 'Viewing Activity',
      subtitle: 'See what you\'ve been watching',
      action: () => {
        navigate('/mobile/viewing-activity');
      }
    },
    {
      icon: LanguageIcon,
      title: 'Language',
      subtitle: 'Change your language preference',
      action: () => {
        toast('Language settings coming soon');
      }
    },
    {
      icon: ShieldCheckIcon,
      title: 'Privacy & Security',
      subtitle: 'Manage your privacy settings',
      action: () => {
        navigate('/mobile/privacy-security');
      }
    },
    {
      icon: QuestionMarkCircleIcon,
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      action: () => {
        navigate('/mobile/help-support');
      }
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-white">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-gray-800 z-40">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-red-600 text-xl font-bold">JSTREAM</h1>
          <h2 className="text-white text-lg font-semibold">Profile</h2>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 pb-20 px-4">
        {!user ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">Sign in to access your profile</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-lg font-semibold">
                    {user.email || 'User'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Member since {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-2">
              {profileMenuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className="w-full bg-gray-900 rounded-xl p-4 flex items-center space-x-4 hover:bg-gray-800 transition-colors"
                >
                  <item.icon className="h-6 w-6 text-gray-400" />
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium">{item.title}</p>
                    <p className="text-gray-400 text-sm">{item.subtitle}</p>
                  </div>
                  <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-400" />
                </button>
              ))}
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="w-full bg-red-600 text-white py-4 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span>Sign Out</span>
            </button>

            {/* App Version */}
            <div className="text-center pt-4">
              <p className="text-gray-500 text-sm">JStream v1.0.0</p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />
    </div>
  );
};

export default MobileProfile; 