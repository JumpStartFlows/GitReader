import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Image as ImageIcon } from 'lucide-react';

interface ImageDebuggerProps {
  src: string;
  alt: string;
  className?: string;
}

export const ImageDebugger: React.FC<ImageDebuggerProps> = ({ src, alt, className }) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [actualSrc, setActualSrc] = useState<string>('');

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setImageStatus('loaded');
      setActualSrc(img.src);
    };
    
    img.onerror = () => {
      setImageStatus('error');
      console.error(`Failed to load image: ${src}`);
      console.log('Attempted paths:', [
        src,
        `${window.location.origin}${src}`,
        `${window.location.origin}/public${src}`,
        `${window.location.origin}/src/assets${src}`
      ]);
    };
    
    img.src = src;
  }, [src]);

  if (imageStatus === 'error') {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4`}>
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Image not found</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Path: {src}</p>
        </div>
      </div>
    );
  }

  if (imageStatus === 'loading') {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg p-4`}>
        <div className="text-center">
          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-pulse" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <img src={src} alt={alt} className={className} />
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};