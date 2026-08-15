<!-- # CODEX INTEGRATION BRIEF — Backend & Data Layer

## The Researcher's Cosmos · Portfolio

> **Your role:** Build the backend data layer — GitHub API integration, Redis caching, scoring engine, AI enrichment, and API routes.
> **My role (Antigravity):** Built the entire frontend — 3D scenes, UI components, animations, page assembly.
> **Integration point:** The frontend fetches from YOUR API routes and expects data in the exact TypeScript types defined below.

---

## PROJECT CONTEXT

This is a portfolio site where **GitHub IS the database**. Every repo tagged with `portfolio` topic auto-appears as a project card with a unique 3D scene, AI-generated descriptions, and live stats. The frontend is already built with mock data — your job is to replace that mock data with real GitHub data.

**Tech Stack:**
- Next.js 15, App Router, TypeScript strict
- `@upstash/redis` for caching (replaces deprecated `@vercel/kv`)
- TanStack Query v5 on the client (already wired)
- Deployment target: Vercel

---

## CRITICAL: DATA CONTRACTS

The frontend imports types from `src/lib/types.ts` and mock data from `src/data/mock-*.ts`. Your API routes MUST return data matching these exact interfaces. Do NOT change these types — the entire frontend depends on them.

### Core Types (`src/lib/types.ts`)

```typescript
// === TYPES YOU MUST CONFORM TO ===

export interface ProjectData {
  // Identity
  id: string;                    // GitHub repo ID
  name: string;                  // repo name (raw)
  fullName: string;              // username/repo-name
  
  // Display (AI-enriched or from GitHub)
  displayTitle: string;          // Human-readable title
  tagline: string;               // One-line description
  longDescription: string;       // 3-paragraph rich description (for modal)
  category: 'ml-research' | 'geoai' | 'fullstack' | 'tooling' | 'research-tool' | 'open-source';
  
  // Visual
  sceneType: 'globe' | 'mesh' | 'dag' | 'waveform' | 'pointcloud' | 'crystal';
  primaryColor: string;          // hex color for card glow
  accentColor: string;           // hex secondary color
  
  // Tech
  techStack: string[];           // ["Next.js", "PyTorch", "PostgreSQL"]
  languages: LanguageBreakdown[];
  
  // Stats (live from GitHub)
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  
  // Activity
  commitActivity: number[];      // 52 numbers, one per week (last year)
  lastUpdated: string;           // ISO date string
  createdAt: string;             // ISO date string
  
  // Links
  githubUrl: string;             // html_url
  liveUrl: string | null;        // homepage field (null if empty)
  
  // Meta
  version: string | null;        // latest release tag (null if no releases)
  score: number;                 // relevance score from scoring engine
  featured: boolean;             // score >= 25 or manually set
  
  // Key metric (AI-enriched)
  keyMetric: {
    label: string;               // "API Requests/day"
    value: string;               // "10k+"
  };
}

export interface LanguageBreakdown {
  name: string;                  // "Python"
  color: string;                 // "#3572A5"
  percentage: number;            // 52.3
  bytes: number;                 // raw byte count
}

export interface ContributionDay {
  date: string;                  // "2024-03-15"
  count: number;                 // 0-15+
  level: 0 | 1 | 2 | 3 | 4;    // intensity bucket
}

export interface GitHubStats {
  totalCommits: number;
  totalPRs: number;
  totalRepos: number;
  longestStreak: number;         // calculated from calendar
  currentStreak: number;
  totalContributions: number;    // last year
  contributionCalendar: ContributionDay[];  // 365 days
}

export interface SkillData {
  name: string;
  category: 'ml-ai' | 'frontend' | 'backend' | 'systems' | 'data' | 'tools' | 'cloud';
  proficiency: number;           // 0-100
  yearsUsed: number;
  githubBytes: number;           // total bytes across all repos
  icon?: string;                 // optional icon identifier
}
```

---

## API ROUTES TO BUILD

All routes live in `src/app/api/`. All return JSON. All use server-side `GITHUB_TOKEN` — **NEVER expose token to client.**

### 1. `GET /api/github/projects`

**Purpose:** Return all portfolio projects, scored, enriched, merged with overrides.

**Response:** `ProjectData[]` sorted by `score` descending.

**Flow:**
1. Check Redis cache (`projects:list`, TTL: 6 hours)
2. If miss: fetch repos with `portfolio` topic via GitHub REST
3. For each repo: fetch languages, commit activity (parallel with `Promise.all`)
4. Run scoring engine on each repo
5. Check AI enrichment cache per repo — if missing, queue enrichment (non-blocking)
6. Merge: GitHub data + AI enrichment + manual overrides from `src/data/project-overrides.ts`
7. Store in Redis, return

### 2. `GET /api/github/stats`

**Purpose:** Return contribution calendar and aggregate stats.

**Response:** `GitHubStats`

**Flow:**
1. Check Redis (`user:stats`, TTL: 12 hours)
2. If miss: GraphQL query for `contributionsCollection`
3. Calculate streaks client-side from calendar data
4. Return

### 3. `GET /api/github/pinned`

**Purpose:** Return the 6 GitHub-pinned repos with deep metadata.

**Response:** `ProjectData[]` (subset, always 6 items max)

**Flow:**
1. GraphQL query from blueprint Part 2, Source B
2. This data feeds into the scoring engine (pinned repos get +10 score bonus)

### 4. `GET /api/github/readme?repo={name}`

**Purpose:** Return parsed README for a specific repo.

**Response:**
```typescript
{
  title: string;
  description: string;
  features: string[];
  techStack: string[];
  demoUrl: string | null;
  screenshots: string[];  // image URLs
  badges: string[];
}
```

**Flow:**
1. Fetch README via REST (base64 encoded)
2. Decode, parse with `unified` + `remark-parse`
3. Extract structured sections

### 5. `GET /api/github/languages?repo={name}`

**Purpose:** Language breakdown for a specific repo.

**Response:** `LanguageBreakdown[]`

### 6. `POST /api/github/webhook`

**Purpose:** Handle GitHub webhook events for real-time cache invalidation.

**Flow:**
1. Verify HMAC-SHA256 signature using `GITHUB_WEBHOOK_SECRET`
2. Handle events: `created`, `pushed`, `starred`, `deleted`, `publicized`
3. Invalidate relevant Redis keys
4. Return 200

### 7. Cron Routes

**`GET /api/cron/refresh-projects`** — Every 6 hours. Full refresh.
**`GET /api/cron/refresh-stats`** — Every 1 hour. Star counts + timestamps only.

Both require `Authorization: Bearer ${CRON_SECRET}` header.

**`vercel.json`:**
```json
{
  "crons": [
    { "path": "/api/cron/refresh-projects", "schedule": "0 */6 * * *" },
    { "path": "/api/cron/refresh-stats", "schedule": "0 * * * *" }
  ]
}
```

---

## FILES TO CREATE

```
src/
├── lib/
│   ├── github.ts          ← GitHub API client (REST + GraphQL)
│   ├── cache.ts           ← Upstash Redis client + SWR helpers
│   ├── scoring.ts         ← Repo scoring engine
│   ├── enrichment.ts      ← AI enrichment (Gemini or Claude Haiku)
│   └── readme-parser.ts   ← unified/remark README → structured data
├── data/
│   ├── project-overrides.ts  ← Manual override dictionary
│   └── fallback-projects.ts  ← Static fallback when APIs are down
├── app/api/
│   ├── github/
│   │   ├── projects/route.ts
│   │   ├── stats/route.ts
│   │   ├── pinned/route.ts
│   │   ├── readme/route.ts
│   │   ├── languages/route.ts
│   │   └── webhook/route.ts
│   └── cron/
│       ├── refresh-projects/route.ts
│       └── refresh-stats/route.ts
```

---

## FILES YOU MUST NOT MODIFY

These are owned by the frontend build. Modifying them will cause merge conflicts:

```
src/app/globals.css
src/app/layout.tsx
src/app/page.tsx
src/app/providers.tsx
src/components/**/*        ← ALL component files
src/hooks/**/*             ← ALL hook files
src/data/mock-*.ts         ← Mock data files (your real data replaces these via API)
next.config.ts             ← Already configured, but you may ADD to it
```

---

## SCORING ENGINE SPEC (`src/lib/scoring.ts`)

```typescript
function scoreRepo(repo: GitHubRepo): number {
  let score = 0;
  
  score += repo.stargazers_count * 2.0;
  score += repo.forks_count * 1.5;
  
  // Recency: 1.0 if pushed < 30 days ago, exponential decay otherwise
  const daysSincePush = daysBetween(new Date(repo.pushed_at), new Date());
  const recency = daysSincePush < 30 ? 1.0 : Math.exp(-0.02 * (daysSincePush - 30));
  score += recency * 1.8;
  
  // README quality: 0-1 based on length and sections
  score += readmeQualityScore(repo) * 1.2;
  
  // Has live URL
  score += repo.homepage ? 5.0 : 0;
  
  // Topic count
  score += repo.topics.length * 0.3;
  
  // Has description
  score += repo.description ? 2.0 : 0;
  
  // Commit frequency (avg commits/month last 6 months)
  score += commitFrequency(repo) * 1.0;
  
  // Pinned bonus
  score += isPinned(repo) ? 10.0 : 0;
  
  return score;
}

// THRESHOLDS:
// score >= 8.0  → appears in portfolio
// score >= 25.0 → featured (large card, shown first)
// archived repos → always excluded
// forks → excluded unless >20 commits added
```

---

## CACHING SPEC (`src/lib/cache.ts`)

```typescript
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

// TTL Constants
const TTL = {
  REPO_LIST: 6 * 60 * 60,       // 6 hours
  REPO_STATS: 60 * 60,           // 1 hour  
  COMMIT_ACTIVITY: 24 * 60 * 60, // 24 hours
  AI_ENRICHMENT: 0,              // permanent (manual invalidation only)
  CONTRIBUTIONS: 12 * 60 * 60,   // 12 hours
};

// Stale-While-Revalidate pattern
async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number
): Promise<T> {
  const cached = await redis.get<{ data: T; timestamp: number }>(key);
  
  if (cached) {
    const isStale = Date.now() - cached.timestamp > ttlSeconds * 1000;
    if (isStale) {
      // Revalidate in background, serve stale immediately
      refreshInBackground(key, fetcher, ttlSeconds);
    }
    return cached.data;
  }
  
  // Cache miss: fetch, store, return
  const fresh = await fetcher();
  await redis.set(key, { data: fresh, timestamp: Date.now() });
  return fresh;
}
```

**Env vars:** `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

---

## AI ENRICHMENT SPEC (`src/lib/enrichment.ts`)

Runs ONCE per new repo. Cached permanently. Use **Gemini API** (or Claude Haiku as fallback).

**Input:** repo name, description, topics, primary language, all languages, first 2000 chars of README

**Output:**
```typescript
interface EnrichedMetadata {
  displayTitle: string;
  tagline: string;
  longDescription: string;
  category: ProjectData['category'];
  techStack: string[];
  sceneType: ProjectData['sceneType'];
  primaryColor: string;
  accentColor: string;
  keyMetric: { label: string; value: string };
}
```

**Prompt:**
```
You are enriching metadata for a portfolio of an ML researcher and software engineer.
Given this GitHub repository data, return ONLY a JSON object (no markdown) with these fields:
[fields listed above].

Choose sceneType from [globe, mesh, dag, waveform, pointcloud, crystal] based on
what best visualizes this project.

Choose colors that feel right for the domain:
- ML/AI → violet (#7B2FBE)
- Geo/spatial → teal (#0D9488)  
- Infrastructure → gold (#D97706)
- Frontend → cyan (#00F0FF)
- Research → prismatic white (#E8E6F0)
```

**Fallback if AI fails:**
- `displayTitle` = repo name, title-cased
- `tagline` = GitHub description
- `sceneType` = "mesh" (default)
- `primaryColor` = "#00F0FF" (plasma cyan)

---

## ENVIRONMENT VARIABLES

Create `.env.local`:
```bash
# GitHub
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx
GITHUB_USERNAME=sahilkumar
GITHUB_WEBHOOK_SECRET=random-32-char-string

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxxxxxxxxxxxx

# AI Enrichment (pick one)
GOOGLE_AI_API_KEY=your-gemini-key
# or
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Cron Security
CRON_SECRET=random-secret-for-cron-auth
```

---

## MERGE PRIORITY

When building the final `ProjectData` object, merge in this order (highest wins):

```
1. project-overrides.ts    ← Manual control (always wins)
2. AI enrichment           ← Gemini/Claude interpretation
3. GitHub API data         ← Raw source of truth  
4. Defaults                ← Fallback values
```

---

## INTEGRATION TEST

After you build the routes, the frontend will work if:

1. `GET /api/github/projects` returns `ProjectData[]` — project cards populate
2. `GET /api/github/stats` returns `GitHubStats` — about section populates
3. Both return valid JSON matching the types above
4. The `mock-projects.ts` file shows exactly what shape the data should be in — use it as your reference

---

## INSTALL THESE PACKAGES

```bash
npm install @upstash/redis unified remark-parse remark-gfm unist-util-visit
```

If using Gemini:
```bash
npm install @google/generative-ai
```

If using Anthropic:
```bash
npm install @anthropic-ai/sdk
```

---

> **DO NOT** run `npm install` for packages already installed (three, @react-three/fiber, motion, @tanstack/react-query — these are frontend deps, already present).
> **DO NOT** modify any files outside the paths listed in "FILES TO CREATE".
> **DO** follow the types in `src/lib/types.ts` exactly — the frontend renders based on these contracts. -->
