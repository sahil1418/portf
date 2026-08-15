import { ProjectData, ProjectCategory, GitHubStats, LanguageBreakdown, ContributionDay } from '@/lib/types';
import { RepoData } from '@/lib/github';

export function getSceneType(repo: RepoData): string {
  const lang = (repo.language || '').toLowerCase();
  if (['python', 'jupyter notebook', 'r'].includes(lang)) return 'mesh';
  if (['html', 'css', 'javascript', 'typescript'].includes(lang)) return 'waveform';
  if (['go', 'rust', 'c', 'c++', 'java'].includes(lang)) return 'dag';
  if (repo.topics?.some(t => ['geo', 'map', 'gis', 'spatial'].includes(t))) return 'globe';
  if (repo.size > 3000) return 'pointcloud';
  return 'crystal';
}

export function getPrimaryColor(repo: RepoData): string {
  const colors: Record<string, string> = {
    'Python': '#3572A5',
    'TypeScript': '#3178C6',
    'JavaScript': '#F7DF1E',
    'HTML': '#E34C26',
    'Go': '#00ADD8',
    'Rust': '#DEA584',
    'Java': '#B07219',
    'C++': '#F34B7D',
  };
  return colors[repo.language || ''] || '#00F0FF';
}

export function getCategory(repo: RepoData): string {
  const lang = (repo.language || '').toLowerCase();
  const topics = repo.topics?.map(t => t.toLowerCase()) || [];
  if (topics.some(t => ['ml', 'ai', 'machine-learning', 'deep-learning'].includes(t)) || ['jupyter notebook'].includes(lang)) return 'ml-research';
  if (topics.some(t => ['geo', 'gis', 'satellite', 'remote-sensing'].includes(t))) return 'geoai';
  if (['typescript', 'javascript'].includes(lang) && !topics.includes('api')) return 'fullstack';
  if (['go', 'rust', 'docker'].some(t => topics.includes(t) || lang === t)) return 'tooling';
  return 'open-source';
}

export function transformRepoToProject(repo: RepoData, languages: Record<string, number>, commitActivity: number[]): ProjectData {
  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0) || 1;
  const languageBreakdown: LanguageBreakdown[] = Object.entries(languages)
    .map(([name, bytes]) => ({
      name,
      percentage: Math.round((bytes / totalBytes) * 1000) / 10,
      color: getLanguageColor(name),
      bytes,
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 6);

  return {
    id: repo.name,
    name: repo.name,
    fullName: repo.fullName,
    displayTitle: formatRepoName(repo.name),
    tagline: repo.description || `A ${repo.language || 'code'} project`,
    longDescription: repo.description || '',
    category: getCategory(repo) as ProjectCategory,
    sceneType: getSceneType(repo) as any,
    primaryColor: getPrimaryColor(repo),
    accentColor: getPrimaryColor(repo),
    techStack: extractTechStack(repo),
    stars: repo.stargazersCount,
    forks: repo.forksCount,
    watchers: 0,
    openIssues: repo.openIssuesCount,
    languages: languageBreakdown,
    commitActivity: commitActivity.length > 0 ? commitActivity : generatePlaceholderActivity(),
    keyMetric: {
      label: 'Size',
      value: formatSize(repo.size),
    },
    githubUrl: repo.htmlUrl,
    liveUrl: repo.homepage || null,
    createdAt: repo.createdAt,
    lastUpdated: repo.pushedAt,
    version: null,
    featured: repo.stargazersCount > 0 || repo.size > 500,
    score: calculateScore(repo),
  };
}

function formatRepoName(name: string): string {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function formatSize(sizeKb: number): string {
  if (sizeKb >= 1024) return `${(sizeKb / 1024).toFixed(1)} MB`;
  return `${sizeKb} KB`;
}

function extractTechStack(repo: RepoData): string[] {
  const stack: string[] = [];
  if (repo.language) stack.push(repo.language);
  stack.push(...(repo.topics || []).slice(0, 4).map(t => t.charAt(0).toUpperCase() + t.slice(1)));
  return stack.slice(0, 5);
}

function calculateScore(repo: RepoData): number {
  return repo.stargazersCount * 5 + repo.forksCount * 3 + (repo.size > 500 ? 5 : 2) + (repo.description ? 3 : 0) + (repo.homepage ? 5 : 0);
}

function generatePlaceholderActivity(): number[] {
  return Array.from({ length: 52 }, () => Math.floor(Math.random() * 5));
}

function getLanguageColor(name: string): string {
  const colors: Record<string, string> = {
    'Python': '#3572A5', 'TypeScript': '#3178C6', 'JavaScript': '#F7DF1E',
    'HTML': '#E34C26', 'CSS': '#563D7C', 'Go': '#00ADD8', 'Rust': '#DEA584',
    'Java': '#B07219', 'Shell': '#89E051', 'Dockerfile': '#384D54',
    'Jupyter Notebook': '#DA5B0B', 'SCSS': '#C6538C',
  };
  return colors[name] || '#8b8b8b';
}

export function calculateStats(repos: RepoData[]): { totalRepos: number; totalStars: number; totalForks: number; languages: Record<string, number> } {
  return {
    totalRepos: repos.filter(r => !r.fork).length,
    totalStars: repos.reduce((sum, r) => sum + r.stargazersCount, 0),
    totalForks: repos.reduce((sum, r) => sum + r.forksCount, 0),
    languages: repos.reduce((acc, r) => {
      if (r.language) acc[r.language] = (acc[r.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
}
