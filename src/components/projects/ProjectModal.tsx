'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectData } from '@/lib/types';
import SceneRenderer from '@/components/scenes/SceneRenderer';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import LanguageBar from '@/components/ui/LanguageBar';

interface ProjectModalProps {
  project: ProjectData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  // Don't render anything if closed or no project, but let AnimatePresence handle exit
  const metricMatch = project?.keyMetric?.value?.match(/^([\d.]+)(.*)$/);
  const metricNumber = metricMatch ? parseFloat(metricMatch[1]) : 0;
  const metricSuffix = metricMatch ? metricMatch[2] : '';

  return (
    <AnimatePresence>
      {isOpen && project && (
        <div className="modal-overlay">
          <motion.div
            className="overlay-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="modal-container"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{ '--theme-color': project.primaryColor } as React.CSSProperties}
          >
            <button className="close-btn" onClick={onClose} aria-label="Close modal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="modal-content">
              <div className="header">
                <div className="scene-wrapper">
                  <SceneRenderer 
                    sceneType={project.sceneType} 
                    color={project.primaryColor} 
                    active={true} 
                  />
                </div>
                <div className="header-text">
                  <div className="badges">
                    {project.category && (
                      <span className="badge category">{project.category}</span>
                    )}
                    {project.lastUpdated && (
                      <span className="badge activity">
                        Updated {new Date(project.lastUpdated).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <h2 className="title">{project.displayTitle}</h2>
                  <p className="tagline">{project.tagline}</p>
                </div>
              </div>

              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-value">⭐ <AnimatedCounter target={project.stars || 0} /></div>
                  <div className="stat-label">Stars</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">🍴 <AnimatedCounter target={project.forks || 0} /></div>
                  <div className="stat-label">Forks</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">⚠️ <AnimatedCounter target={project.openIssues || 0} /></div>
                  <div className="stat-label">Issues</div>
                </div>
                {project.keyMetric && (
                  <div className="stat-card highlight">
                    <div className="stat-value">
                      <AnimatedCounter target={metricNumber} />
                      {metricSuffix}
                    </div>
                    <div className="stat-label">{project.keyMetric.label}</div>
                  </div>
                )}
              </div>

              <div className="description">
                {project.longDescription?.split('\n').map((paragraph, idx) => paragraph.trim() && (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="section">
                <h3>Tech Stack</h3>
                <div className="tech-stack-wrap">
                  {project.techStack?.map((tech) => (
                    <span key={tech} className="tech-chip large">{tech}</span>
                  ))}
                </div>
              </div>

              {project.languages && (
                <div className="section">
                  <h3>Languages</h3>
                  <LanguageBar languages={project.languages} />
                </div>
              )}

              <div className="action-buttons">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn primary">
                    View on GitHub ↗
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn secondary">
                    Live Demo ↗
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          box-sizing: border-box;
        }

        .overlay-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(3, 0, 20, 0.9);
          backdrop-filter: blur(10px);
          z-index: 1;
        }

        .modal-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          background: var(--glass-bg, rgba(15, 15, 30, 0.7));
          backdrop-filter: blur(16px);
          border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.1));
          border-radius: 24px;
          overflow-y: auto;
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5), 0 0 40px color-mix(in srgb, var(--theme-color) 10%, transparent);
        }

        .modal-container::-webkit-scrollbar {
          width: 8px;
        }
        .modal-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .modal-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--glass-bg, rgba(255, 255, 255, 0.1));
          border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
        }

        .modal-content {
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .header {
          display: flex;
          flex-direction: column;
        }

        .scene-wrapper {
          height: 250px;
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid var(--glass-border, rgba(255, 255, 255, 0.1));
          border-radius: 24px 24px 0 0;
          overflow: hidden;
        }

        .header-text {
          padding: 24px 32px 0;
        }

        .badges {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }

        .badge {
          font-size: 0.75rem;
          padding: 4px 10px;
          border-radius: 12px;
          background: var(--glass-bg, rgba(255, 255, 255, 0.05));
          border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.1));
          color: var(--text-secondary, #a0a0b0);
        }

        .badge.category {
          color: var(--theme-color);
          border-color: color-mix(in srgb, var(--theme-color) 30%, transparent);
          background: color-mix(in srgb, var(--theme-color) 10%, transparent);
        }

        .title {
          font-family: var(--font-heading, 'Space Grotesk', sans-serif);
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary, #ffffff);
          margin: 0 0 8px 0;
          line-height: 1.2;
        }

        .tagline {
          font-family: var(--font-sans, 'Inter', sans-serif);
          font-size: 1.2rem;
          color: var(--text-secondary, #a0a0b0);
          margin: 0;
        }

        .stats-row {
          display: flex;
          gap: 16px;
          padding: 0 32px;
          overflow-x: auto;
        }

        .stat-card {
          flex: 1;
          min-width: 120px;
          background: var(--glass-bg, rgba(255, 255, 255, 0.03));
          border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.08));
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .stat-card.highlight {
          border-color: color-mix(in srgb, var(--theme-color) 40%, transparent);
          background: color-mix(in srgb, var(--theme-color) 5%, transparent);
        }

        .stat-card.highlight .stat-value {
          color: var(--theme-color);
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary, #ffffff);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .stat-label {
          font-size: 0.85rem;
          color: var(--text-secondary, #a0a0b0);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .description {
          padding: 0 32px;
          font-size: 1.05rem;
          line-height: 1.7;
          color: var(--text-secondary, #cccccc);
        }

        .description p {
          margin-top: 0;
          margin-bottom: 16px;
        }

        .section {
          padding: 0 32px;
        }

        .section h3 {
          font-family: var(--font-heading, 'Space Grotesk', sans-serif);
          font-size: 1.2rem;
          color: var(--text-primary, #ffffff);
          margin: 0 0 16px 0;
        }

        .tech-stack-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .tech-chip.large {
          background: var(--glass-bg, rgba(255, 255, 255, 0.05));
          border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.15));
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          color: var(--text-primary, #ffffff);
          transition: all 0.2s;
        }

        .tech-chip.large:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--theme-color);
          box-shadow: 0 0 15px color-mix(in srgb, var(--theme-color) 20%, transparent);
        }

        .action-buttons {
          display: flex;
          gap: 16px;
          padding: 24px 32px 40px;
          margin-top: 16px;
          border-top: 1px solid var(--glass-border, rgba(255, 255, 255, 0.05));
        }

        .btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px 24px;
          border-radius: 12px;
          font-family: var(--font-heading, 'Space Grotesk', sans-serif);
          font-size: 1.1rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s;
          cursor: pointer;
        }

        .btn.primary {
          background: var(--theme-color, #4f46e5);
          color: #ffffff;
          border: none;
          box-shadow: 0 4px 14px color-mix(in srgb, var(--theme-color) 40%, transparent);
        }

        .btn.primary:hover {
          filter: brightness(1.1);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px color-mix(in srgb, var(--theme-color) 60%, transparent);
        }

        .btn.secondary {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary, #ffffff);
          border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
        }

        .btn.secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .stats-row {
            flex-wrap: wrap;
          }
          .stat-card {
            min-width: calc(50% - 8px);
          }
          .action-buttons {
            flex-direction: column;
          }
          .title {
            font-size: 2rem;
          }
        }
      `}</style>
    </AnimatePresence>
  );
}
