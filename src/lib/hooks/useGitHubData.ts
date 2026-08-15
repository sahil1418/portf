'use client';

import { useState, useEffect } from 'react';
import { ProjectData, GitHubStats } from '@/lib/types';

interface UseGitHubDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useGitHubProjects(): UseGitHubDataReturn<ProjectData[]> {
  const [data, setData] = useState<ProjectData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/github/projects')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useGitHubStats(): UseGitHubDataReturn<GitHubStats> {
  const [data, setData] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/github/stats')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
