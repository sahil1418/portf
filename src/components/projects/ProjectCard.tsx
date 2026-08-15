'use client';

import React, { useMemo, useState } from 'react';
import { ProjectData } from '@/lib/types';
import SceneRenderer from '@/components/scenes/SceneRenderer';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import LanguageBar from '@/components/ui/LanguageBar';
import CommitWaveform from '@/components/ui/CommitWaveform';

interface ProjectCardProps {
  project: ProjectData;
  index: number;
  onClick: () => void;
}

export default function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const timeAgo = useMemo(() => {
    if (!project.lastUpdated) return 'Unknown';

    const diffTime = Math.abs(new Date().getTime() - new Date(project.lastUpdated).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    }

    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  }, [project.lastUpdated]);

  const visibleTech = project.techStack?.slice(0, 4) || [];
  const extraTech = (project.techStack?.length || 0) - 4;
  const categoryLabel = project.category.replace(/-/g, ' ');

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    card.style.setProperty('--pointer-x', `${x * 100}%`);
    card.style.setProperty('--pointer-y', `${y * 100}%`);
    card.style.setProperty('--tilt-x', `${(x - 0.5) * 4}deg`);
    card.style.setProperty('--tilt-y', `${(0.5 - y) * 4}deg`);
  };

  const resetCardPosition = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsHovered(false);
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
    event.currentTarget.style.setProperty('--pointer-x', '50%');
    event.currentTarget.style.setProperty('--pointer-y', '50%');
  };

  return (
    <div
      className={`project-card ${index === 0 ? 'project-card--lead' : ''}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetCardPosition}
      role="article"
      aria-label={project.displayTitle}
      style={{ '--card-color': project.primaryColor } as React.CSSProperties}
    >
      <div className="scene-container">
        <div className="scene-grid" aria-hidden="true" />
        <div className="scene-orb" aria-hidden="true" />
        <div className="scene-meta" aria-hidden="true">
          <span>NODE / {String(index + 1).padStart(2, '0')}</span>
          <span>LIVE VISUAL</span>
        </div>
        <SceneRenderer sceneType={project.sceneType} color={project.primaryColor} active={isHovered} />
        {project.version && <div className="version-badge">{project.version}</div>}
      </div>

      <div className="content-container">
        <div className="header">
          <div className="title-row">
            <h3 className="title">{project.displayTitle}</h3>
            <span className="project-kind">{categoryLabel}</span>
          </div>
          <p className="tagline">{project.tagline}</p>
        </div>

        {project.keyMetric && (
          <div className="key-metric">
            <div className="metric-value">{project.keyMetric.value}</div>
            <div className="metric-label">{project.keyMetric.label}</div>
          </div>
        )}

        <div className="tech-stack">
          {visibleTech.map((tech) => (
            <span key={tech} className="tech-chip" title={tech}>{tech}</span>
          ))}
          {extraTech > 0 && <span className="tech-chip extra">+{extraTech}</span>}
        </div>

        {project.languages && (
          <div className="languages">
            <LanguageBar languages={project.languages} />
          </div>
        )}

        {project.commitActivity && (
          <div className="commits">
            <CommitWaveform data={project.commitActivity} color={project.primaryColor} />
          </div>
        )}

        <div className="bottom-row">
          {(project.stars || 0) > 0 && (
            <div className="stars">
              <span aria-hidden="true">*</span> <AnimatedCounter target={project.stars || 0} />
            </div>
          )}
          <button
            type="button"
            className="case-study"
            onClick={(event) => {
              event.stopPropagation();
              onClick();
            }}
          >
            View case study <span>&rarr;</span>
          </button>
          <div className="actions">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" onClick={(event) => event.stopPropagation()}>
                Live <span aria-hidden="true">&#8599;</span>
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" onClick={(event) => event.stopPropagation()}>
                GitHub <span aria-hidden="true">&#8599;</span>
              </a>
            )}
          </div>
        </div>

        <div className="activity-badge">Last active {timeAgo} ago</div>
      </div>

      <style jsx>{`
        .project-card {
          --pointer-x: 50%;
          --pointer-y: 50%;
          --tilt-x: 0deg;
          --tilt-y: 0deg;
          position: relative;
          isolation: isolate;
          display: flex;
          flex-direction: column;
          min-height: 470px;
          height: 100%;
          overflow: hidden;
          border: 1px solid rgba(226, 247, 255, 0.1);
          border-radius: 20px;
          background: linear-gradient(145deg, rgba(17, 22, 49, 0.92), rgba(5, 8, 27, 0.9));
          backdrop-filter: blur(18px);
          cursor: pointer;
          outline: none;
          transform-style: preserve-3d;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease, box-shadow 0.35s ease;
        }

        .project-card::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: -1;
          opacity: 0;
          background: radial-gradient(circle at var(--pointer-x) var(--pointer-y), color-mix(in srgb, var(--card-color) 24%, transparent), transparent 42%);
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .project-card::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 3;
          opacity: 0.15;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 50%, transparent 50%);
          background-size: 100% 5px;
          mix-blend-mode: overlay;
          pointer-events: none;
        }

        .project-card:hover,
        .project-card:focus-visible {
          transform: perspective(1100px) rotateX(var(--tilt-y)) rotateY(var(--tilt-x)) translateY(-8px);
          border-color: color-mix(in srgb, var(--card-color) 54%, rgba(255,255,255,0.14));
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--card-color) 11%, transparent), 0 18px 50px rgba(0,0,0,0.34), 0 0 38px color-mix(in srgb, var(--card-color) 19%, transparent);
        }

        .project-card:hover::before,
        .project-card:focus-visible::before {
          opacity: 1;
        }

        .scene-container {
          position: relative;
          height: 214px;
          overflow: hidden;
          border-bottom: 1px solid color-mix(in srgb, var(--card-color) 18%, rgba(255,255,255,0.05));
          border-radius: 19px 19px 0 0;
          background: radial-gradient(ellipse at center, color-mix(in srgb, var(--card-color) 15%, #0a1027), #060916 76%);
        }

        .project-card--lead .scene-container {
          height: 238px;
        }

        .scene-grid {
          position: absolute;
          inset: 0;
          opacity: 0.48;
          background-image: linear-gradient(color-mix(in srgb, var(--card-color) 16%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--card-color) 16%, transparent) 1px, transparent 1px);
          background-size: 24px 24px;
          mask-image: linear-gradient(to bottom, transparent, black 58%, transparent);
          pointer-events: none;
        }

        .scene-orb {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 220px;
          aspect-ratio: 1;
          border-radius: 50%;
          background: radial-gradient(circle, color-mix(in srgb, var(--card-color) 15%, transparent), transparent 66%);
          filter: blur(4px);
          pointer-events: none;
          transform: translate(-50%, -50%);
          animation: orb-breathe 5s ease-in-out infinite;
        }

        .scene-meta {
          position: absolute;
          z-index: 2;
          inset: 12px 14px auto;
          display: flex;
          justify-content: space-between;
          color: color-mix(in srgb, var(--card-color) 70%, white);
          font-family: var(--font-mono);
          font-size: 0.58rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          pointer-events: none;
          text-shadow: 0 0 12px color-mix(in srgb, var(--card-color) 60%, transparent);
        }

        .version-badge {
          position: absolute;
          z-index: 2;
          top: 34px;
          right: 12px;
          padding: 4px 8px;
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 999px;
          background: rgba(3, 9, 25, 0.56);
          backdrop-filter: blur(8px);
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 0.65rem;
        }

        .content-container {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 16px;
          padding: 19px 20px 18px;
        }

        .header {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .title {
          margin: 0;
          color: var(--text-primary);
          font-family: var(--font-heading);
          font-size: clamp(1.08rem, 2vw, 1.27rem);
          font-weight: 700;
          line-height: 1.2;
        }

        .project-kind {
          flex: 0 0 auto;
          max-width: 42%;
          overflow: hidden;
          color: var(--text-tertiary);
          font-family: var(--font-mono);
          font-size: 0.56rem;
          letter-spacing: 0.1em;
          line-height: 1.4;
          text-align: right;
          text-overflow: ellipsis;
          text-transform: uppercase;
        }

        .tagline {
          overflow: hidden;
          margin: 0;
          color: var(--text-secondary);
          font-family: var(--font-body);
          font-size: 0.88rem;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .key-metric {
          display: flex;
          flex-direction: column;
        }

        .metric-value {
          display: flex;
          align-items: baseline;
          color: var(--card-color);
          font-size: 1.45rem;
          font-weight: 700;
          line-height: 1.15;
          text-shadow: 0 0 20px color-mix(in srgb, var(--card-color) 22%, transparent);
        }

        .metric-label {
          margin-top: 3px;
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 0.67rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .tech-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .tech-chip {
          padding: 4px 8px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.035);
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 0.64rem;
          white-space: nowrap;
        }

        .tech-chip.extra {
          background: rgba(255, 255, 255, 0.02);
        }

        .languages,
        .commits {
          width: 100%;
        }

        .bottom-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }

        .stars {
          display: flex;
          align-items: center;
          gap: 5px;
          color: var(--text-primary);
          font-size: 0.82rem;
          font-weight: 500;
        }

        .stars span {
          color: var(--gold-400);
          font-size: 0.74rem;
        }

        .case-study {
          margin-right: auto;
          padding: 0;
          border: 0;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 0.64rem;
          white-space: nowrap;
        }

        .case-study:focus-visible {
          outline: 1px solid var(--card-color);
          outline-offset: 4px;
        }

        .case-study span {
          display: inline-block;
          color: var(--card-color);
          transition: transform 180ms ease;
        }

        .project-card:hover .case-study span {
          transform: translateX(4px);
        }

        .actions {
          display: flex;
          gap: 6px;
        }

        .btn-ghost {
          padding: 4px 8px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          background: transparent;
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 0.62rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-ghost:hover {
          border-color: color-mix(in srgb, var(--card-color) 36%, transparent);
          background: color-mix(in srgb, var(--card-color) 12%, transparent);
          color: var(--text-primary);
        }

        .activity-badge {
          margin-top: 2px;
          color: var(--text-tertiary);
          font-family: var(--font-mono);
          font-size: 0.64rem;
          letter-spacing: 0.02em;
          text-align: center;
        }

        @keyframes orb-breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(0.92); opacity: 0.62; }
          50% { transform: translate(-50%, -50%) scale(1.08); opacity: 1; }
        }

        @media (max-width: 560px) {
          .project-card,
          .project-card--lead {
            min-height: 0;
          }

          .scene-container,
          .project-card--lead .scene-container {
            height: 205px;
          }

          .content-container {
            gap: 14px;
            padding: 17px;
          }

          .bottom-row {
            flex-wrap: wrap;
          }

          .actions {
            margin-left: auto;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .project-card,
          .project-card:hover,
          .project-card:focus-visible {
            transform: none;
          }

          .scene-orb {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
