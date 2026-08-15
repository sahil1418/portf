// ============================================================
// Core Types for Sahil Kumar's Portfolio
// ============================================================

// === PROJECT DATA ===
export interface ProjectData {
  id: string;
  name: string;
  fullName: string;

  // Display
  displayTitle: string;
  tagline: string;
  longDescription: string;
  category: ProjectCategory;

  // Visual
  sceneType: SceneType;
  primaryColor: string;
  accentColor: string;

  // Tech
  techStack: string[];
  languages: LanguageBreakdown[];

  // Stats
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;

  // Activity
  commitActivity: number[];
  lastUpdated: string;
  createdAt: string;

  // Links
  githubUrl: string;
  liveUrl: string | null;

  // Meta
  version: string | null;
  score: number;
  featured: boolean;

  // Key metric
  keyMetric: {
    label: string;
    value: string;
  };
}

export type ProjectCategory =
  | 'ml-research'
  | 'geoai'
  | 'fullstack'
  | 'tooling'
  | 'research-tool'
  | 'open-source';

export type SceneType =
  | 'globe'
  | 'mesh'
  | 'dag'
  | 'waveform'
  | 'pointcloud'
  | 'crystal';

export interface LanguageBreakdown {
  name: string;
  color: string;
  percentage: number;
  bytes: number;
}

// === CONTRIBUTION DATA ===
export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubStats {
  totalCommits: number;
  totalPRs: number;
  totalRepos: number;
  longestStreak: number;
  currentStreak: number;
  totalContributions: number;
  contributionCalendar: ContributionDay[];
}

// === SKILLS ===
export interface SkillData {
  name: string;
  category: SkillCategory;
  proficiency: number;
  yearsUsed: number;
  githubBytes: number;
  icon?: string;
}

export type SkillCategory =
  | 'ml-ai'
  | 'frontend'
  | 'backend'
  | 'systems'
  | 'data'
  | 'tools'
  | 'cloud'
  | 'languages'
  | 'frameworks'
  | 'ai-ml'
  | 'fundamentals';

// === NAVIGATION ===
export interface NavLink {
  label: string;
  href: string;
  id: string;
}
