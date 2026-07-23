import { useState, useEffect } from "react";
import hainickLogo from "../storage/logo/hainick_logo.png";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // tutup menu saat resize ke desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About Us", href: "#about" },
    { label: "Official Talent", href: "#officialTalent" },
    { label: "Creator+", href: "#creatorPlus" },
    { label: "Service", href: "#services" },
    { label: "Creator", href: "#creator" },
    { label: "Activity", href: "#activity" },
    { label: "Pricelist", href: "#pricelist" },
    { label: "Testimony", href: "#testimony" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        /* ── Nav link ── */
        .nav-link {
          color: #222;
          text-decoration: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          letter-spacing: 0.005em;
          padding: 0.25rem 0;
          position: relative;
          transition: color 0.2s;
          white-space: nowrap;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 2px;
          background: #1a2744;
          border-radius: 2px;
          transition: width 0.25s ease;
        }
        .nav-link:hover { color: #000; }
        .nav-link:hover::after { width: 100%; }

        /* ── Contact button ── */
        .contact-btn {
          background: #1a2744;
          color: #fff;
          padding: 0.55rem 1.35rem;
          border-radius: 100px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .contact-btn:hover { background: #263660; transform: translateY(-1px); }

        /* ── Hamburger ── */
        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 4px;
          z-index: 1001;
        }
        .hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background: #0a0a0a;
          border-radius: 2px;
          transition: transform 0.3s, opacity 0.3s;
          transform-origin: center;
        }
        .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* ── Desktop nav ── */
        .desktop-nav { display: flex; gap: 1.7rem; align-items: center; }

        /* ── Mobile drawer ── */
        .mobile-drawer {
          display: none;
          position: fixed;
          top: 64px; left: 0; right: 0;
          background: #fff;
          border-top: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          flex-direction: column;
          padding: 1.2rem 1.5rem 1.5rem;
          gap: 0;
          z-index: 998;
          transform: translateY(-8px);
          opacity: 0;
          transition: transform 0.25s ease, opacity 0.25s ease;
        }
        .mobile-drawer.open {
          display: flex;
          transform: translateY(0);
          opacity: 1;
        }
        .mobile-nav-link {
          color: #222;
          text-decoration: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          padding: 0.8rem 0;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          transition: color 0.2s;
        }
        .mobile-nav-link:last-of-type { border-bottom: none; }
        .mobile-nav-link:hover { color: #1a2744; }
        .mobile-contact-btn {
          margin-top: 1rem;
          background: #1a2744;
          color: #fff;
          padding: 0.75rem;
          border-radius: 100px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          text-align: center;
        }

        /* ── Logo image ── */
        .header-logo-img {
          height: 24px;
          width: auto;
          object-fit: contain;
          display: block;
        }

        /* ── Breakpoints ── */
        @media (max-width: 1023px) {
          .desktop-nav { display: none !important; }
          .desktop-cta { display: none !important; }
          .hamburger   { display: flex !important; }
        }

        @media (max-width: 480px) {
          .header-logo-img { height: 28px; }
        }
      `}</style>

      {/* ── HEADER BAR ── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          height: 64,
          background: "#fff",
          borderBottom: scrolled
            ? "1px solid rgba(0,0,0,0.08)"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.06)" : "none",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          padding: "0 1.5rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            width: "100%",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {/* Logo */}
          <a
            href="#home"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img src={hainickLogo} alt="Hainick" className="header-logo-img" />
          </a>

          {/* Desktop Nav (center) */}
          <nav className="desktop-nav">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA (right) */}
          <div
            className="desktop-cta"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <a
              href="https://wa.me/6282136358570"
              className="contact-btn"
              target="_blank"
              rel="noreferrer"
            >
              Contact Us
            </a>
          </div>

          {/* Hamburger (right on mobile, replaces CTA column) */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              className={`hamburger${menuOpen ? " open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      <div className={`mobile-drawer${menuOpen ? " open" : ""}`}>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="mobile-nav-link"
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contact"
          className="mobile-contact-btn"
          onClick={() => setMenuOpen(false)}
        >
          Contact Us
        </a>
      </div>
    </>
  );
};

export default Header;
