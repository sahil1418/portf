'use client';

import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { showcaseProjects } from '@/data/showcase-projects';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectModal from '@/components/projects/ProjectModal';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ProjectData } from '@/lib/types';

const projectFilters = [
  { value: 'all', label: 'All work' },
  { value: 'research', label: 'AI systems' },
  { value: 'product', label: 'Product builds' },
] as const;

type ProjectFilter = (typeof projectFilters)[number]['value'];

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('all');
  const { ref, isVisible } = useScrollAnimation();

  const visibleProjects = useMemo(() => {
    if (activeFilter === 'research') {
      return showcaseProjects.filter((project) => project.category === 'ml-research');
    }

    if (activeFilter === 'product') {
      return showcaseProjects.filter((project) => project.category === 'fullstack');
    }

    return showcaseProjects;
  }, [activeFilter]);

  return (
    <section className="projects-section" id="projects" ref={ref}>
      <div
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="projects-header">
          <div className="section-kicker">
            <span className="kicker-pulse" aria-hidden="true" />
            Selected systems
            <span className="kicker-count">
              {String(showcaseProjects.length).padStart(2, '0')} / {String(showcaseProjects.length).padStart(2, '0')}
            </span>
          </div>
          <h2 className="section-heading">PROJECT <span>WALL</span></h2>
          <p className="section-subtitle">
            Research systems and product builds, visualised as a live collection of the work behind the screen.
          </p>

          <div className="project-filter" role="tablist" aria-label="Filter showcased projects">
            {projectFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                role="tab"
                aria-selected={activeFilter === filter.value}
                className={activeFilter === filter.value ? 'filter-button active' : 'filter-button'}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="projects-grid" aria-live="polite">
          {visibleProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className={`project-cell project-cell--${index + 1}`}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              layout
            >
              <ProjectCard project={project} index={index} onClick={() => setSelectedProject(project)} />
            </motion.div>
          ))}
        </div>

        <div className="github-cta">
          <div className="cta-line" />
          <a
            href="https://github.com/sahil1418?tab=repositories"
            target="_blank"
            rel="noreferrer"
            className="github-link"
          >
            <span className="github-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.562 21.8 24 17.302 24 12 24 5.373 18.627 0 12 0Z" />
              </svg>
            </span>
            Explore every repository on GitHub
            <span className="arrow">&rarr;</span>
          </a>
          <div className="cta-line" />
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <style jsx>{`
        .projects-section {
          max-width: 1320px;
          margin: 0 auto;
          padding: var(--space-4xl) var(--space-md);
          scroll-margin-top: 84px;
        }

        .projects-header {
          margin-bottom: 2.25rem;
          text-align: center;
        }

        .section-kicker {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 6px 10px 6px 12px;
          border: 1px solid rgba(125, 255, 246, 0.14);
          border-radius: 999px;
          background: rgba(3, 12, 29, 0.5);
          color: var(--cyan-300);
          font-family: var(--font-mono);
          font-size: 0.64rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .kicker-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #67f8d4;
          box-shadow: 0 0 0 4px rgba(103, 248, 212, 0.1), 0 0 12px rgba(103, 248, 212, 0.8);
          animation: signal-pulse 2.4s ease-in-out infinite;
        }

        .kicker-count {
          padding-left: 8px;
          border-left: 1px solid rgba(255, 255, 255, 0.12);
          color: var(--text-tertiary);
        }

        .section-heading {
          margin: 0.85rem 0 1.1rem;
          font-size: clamp(2.15rem, 5vw, 3.7rem);
          letter-spacing: -0.045em;
        }

        .section-heading span {
          color: var(--cyan-400);
          text-shadow: 0 0 34px rgba(0, 240, 255, 0.25);
        }

        .section-heading::after {
          display: none;
        }

        .section-subtitle {
          max-width: 610px;
          margin: 0 auto 1.45rem;
          color: var(--text-secondary);
          font-family: var(--font-body);
          font-size: 1rem;
          line-height: 1.7;
        }

        .project-filter {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          background: rgba(8, 10, 29, 0.62);
          backdrop-filter: blur(12px);
        }

        .filter-button {
          appearance: none;
          border: 0;
          border-radius: 999px;
          padding: 8px 13px;
          background: transparent;
          color: var(--text-tertiary);
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: color 180ms ease, background 180ms ease, box-shadow 180ms ease;
        }

        .filter-button:hover,
        .filter-button:focus-visible {
          outline: none;
          color: var(--text-primary);
        }

        .filter-button.active {
          background: linear-gradient(135deg, var(--cyan-300), #72f4d6);
          box-shadow: 0 3px 15px rgba(0, 240, 255, 0.18);
          color: #021417;
        }

        .projects-grid {
          position: relative;
          isolation: isolate;
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          gap: 18px;
        }

        .projects-grid::before {
          content: '';
          position: absolute;
          inset: -18px;
          z-index: -1;
          border: 1px solid rgba(112, 223, 255, 0.06);
          border-radius: 28px;
          background:
            linear-gradient(rgba(116, 229, 255, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(116, 229, 255, 0.025) 1px, transparent 1px),
            radial-gradient(circle at 50% 0%, rgba(0, 240, 255, 0.075), transparent 48%);
          background-size: 34px 34px, 34px 34px, auto;
          pointer-events: none;
        }

        :global(.project-cell) {
          min-width: 0;
          grid-column: span 6;
        }

        :global(.project-cell--1),
        :global(.project-cell--4) {
          grid-column: span 7;
        }

        :global(.project-cell--2),
        :global(.project-cell--3) {
          grid-column: span 5;
        }

        .github-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          margin-top: 3rem;
        }

        .cta-line {
          flex: 1;
          max-width: 120px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        }

        .github-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 28px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50px;
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(8px);
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 0.85rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .github-link:hover {
          transform: translateY(-2px);
          border-color: rgba(0, 240, 255, 0.2);
          background: rgba(0, 240, 255, 0.04);
          box-shadow: 0 4px 20px rgba(0, 240, 255, 0.1);
          color: var(--cyan-400);
        }

        .github-icon {
          display: flex;
          align-items: center;
        }

        .arrow {
          transition: transform 0.3s ease;
        }

        .github-link:hover .arrow {
          transform: translateX(4px);
        }

        @keyframes signal-pulse {
          0%, 100% { transform: scale(0.88); opacity: 0.75; }
          50% { transform: scale(1); opacity: 1; }
        }

        @media (max-width: 820px) {
          .projects-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          :global(.project-cell),
          :global(.project-cell--1),
          :global(.project-cell--2),
          :global(.project-cell--3),
          :global(.project-cell--4) {
            grid-column: auto;
          }

          .projects-grid::before {
            inset: -10px;
            border-radius: 20px;
          }

          .github-cta {
            gap: 10px;
          }

          .cta-line {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .projects-section {
            padding-inline: 0.85rem;
          }

          .section-kicker {
            font-size: 0.58rem;
          }

          .project-filter {
            width: 100%;
          }

          .filter-button {
            flex: 1;
            padding-inline: 7px;
            font-size: 0.61rem;
          }

          .github-link {
            padding-inline: 18px;
            font-size: 0.72rem;
          }
        }
      `}</style>
    </section>
  );
}
