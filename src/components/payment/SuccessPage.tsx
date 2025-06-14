import React from 'react';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from '../ui/Link';

export const SuccessPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-2xl p-8 shadow-xl text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Thank you for your support! Your payment has been processed successfully. 
            You can now continue exploring GitHub repositories.
          </p>
          
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