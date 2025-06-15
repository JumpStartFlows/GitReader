import React, { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar } from './SearchBar';
import { RepoCard } from './RepoCard';
import { Pagination } from './Pagination';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { ProductCard } from './payment/ProductCard';
import { githubApi } from '../services/githubApi';
import { GitHubRepository, SearchSuggestion } from '../types/github';
import { stripeProducts } from '../stripe-config';
import { Github, Heart } from 'lucide-react';

interface MainAppProps {
  queryParams?: Record<string, string>;
}

export const MainApp: React.FC<MainAppProps> = ({ queryParams = {} }) => {
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currentQuery, setCurrentQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

  // Modal state is now controlled by URL query parameters
  const showDonation = queryParams.modal === 'donation';

  const perPage = 10;

  useEffect(() => {
    // Load trending repositories for suggestions
    const loadSuggestions = async () => {
      try {
        const trending = await githubApi.getTrendingRepositories();
        const trendingSuggestions: SearchSuggestion[] = trending.slice(0, 8).map(repo => ({
          query: repo.name,
          type: 'trending'
        }));

        const popularSuggestions: SearchSuggestion[] = [
          { query: 'react', type: 'popular' },
          { query: 'javascript', type: 'popular' },
          { query: 'typescript', type: 'popular' },
          { query: 'python', type: 'popular' },
          { query: 'machine learning', type: 'popular' },
          { query: 'web development', type: 'popular' },
          { query: 'api', type: 'popular' },
          { query: 'framework', type: 'popular' }
        ];

        setSuggestions([...trendingSuggestions, ...popularSuggestions]);
      } catch (error) {
        console.warn('Failed to load suggestions:', error);
        // Fallback to popular suggestions only
        setSuggestions([
          { query: 'react', type: 'popular' },
          { query: 'javascript', type: 'popular' },
          { query: 'typescript', type: 'popular' },
          { query: 'python', type: 'popular' },
          { query: 'machine learning', type: 'popular' },
          { query: 'web development', type: 'popular' },
          { query: 'api', type: 'popular' },
          { query: 'framework', type: 'popular' }
        ]);
      }
    };

    loadSuggestions();
  }, []);

  const handleSearch = async (query: string, page: number = 1) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setCurrentQuery(query);
    setCurrentPage(page);

    try {
      const response = await githubApi.searchRepositories(query, page, perPage);
      setRepositories(response.items);
      setTotalCount(response.total_count);
      setTotalPages(Math.min(Math.ceil(response.total_count / perPage), 100)); // GitHub API limits to 1000 results
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setRepositories([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (currentQuery) {
      handleSearch(currentQuery, page);
    }
  };

  const handleRetry = () => {
    if (currentQuery) {
      handleSearch(currentQuery, currentPage);
    }
  };

  const handleOpenDonation = () => {
    // Add modal=donation query parameter to URL
    const url = new URL(window.location.href);
    url.searchParams.set('modal', 'donation');
    window.history.pushState({}, '', url.toString());
    
    // Trigger popstate event to update router state
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleCloseDonation = () => {
    // Remove modal query parameter from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('modal');
    window.history.replaceState({}, '', url.toString());
    
    // Trigger popstate event to update router state
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-colors duration-300">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <button
          onClick={handleOpenDonation}
          className="p-3 rounded-full backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300 shadow-lg text-gray-700 dark:text-gray-300"
          aria-label="Donate"
        >
          <Heart className="w-5 h-5" />
        </button>
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Github className="w-10 h-10 text-gray-800 dark:text-white" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              GitReader
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover and explore README files from GitHub repositories. Search by keywords, 
            browse trending projects, and dive deep into documentation.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            onSearch={(query) => handleSearch(query, 1)}
            suggestions={suggestions}
            isLoading={isLoading}
          />
        </div>

        {/* Results Summary */}
        {currentQuery && !isLoading && !error && (
          <div className="text-center mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Found {totalCount.toLocaleString()} repositories for "{currentQuery}"
              {totalCount > 1000 && ' (showing first 1000 results)'}
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Error State */}
        {error && <ErrorMessage message={error} onRetry={handleRetry} />}

        {/* Results */}
        {!isLoading && !error && repositories.length > 0 && (
          <>
            <div className="space-y-6 mb-8">
              {repositories.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </>
        )}

        {/* No Results */}
        {!isLoading && !error && currentQuery && repositories.length === 0 && (
          <div className="text-center py-12">
            <div className="backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-xl p-8 max-w-md mx-auto">
              <Github className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No repositories found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search terms or browse our trending suggestions.
              </p>
            </div>
          </div>
        )}

        {/* Welcome State */}
        {!currentQuery && !isLoading && (
          <div className="text-center py-12">
            <div className="backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-xl p-8 max-w-lg mx-auto">
              <Github className="w-20 h-20 text-blue-500 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Start exploring GitHub
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Search for repositories by name, topic, or technology. Click on any repository 
                to view its README file with full markdown rendering and syntax highlighting.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestions.slice(0, 6).map((suggestion) => (
                  <button
                    key={suggestion.query}
                    onClick={() => handleSearch(suggestion.query, 1)}
                    className="px-3 py-1 rounded-full text-sm backdrop-blur-sm bg-blue-100/50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50 hover:bg-blue-200/50 dark:hover:bg-blue-800/30 transition-colors"
                  >
                    {suggestion.query}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Donation Modal */}
      {showDonation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <div className="bg-white/95 dark:bg-gray-900/95 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Support GitReader
                </h2>
                <button
                  onClick={handleCloseDonation}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors text-xl font-medium w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Close donation modal"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                {stripeProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};