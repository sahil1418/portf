'use client';

import { useState, useEffect, useRef } from 'react';

const NAV_LINKS = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Research', href: '#research', id: 'research' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current?.style.setProperty('transform', `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`);

      // Find active section
      const sections = NAV_LINKS.map((link) => ({
        id: link.id,
        el: document.getElementById(link.id),
      })).filter((s) => s.el);

      const scrollPos = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.el && section.el.offsetTop <= scrollPos) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: var(--z-navbar);
          padding: 0 var(--space-xl);
          transition: all var(--transition-base);
        }

        .navbar-scrolled {
          background: rgba(3, 0, 20, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .scroll-progress {
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 2px;
          background: linear-gradient(90deg, var(--cyan-500), var(--violet-500), #f472b6);
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
          transform: scaleX(0);
          transform-origin: left;
          pointer-events: none;
        }

        .navbar-inner {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }

        .logo {
          font-family: var(--font-heading);
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .logo:hover {
          color: var(--cyan-400);
          text-shadow: var(--glow-text-cyan);
        }

        .logo-dot {
          color: var(--cyan-500);
          text-shadow: var(--glow-text-cyan);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          list-style: none;
        }

        .nav-link {
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-tertiary);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all var(--transition-fast);
          border: none;
          background: none;
          position: relative;
        }

        .nav-link:hover {
          color: var(--text-primary);
        }

        .nav-link-active {
          color: var(--cyan-400);
          background: rgba(0, 240, 255, 0.08);
        }

        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          z-index: 1001;
        }

        .hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--text-primary);
          border-radius: 2px;
          transition: all var(--transition-fast);
        }

        .hamburger-open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        .hamburger-open span:nth-child(2) {
          opacity: 0;
        }
        .hamburger-open span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        .mobile-menu {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(3, 0, 20, 0.97);
          backdrop-filter: blur(30px);
          z-index: 1000;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-xl);
        }

        .mobile-menu-open {
          display: flex;
        }

        .mobile-link {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
          border: none;
          background: none;
          letter-spacing: 0.02em;
        }

        .mobile-link:hover,
        .mobile-link-active {
          color: var(--cyan-400);
          text-shadow: var(--glow-text-cyan);
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          .hamburger {
            display: flex;
          }
        }
      `}</style>

      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="scroll-progress" ref={progressRef} aria-hidden="true" />
        <div className="navbar-inner">
          <div className="logo" onClick={() => handleNavClick('#home')}>
            SK<span className="logo-dot">.</span>
          </div>

          <ul className="nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  className={`nav-link ${activeSection === link.id ? 'nav-link-active' : ''}`}
                  onClick={() => handleNavClick(link.href)}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <button
            className={`hamburger ${mobileOpen ? 'hamburger-open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'mobile-menu-open' : ''}`}>
        {NAV_LINKS.map((link, i) => (
          <button
            key={link.id}
            className={`mobile-link ${activeSection === link.id ? 'mobile-link-active' : ''}`}
            onClick={() => handleNavClick(link.href)}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {link.label}
          </button>
        ))}
      </div>
    </>
  );
}
