'use client';

import type { CSSProperties } from 'react';
import { mockSkills } from '@/data/mock-skills';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const categoryMeta: Record<string, { title: string; color: string }> = {
  languages: { title: 'Languages', color: '#22d3ee' },
  fundamentals: { title: 'Foundations', color: '#f59e0b' },
  frameworks: { title: 'Frameworks & tools', color: '#34d399' },
  'ai-ml': { title: 'AI / ML', color: '#a855f7' },
};

const categoryOrder = ['languages', 'fundamentals', 'frameworks', 'ai-ml'];

export default function SkillsSection() {
  const { ref, isVisible } = useScrollAnimation();

  const skillGroups = categoryOrder
    .map((category) => ({
      category,
      skills: mockSkills.filter((skill) => skill.category === category),
      meta: categoryMeta[category],
    }))
    .filter((group) => group.skills.length > 0 && group.meta);

  return (
    <section className="skills-section" id="skills" ref={ref}>
      <div className={isVisible ? 'skills-content visible' : 'skills-content'}>
        <header className="skills-header">
          <p className="section-kicker">Technical toolkit</p>
          <h2 className="section-heading">TECH <span>STACK</span></h2>
          <p className="section-subtitle">The technologies I use across research, systems, and product development.</p>
        </header>

        <div className="skills-list" aria-label="Technical skills">
          {skillGroups.map((group) => (
            <article
              key={group.category}
              className="skill-group"
              style={{ '--group-color': group.meta.color } as CSSProperties}
            >
              <h3><span aria-hidden="true" />{group.meta.title}</h3>
              <div className="skill-chips">
                {group.skills.map((skill) => (
                  <span key={skill.name} className="skill-chip">{skill.name}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .skills-section {
          max-width: 1080px;
          margin: 0 auto;
          padding: var(--space-4xl) var(--space-md);
          scroll-margin-top: 84px;
        }

        .skills-content {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s var(--ease-out-expo), transform 0.7s var(--ease-out-expo);
        }

        .skills-content.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .skills-header {
          max-width: 620px;
          margin: 0 auto 2rem;
          text-align: center;
        }

        .section-kicker {
          margin: 0;
          color: var(--cyan-300);
          font-family: var(--font-mono);
          font-size: 0.64rem;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .section-heading {
          margin: 0.65rem 0 0.85rem;
          color: var(--text-primary);
          font-family: var(--font-heading);
          font-size: clamp(2.05rem, 5vw, 3.4rem);
          letter-spacing: -0.04em;
          text-align: center;
        }

        .section-heading span {
          color: var(--cyan-400);
          text-shadow: 0 0 30px rgba(0, 240, 255, 0.22);
        }

        .section-heading::after {
          display: none;
        }

        .section-subtitle {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.94rem;
          line-height: 1.7;
        }

        .skills-list {
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          background: rgba(9, 11, 32, 0.48);
          backdrop-filter: blur(12px);
        }

        .skill-group {
          display: grid;
          grid-template-columns: 190px minmax(0, 1fr);
          gap: 24px;
          align-items: center;
          padding: 19px 22px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          transition: background 180ms ease;
        }

        .skill-group:last-child {
          border-bottom: 0;
        }

        .skill-group:hover {
          background: color-mix(in srgb, var(--group-color) 6%, transparent);
        }

        h3 {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: 0;
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        h3 span {
          width: 7px;
          height: 7px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: var(--group-color);
          box-shadow: 0 0 12px color-mix(in srgb, var(--group-color) 65%, transparent);
        }

        .skill-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .skill-chip {
          display: inline-flex;
          align-items: center;
          min-height: 30px;
          padding: 4px 10px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.035);
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 0.67rem;
          transition: border-color 160ms ease, color 160ms ease, background 160ms ease;
        }

        .skill-chip:hover {
          border-color: color-mix(in srgb, var(--group-color) 46%, transparent);
          background: color-mix(in srgb, var(--group-color) 11%, transparent);
          color: var(--text-primary);
        }

        @media (max-width: 680px) {
          .skill-group {
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 17px;
          }
        }

        @media (max-width: 480px) {
          .skills-section {
            padding-inline: 0.85rem;
          }

          .skills-list {
            border-radius: 14px;
          }

          .skill-chip {
            font-size: 0.63rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .skills-content,
          .skill-group {
            transform: none;
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
