# GITHUB INTEGRATION — IMPLEMENTATION BLUEPRINT
## The Researcher's Cosmos · Project Data Layer

> *No codes. Full implementation thinking. Hand to Opus for execution.*

---

## THE CORE IDEA

The portfolio never hardcodes a single project manually.

GitHub **is** the database. Every repository you've ever pushed becomes a candidate. The site fetches it, scores it, enriches it, and renders it as a living city in the Project Metaverse — automatically. You push a new repo today, it appears tonight.

The system has three jobs:

```
FETCH → SCORE → ENRICH → RENDER

GitHub API  →  Relevance Engine  →  AI Enrichment  →  3D Scene
```

You only do one thing manually: add a topic tag `portfolio` to repos you want shown. Everything else is automatic.

---

## PART 1 — DATA FLOW ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                        GITHUB API                               │
│    REST v3  +  GraphQL v4  (both used, each for different data) │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER LAYER                         │
│                                                                 │
│   Route Handlers (app/api/*)  ←  NOT client-side fetching      │
│   Your GitHub token NEVER leaves the server                     │
│   Rate limit budget managed here                                │
└──────┬─────────────────────────────────────────────────────────┘
       │
       ├── /api/github/projects      ← All repos marked `portfolio`
       ├── /api/github/stats         ← Contribution graph, streak, totals
       ├── /api/github/pinned        ← Your 6 GitHub-pinned repos
       ├── /api/github/readme        ← Per-repo README, parsed to rich data
       └── /api/github/languages     ← Language breakdown per repo
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VERCEL KV  (Redis)                           │
│                                                                 │
│   Cache layer between GitHub API and your visitors              │
│   TTL: 6 hours per key                                          │
│   Prevents burning GitHub's rate limit on traffic spikes        │
│   Stale-while-revalidate pattern for instant response           │
└──────┬──────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CLIENT — THE 3D SCENE                          │
│                                                                 │
│   React Query fetches from YOUR API (not GitHub directly)       │
│   Optimistic UI: skeleton cities render before data arrives     │
│   Real-time: GitHub webhook → Vercel redeploy → fresh cache     │
└─────────────────────────────────────────────────────────────────┘
```

---

## PART 2 — GITHUB DATA SOURCES

Two GitHub APIs are used. Each gives different data. Both are needed.

---

### SOURCE A — REST API v3

**Used for:** Per-repository metadata, traffic stats, releases

```
What you get per repo:
─────────────────────────────────────────────────────────────────
  id                → unique identifier
  name              → repo name (becomes project title base)
  full_name         → username/repo-name
  description       → becomes project tagline (if exists)
  topics            → tags for filtering + category detection
  language          → primary language
  languages_url     → endpoint to get ALL languages used
  stargazers_count  → ⭐ star count
  forks_count       → fork count
  watchers_count    → watcher count
  open_issues_count → issue count
  size              → repo size in KB
  created_at        → project birth date
  updated_at        → last activity (used for "active" badge)
  pushed_at         → last commit push time
  homepage          → live URL (if set in repo settings)
  html_url          → GitHub link
  default_branch    → usually 'main'
  license           → license info
  visibility        → public/private (only public ones shown)
  archived          → skip archived repos
```

**Traffic data (requires push access to repo):**
```
  views.count       → total views last 14 days
  views.uniques     → unique visitors
  clones.count      → total clones
  clones.uniques    → unique cloners
```

---

### SOURCE B — GraphQL API v4

**Used for:** Pinned repos, contribution data, richer relationship data

GraphQL query for pinned repos + deep stats in a SINGLE request:

```graphql
{
  user(login: "sahilkumar") {

    # The 6 repos you've pinned on your GitHub profile
    pinnedItems(first: 6, types: [REPOSITORY]) {
      nodes {
        ... on Repository {
          name
          description
          url
          stargazerCount
          forkCount
          primaryLanguage { name color }
          languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node { name color }
            }
          }
          repositoryTopics(first: 10) {
            nodes { topic { name } }
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 1) {
                  totalCount          # total commit count
                  nodes {
                    committedDate     # last commit date
                    message           # last commit message
                    additions
                    deletions
                  }
                }
              }
            }
          }
          releases(first: 1, orderBy: {field: CREATED_AT, direction: DESC}) {
            nodes {
              tagName               # latest version
              publishedAt
              description           # release notes
            }
          }
        }
      }
    }

    # Contribution activity
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalRepositoriesWithContributedCommits
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            color
          }
        }
      }
    }
  }
}
```

**One GraphQL call replaces ~20 REST calls. Use this aggressively.**

---

### SOURCE C — README Parsing

Every repo's README becomes structured data.

Flow:
```
Fetch README (base64 encoded) from GitHub API
       ↓
Decode from base64 → Markdown string
       ↓
Parse with unified/remark
       ↓
Extract structured sections:
  - First H1         → display title
  - First paragraph  → description
  - ## Features      → feature bullet list
  - ## Tech Stack    → technology list
  - ## Demo          → live URL if not in repo settings
  - Images           → screenshots for the project card
  - Badges           → CI status, coverage, version
       ↓
Store as structured JSON alongside repo metadata
```

**This means a well-written README auto-populates the entire project card with zero manual input.**

---

### SOURCE D — Commit Activity

```
GET /repos/{owner}/{repo}/stats/commit_activity
→ Returns: weekly commit counts for the last year (52 weeks)
   Used for: animated activity waveform inside project card

GET /repos/{owner}/{repo}/stats/contributors
→ Returns: contributor breakdown
   Used for: showing "solo project" vs "team project"

GET /repos/{owner}/{repo}/stats/code_frequency
→ Returns: weekly additions/deletions for entire history
   Used for: "lines written" counter animation
```

---

## PART 3 — THE SCORING ENGINE

Not all repos are equal. The scoring engine ranks them.

```
RELEVANCE SCORE FORMULA
═══════════════════════════════════════════════════════════════

score = (stars × 2.0)
      + (forks × 1.5)
      + (recentActivity × 1.8)   ← 1.0 if pushed < 30 days ago, else decay
      + (readmeQuality × 1.2)    ← score based on README completeness
      + (hasliveUrl × 5.0)       ← big bonus if it's deployed somewhere
      + (topicCount × 0.3)       ← more topic tags = more context
      + (hasDescription × 2.0)   ← required for good card rendering
      + (commitFrequency × 1.0)  ← avg commits/month last 6 months
      + (isPinned × 10.0)        ← if YOU pinned it, it's important

MINIMUM THRESHOLD: score ≥ 8.0 to appear in main grid
FEATURED (score ≥ 25): gets the largest card slot, appears first
ARCHIVED: always excluded regardless of score
FORK: excluded unless you've made >20 commits on top of it
```

The top 6 projects by score fill the Project Metaverse. The rest live in an "All Projects" expandable section below.

---

## PART 4 — AI ENRICHMENT LAYER

GitHub data is raw. The AI layer makes it presentable.

```
TRIGGER: When a repo enters the portfolio for the first time
         (never re-runs unless you manually invalidate cache)

INPUT → OUTPUT
═══════════════════════════════════════════════════════════════

INPUT:
  repo.name
  repo.description          (might be empty or too terse)
  repo.topics               (raw tag list)
  repo.primaryLanguage
  repo.languages            (all languages + percentage)
  README first 2000 chars

OUTPUT (Claude Haiku — fast + cheap for this task):
  {
    displayTitle:    "cleaner, more human-readable title",
    tagline:         "one powerful sentence describing the project",
    longDescription: "3 paragraph rich description for modal",
    category:        "ml-research | geoai | fullstack | tooling | research-tool",
    techStack:       ["Next.js", "PyTorch", "PostgreSQL"],  ← cleaned + normalized
    sceneType:       "globe | mesh | dag | waveform | pointcloud | crystal",
    primaryColor:    "#hex",     ← chosen to match project vibe
    accentColor:     "#hex",
    keyMetric: {
      label: "API Requests/day",
      value: "10k+"
    }
  }

PROMPT GIVEN TO HAIKU:
  "You are enriching metadata for a portfolio of an ML researcher and
   software engineer. Given this GitHub repository data, return ONLY
   a JSON object (no markdown) with these fields: [fields]. Choose
   sceneType from [options] based on what best visualizes this project.
   Choose colors that feel right for the domain — ML is violet, geo is
   teal, infrastructure is gold, frontend is cyan."
```

**This runs ONCE per new repo. Stored in Vercel KV. Never re-billed.**

---

## PART 5 — CACHING STRATEGY

```
CACHE LAYERS — INNERMOST TO OUTERMOST
═══════════════════════════════════════════════════════════════

LAYER 1 — Vercel KV (Redis)
  What: All GitHub API responses + AI enrichment results
  TTL:
    repo list:       6 hours   (new repos appear within 6h automatically)
    repo stats:      1 hour    (stars/forks update frequently)
    commit activity: 24 hours  (changes slowly)
    AI enrichment:   permanent (manual invalidation only)
    contribution:    12 hours
  Pattern: Stale-While-Revalidate
    → Serve stale cache immediately (fast response)
    → Refresh in background
    → Next request gets fresh data

LAYER 2 — Next.js Route Handler Cache
  fetch() calls inside Route Handlers use Next.js built-in caching
  revalidate: 3600 (1 hour) on each fetch
  GitHub's own CDN cache headers respected

LAYER 3 — React Query Client Cache
  On client, React Query keeps data in memory
  staleTime: 5 minutes (no re-fetch on remount within 5min)
  gcTime: 30 minutes
  This means navigating away and back = instant, no flicker

LAYER 4 — Vercel Edge Network
  Static responses cached at CDN edge globally
  Nearest edge serves portfolio visitors worldwide

TOTAL RESULT:
  Visitor in India: ~40ms response time for project data
  GitHub API: called maybe 240 times/day MAX (not per visitor)
  GitHub rate limit: 5,000 req/hour authenticated
  You use: ~40 req/hour max → 0.8% of rate limit
```

---

## PART 6 — REAL-TIME UPDATES (OPTIONAL)

For when you push a new repo and want it live immediately.

```
WEBHOOK FLOW
═══════════════════════════════════════════════════════════════

GitHub Webhook Settings:
  Payload URL: https://yourdomain.com/api/github/webhook
  Content type: application/json
  Secret: [random 32-char string]  ← stored as env var
  Events: ✓ Repositories  ✓ Push  ✓ Stars

What happens:
  1. You create/update a repo on GitHub
  2. GitHub POSTs to your webhook endpoint
  3. Your Route Handler:
     a. Verifies HMAC signature (security)
     b. Identifies event type
     c. Invalidates relevant KV cache keys
     d. Optionally: triggers Vercel redeploy via deploy hook
  4. Next visitor gets fresh data

Events and actions:
  created    → fetch new repo, run AI enrichment, add to cache
  starred    → update star count in cache (no re-enrichment)
  pushed     → update commit stats, last-pushed timestamp
  deleted    → remove from cache, remove from displayed list
  publicized → repo became public: trigger full enrichment
```

---

## PART 7 — WHAT RENDERS ON SCREEN

Once data flows in, here's exactly what each GitHub field maps to visually.

```
GITHUB DATA → VISUAL ELEMENT MAPPING
═══════════════════════════════════════════════════════════════

repo.displayTitle (AI-enriched)
  → Large card heading, Space Grotesk 700

repo.tagline (AI-enriched)
  → Subtitle under heading, 1 line max

repo.primaryColor (AI-enriched)
  → Card border glow color
  → 3D scene ambient light color
  → HUD label accent

repo.techStack (AI-enriched, normalized)
  → Floating tech chips at bottom of card
  → Also: orbiting spheres in project modal, one per technology

repo.sceneType (AI-enriched)
  → Which of the 5 mini 3D scenes renders inside the card:
    globe       → Earth with glowing data points (GeoAI projects)
    mesh        → Morphing cloth/mesh (ML/model projects)
    dag         → Directed acyclic graph (pipeline projects)
    waveform    → Oscilloscope line (real-time/audio/signal projects)
    pointcloud  → 3D point cloud terrain (satellite/spatial projects)
    crystal     → Icosahedron (research / academic)

repo.stargazers_count (live, from GitHub)
  → Animated counter in card: "⭐ 2,341"
  → Counts up from 0 on scroll-into-view

repo.commit_activity (weekly array, 52 weeks)
  → Rendered as an animated waveform at card bottom
  → Height of bars = commit count per week
  → Most recent weeks = full brightness, older = fade

repo.homepage (live URL)
  → "Live ↗" button in card
  → If empty: button is hidden (not grayed)

repo.html_url
  → "GitHub ↗" button — always present

repo.updated_at
  → "Last active: 3 days ago" badge
  → If > 6 months: "archived project" soft label

repo.languages (all languages + byte count)
  → Micro bar in card: colored segments = language proportions
  → Like GitHub's own language bar but in PLASMA CYAN palette
  → On hover: exact percentages in tooltip

README screenshots (parsed from README)
  → Shown in project modal carousel
  → First screenshot = card background blur (barely visible)

repo.contributionCalendar
  → NOT used per-card. Used in About section's global stats:
    "847 contributions last year" + mini calendar heatmap

repo.releases[0].tagName
  → Version badge: "v2.4.1" in top-right corner of card
  → If no releases: not shown

repo.open_issues_count
  → Shown in modal only: "12 open issues"
  → If 0: "No open issues ✓" in green

key_metric (AI-enriched)
  → The ONE bold stat in center of card
    e.g., "10k+ API calls/day" or "2.3k GitHub Stars"
  → Animated count-up on scroll
```

---

## PART 8 — MANUAL OVERRIDE SYSTEM

For when GitHub data isn't enough or is wrong.

```
OVERRIDE FILE: /data/project-overrides.ts
═══════════════════════════════════════════════════════════════

You maintain ONE TypeScript file. It's a dictionary keyed by repo name.

Any field here WINS over GitHub data + AI enrichment.

Structure:
  {
    "geoai-platform": {
      displayTitle: "GeoAI Platform",          ← override AI title
      tagline: "...",                           ← override tagline
      featured: true,                           ← force to top
      hidden: false,
      customMetric: {
        label: "Satellite images processed",
        value: "1.2M+"
      },
      architectureDiagram: {                    ← manual architecture diagram
        nodes: [...],
        edges: [...]
      },
      demoVideo: "https://...",                 ← add video to modal
      awards: ["Best GeoAI Tool 2024"],         ← add award badges
      order: 1                                  ← explicit position in grid
    },
    "secret-project": {
      hidden: true,                             ← exists on GitHub, hide here
    }
  }

MERGE PRIORITY (highest to lowest):
  1. project-overrides.ts    ← your manual control
  2. AI enrichment           ← Claude's interpretation
  3. GitHub API data         ← raw source of truth
  4. Defaults                ← fallback values
```

---

## PART 9 — THE "PORTFOLIO" TOPIC TAG SYSTEM

```
HOW YOU CONTROL WHICH REPOS APPEAR
═══════════════════════════════════════════════════════════════

On GitHub, each repo has "Topics" (like hashtags).

Your tagging convention:
  portfolio          → include this repo in portfolio
  portfolio-featured → include AND force to featured position
  portfolio-hidden   → explicitly exclude (even if public)

Additional topic tags you add that auto-inform the system:
  ml-research        → category: ML Research
  geoai              → category: GeoAI / Geospatial
  fullstack          → category: Full Stack
  open-source        → show "Open Source" badge
  production         → show "In Production" badge
  research           → connect to Research section

The site fetches:
  /users/{username}/repos?topic=portfolio&per_page=100

Result: total GitHub control. No CMS. No config files. No redeploy
needed to add a project — just tag the repo on GitHub.
```

---

## PART 10 — ENVIRONMENT VARIABLES

```
REQUIRED ENV VARS
═══════════════════════════════════════════════════════════════

GitHub:
  GITHUB_TOKEN              → Personal Access Token (Classic)
                              Scopes needed:
                                ✓ public_repo
                                ✓ read:user
                                ✓ repo (if you want traffic stats)
  GITHUB_USERNAME           → "sahilkumar"
  GITHUB_WEBHOOK_SECRET     → random string, same as GitHub webhook

Vercel KV (Redis):
  KV_REST_API_URL           → from Vercel dashboard
  KV_REST_API_TOKEN         → from Vercel dashboard

AI Enrichment:
  ANTHROPIC_API_KEY         → for Claude Haiku enrichment calls

All of these live in:
  .env.local                → local development (never committed)
  Vercel Dashboard → Settings → Environment Variables → Production

SECURITY RULES:
  • GITHUB_TOKEN is ONLY read in Route Handlers (server-side)
  • NEVER passed to client components
  • NEVER in NEXT_PUBLIC_ prefix
  • Rotate token every 90 days
  • Use fine-grained PAT (new GitHub PAT type) for least privilege
```

---

## PART 11 — FALLBACK + ERROR STATES

```
WHAT HAPPENS WHEN THINGS GO WRONG
═══════════════════════════════════════════════════════════════

SCENARIO 1: GitHub API is down
  → Serve from KV cache (even if stale)
  → If KV also empty: serve from /data/fallback-projects.ts
    (a static JSON you maintain as last resort)
  → User sees no error. Site loads. Stale data shown.

SCENARIO 2: Rate limit hit
  → Next.js middleware checks rate limit before calling GitHub
  → If near limit: serve cached data only, no fresh fetch
  → Rate limit resets every hour. Auto-recovers.

SCENARIO 3: AI enrichment fails for a repo
  → Repo still shows with un-enriched data
  → GitHub description used as tagline
  → Default sceneType: "mesh"
  → Default color: PLASMA CYAN
  → Flag stored in KV: "enrichment_failed: true"
  → Retry scheduled for next cache refresh

SCENARIO 4: README has no screenshots
  → Card shows the animated 3D scene only (no background image)
  → Actually looks better in most cases

SCENARIO 5: Repo has no description
  → Minimum viable card: title + language bar + stats only
  → No tagline shown (empty space better than "No description")
  → AI enrichment still runs and generates a description from code

SCENARIO 6: New repo appears, not yet enriched
  → Skeleton card renders immediately (animated loading state)
  → Enrichment runs server-side in background
  → On next page load: full card appears
  → Feels instant to next visitor
```

---

## PART 12 — DATA REFRESH SCHEDULE

```
AUTOMATED REFRESH CADENCE
═══════════════════════════════════════════════════════════════

Every 6 hours (Vercel Cron Jobs):
  → Fetch all `portfolio`-tagged repos
  → Compare to cached list
  → New repos: trigger AI enrichment
  → Removed topic: remove from cache
  → Update all star/fork counts
  → Update all commit activity arrays

Every 1 hour:
  → Update star counts only (high-churn data)
  → Update "last pushed" timestamps

Every 24 hours:
  → Rebuild full contribution calendar
  → Refresh language breakdowns
  → Update traffic stats (views, clones)

On webhook (immediate):
  → Targeted invalidation of specific repo
  → No full refresh needed

VERCEL CRON SYNTAX:
  /api/cron/refresh-projects  → runs every 6 hours
  /api/cron/refresh-stats     → runs every hour
  These are simple Route Handlers with a secret token
  to prevent unauthorized trigger.
```

---

## PART 13 — THE COMPLETE DATA PIPELINE

End to end, step by step, what happens when a new visitor opens your site:

```
VISITOR OPENS SITE
        │
        ▼
Next.js serves HTML shell + JS bundle (from CDN edge)
        │
        ▼
Client mounts. React Query fires: GET /api/github/projects
        │
        ▼
Route Handler receives request
        │
        ├─ Check KV cache: "projects:list" key
        │        │
        │   HIT  └──→ Return cached JSON immediately (~5ms)
        │
        │   MISS  ↓
        │
        ▼
GitHub GraphQL query fires (pinned repos + metadata)
        │
        ▼
GitHub REST calls fire (parallel, Promise.all):
  - Topics-filtered repo list
  - Per-repo language breakdown
  - Per-repo commit activity
  - Per-repo traffic stats
        │
        ▼
Scoring engine runs on server:
  - Calculate score for each repo
  - Sort by score
  - Slice to top 6 featured
  - Remaining go to "all projects" group
        │
        ▼
AI enrichment check (per repo):
  - Already enriched? Use stored enrichment
  - Not enriched? Fire Claude Haiku call (async, non-blocking)
  - Return un-enriched data immediately, enrichment fills in on reload
        │
        ▼
Merge: GitHub data + AI enrichment + manual overrides
        │
        ▼
Store full result in KV: TTL 6 hours
        │
        ▼
Return to client as clean ProjectData[] array
        │
        ▼
React Query stores in client cache (staleTime: 5min)
        │
        ▼
Project Metaverse renders:
  - Top 6 repos → featured project cities
  - Each city color = repo's primaryColor
  - Each city's 3D scene = repo's sceneType
  - Stats animate on scroll-into-view
  - Real star counts displayed
        │
        ▼
User hovers a project city:
  - Stats update (from already-loaded data, no new fetch)
  - Commit waveform animates
  - Language bar appears

User clicks a project city:
  - Modal opens (FLIP animation)
  - Architecture diagram loads (from override file or AI-generated)
  - Tech stack orbits (from AI-enriched techStack array)
  - README images load (lazy, from parsed README)
  - "View on GitHub" → html_url
  - "Live Demo" → homepage (if exists)
```

---

## PART 14 — SKILLS SECTION — SAME IDEA, DIFFERENT SOURCE

The Skills galaxy also auto-populates from GitHub.

```
LANGUAGE AGGREGATION
═══════════════════════════════════════════════════════════════

GitHub gives you language breakdown per repo.
Aggregate across ALL public repos:

  For each repo:
    Get languages → {Python: 48293 bytes, TypeScript: 22104 bytes, ...}

  Sum across all repos:
    Python:     2,847,293 bytes  (all your Python code ever written)
    TypeScript:   983,102 bytes
    JavaScript:   421,847 bytes
    etc.

  Normalize to percentages:
    Python:     52.3%
    TypeScript: 18.1%
    etc.

  Map to skill categories using a lookup table:
    Python       → ML / Backend (both)
    TypeScript   → Frontend
    Rust         → Systems
    SQL          → Databases

  This becomes the SIZE of stars in the skill galaxy.
  More bytes written = bigger star = higher proficiency implied.

LIMITATION + FIX:
  GitHub bytes ≠ actual skill level.
  You might have 1M bytes of Python tutorial code and be terrible.

  FIX: Keep a /data/skill-overrides.ts
    Manually set proficiency: 0–100 for each skill.
    GitHub data only contributes to the "years used" field.
    Your manual number drives the star size.
```

---

## PART 15 — GITHUB CONTRIBUTIONS → ABOUT SECTION

```
CONTRIBUTION CALENDAR RENDERING
═══════════════════════════════════════════════════════════════

GraphQL gives you 52 weeks × 7 days of contribution data.
Each day has: date, count, color.

Where this appears:
  About section → below the stats cards
  "847 contributions in 2024"

Visual: NOT the standard GitHub green grid.
Instead: a cosmic heat map.
  Low activity day   → tiny dim star
  Medium activity    → medium glowing star, CYAN tint
  High activity      → large bright star, PLASMA CYAN
  Max activity day   → star with glow ring (like a nova)

This heat map is rendered as a Three.js InstancedMesh:
  365 instances × 7 days
  Each instance position = calendar grid position
  Each instance scale = contribution count (normalized)
  Each instance color = contribution intensity

It looks like a star cluster that represents your work ethic.
Far more interesting than a green square grid.

ADDITIONAL STATS from contributions data:
  totalCommitContributions     → "1,247 commits"
  totalPullRequestContributions → "89 PRs merged"
  totalRepositoriesWithContributed → "23 repositories"
  longest streak               → calculated client-side from daily data
```

---

## SUMMARY — WHAT YOU NEVER DO MANUALLY

```
AUTOMATED (zero manual work):
═══════════════════════════════════════════════════════════════
  ✓ Project titles, descriptions, taglines    (AI-enriched)
  ✓ Tech stack extraction                     (AI-enriched)
  ✓ Project colors and scene types            (AI-enriched)
  ✓ Star, fork, watcher counts                (live GitHub)
  ✓ Commit activity waveforms                 (live GitHub)
  ✓ Language breakdown bars                   (live GitHub)
  ✓ Last-active timestamps                    (live GitHub)
  ✓ Live demo URLs                            (from repo homepage field)
  ✓ GitHub link                               (always auto)
  ✓ Contribution calendar heat map            (live GitHub)
  ✓ New project appearance                    (add topic tag, done)
  ✓ Cache management                          (automatic TTL)
  ✓ API rate limit management                 (automatic)

WHAT YOU DO MANUALLY (and ONLY this):
═══════════════════════════════════════════════════════════════
  → Tag repos with `portfolio` on GitHub            (30 seconds per repo)
  → Write a good README on repos you care about     (you should anyway)
  → Set `homepage` field on deployed repos           (30 seconds)
  → Run project-overrides.ts for hero stats          (optional)
  → Rotate GitHub token every 90 days                (security hygiene)
```

---

*Hand this document to Opus with:*
*"Implement every system described here. Use Next.js 14 App Router,*
*TypeScript strict, Vercel KV via @vercel/kv, React Query v5.*
*Route handlers in /app/api/. Follow the data flow exactly as described."*
