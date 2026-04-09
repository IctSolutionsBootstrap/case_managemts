'use client'

import Link from 'next/link'
import { Scale, ShieldCheck, FileText, Users, ArrowRight, Gavel, BookOpen, Globe } from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: 'Case Management',
    desc: 'Track, manage, and resolve criminal and civil cases with full audit trails.',
  },
  {
    icon: Gavel,
    title: 'Court Docket',
    desc: 'Schedule hearings, manage courtroom sessions, and draft formal judgments.',
  },
  {
    icon: ShieldCheck,
    title: 'Prosecution Review',
    desc: 'Streamline case review workflows between investigators and prosecutors.',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    desc: 'Judges, clerks, prosecutors, and administrators each get tailored dashboards.',
  },
  {
    icon: BookOpen,
    title: 'Legal Archive',
    desc: 'Search and retrieve historical records, judgments, and case documents.',
  },
  {
    icon: Globe,
    title: 'Multi-Language',
    desc: 'Full support for Amharic, Somali, and English across the entire system.',
  },
]

export default function LandingPage() {
  return (
    <div className="landing-root">
      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-logo">
            <Scale className="landing-logo-icon" />
            <span className="landing-logo-text">JRBJ · By cheche</span>
          </div>
          <a
            href="http://localhost:3000/login"
            className="landing-login-btn"
          >
            Login&nbsp;<ArrowRight size={16} />
          </a>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="landing-hero">
        {/* decorative circles */}
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />

        <div className="hero-content">
          <div className="hero-badge">🏛️ Somali Regional State · Ethiopia</div>
          <h1 className="hero-title">
            Somali Regional<br />
            <span className="hero-title-accent">Bureau of Justice</span>
          </h1>
          <p className="hero-subtitle">
            Integrated Case Management System — designed for judges, prosecutors,
            court clerks, and administrators to manage the full justice lifecycle
            in one secure platform.
          </p>
          <div className="hero-actions">
            <a
              href="http://localhost:3000/login"
              className="hero-cta-primary"
            >
              Access the System <ArrowRight size={18} />
            </a>
            <a href="#features" className="hero-cta-secondary">
              Learn More
            </a>
          </div>
        </div>

        {/* Stats row */}
        <div className="hero-stats">
          {[
            { value: '5+', label: 'User Roles' },
            { value: '6', label: 'Core Modules' },
            { value: '3', label: 'Languages' },
            { value: '24/7', label: 'Availability' },
          ].map((s) => (
            <div key={s.label} className="hero-stat">
              <span className="hero-stat-value">{s.value}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section id="features" className="landing-features">
        <div className="features-inner">
          <p className="features-eyebrow">What We Offer</p>
          <h2 className="features-title">Everything justice needs, in one system</h2>
          <div className="features-grid">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="feature-card">
                  <div className="feature-icon-wrap">
                    <Icon size={24} />
                  </div>
                  <h3 className="feature-card-title">{f.title}</h3>
                  <p className="feature-card-desc">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────────────── */}
      <section className="landing-cta-band">
        <div className="cta-band-inner">
          <h2 className="cta-band-title">Ready to get started?</h2>
          <p className="cta-band-sub">
            Sign in with your official credentials to access your dashboard.
          </p>
          <a
            href="http://localhost:3000/login"
            className="hero-cta-primary cta-band-btn"
          >
            Login to the System <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <Scale size={18} className="footer-icon" />
        <span>© {new Date().getFullYear()} Jijiga Regional Bureau of Justice · Somali Regional State, Ethiopia</span>
      </footer>

      {/* ── SCOPED STYLES ────────────────────────────────────────── */}
      <style>{`
        /* ---------- reset / root ---------- */
        .landing-root {
          min-height: 100vh;
          font-family: 'Geist', 'Inter', sans-serif;
          background: #f0f4ff;
          color: #1a2740;
          overflow-x: hidden;
        }

        /* ---------- nav ---------- */
        .landing-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(14px);
          background: rgba(26, 54, 93, 0.92);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .landing-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .landing-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .landing-logo-icon { color: #d4a853; width: 28px; height: 28px; }
        .landing-logo-text {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.04em;
        }
        .landing-login-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 22px;
          border-radius: 8px;
          background: #8b1c3c;
          color: #fff;
          font-weight: 600;
          font-size: 0.92rem;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 2px 12px rgba(139,28,60,0.35);
        }
        .landing-login-btn:hover {
          background: #a82249;
          transform: translateY(-1px);
          box-shadow: 0 4px 18px rgba(139,28,60,0.5);
        }

        /* ---------- hero ---------- */
        .landing-hero {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #1a365d 0%, #0f2040 60%, #8b1c3c 100%);
          padding: 100px 24px 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .hero-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.18;
        }
        .hero-blob-1 {
          width: 600px; height: 600px;
          background: #4a90e2;
          top: -200px; left: -150px;
        }
        .hero-blob-2 {
          width: 500px; height: 500px;
          background: #8b1c3c;
          bottom: -200px; right: -100px;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 760px;
        }
        .hero-badge {
          display: inline-block;
          padding: 6px 18px;
          border-radius: 999px;
          background: rgba(212,168,83,0.18);
          border: 1px solid rgba(212,168,83,0.4);
          color: #d4a853;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          margin-bottom: 24px;
          text-transform: uppercase;
        }
        .hero-title {
          font-size: clamp(2.4rem, 6vw, 3.8rem);
          font-weight: 800;
          color: #fff;
          line-height: 1.12;
          margin: 0 0 12px;
        }
        .hero-title-accent {
          background: linear-gradient(90deg, #d4a853, #f0c96a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.72);
          line-height: 1.7;
          max-width: 620px;
          margin: 0 auto 36px;
        }
        .hero-actions {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .hero-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          border-radius: 10px;
          background: #8b1c3c;
          color: #fff;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          box-shadow: 0 4px 20px rgba(139,28,60,0.45);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .hero-cta-primary:hover {
          background: #a82249;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(139,28,60,0.55);
        }
        .hero-cta-secondary {
          display: inline-flex;
          align-items: center;
          padding: 14px 30px;
          border-radius: 10px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.25);
          color: #fff;
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          backdrop-filter: blur(8px);
          transition: background 0.2s, transform 0.15s;
        }
        .hero-cta-secondary:hover {
          background: rgba(255,255,255,0.18);
          transform: translateY(-2px);
        }

        /* stats */
        .hero-stats {
          position: relative;
          z-index: 2;
          display: flex;
          gap: 40px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 64px;
          padding-top: 40px;
          border-top: 1px solid rgba(255,255,255,0.12);
          width: 100%;
          max-width: 700px;
        }
        .hero-stat { text-align: center; }
        .hero-stat-value {
          display: block;
          font-size: 2rem;
          font-weight: 800;
          color: #d4a853;
        }
        .hero-stat-label {
          display: block;
          font-size: 0.82rem;
          color: rgba(255,255,255,0.55);
          margin-top: 2px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* ---------- features ---------- */
        .landing-features {
          padding: 90px 24px;
          background: #f0f4ff;
        }
        .features-inner {
          max-width: 1100px;
          margin: 0 auto;
          text-align: center;
        }
        .features-eyebrow {
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #8b1c3c;
          margin-bottom: 10px;
        }
        .features-title {
          font-size: clamp(1.6rem, 4vw, 2.4rem);
          font-weight: 800;
          color: #1a2740;
          margin-bottom: 52px;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }
        .feature-card {
          background: #fff;
          border: 1px solid #e2e8f4;
          border-radius: 16px;
          padding: 32px 28px;
          text-align: left;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 12px rgba(26,54,93,0.06);
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 32px rgba(26,54,93,0.12);
        }
        .feature-icon-wrap {
          width: 50px; height: 50px;
          border-radius: 12px;
          background: linear-gradient(135deg, #1a365d, #25538a);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d4a853;
          margin-bottom: 18px;
        }
        .feature-card-title {
          font-size: 1.08rem;
          font-weight: 700;
          color: #1a2740;
          margin-bottom: 8px;
        }
        .feature-card-desc {
          font-size: 0.92rem;
          color: #5a6a85;
          line-height: 1.65;
        }

        /* ---------- cta band ---------- */
        .landing-cta-band {
          background: linear-gradient(135deg, #1a365d, #8b1c3c);
          padding: 80px 24px;
          text-align: center;
        }
        .cta-band-inner { max-width: 600px; margin: 0 auto; }
        .cta-band-title {
          font-size: 2rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 12px;
        }
        .cta-band-sub {
          color: rgba(255,255,255,0.72);
          font-size: 1rem;
          margin-bottom: 32px;
          line-height: 1.6;
        }
        .cta-band-btn { font-size: 1.05rem; }

        /* ---------- footer ---------- */
        .landing-footer {
          background: #0f1e36;
          color: rgba(255,255,255,0.45);
          font-size: 0.82rem;
          padding: 22px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .footer-icon { color: #d4a853; flex-shrink: 0; }

        /* ---------- responsive ---------- */
        @media (max-width: 640px) {
          .hero-stats { gap: 24px; }
          .features-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
