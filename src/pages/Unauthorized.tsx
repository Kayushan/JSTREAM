import React from 'react';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <ShieldExclamationIcon className="h-24 w-24 text-pink-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">
            Access Restricted
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            This is a private streaming platform. Only authorized users can access this content.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            How to Get Access
          </h2>
          <ul className="text-gray-300 text-left space-y-2">
            <li className="flex items-start">
              <span className="text-pink-500 mr-2">•</span>
              Contact the administrator to create your account
            </li>
            <li className="flex items-start">
              <span className="text-pink-500 mr-2">•</span>
              You'll receive login credentials via email
            </li>
            <li className="flex items-start">
              <span className="text-pink-500 mr-2">•</span>
              Sign in with your provided credentials
            </li>
          </ul>
        </div>

        <div className="text-gray-500 text-sm">
          <p>If you believe this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 