import { NextResponse } from 'next/server';
import { fetchUserRepos, fetchRepoLanguages, fetchRepoCommitActivity } from '@/lib/github';
import { transformRepoToProject } from '@/lib/transformers';

const GITHUB_USERNAME = 'sahil1418';

export async function GET() {
  try {
    const repos = await fetchUserRepos(GITHUB_USERNAME);
    
    // Filter out forks, sort by score-worthy metrics
    const ownRepos = repos
      .filter(r => !r.fork)
      .sort((a, b) => (b.stargazersCount + b.size/100) - (a.stargazersCount + a.size/100));

    // Fetch languages and commit activity for top repos (limit to avoid rate limiting)
    const projects = await Promise.all(
      ownRepos.slice(0, 12).map(async (repo) => {
        const [languages, commitActivity] = await Promise.all([
          fetchRepoLanguages(GITHUB_USERNAME, repo.name).catch(() => ({})),
          fetchRepoCommitActivity(GITHUB_USERNAME, repo.name).catch(() => []),
        ]);
        return transformRepoToProject(repo, languages, commitActivity);
      })
    );

    return NextResponse.json(projects, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
