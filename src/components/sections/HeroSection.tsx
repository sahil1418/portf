'use client';

import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import TypewriterText from '@/components/ui/TypewriterText';

const NeuralCore = dynamic(() => import('@/components/scenes/NeuralCore'), { ssr: false });

const LINKEDIN_URL = 'https://www.linkedin.com/in/sahil-kumar-0a272028b/';

const credentials = [
  { value: '2× IEEE', label: 'ICDM (CORE A*) & MIGARS 2026' },
  { value: 'Top 5 Teams', label: 'of 200K+ · Hero Campus ML Challenge' },
  { value: 'Top 50', label: 'of 32K+ teams · Amazon ML Challenge' },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function HeroSection() {
  const staggerDelay = 0.18;

  return (
    <section className="hero-container" id="home">
      <div className="hero-scene">
        <NeuralCore />
      </div>
      <div className="radial-overlay"></div>
      <div className="noise-overlay"></div>

      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease, delay: 0 }}
          className="status-pill"
        >
          <span className="status-dot" aria-hidden="true" />
          B.Tech ECE &apos;27 · IIIT Allahabad
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease, delay: staggerDelay }}
          className="hero-title"
        >
          <span className="title-first">SAHIL</span>
          <span className="title-last">KUMAR</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: staggerDelay * 2 }}
          className="subtitle-line"
        >
          <span className="subtitle-chevron">{'>'}</span>
          <TypewriterText
            phrases={['ML Researcher', 'AI / ML Engineer', 'Full Stack Developer', 'Remote Sensing Researcher']}
            className="subtitle-text"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: staggerDelay * 3 }}
          className="hero-pitch"
        >
          I build physics-aware machine learning systems and the full-stack products that put them in people&apos;s hands.
        </motion.p>

        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: staggerDelay * 4 }}
          className="credentials"
          aria-label="Highlights"
        >
          {credentials.map((item) => (
            <li key={item.value} className="credential">
              <span className="credential-value">{item.value}</span>
              <span className="credential-label">{item.label}</span>
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: staggerDelay * 5 }}
          className="hero-cta"
        >
          <a href="#projects" className="btn-explore">
            <span className="btn-bg"></span>
            <span className="btn-content">Explore Projects</span>
            <span className="btn-glow"></span>
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="btn-connect">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
            </svg>
            Connect on LinkedIn
          </a>
          <a href="#contact" className="btn-text">
            Get in touch <span className="btn-arrow">→</span>
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: staggerDelay * 7 }}
        className="scroll-indicator"
      >
        <span className="scroll-label">SCROLL</span>
        <div className="scroll-track">
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="scroll-dot"
          />
        </div>
      </motion.div>

      {/* Global so the classes reach motion.* components; every selector is hero-specific. */}
      <style jsx global>{`
        .hero-container {
          min-height: 100vh;
          min-height: 100svh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          scroll-margin-top: 0;
        }

        .hero-scene {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .hero-container .radial-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background:
            linear-gradient(90deg, rgba(3, 0, 20, 0.78) 0%, rgba(3, 0, 20, 0.35) 38%, transparent 60%),
            linear-gradient(180deg, transparent 70%, rgba(3, 0, 20, 0.9) 100%);
          pointer-events: none;
        }

        .hero-container .noise-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          opacity: 0.02;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.1rem;
          width: 100%;
          max-width: 1320px;
          margin: 0 auto;
          padding: 110px clamp(1rem, 5vw, 4rem) 120px;
          pointer-events: none;
        }

        .hero-content > * {
          pointer-events: auto;
          max-width: 640px;
        }

        /* Status pill */
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 7px 14px 7px 12px;
          border: 1px solid rgba(0, 240, 255, 0.22);
          border-radius: 999px;
          background: rgba(0, 240, 255, 0.06);
          backdrop-filter: blur(10px);
          color: var(--cyan-200);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.6);
          animation: status-ping 2.2s ease-out infinite;
        }

        @keyframes status-ping {
          0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.6); }
          80%, 100% { box-shadow: 0 0 0 10px rgba(52, 211, 153, 0); }
        }

        /* Title */
        .hero-title {
          display: flex;
          flex-direction: column;
          font-family: var(--font-display);
          font-size: clamp(3.2rem, 8.4vw, 7.2rem);
          font-weight: 800;
          line-height: 0.95;
          margin: 0;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .title-first {
          background: linear-gradient(135deg, #ffffff 0%, #dfe7ff 40%, var(--cyan-400) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 28px rgba(0, 240, 255, 0.22));
        }

        .title-last {
          background: linear-gradient(110deg, #27ddff 0%, #6c6cff 35%, #c34bff 65%, #27ddff 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 28px rgba(123, 47, 190, 0.32));
          animation: gradient-shift 8s ease-in-out infinite;
        }

        /* Subtitle */
        .subtitle-line {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: var(--font-mono);
          font-size: clamp(1.1rem, 2.2vw, 1.55rem);
          min-height: 2.4rem;
        }

        .subtitle-chevron {
          color: var(--cyan-500);
          font-weight: 700;
          font-size: 1.2em;
          text-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
        }

        .subtitle-line .subtitle-text {
          color: var(--text-secondary);
        }

        .hero-pitch {
          color: var(--text-secondary);
          font-size: clamp(1rem, 1.4vw, 1.12rem);
          line-height: 1.65;
          max-width: 520px;
        }

        /* Credentials */
        .credentials {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          width: 100%;
          list-style: none;
        }

        .credential {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 12px 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          background: linear-gradient(160deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
          backdrop-filter: blur(12px);
          transition: border-color 200ms ease, transform 200ms ease;
        }

        .credential:hover {
          transform: translateY(-2px);
          border-color: rgba(0, 240, 255, 0.3);
        }

        .credential-value {
          font-family: var(--font-heading);
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.1;
        }

        .credential-label {
          font-size: 0.72rem;
          color: var(--text-tertiary);
          line-height: 1.35;
        }

        /* CTAs */
        .hero-cta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 0.4rem;
        }

        .btn-explore {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 14px 30px;
          border-radius: 50px;
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          overflow: hidden;
          cursor: pointer;
          color: #030014;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .btn-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--cyan-400), var(--cyan-500), var(--purple-300));
          border-radius: inherit;
          z-index: 0;
        }

        .btn-content {
          position: relative;
          z-index: 1;
        }

        .btn-glow {
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, var(--cyan-400), var(--purple-400));
          border-radius: inherit;
          z-index: -1;
          filter: blur(12px);
          opacity: 0.4;
          transition: opacity 0.3s;
        }

        .btn-explore:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 40px rgba(0, 240, 255, 0.3);
          color: #030014;
        }

        .btn-explore:hover .btn-glow {
          opacity: 0.7;
        }

        .btn-connect {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 13px 24px;
          border-radius: 50px;
          font-family: var(--font-body);
          font-weight: 500;
          font-size: 0.95rem;
          color: var(--text-primary);
          background: rgba(10, 102, 194, 0.18);
          border: 1px solid rgba(80, 160, 255, 0.35);
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }

        .btn-connect:hover {
          color: #fff;
          background: rgba(10, 102, 194, 0.4);
          border-color: rgba(120, 180, 255, 0.6);
          transform: translateY(-2px);
        }

        .btn-text {
          display: inline-flex;
          gap: 6px;
          padding: 13px 8px;
          color: var(--text-secondary);
          font-size: 0.95rem;
          font-weight: 500;
        }

        .btn-text:hover {
          color: var(--cyan-300);
        }

        .btn-arrow {
          transition: transform 0.3s ease;
        }

        .btn-text:hover .btn-arrow {
          transform: translateX(4px);
        }

        /* Scroll Indicator */
        .scroll-indicator {
          position: absolute;
          z-index: 3;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          pointer-events: none;
        }

        .scroll-label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: var(--text-tertiary);
          letter-spacing: 0.25em;
        }

        .scroll-track {
          width: 1px;
          height: 30px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 2px;
          position: relative;
          overflow: hidden;
        }

        .scroll-dot {
          width: 3px;
          height: 8px;
          background: var(--cyan-500);
          border-radius: 2px;
          position: absolute;
          left: -1px;
          box-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
        }

        @media (max-width: 959px) {
          .hero-content {
            align-items: center;
            text-align: center;
            padding-top: 100px;
          }

          .hero-title {
            align-items: center;
          }

          .hero-pitch {
            margin: 0 auto;
          }

          .hero-cta {
            justify-content: center;
          }

          .hero-container .radial-overlay {
            background:
              radial-gradient(ellipse 90% 60% at 50% 50%, rgba(3, 0, 20, 0.55) 0%, rgba(3, 0, 20, 0.25) 70%),
              linear-gradient(180deg, transparent 70%, rgba(3, 0, 20, 0.9) 100%);
          }

          .scroll-indicator {
            display: none;
          }
        }

        @media (max-width: 560px) {
          .credentials {
            grid-template-columns: 1fr;
          }

          .credential {
            flex-direction: row;
            align-items: baseline;
            gap: 10px;
            text-align: left;
          }

          .credential-value {
            min-width: 80px;
            font-size: 1.1rem;
          }

          .btn-explore, .btn-connect {
            padding: 12px 22px;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </section>
  );
}
