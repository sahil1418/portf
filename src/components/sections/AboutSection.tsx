'use client';

import { mockStats } from '@/data/mock-stats';
import { useGitHubStats } from '@/lib/hooks/useGitHubData';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function AboutSection() {
  const { ref, isVisible } = useScrollAnimation();
  const { data: liveStats } = useGitHubStats();
  const stats = liveStats || mockStats;

  const statEntries = [
    { label: 'Commits', value: stats.totalCommits },
    { label: 'PRs merged', value: stats.totalPRs },
    { label: 'Repositories', value: stats.totalRepos },
    { label: 'Longest streak', value: stats.longestStreak },
  ];

  return (
    <section className="about-section" id="about" ref={ref}>
      <div className={isVisible ? 'about-content visible' : 'about-content'}>
        <header className="about-header">
          <p className="section-kicker">A little about me</p>
          <h2 className="section-heading">ABOUT</h2>
        </header>

        <div className="about-grid">
          <div className="bio-col">
            <div className="intro-card">
              <span className="intro-label">IIIT Allahabad / ECE</span>
              <p>
                I am a final-year B.Tech student focused on turning strong computer science fundamentals into useful software and applied AI systems.
              </p>
            </div>

            <div className="about-highlights">
              <article className="highlight-item">
                <span className="highlight-label">Problem solving</span>
                <p>I actively practice data structures and algorithms, competitive programming, core CS subjects, and system design.</p>
              </article>
              <article className="highlight-item">
                <span className="highlight-label">ML challenge</span>
                <p>I was a National Finalist in the Hero Campus ML Challenge, placing in the top 24 among more than 200,000 participants. My team also ranked in the Top 5 of the Engineering Track.</p>
              </article>
              <article className="highlight-item">
                <span className="highlight-label">Research</span>
                <p>My research on physics-constrained soil moisture downscaling led to a first-author paper at IEEE MIGARS 2026.</p>
              </article>
              <article className="highlight-item">
                <span className="highlight-label">Projects</span>
                <p>Alongside research, I build practical products such as CivicLoop and AI projects for vehicle damage detection and recommendation systems.</p>
              </article>
            </div>
          </div>

          <div className="stats-col" aria-label="GitHub activity statistics">
            <p className="stats-label">Building in public</p>
            <div className="stats-grid">
              {statEntries.map((stat) => (
                <div className="stat-card" key={stat.label}>
                  <div className="stat-value"><AnimatedCounter target={stat.value} /></div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .about-section {
          max-width: 1120px;
          margin: 0 auto;
          padding: var(--space-4xl) var(--space-md);
          scroll-margin-top: 84px;
        }

        .about-content {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s var(--ease-out-expo), transform 0.7s var(--ease-out-expo);
        }

        .about-content.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .about-header {
          margin-bottom: 2.35rem;
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
          margin: 0.65rem 0 0;
          color: var(--text-primary);
          font-family: var(--font-heading);
          font-size: clamp(2.05rem, 5vw, 3.4rem);
          letter-spacing: -0.04em;
          text-align: center;
        }

        .section-heading::after {
          display: none;
        }

        .about-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) minmax(360px, 0.88fr);
          gap: clamp(2rem, 6vw, 5rem);
          align-items: center;
        }

        .bio-col {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .intro-card {
          padding: 20px 21px;
          border: 1px solid rgba(0, 240, 255, 0.14);
          border-radius: 15px;
          background: linear-gradient(120deg, rgba(0, 240, 255, 0.07), rgba(12, 14, 40, 0.5) 54%);
        }

        .intro-label,
        .highlight-label {
          display: block;
          color: var(--cyan-300);
          font-family: var(--font-mono);
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .intro-card p {
          margin: 7px 0 0;
          color: var(--text-primary);
          font-size: clamp(1.05rem, 1.75vw, 1.2rem);
          font-weight: 500;
          line-height: 1.6;
        }

        .about-highlights {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
        }

        .highlight-item {
          min-height: 132px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.024);
          transition: border-color 180ms ease, background 180ms ease, transform 180ms ease;
        }

        .highlight-item:hover {
          transform: translateY(-2px);
          border-color: rgba(0, 240, 255, 0.2);
          background: rgba(0, 240, 255, 0.035);
        }

        .highlight-item p {
          margin: 7px 0 0;
          color: var(--text-secondary);
          font-size: 0.88rem;
          line-height: 1.58;
        }

        .stats-col {
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          background: rgba(10, 12, 37, 0.42);
          backdrop-filter: blur(12px);
        }

        .stats-label {
          margin: 0 0 14px;
          color: var(--text-tertiary);
          font-family: var(--font-mono);
          font-size: 0.64rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
        }

        .stat-card {
          min-height: 116px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.025);
          transition: border-color 180ms ease, background 180ms ease, transform 180ms ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          border-color: rgba(0, 240, 255, 0.28);
          background: rgba(0, 240, 255, 0.04);
        }

        .stat-value {
          color: var(--text-primary);
          font-family: var(--font-heading);
          font-size: clamp(1.75rem, 3vw, 2.3rem);
          font-weight: 700;
          line-height: 1;
        }

        .stat-label {
          margin-top: 9px;
          color: var(--text-tertiary);
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        @media (max-width: 800px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        @media (max-width: 480px) {
          .about-section {
            padding-inline: 0.85rem;
          }

          .stats-col {
            padding: 14px;
          }

          .stat-card {
            min-height: 100px;
            padding: 13px;
          }

          .about-highlights {
            grid-template-columns: 1fr;
          }

          .highlight-item {
            min-height: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .about-content,
          .stat-card,
          .stat-card:hover {
            transform: none;
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
