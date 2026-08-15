'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface CommitWaveformProps {
  data: number[];
  className?: string;
  color?: string;
}

export default function CommitWaveform({
  data,
  className = '',
  color = 'var(--cyan-500)',
}: CommitWaveformProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

  if (!data || data.length === 0) return null;

  const max = Math.max(...data, 1);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '1px',
        height: '24px',
        width: '100%',
      }}
    >
      {data.map((value, i) => {
        const height = (value / max) * 100;
        const recency = i / data.length; // 0 = oldest, 1 = newest
        const opacity = 0.15 + recency * 0.85;

        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: isVisible ? `${Math.max(height, 4)}%` : '4%',
              minHeight: '1px',
              background: color,
              opacity,
              borderRadius: '1px 1px 0 0',
              transition: `height 0.6s var(--ease-out-expo)`,
              transitionDelay: `${i * 15}ms`,
            }}
          />
        );
      })}
    </div>
  );
}
