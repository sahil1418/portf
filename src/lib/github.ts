export interface GitHubProfile {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
}

export interface RepoData {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  stargazersCount: number;
  forksCount: number;
  openIssuesCount: number;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  topics: string[];
  size: number;
  fork: boolean;
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    login: string;
  };
  repo: {
    name: string;
  };
  createdAt: string;
}

const BASE_URL = 'https://api.github.com';

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'sahilkumar-portfolio',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function fetchGitHub<T>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, { headers: getHeaders(), next: { revalidate: 3600 } });
  
  if (!response.ok) {
    throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchUserProfile(username: string): Promise<GitHubProfile> {
  const data = await fetchGitHub<any>(`/users/${username}`);
  return {
    login: data.login,
    name: data.name,
    bio: data.bio,
    avatarUrl: data.avatar_url,
    publicRepos: data.public_repos,
    followers: data.followers,
    following: data.following,
    createdAt: data.created_at,
  };
}

export async function fetchUserRepos(username: string): Promise<RepoData[]> {
  const data = await fetchGitHub<any[]>(`/users/${username}/repos?per_page=100&sort=pushed`);
  return data.map(repo => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    htmlUrl: repo.html_url,
    homepage: repo.homepage,
    language: repo.language,
    stargazersCount: repo.stargazers_count,
    forksCount: repo.forks_count,
    openIssuesCount: repo.open_issues_count,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
    topics: repo.topics || [],
    size: repo.size,
    fork: repo.fork,
  }));
}

export async function fetchRepoLanguages(owner: string, repo: string): Promise<Record<string, number>> {
  return fetchGitHub<Record<string, number>>(`/repos/${owner}/${repo}/languages`);
}

export async function fetchRepoCommitActivity(owner: string, repo: string): Promise<number[]> {
  const data = await fetchGitHub<any[]>(`/repos/${owner}/${repo}/stats/commit_activity`);
  if (!Array.isArray(data)) return [];
  return data.map(week => week.total);
}

export async function fetchUserEvents(username: string): Promise<GitHubEvent[]> {
  const data = await fetchGitHub<any[]>(`/users/${username}/events/public`);
  return data.map(event => ({
    id: event.id,
    type: event.type,
    actor: { login: event.actor.login },
    repo: { name: event.repo.name },
    createdAt: event.created_at,
  }));
}
