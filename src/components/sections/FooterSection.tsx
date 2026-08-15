'use client';

export default function FooterSection() {
  return (
    <footer className="footer-section">
      <div className="footer-content">
        <p className="footer-text">
          Built with passion using Next.js, Three.js & Motion
        </p>
        <p className="footer-copyright">
          © {new Date().getFullYear()} Sahil Kumar · All rights reserved
        </p>
      </div>

      <style jsx>{`
        .footer-section {
          padding: 3rem var(--space-md);
          position: relative;
          text-align: center;
          margin-top: var(--space-4xl);
        }

        .footer-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(
            90deg, 
            transparent 0%, 
            rgba(0, 240, 255, 0.3) 50%, 
            transparent 100%
          );
        }

        .footer-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .footer-text {
          font-family: var(--font-body);
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .footer-copyright {
          font-family: var(--font-mono);
          color: var(--text-tertiary);
          font-size: 0.75rem;
        }
      `}</style>
    </footer>
  );
}
