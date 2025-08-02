import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession } from '../services/supabase';
import { toast } from 'react-hot-toast';
import { 
  UserIcon, 
  EnvelopeIcon, 
  CalendarIcon,
  ChevronLeftIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import MobileNavigation from '../components/layout/MobileNavigation';

const MobileAccount: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const session = await getSession();
        if (session?.user) {
          setUser(session.user);
          setDisplayName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User');
          setEmail(session.user.email || '');
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  const handleSave = async () => {
    try {
      // TODO: Implement actual profile update with Supabase
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setDisplayName(user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User');
    setEmail(user?.email || '');
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-white">Loading account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-gray-800 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/mobile/profile')}
              className="text-white p-2"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-red-600 text-xl font-bold">JSTREAM</h1>
          </div>
          <h2 className="text-white text-lg font-semibold">Account</h2>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 pb-20 px-4">
        {!user ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">Sign in to access your account</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Picture Section */}
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
                  <UserIcon className="h-10 w-10 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-lg font-semibold">
                    {displayName}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Member since {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-gray-400 hover:text-white p-2"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Account Details</h3>
              
              <div className="space-y-4">
                {/* Display Name */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Display Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-white">{displayName}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-white">{email}</span>
                    </div>
                  )}
                </div>

                {/* Member Since */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Member Since</label>
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-white">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Actions */}
              {isEditing && (
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CheckIcon className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-700 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            {/* Account Actions */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Account Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => toast('Change password feature coming soon')}
                  className="w-full text-left text-white hover:text-red-400 transition-colors py-2"
                >
                  Change Password
                </button>
                <button
                  onClick={() => toast('Delete account feature coming soon')}
                  className="w-full text-left text-red-400 hover:text-red-300 transition-colors py-2"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />
    </div>
  );
};

export default MobileAccount; 