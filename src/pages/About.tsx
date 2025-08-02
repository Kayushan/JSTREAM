import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-b from-gray-900 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              About Our Platform
            </h1>
            <p className="text-xl text-gray-300">
              Your Personal Streaming Experience
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* What We Are */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">What We Are</h2>
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-300 leading-relaxed mb-4">
                This is a personal streaming platform designed for private use. We provide a Netflix-style interface 
                that allows you to browse and discover movies and TV shows using metadata from The Movie Database (TMDB).
              </p>
              <p className="text-gray-300 leading-relaxed">
                Our platform serves as a content discovery and organization tool, helping you keep track of your 
                favorite movies and TV shows in a beautiful, user-friendly interface.
              </p>
            </div>
          </section>

          {/* How It Works */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">How It Works</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Content Discovery</h3>
                <p className="text-gray-300 leading-relaxed">
                  Browse trending movies and TV shows, search for specific content, and discover new releases 
                  using data from TMDB. Our platform provides comprehensive information including ratings, 
                  release dates, and descriptions.
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Personal Library</h3>
                <p className="text-gray-300 leading-relaxed">
                  Save your favorite movies and TV shows to your personal library. Track your viewing progress 
                  and maintain a curated collection of content you love.
                </p>
              </div>
            </div>
          </section>

          {/* Legal Disclaimer */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Legal Disclaimer</h2>
            <div className="bg-pink-900/20 border border-pink-600/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-pink-400 mb-4">Important Legal Notice</h3>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  <strong className="text-pink-400">We do not host, store, or distribute any video content.</strong> 
                  This platform is designed for content discovery and organization purposes only.
                </p>
                <p>
                  <strong className="text-pink-400">No copyrighted content is supported or promoted.</strong> 
                  We respect intellectual property rights and do not facilitate access to copyrighted material.
                </p>
                <p>
                  <strong className="text-pink-400">Third-party streaming services:</strong> 
                  When you click on a movie or TV show, you may be redirected to third-party streaming services 
                  that are responsible for their own content and licensing.
                </p>
                <p>
                  <strong className="text-pink-400">User responsibility:</strong> 
                  Users are responsible for ensuring they have proper authorization to access any content 
                  through third-party services.
                </p>
              </div>
            </div>
          </section>

          {/* Technology Stack */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Technology</h2>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Frontend</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• React 19 with TypeScript</li>
                    <li>• Vite for fast development</li>
                    <li>• Tailwind CSS for styling</li>
                    <li>• React Router for navigation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Backend & APIs</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Supabase for authentication</li>
                    <li>• TMDB API for content metadata</li>
                    <li>• PostgreSQL database</li>
                    <li>• VidSrc for streaming links</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy & Security */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Privacy & Security</h2>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  <strong className="text-white">Data Collection:</strong> We only collect information necessary 
                  for authentication and personal library management. No viewing history or personal data is shared 
                  with third parties.
                </p>
                <p>
                  <strong className="text-white">Authentication:</strong> Secure user authentication through Supabase 
                  ensures your account and personal data remain protected.
                </p>
                <p>
                  <strong className="text-white">Content Metadata:</strong> All movie and TV show information is 
                  sourced from TMDB's public API and does not contain any personal or copyrighted content.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Contact</h2>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-300 leading-relaxed mb-4">
                This is a personal project designed for private use. For questions about content licensing 
                or copyright, please contact the respective content owners or streaming services.
              </p>
              <p className="text-gray-400 text-sm">
                Built with ❤️ for personal entertainment and content discovery
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About; 