import React from 'react';
import { XCircle, ArrowLeft, Heart } from 'lucide-react';
import { Link } from '../ui/Link';

export const CancelPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-2xl p-8 shadow-xl text-center">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-orange-600 dark:text-orange-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Donation Cancelled
          </h1>
          
          <div className="mb-6">
            <Heart className="w-6 h-6 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Your donation was cancelled. No charges were made to your account. 
              You can try again anytime if you'd like to support GitReader and help keep the vibes flowing!
            </p>
          </div>
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to GitReader
          </Link>
        </div>
      </div>
    </div>
  );
};