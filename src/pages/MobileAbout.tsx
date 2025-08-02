import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import MobileNavigation from '../components/layout/MobileNavigation';

const MobileAbout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-gray-800 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/')}
              className="text-white p-2"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-red-600 text-xl font-bold">JSTREAM</h1>
          </div>
          <h2 className="text-white text-lg font-semibold">About</h2>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 pb-20 px-4">
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="text-center py-8">
            <h1 className="text-3xl font-bold text-white mb-4">About JStream</h1>
            <p className="text-gray-300 text-lg">
              Your personal streaming platform for discovering and watching your favorite content
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              JStream is dedicated to providing a seamless and personalized streaming experience. 
              We believe everyone deserves access to quality entertainment, and we're committed to 
              making content discovery effortless and enjoyable.
            </p>
          </div>

          {/* Features Section */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">What We Offer</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Vast Content Library</h3>
                  <p className="text-gray-400 text-sm">Access to thousands of movies and TV shows from various genres and eras.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Personalized Experience</h3>
                  <p className="text-gray-400 text-sm">Smart recommendations based on your viewing preferences and history.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Cross-Platform Access</h3>
                  <p className="text-gray-400 text-sm">Watch on any device, anywhere, with seamless synchronization.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">High-Quality Streaming</h3>
                  <p className="text-gray-400 text-sm">Crystal clear video quality with adaptive streaming technology.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Technology Section */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Built with Modern Technology</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <h3 className="text-white font-semibold mb-2">React</h3>
                <p className="text-gray-400 text-sm">Modern UI framework</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <h3 className="text-white font-semibold mb-2">TypeScript</h3>
                <p className="text-gray-400 text-sm">Type-safe development</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <h3 className="text-white font-semibold mb-2">Tailwind CSS</h3>
                <p className="text-gray-400 text-sm">Utility-first styling</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <h3 className="text-white font-semibold mb-2">TMDB API</h3>
                <p className="text-gray-400 text-sm">Rich content database</p>
              </div>
            </div>
          </div>

          {/* Legal Disclaimer Section */}
          <div className="bg-pink-900/20 border border-pink-600/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-pink-400 mb-4">Legal Disclaimer</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <h3 className="text-pink-400 font-semibold text-sm">No Content Hosting</h3>
                  <p className="text-gray-300 text-sm">We do not host, store, or distribute any video content. This platform is for content discovery and organization only.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <h3 className="text-pink-400 font-semibold text-sm">Copyright Respect</h3>
                  <p className="text-gray-300 text-sm">No copyrighted content is supported or promoted. We respect intellectual property rights.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <h3 className="text-pink-400 font-semibold text-sm">Third-Party Services</h3>
                  <p className="text-gray-300 text-sm">Clicking on content may redirect to third-party streaming services responsible for their own content and licensing.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <h3 className="text-pink-400 font-semibold text-sm">User Responsibility</h3>
                  <p className="text-gray-300 text-sm">Users are responsible for ensuring they have proper authorization to access any content through third-party services.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Developer Section */}
          <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Developed by Shan</h2>
            <p className="text-white/90 leading-relaxed">
              JStream is a passion project created by Shan, a full-stack developer with a love for 
              creating exceptional user experiences. This platform represents the perfect blend of 
              modern web technologies and user-centric design principles.
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <span className="text-white/80 text-sm">Full-stack Developer & UI/UX Designer</span>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-gray-300 mb-4">
              Have questions, suggestions, or feedback? We'd love to hear from you!
            </p>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>📧 Email: contact@jstream.com</p>
              <p>🌐 Website: jstream.com</p>
              <p>📱 Mobile: Optimized for all devices</p>
            </div>
          </div>

          {/* Version Info */}
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">JStream v1.0.0</p>
            <p className="text-gray-500 text-xs mt-1">© 2024 JStream. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />
    </div>
  );
};

export default MobileAbout; 