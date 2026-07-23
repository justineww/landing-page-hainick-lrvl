// Footer.jsx
import hainickLogo from "../storage/logo/hainick_logo.png";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IGIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const EmailIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

const WhatsappIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ── Nav links (sama dengan Header) ────────────────────────────────────────────
const NAV_COLS = [
  [
    { label: "About Us", href: "#about" },
    { label: "Talent", href: "#talent" },
    { label: "Service", href: "#service" },
  ],
  [
    { label: "Official Talent", href: "#officialTalent" },
    { label: "Creator+", href: "#creatorPlus" },
    { label: "Activity", href: "#activity" },
  ],
  [
    { label: "Pricelist", href: "#pricelist" },
    { label: "Testimony", href: "#testimony" },
    { label: "Contact Us", href: "#contact" },
  ],
];

const SOCIALS = [
  {
    icon: <IGIcon />,
    href: "https://www.instagram.com/hainickreatif/",
    label: "Instagram",
  },
  {
    icon: <EmailIcon />,
    href: "mailto:hainickreatif@gmail.com",
    label: "Email",
  },
  {
    icon: <WhatsappIcon />,
    href: "https://wa.me/6282136358570",
    label: "WhatsApp",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        .footer-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #fff;
          border-top: 1px solid #e8e8e8;
          padding: 52px 1rem 0;
          box-sizing: border-box;
        }

        /* ── Top area ── */
        .footer-top {
          max-width: 1060px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 48px;
          padding-bottom: 48px;
        }

        /* Brand col */
        .footer-brand-logo-img {
          height: 28px;
          width: auto;
          object-fit: contain;
          display: block;
          margin-bottom: 20px;
        }

        .footer-brand-desc {
          font-size: 0.82rem;
          line-height: 1.7;
          color: #555;
          font-weight: 400;
          margin: 0;
          max-width: 220px;
        }

        /* Nav cols */
        .footer-nav {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .footer-nav-col {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .footer-nav-link {
          font-size: 0.875rem;
          font-weight: 500;
          color: #333;
          text-decoration: none;
          transition: color 0.15s;
          width: fit-content;
        }
        .footer-nav-link:hover { color: #0a0a0a; }

        /* ── Divider ── */
        .footer-divider {
          max-width: 1060px;
          margin: 0 auto;
          border: none;
          border-top: 1px solid #e8e8e8;
        }

        /* ── Bottom bar ── */
        .footer-bottom {
          max-width: 1060px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 0 24px;
        }

        .footer-copy {
          font-size: 0.8rem;
          color: #888;
          font-weight: 400;
          margin: 0;
        }

        .footer-socials {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .footer-social-link {
          color: #0a0a0a;
          display: flex;
          align-items: center;
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .footer-social-link:hover { opacity: 0.5; }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .footer-top {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .footer-brand-desc { max-width: 100%; }
          .footer-nav { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 480px) {
          .footer-root { padding: 40px 1rem 0; }
          .footer-nav { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .footer-bottom { flex-direction: column; align-items: flex-start; gap: 14px; }
          .footer-brand-logo-img { height: 26px; }
        }
      `}</style>

      <footer className="footer-root">
        {/* ── Top ── */}
        <div className="footer-top">
          {/* Brand */}
          <div>
            <a href="#home">
              <img
                src={hainickLogo}
                alt="Hainick"
                className="footer-brand-logo-img"
              />
            </a>
            <p className="footer-brand-desc">
              Hainick is a creative management company dedicated to connecting
              talents with opportunities and creating memorable experiences.
            </p>
          </div>

          {/* Nav columns */}
          <nav className="footer-nav">
            {NAV_COLS.map((col, ci) => (
              <div key={ci} className="footer-nav-col">
                {col.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="footer-nav-link"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </div>

        {/* ── Divider ── */}
        <hr className="footer-divider" />

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <p className="footer-copy">© 2026 Hainick.Co. All rights reserved</p>
          <div className="footer-socials">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="footer-social-link"
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
