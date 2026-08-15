'use client';

import { LanguageBreakdown } from '@/lib/types';
import { useState } from 'react';

interface LanguageBarProps {
  languages: LanguageBreakdown[];
  className?: string;
}

// GitHub-style language colors
const languageColors: Record<string, string> = {
  Python: '#3572A5',
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Rust: '#DEA584',
  Go: '#00ADD8',
  Java: '#B07219',
  'C++': '#F34B7D',
  C: '#555555',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  PHP: '#4F5D95',
  Shell: '#89E051',
  HTML: '#E34C26',
  CSS: '#563D7C',
  SCSS: '#C6538C',
  SQL: '#E38C00',
  R: '#198CE7',
  Jupyter: '#DA5B0B',
  CUDA: '#3A4E3A',
  Dockerfile: '#384D54',
  Makefile: '#427819',
};

export default function LanguageBar({ languages, className = '' }: LanguageBarProps) {
  const [hoveredLang, setHoveredLang] = useState<string | null>(null);

  if (!languages || languages.length === 0) return null;

  return (
    <div className={className} style={{ position: 'relative' }}>
      {/* Bar */}
      <div
        style={{
          display: 'flex',
          height: '4px',
          borderRadius: '9999px',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.05)',
          gap: '1px',
        }}
      >
        {languages.map((lang) => (
          <div
            key={lang.name}
            onMouseEnter={() => setHoveredLang(lang.name)}
            onMouseLeave={() => setHoveredLang(null)}
            style={{
              width: `${lang.percentage}%`,
              minWidth: lang.percentage > 1 ? '3px' : '1px',
              background: lang.color || languageColors[lang.name] || '#8b8b8b',
              transition: 'opacity 150ms ease, transform 150ms ease',
              opacity: hoveredLang && hoveredLang !== lang.name ? 0.4 : 1,
              transform: hoveredLang === lang.name ? 'scaleY(1.5)' : 'scaleY(1)',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* Tooltip */}
      {hoveredLang && (
        <div
          style={{
            position: 'absolute',
            top: '-32px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(10, 10, 46, 0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            backdropFilter: 'blur(8px)',
            zIndex: 10,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background:
                languages.find((l) => l.name === hoveredLang)?.color ||
                languageColors[hoveredLang] ||
                '#8b8b8b',
              marginRight: '5px',
            }}
          />
          {hoveredLang}{' '}
          {languages.find((l) => l.name === hoveredLang)?.percentage.toFixed(1)}%
        </div>
      )}

      {/* Legend (small, below bar) */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginTop: '8px',
        }}
      >
        {languages.slice(0, 4).map((lang) => (
          <div
            key={lang.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.65rem',
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: lang.color || languageColors[lang.name] || '#8b8b8b',
              }}
            />
            {lang.name}
          </div>
        ))}
      </div>
    </div>
  );
}
