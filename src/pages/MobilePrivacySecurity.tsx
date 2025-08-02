import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheckIcon,
  DocumentTextIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';
import MobileNavigation from '../components/layout/MobileNavigation';

const MobilePrivacySecurity: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');
  const navigate = useNavigate();

  const privacyPolicy = `
# Privacy Policy

## Information We Collect

JStream collects information you provide directly to us, such as when you create an account, update your profile, or contact us for support.

### Personal Information
- Email address
- Display name
- Viewing preferences and history
- Account settings

### Usage Information
- Content you watch
- Search queries
- Device information
- Usage patterns

## How We Use Your Information

We use the information we collect to:
- Provide and maintain our streaming service
- Personalize your experience
- Improve our platform
- Send you updates and notifications
- Ensure platform security

## Information Sharing

We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.

## Data Security

We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

## Your Rights

You have the right to:
- Access your personal information
- Update or correct your information
- Delete your account
- Opt-out of communications

## Contact Us

If you have questions about this Privacy Policy, please contact us at privacy@jstream.com
  `;

  const termsConditions = `
# Terms and Conditions

## Acceptance of Terms

By accessing and using JStream, you accept and agree to be bound by the terms and provision of this agreement.

## Service Description

JStream is a content discovery platform that provides information about movies and TV shows. We do not host, store, or distribute any video content.

## User Accounts

You are responsible for:
- Maintaining the confidentiality of your account
- All activities that occur under your account
- Providing accurate and complete information

## Acceptable Use

You agree not to:
- Use the service for any unlawful purpose
- Attempt to gain unauthorized access to our systems
- Interfere with the proper working of the service
- Use automated tools to access the service

## Content Disclaimer

JStream provides information about content for discovery purposes only. We do not guarantee the availability, accuracy, or legality of any content referenced on our platform.

## Intellectual Property

All content on JStream, including text, graphics, logos, and software, is the property of JStream or its licensors and is protected by copyright laws.

## Limitation of Liability

JStream shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.

## Termination

We may terminate or suspend your account at any time, with or without cause, with or without notice.

## Changes to Terms

We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of any changes.

## Contact Information

For questions about these Terms and Conditions, contact us at legal@jstream.com
  `;

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
          <h2 className="text-white text-lg font-semibold">Privacy & Security</h2>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 pb-20 px-4">
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex bg-gray-900 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'privacy'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <ShieldCheckIcon className="h-4 w-4" />
                <span>Privacy Policy</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'terms'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <DocumentTextIcon className="h-4 w-4" />
                <span>Terms & Conditions</span>
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-line text-gray-300 text-sm leading-relaxed">
                {activeTab === 'privacy' ? privacyPolicy : termsConditions}
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Security Features</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <ShieldCheckIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Secure Authentication</p>
                  <p className="text-gray-400 text-sm">Your account is protected with industry-standard security</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <ShieldCheckIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Data Encryption</p>
                  <p className="text-gray-400 text-sm">All data is encrypted in transit and at rest</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <ShieldCheckIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Privacy Controls</p>
                  <p className="text-gray-400 text-sm">Control what information is shared and stored</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 text-gray-300 text-sm">
              <p><strong>Privacy Questions:</strong> privacy@jstream.com</p>
              <p><strong>Legal Questions:</strong> legal@jstream.com</p>
              <p><strong>General Support:</strong> support@jstream.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />
    </div>
  );
};

export default MobilePrivacySecurity; 