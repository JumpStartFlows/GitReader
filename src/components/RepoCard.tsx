import React, { useState } from 'react';
import { Star, GitFork, ExternalLink, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { GitHubRepository } from '../types/github';
import { MarkdownViewer } from './MarkdownViewer';
import { githubApi } from '../services/githubApi';

interface RepoCardProps {
  repo: GitHubRepository;
}

export const RepoCard: React.FC<RepoCardProps> = ({ repo }) => {
  const [showReadme, setShowReadme] = useState(false);
  const [readme, setReadme] = useState<string | null>(null);
  const [isLoadingReadme, setIsLoadingReadme] = useState(false);
  const [readmeError, setReadmeError] = useState<string | null>(null);

  const handleToggleReadme = async () => {
    if (!showReadme && !readme) {
      setIsLoadingReadme(true);
      setReadmeError(null);
      
      try {
        const readmeContent = await githubApi.getReadme(repo.owner.login, repo.name);
        setReadme(readmeContent);
      } catch (error) {
        setReadmeError(error instanceof Error ? error.message : 'Failed to load README');
      } finally {
        setIsLoadingReadme(false);
      }
    }
    
    setShowReadme(!showReadme);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/15 dark:hover:bg-black/15">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <img
            src={repo.owner.avatar_url}
            alt={repo.owner.login}
            className="w-10 h-10 rounded-full border-2 border-white/20 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-2 group break-all"
              style={{ wordBreak: 'break-all', overflowWrap: 'break-word' }}
            >
              <span className="break-all">{repo.full_name}</span>
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </a>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Updated {formatDate(repo.updated_at)}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleToggleReadme}
          className="flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-sm bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-200 text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0"
          disabled={isLoadingReadme}
        >
          <FileText className="w-4 h-4" />
          README
          {isLoadingReadme ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : showReadme ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {repo.description && (
        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed break-words">
          {repo.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-yellow-500">
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">{repo.stargazers_count.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
            <GitFork className="w-4 h-4" />
            <span className="text-sm font-medium">{repo.forks_count.toLocaleString()}</span>
          </div>
        </div>
        
        {repo.language && (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
            {repo.language}
          </span>
        )}
      </div>

      {showReadme && (
        <div className="mt-6 pt-6 border-t border-white/20 dark:border-white/10 w-full overflow-hidden">
          {isLoadingReadme ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : readmeError ? (
            <div className="text-center py-8">
              <p className="text-red-500 dark:text-red-400">{readmeError}</p>
            </div>
          ) : readme ? (
            <div className="w-full overflow-hidden">
              <MarkdownViewer content={readme} />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};