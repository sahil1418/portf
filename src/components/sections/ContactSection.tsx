'use client';

import type { FormEvent } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const CONTACT_EMAIL = 'sahil0329308@gmail.com';

// No backend: hand the message to the visitor's mail client, pre-filled.
function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const from = String(data.get('email') ?? '');
  const subject = encodeURIComponent(`Portfolio enquiry from ${from}`);
  const body = encodeURIComponent(`${data.get('message') ?? ''}\n\n— ${from}`);
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

export default function ContactSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="contact-section" id="contact" ref={ref}>
      <div className="bg-mesh" />

      <div
        className="contact-content"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <header className="contact-header">
          <p className="section-kicker">Open to collaborate</p>
          <h2 className="section-heading">LET&apos;S <span>CONNECT</span></h2>
          <p className="subtitle">Have an interesting project or just want to say hi? Let&apos;s talk.</p>
        </header>

        <nav className="social-links" aria-label="Social links">
          <a href="https://github.com/sahil1418" target="_blank" rel="noreferrer" className="social-card" aria-label="GitHub (opens in a new tab)">GitHub</a>
          <a href="https://www.linkedin.com/in/sahil-kumar-0a272028b/" target="_blank" rel="noreferrer" className="social-card" aria-label="LinkedIn (opens in a new tab)">LinkedIn</a>
          <a href={`mailto:${CONTACT_EMAIL}`} className="social-card">Email</a>
        </nav>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="contact-email">Your email</label>
            <input id="contact-email" name="email" type="email" placeholder="name@company.com" className="form-input" required />
          </div>
          <div className="form-group">
            <label htmlFor="contact-message">Your message</label>
            <textarea id="contact-message" name="message" placeholder="How can we work together?" rows={4} className="form-input" required />
          </div>
          <button type="submit" className="btn-submit">Send message <span aria-hidden="true">&rarr;</span></button>
        </form>
      </div>

      <style jsx>{`
        .contact-section {
          position: relative;
          display: flex;
          justify-content: center;
          overflow: hidden;
          padding: var(--space-4xl) var(--space-md);
          scroll-margin-top: 84px;
        }

        .bg-mesh {
          position: absolute;
          inset: 0;
          z-index: 0;
          background:
            radial-gradient(circle at 20% 50%, rgba(123, 47, 190, 0.1), transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(0, 240, 255, 0.08), transparent 50%);
          pointer-events: none;
        }

        .contact-content {
          position: relative;
          z-index: 1;
          display: flex;
          width: 100%;
          max-width: 690px;
          flex-direction: column;
          align-items: center;
        }

        .contact-header {
          margin-bottom: 1.75rem;
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
        }

        .section-heading span {
          color: var(--cyan-400);
          text-shadow: 0 0 30px rgba(0, 240, 255, 0.22);
        }

        .section-heading::after {
          display: none;
        }

        .subtitle {
          margin: 0;
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .social-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          width: 100%;
          margin-bottom: 1.6rem;
        }

        .social-card {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 126px;
          padding: 0.78rem 1.1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          background: rgba(13, 15, 43, 0.5);
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 0.76rem;
          text-decoration: none;
          transition: border-color 180ms ease, color 180ms ease, background 180ms ease, transform 180ms ease;
        }

        .social-card:hover,
        .social-card:focus-visible {
          transform: translateY(-2px);
          border-color: rgba(0, 240, 255, 0.42);
          background: rgba(0, 240, 255, 0.06);
          color: var(--cyan-200);
          outline: none;
        }

        .contact-form {
          display: flex;
          width: 100%;
          max-width: 540px;
          flex-direction: column;
          gap: 14px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 16px;
          background: rgba(10, 12, 37, 0.58);
          backdrop-filter: blur(14px);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        label {
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 0.67rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .form-input {
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.025);
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 0.94rem;
          transition: border-color var(--transition-fast), background var(--transition-fast);
        }

        input.form-input {
          height: 46px;
          padding: 0 13px;
        }

        textarea.form-input {
          min-height: 116px;
          padding: 12px 13px;
          resize: vertical;
        }

        .form-input::placeholder {
          color: var(--text-tertiary);
        }

        .form-input:focus {
          border-color: var(--cyan-500);
          background: rgba(0, 240, 255, 0.045);
          outline: none;
        }

        .btn-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 46px;
          border: 1px solid var(--purple-500);
          border-radius: 8px;
          background: rgba(123, 47, 190, 0.2);
          color: #fff;
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: background var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
        }

        .btn-submit:hover {
          transform: translateY(-1px);
          background: rgba(123, 47, 190, 0.38);
          box-shadow: 0 0 18px rgba(123, 47, 190, 0.32);
        }

        @media (max-width: 520px) {
          .contact-section {
            padding-inline: 0.85rem;
          }

          .social-links {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .social-card {
            min-width: 0;
          }

          .contact-form {
            padding: 16px;
          }
        }
      `}</style>
    </section>
  );
}
