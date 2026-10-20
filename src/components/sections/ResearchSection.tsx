'use client';

import type { CSSProperties, PointerEvent } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface Publication {
  id: string;
  venue: string;
  year: string;
  badge: string;
  title: string;
  subtitle: string;
  summary: string;
  metrics: { value: string; label: string }[];
  links?: { href: string; label: string }[];
  color: string;
  glyph: 'hypergraph' | 'downscale';
}

const publications: Publication[] = [
  {
    id: 'hypercp',
    venue: 'IEEE ICDM',
    year: '2026',
    badge: 'CORE A* · Co-author',
    title: 'HyperCP',
    subtitle: 'Hyperedge-aware conformal prediction for supply-chain forecasting',
    summary:
      'A hypergraph-based conformal prediction framework for group-level supply-chain demand forecasting, giving calibrated, distribution-free uncertainty instead of bare point estimates.',
    metrics: [
      { value: '0.980', label: 'Coverage vs 0.90 target' },
      { value: '7 / 7', label: 'Baselines outperformed' },
    ],
    color: '#a855f7',
    glyph: 'hypergraph',
  },
  {
    id: 'smap',
    venue: 'IEEE MIGARS',
    year: '2026',
    badge: 'First author · Published',
    title: 'Physics-Constrained Stacking Ensemble',
    subtitle: 'Downscaling NASA SMAP soil moisture, 9 km → 10 m',
    summary:
      'A 4-model stacking ensemble (RF, XGBoost, MLP, physics-constrained transformer) with a Ridge meta-learner, validated with spatial-block holdout across 26,070 samples from 500 stations.',
    metrics: [
      { value: '0.0245', label: 'RMSE (m³/m³)' },
      { value: '39%', label: 'Below SMAP mission target' },
    ],
    links: [
      { href: 'https://doi.org/10.1109/MIGARS72065.2026.11689297', label: 'Read paper (DOI)' },
      { href: 'https://github.com/sahil1418/Global_SSM', label: 'View code' },
    ],
    color: '#22d3ee',
    glyph: 'downscale',
  },
];

function HypergraphGlyph() {
  const nodes = [
    [40, 50], [95, 28], [150, 54], [70, 105], [130, 112], [185, 98], [110, 70],
  ];
  return (
    <svg viewBox="0 0 220 140" className="glyph" aria-hidden="true">
      <path className="hyperedge he-1" d="M30 52 Q95 5 160 52 Q110 95 30 52Z" />
      <path className="hyperedge he-2" d="M60 108 Q110 40 195 98 Q130 140 60 108Z" />
      <path className="hyperedge he-3" d="M85 25 Q140 70 125 120 Q70 95 85 25Z" />
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 6 ? 6 : 4.5} className="glyph-node" style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
    </svg>
  );
}

function DownscaleGlyph() {
  const fine = Array.from({ length: 64 }, (_, i) => i);
  return (
    <svg viewBox="0 0 220 140" className="glyph" aria-hidden="true">
      <g className="coarse">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={20 + (i % 2) * 40} y={30 + Math.floor(i / 2) * 40} width="38" height="38" rx="3" />
        ))}
      </g>
      <path className="arrow" d="M112 70 H132 M126 64 L132 70 L126 76" />
      <g className="fine">
        {fine.map((i) => (
          <rect
            key={i}
            x={142 + (i % 8) * 9.5}
            y={32 + Math.floor(i / 8) * 9.5}
            width="8"
            height="8"
            rx="1.5"
            style={{ opacity: 0.25 + ((Math.sin(i * 1.7) + 1) / 2) * 0.75, animationDelay: `${(i % 8) * 0.08}s` }}
          />
        ))}
      </g>
    </svg>
  );
}

function handleTilt(event: PointerEvent<HTMLElement>) {
  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  card.style.setProperty('--rx', `${(0.5 - y) * 12}deg`);
  card.style.setProperty('--ry', `${(x - 0.5) * 14}deg`);
  card.style.setProperty('--gx', `${x * 100}%`);
  card.style.setProperty('--gy', `${y * 100}%`);
}

function resetTilt(event: PointerEvent<HTMLElement>) {
  const card = event.currentTarget;
  card.style.setProperty('--rx', '0deg');
  card.style.setProperty('--ry', '0deg');
}

export default function ResearchSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="research-section" id="research" ref={ref}>
      <div className={isVisible ? 'research-content visible' : 'research-content'}>
        <header className="research-header">
          <p className="section-kicker">Peer-reviewed work</p>
          <h2 className="section-heading">RESEARCH <span>&amp; PUBLICATIONS</span></h2>
          <p className="section-subtitle">Two IEEE papers in 2026, one on uncertainty-aware learning over hypergraphs and one on physics-informed remote sensing.</p>
        </header>

        <div className="paper-grid">
          {publications.map((paper, index) => (
            <article
              key={paper.id}
              className="paper-card"
              onPointerMove={handleTilt}
              onPointerLeave={resetTilt}
              style={{ '--paper-color': paper.color, transitionDelay: `${index * 120}ms` } as CSSProperties}
            >
              <div className="paper-inner">
                <div className="paper-glare" aria-hidden="true" />

                <div className="paper-top">
                  <span className="venue">
                    <span className="venue-dot" aria-hidden="true" />
                    {paper.venue} <strong>{paper.year}</strong>
                  </span>
                  <span className="paper-badge">{paper.badge}</span>
                </div>

                <div className="glyph-wrap">
                  {paper.glyph === 'hypergraph' ? <HypergraphGlyph /> : <DownscaleGlyph />}
                </div>

                <div className="paper-body">
                  <h3>{paper.title}</h3>
                  <p className="paper-subtitle">{paper.subtitle}</p>
                  <p className="paper-summary">{paper.summary}</p>
                </div>

                <div className="paper-metrics">
                  {paper.metrics.map((metric) => (
                    <div key={metric.label} className="paper-metric">
                      <span className="metric-value">{metric.value}</span>
                      <span className="metric-label">{metric.label}</span>
                    </div>
                  ))}
                </div>

                {paper.links && (
                  <div className="paper-links">
                    {paper.links.map((link) => (
                      <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="paper-link">
                        {link.label} <span aria-hidden="true">&#8599;</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .research-section {
          max-width: 1120px;
          margin: 0 auto;
          padding: var(--space-4xl) var(--space-md);
          scroll-margin-top: 84px;
        }

        .research-header {
          max-width: 640px;
          margin: 0 auto 2.6rem;
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
          color: var(--purple-200);
          text-shadow: 0 0 30px rgba(168, 85, 247, 0.3);
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

        .paper-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
          perspective: 1200px;
        }

        .paper-card {
          --rx: 0deg;
          --ry: 0deg;
          --gx: 50%;
          --gy: 0%;
          perspective: 1000px;
          opacity: 0;
          transform: translateY(40px) rotateX(12deg);
          transition: opacity 0.8s var(--ease-out-expo), transform 0.8s var(--ease-out-expo);
        }

        .research-content.visible .paper-card {
          opacity: 1;
          transform: none;
        }

        .paper-inner {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 18px;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 22px;
          background:
            radial-gradient(120% 80% at 0% 0%, color-mix(in srgb, var(--paper-color) 16%, transparent), transparent 60%),
            linear-gradient(160deg, rgba(18, 18, 52, 0.92), rgba(8, 8, 28, 0.92));
          transform-style: preserve-3d;
          transform: rotateX(var(--rx)) rotateY(var(--ry));
          transition: transform 0.25s ease-out, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .paper-card:hover .paper-inner {
          border-color: color-mix(in srgb, var(--paper-color) 45%, transparent);
          box-shadow:
            0 30px 60px -20px rgba(0, 0, 0, 0.6),
            0 0 50px -10px color-mix(in srgb, var(--paper-color) 40%, transparent);
        }

        .paper-glare {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(circle at var(--gx) var(--gy), rgba(255, 255, 255, 0.1), transparent 45%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .paper-card:hover .paper-glare {
          opacity: 1;
        }

        .paper-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          transform: translateZ(30px);
        }

        .venue {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          letter-spacing: 0.08em;
        }

        .venue strong {
          color: var(--paper-color);
        }

        .venue-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--paper-color);
          box-shadow: 0 0 12px var(--paper-color);
        }

        .paper-badge {
          padding: 4px 10px;
          border: 1px solid color-mix(in srgb, var(--paper-color) 40%, transparent);
          border-radius: 999px;
          background: color-mix(in srgb, var(--paper-color) 12%, transparent);
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: 0.66rem;
          letter-spacing: 0.04em;
        }

        .glyph-wrap {
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          background:
            linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px) 0 0 / 16px 16px,
            linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px) 0 0 / 16px 16px;
          transform: translateZ(55px);
        }

        .glyph-wrap :global(.glyph) {
          width: 100%;
          max-width: 240px;
          height: 100%;
          overflow: visible;
        }

        .glyph-wrap :global(.hyperedge) {
          fill: color-mix(in srgb, var(--paper-color) 12%, transparent);
          stroke: var(--paper-color);
          stroke-width: 1.2;
          stroke-dasharray: 6 4;
          animation: dash-flow 6s linear infinite;
        }

        .glyph-wrap :global(.he-2) {
          fill: rgba(34, 211, 238, 0.08);
          stroke: #22d3ee;
          animation-direction: reverse;
        }

        .glyph-wrap :global(.he-3) {
          fill: rgba(244, 114, 182, 0.07);
          stroke: #f472b6;
        }

        .glyph-wrap :global(.glyph-node) {
          fill: #fff;
          filter: drop-shadow(0 0 6px var(--paper-color));
          animation: node-pulse 2.4s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center;
        }

        .glyph-wrap :global(.coarse rect) {
          fill: rgba(34, 211, 238, 0.14);
          stroke: rgba(34, 211, 238, 0.55);
        }

        .glyph-wrap :global(.arrow) {
          fill: none;
          stroke: var(--text-secondary);
          stroke-width: 1.6;
          stroke-linecap: round;
        }

        .glyph-wrap :global(.fine rect) {
          fill: #22d3ee;
          animation: cell-shimmer 3s ease-in-out infinite;
        }

        @keyframes dash-flow {
          to { stroke-dashoffset: -100; }
        }

        @keyframes node-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.35); }
        }

        @keyframes cell-shimmer {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.8); }
        }

        .paper-body {
          transform: translateZ(35px);
        }

        .paper-body h3 {
          font-size: clamp(1.35rem, 2.4vw, 1.7rem);
          letter-spacing: -0.02em;
        }

        .paper-subtitle {
          margin-top: 4px;
          color: var(--paper-color);
          font-family: var(--font-mono);
          font-size: 0.78rem;
        }

        .paper-summary {
          margin-top: 12px;
          font-size: 0.9rem;
          line-height: 1.65;
        }

        .paper-metrics {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: auto;
          transform: translateZ(25px);
        }

        .paper-metric {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 12px 14px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
        }

        .metric-value {
          color: var(--text-primary);
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
        }

        .metric-label {
          color: var(--text-tertiary);
          font-family: var(--font-mono);
          font-size: 0.64rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .paper-links {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          transform: translateZ(25px);
        }

        .paper-link {
          color: var(--paper-color);
          font-size: 0.85rem;
          font-weight: 500;
        }

        .paper-link:hover {
          color: var(--text-primary);
        }

        @media (max-width: 820px) {
          .paper-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .paper-card,
          .paper-inner {
            transform: none !important;
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
