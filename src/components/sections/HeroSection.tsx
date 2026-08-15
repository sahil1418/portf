'use client';

import { motion } from 'motion/react';
import TypewriterText from '@/components/ui/TypewriterText';

export default function HeroSection() {
  const staggerDelay = 0.25;

  return (
    <section className="hero-container" id="hero">
      <div className="radial-overlay"></div>
      <div className="noise-overlay"></div>
      
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0 }}
          className="welcome-label"
        >
          <span className="welcome-line"></span>
          LEARNING IN PUBLIC
          <span className="welcome-line"></span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: staggerDelay }}
          className="hero-title"
        >
          <span className="title-first">SAHIL</span>
          <span className="title-last"> KUMAR</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: staggerDelay * 2 }}
          className="subtitle-line"
        >
          <span className="subtitle-chevron">{'>'}</span>
          <TypewriterText 
            phrases={['Software Developer', 'AI / ML Engineer', 'Full Stack Developer', 'Remote Sensing Researcher']} 
            className="subtitle-text"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: staggerDelay * 3 }}
          className="hero-cta"
        >
          <a href="#projects" className="btn-explore">
            <span className="btn-bg"></span>
            <span className="btn-content">Explore Projects</span>
            <span className="btn-glow"></span>
          </a>
          <a href="#contact" className="btn-connect">
            Get in Touch
            <span className="btn-arrow">→</span>
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: staggerDelay * 5 }}
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

      <style jsx>{`
        .hero-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .radial-overlay {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 76% 54% at 50% 44%, rgba(2, 10, 28, 0.15) 0%, rgba(3, 0, 20, 0.4) 68%, rgba(3, 0, 20, 0.72) 100%),
            radial-gradient(ellipse 54% 38% at 51% 44%, rgba(0, 240, 255, 0.055) 0%, transparent 68%);
          pointer-events: none;
        }

        .noise-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.015;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          z-index: 10;
          padding: var(--space-xl);
          gap: var(--space-md);
        }

        /* Welcome Label */
        .welcome-label {
          display: flex;
          align-items: center;
          gap: 16px;
          font-family: var(--font-display);
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.24em;
          color: var(--cyan-400);
          text-transform: uppercase;
        }

        .welcome-line {
          display: inline-block;
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--cyan-500));
        }
        .welcome-line:last-child {
          background: linear-gradient(90deg, var(--cyan-500), transparent);
        }

        /* Title */
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(3.1rem, 9.2vw, 7.4rem);
          font-weight: 700;
          line-height: 1;
          margin: 0;
          letter-spacing: 0.035em;
          position: relative;
          text-transform: uppercase;
        }

        .title-first {
          background: linear-gradient(135deg, #ffffff 0%, #dfe7ff 35%, var(--cyan-400) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 28px rgba(0, 240, 255, 0.22));
        }

        .title-last {
          background: linear-gradient(135deg, #27ddff 0%, #6c6cff 43%, #c34bff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 28px rgba(123, 47, 190, 0.28));
        }

        /* Subtitle */
        .subtitle-line {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: var(--font-mono);
          font-size: clamp(1.3rem, 3vw, 2rem);
          height: 3rem;
        }

        .subtitle-chevron {
          color: var(--cyan-500);
          font-weight: 700;
          font-size: 1.2em;
          text-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 1; text-shadow: 0 0 20px rgba(0, 240, 255, 0.5); }
          50% { opacity: 0.7; text-shadow: 0 0 8px rgba(0, 240, 255, 0.3); }
        }

        :global(.subtitle-text) {
          color: var(--text-secondary);
        }

        /* CTAs */
        .hero-cta {
          display: flex;
          gap: var(--space-lg);
          flex-wrap: wrap;
          justify-content: center;
          margin-top: var(--space-md);
        }

        .btn-explore {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 14px 32px;
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
          background: linear-gradient(135deg, var(--cyan-400), var(--cyan-500), var(--purple-400));
          border-radius: inherit;
          z-index: 0;
          transition: opacity 0.3s;
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
        }

        .btn-explore:hover .btn-glow {
          opacity: 0.7;
        }

        .btn-connect {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          border-radius: 50px;
          font-family: var(--font-body);
          font-weight: 500;
          font-size: 0.95rem;
          text-decoration: none;
          cursor: pointer;
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }

        .btn-arrow {
          transition: transform 0.3s ease;
        }

        .btn-connect:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }

        .btn-connect:hover .btn-arrow {
          transform: translateX(4px);
        }

        /* Scroll Indicator */
        .scroll-indicator {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
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

        @media (max-width: 768px) {
          .welcome-line { width: 24px; }
          .hero-cta { gap: var(--space-sm); }
          .btn-explore, .btn-connect { 
            padding: 12px 24px; 
            font-size: 0.875rem;
          }
        }
      `}</style>
    </section>
  );
}
