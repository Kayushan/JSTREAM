import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  QuestionMarkCircleIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import MobileNavigation from '../components/layout/MobileNavigation';

const MobileHelpSupport: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How do I create an account?",
      answer: "You can create an account by clicking the 'Sign In' button and then selecting 'Create Account'. You'll need to provide your email address and create a password."
    },
    {
      question: "How do I search for content?",
      answer: "Use the search bar at the top of the screen to find movies and TV shows. You can search by title, genre, or actor name."
    },
    {
      question: "How do I add content to my list?",
      answer: "While browsing content, tap the heart icon on any movie or TV show to add it to your favorites list."
    },
    {
      question: "How do I change my account settings?",
      answer: "Go to your Profile page and tap on 'Account' to modify your display name, email, and other account settings."
    },
    {
      question: "How do I enable dark mode?",
      answer: "Go to Settings and toggle the 'Dark Mode' switch to enable or disable dark theme."
    },
    {
      question: "How do I view my watching history?",
      answer: "Go to your Profile page and tap on 'Viewing Activity' to see your watching history and completed content."
    }
  ];

  const contactMethods = [
    {
      icon: EnvelopeIcon,
      title: "Email Support",
      description: "Send us an email for general inquiries",
      action: () => window.open('mailto:support@jstream.com', '_blank')
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Live Chat",
      description: "Chat with our support team",
      action: () => alert('Live chat feature coming soon!')
    },
    {
      icon: BookOpenIcon,
      title: "Help Center",
      description: "Browse our comprehensive help articles",
      action: () => alert('Help center coming soon!')
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
          <h2 className="text-white text-lg font-semibold">Help & Support</h2>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 pb-20 px-4">
        <div className="space-y-6">
          {/* Developer Info */}
          <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-white text-xl font-bold">Developed by Shan</h3>
                <p className="text-white/80 text-sm">Full-stack developer & UI/UX designer</p>
                <p className="text-white/60 text-xs mt-1">A passionate developer creating amazing streaming experiences</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Get Help</h3>
            <div className="space-y-3">
              {contactMethods.map((method, index) => (
                <button
                  key={index}
                  onClick={method.action}
                  className="w-full flex items-center space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <method.icon className="h-6 w-6 text-red-400" />
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium">{method.title}</p>
                    <p className="text-gray-400 text-sm">{method.description}</p>
                  </div>
                  <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-800 rounded-lg">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-white font-medium">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-4">
                      <p className="text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* App Information */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">About JStream</h3>
            <div className="space-y-3 text-gray-300 text-sm">
              <div className="flex justify-between">
                <span>Version</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Platform</span>
                <span>Web & Mobile</span>
              </div>
              <div className="flex justify-between">
                <span>Technology</span>
                <span>React + TypeScript</span>
              </div>
              <div className="flex justify-between">
                <span>Developer</span>
                <span>Shan</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3 text-gray-300 text-sm">
              <p><strong>Developer:</strong> Shan</p>
              <p><strong>Email:</strong> support@jstream.com</p>
              <p><strong>Website:</strong> jstream.com</p>
              <p><strong>Support Hours:</strong> 24/7</p>
            </div>
          </div>

          {/* Feature Request */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Feature Request</h3>
            <p className="text-gray-300 text-sm mb-4">
              Have an idea for a new feature? We'd love to hear from you!
            </p>
            <button
              onClick={() => window.open('mailto:features@jstream.com?subject=Feature Request', '_blank')}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Suggest a Feature
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />
    </div>
  );
};

export default MobileHelpSupport; 