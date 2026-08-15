'use client';

import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  glowColor?: string;
  hoverable?: boolean;
  padding?: string;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  glowColor,
  hoverable = true,
  padding = 'var(--space-lg)',
  borderRadius = 'var(--radius-lg)',
  className = '',
  style = {},
  onClick,
}: GlassCardProps) {
  const hoverStyles = hoverable
    ? `
      .glass-card:hover {
        border-color: var(--glass-border-hover);
        transform: translateY(-4px);
        box-shadow: ${
          glowColor
            ? `0 0 30px ${glowColor}25, 0 8px 32px rgba(0,0,0,0.3)`
            : '0 8px 32px rgba(0,0,0,0.3)'
        };
      }
    `
    : '';

  return (
    <>
      <style jsx>{`
        .glass-card {
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--glass-border);
          transition: all var(--transition-base);
          cursor: ${onClick ? 'pointer' : 'default'};
        }
        ${hoverStyles}
      `}</style>
      <div
        className={`glass-card ${className}`}
        style={{
          padding,
          borderRadius,
          ...style,
        }}
        onClick={onClick}
      >
        {children}
      </div>
    </>
  );
}
