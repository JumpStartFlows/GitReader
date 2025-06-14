import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="p-2 rounded-lg backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-black/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-3 py-2 text-gray-500 dark:text-gray-400">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg backdrop-blur-md border transition-all duration-200 ${
                currentPage === page
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-600 dark:text-blue-400'
                  : 'bg-white/10 dark:bg-black/10 border-white/20 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-black/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="p-2 rounded-lg backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-black/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};