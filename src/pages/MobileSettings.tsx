import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  CogIcon,
  SunIcon,
  MoonIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  WifiIcon,
  ShieldCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import MobileNavigation from '../components/layout/MobileNavigation';

const MobileSettings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [quality, setQuality] = useState('auto');
  const [language, setLanguage] = useState('English');

  useEffect(() => {
    // Load settings from localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    
    // Apply theme to document
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast.success(`Switched to ${newDarkMode ? 'dark' : 'light'} mode`);
  };

  const handleAutoPlayToggle = () => {
    setAutoPlay(!autoPlay);
    toast.success(`Auto-play ${!autoPlay ? 'enabled' : 'disabled'}`);
  };

  const handleNotificationsToggle = () => {
    setNotifications(!notifications);
    toast.success(`Notifications ${!notifications ? 'enabled' : 'disabled'}`);
  };

  const handleDataSaverToggle = () => {
    setDataSaver(!dataSaver);
    toast.success(`Data saver ${!dataSaver ? 'enabled' : 'disabled'}`);
  };

  const handleQualityChange = (newQuality: string) => {
    setQuality(newQuality);
    toast.success(`Video quality set to ${newQuality}`);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    toast.success(`Language changed to ${newLanguage}`);
  };

  const settingsSections = [
    {
      title: 'Appearance',
      items: [
        {
          label: 'Dark Mode',
          type: 'toggle',
          value: darkMode,
          onChange: handleDarkModeToggle,
          icon: darkMode ? MoonIcon : SunIcon,
          description: 'Switch between light and dark themes'
        }
      ]
    },
    {
      title: 'Playback',
      items: [
        {
          label: 'Auto-play',
          type: 'toggle',
          value: autoPlay,
          onChange: handleAutoPlayToggle,
          icon: autoPlay ? SpeakerWaveIcon : SpeakerXMarkIcon,
          description: 'Automatically play next episode'
        },
        {
          label: 'Video Quality',
          type: 'select',
          value: quality,
          options: ['auto', '1080p', '720p', '480p'],
          onChange: handleQualityChange,
          description: 'Preferred video quality'
        }
      ]
    },
    {
      title: 'Notifications',
      items: [
        {
          label: 'Push Notifications',
          type: 'toggle',
          value: notifications,
          onChange: handleNotificationsToggle,
          icon: ShieldCheckIcon,
          description: 'Receive notifications for new content'
        }
      ]
    },
    {
      title: 'Data & Storage',
      items: [
        {
          label: 'Data Saver',
          type: 'toggle',
          value: dataSaver,
          onChange: handleDataSaverToggle,
          icon: WifiIcon,
          description: 'Reduce data usage when on mobile'
        }
      ]
    },
    {
      title: 'Language',
      items: [
        {
          label: 'App Language',
          type: 'select',
          value: language,
          options: ['English', 'Spanish', 'French', 'German', 'Chinese'],
          onChange: handleLanguageChange,
          description: 'Choose your preferred language'
        }
      ]
    }
  ];

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
          <h2 className="text-white text-lg font-semibold">Settings</h2>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 pb-20 px-4">
        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-white text-lg font-semibold mb-4">{section.title}</h3>
              
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-b-0">
                    <div className="flex items-center space-x-3 flex-1">
                      <item.icon className="h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </div>
                    </div>
                    
                    {item.type === 'toggle' && (
                      <button
                        onClick={item.onChange}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          item.value ? 'bg-red-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            item.value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    )}
                    
                    {item.type === 'select' && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 text-sm">{item.value}</span>
                        <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* About Section */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">About</h3>
            <div className="space-y-3 text-gray-400 text-sm">
              <p>JStream v1.0.0</p>
              <p>A personal streaming platform for content discovery</p>
              <p>Built with React, TypeScript, and Tailwind CSS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />
    </div>
  );
};

export default MobileSettings; 