import type { ContributionDay, GitHubStats } from '@/lib/types';

function getLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

function generateContributionCalendar(): ContributionDay[] {
  const startDate = new Date('2023-12-03');
  const days: { date: string; count: number; dayOfWeek: number; i: number }[] =
    [];

  for (let i = 0; i < 365; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay();

    days.push({ date: dateStr, count: 0, dayOfWeek, i });
  }

  // 1. Current streak: indices 342 to 364 (23 days ending on 2024-12-01)
  days[341].count = 0;
  for (let i = 342; i <= 364; i++) {
    const dow = days[i].dayOfWeek;
    days[i].count = dow === 0 || dow === 6 ? 1 : 4 + (i % 5);
  }

  // 2. Longest streak: indices 120 to 186 (67 days)
  days[119].count = 0;
  days[187].count = 0;
  for (let i = 120; i <= 186; i++) {
    const dow = days[i].dayOfWeek;
    days[i].count = dow === 0 || dow === 6 ? 2 : 5 + (i % 6);
  }

  // 3. Fill other regions with periodic zero breaks to prevent streaks > 67
  for (let i = 0; i < 365; i++) {
    if (i >= 119 && i <= 187) continue;
    if (i >= 341) continue;

    if (i % 11 === 0) {
      days[i].count = 0;
    } else {
      const dow = days[i].dayOfWeek;
      if (dow === 0 || dow === 6) {
        days[i].count = i % 3 === 0 ? 1 : 0;
      } else {
        const weekIndex = Math.floor(i / 7);
        if (weekIndex % 4 === 0) {
          days[i].count = 1 + (i % 3);
        } else {
          days[i].count = 4 + (i % 7);
        }
      }
    }
  }

  // Adjust total sum to match exactly 1847 contributions
  let total = days.reduce((acc, d) => acc + d.count, 0);
  let diff = 1847 - total;
  let ptr = 0;
  while (diff !== 0) {
    const i = ptr % 365;
    const dow = days[i].dayOfWeek;
    const isBreak =
      i === 119 ||
      i === 187 ||
      i === 341 ||
      (i < 119 && i % 11 === 0) ||
      (i > 187 && i < 341 && i % 11 === 0);

    if (!isBreak) {
      if (diff > 0) {
        if (dow !== 0 && dow !== 6) {
          days[i].count += 1;
          diff -= 1;
        }
      } else if (diff < 0) {
        if (days[i].count > 1) {
          days[i].count -= 1;
          diff += 1;
        }
      }
    }
    ptr += 7;
  }

  return days.map((d) => ({
    date: d.date,
    count: d.count,
    level: getLevel(d.count),
  }));
}

export const mockStats: GitHubStats = {
  totalCommits: 2847,
  totalPRs: 156,
  totalRepos: 42,
  longestStreak: 67,
  currentStreak: 23,
  totalContributions: 1847,
  contributionCalendar: generateContributionCalendar(),
};
