import { GitHubRepository, GitHubSearchResponse, ReadmeContent } from '../types/github';

const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'GitHubApiError';
  }
}

export const githubApi = {
  async searchRepositories(
    query: string,
    page: number = 1,
    perPage: number = 10
  ): Promise<GitHubSearchResponse> {
    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&sort=stars&order=desc`
      );

      if (!response.ok) {
        if (response.status === 403) {
          throw new GitHubApiError('Rate limit exceeded. Please try again later.', 403);
        }
        throw new GitHubApiError(`Search failed: ${response.statusText}`, response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof GitHubApiError) {
        throw error;
      }
      throw new GitHubApiError('Network error occurred while searching repositories');
    }
  },

  async getReadme(owner: string, repo: string): Promise<string> {
    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new GitHubApiError('README not found for this repository', 404);
        }
        if (response.status === 403) {
          throw new GitHubApiError('Rate limit exceeded. Please try again later.', 403);
        }
        throw new GitHubApiError(`Failed to fetch README: ${response.statusText}`, response.status);
      }

      const data: ReadmeContent = await response.json();
      
      // Decode base64 content with proper UTF-8 handling
      if (data.encoding === 'base64') {
        const binaryString = atob(data.content.replace(/\n/g, ''));
        const bytes = Uint8Array.from(binaryString, char => char.charCodeAt(0));
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(bytes);
      }
      
      return data.content;
    } catch (error) {
      if (error instanceof GitHubApiError) {
        throw error;
      }
      throw new GitHubApiError('Network error occurred while fetching README');
    }
  },

  async getTrendingRepositories(): Promise<GitHubRepository[]> {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const dateString = oneWeekAgo.toISOString().split('T')[0];
      
      const response = await fetch(
        `${GITHUB_API_BASE}/search/repositories?q=created:>${dateString}&sort=stars&order=desc&per_page=10`
      );

      if (!response.ok) {
        throw new GitHubApiError('Failed to fetch trending repositories');
      }

      const data: GitHubSearchResponse = await response.json();
      return data.items;
    } catch (error) {
      console.warn('Failed to fetch trending repositories:', error);
      return [];
    }
  }
};