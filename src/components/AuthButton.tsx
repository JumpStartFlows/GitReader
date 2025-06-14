import React from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { Link } from './ui/Link';

export const AuthButton: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-200 text-gray-700 dark:text-gray-300 text-sm font-medium"
      >
        <LogIn className="w-4 h-4" />
        Sign In
      </Link>
      <Link
        href="/signup"
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors duration-200"
      >
        <UserPlus className="w-4 h-4" />
        Sign Up
      </Link>
    </div>
  );
};