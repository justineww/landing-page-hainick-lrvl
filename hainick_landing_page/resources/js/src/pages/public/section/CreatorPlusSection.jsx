import { useState, useEffect } from "react";
import { API_URL } from "../../../utils/api";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IGIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const TikTokIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.75a4.85 4.85 0 01-1-.06z" />
  </svg>
);

const XIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatFollowers = (n) => {
  const num = parseInt(n, 10);
  if (isNaN(num) || num === 0) return null;
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return Math.round(num / 1_000) + "K";
  return String(num);
};

// ── Mapping: API response → CreatorPlusSection format ──────────────────────────────
// Menangani dua kemungkinan nama field: followers_ig DAN followers_instagram
const mapCreatorToTalent = (creator) => {
  // Debug: uncomment baris ini jika card masih tidak muncul
  // console.log("Creator fields:", Object.keys(creator), creator);

  const igFollowers = creator.followers_instagram ?? creator.followers_ig ?? 0;
  const ttFollowers = creator.followers_tiktok ?? 0;
  const xFollowers = creator.followers_x ?? 0;

  const socials = {};

  if (igFollowers && igFollowers !== "0") {
    socials.instagram = {
      url: creator.url_instagram || "https://instagram.com/",
      followers: String(igFollowers),
    };
  }
  if (ttFollowers && ttFollowers !== "0") {
    socials.tiktok = {
      url: creator.url_tiktok || "https://tiktok.com/",
      followers: String(ttFollowers),
    };
  }
  if (xFollowers && xFollowers !== "0") {
    socials.x = {
      url: creator.url_x || "https://x.com/",
      followers: String(xFollowers),
    };
  }

  return {
    id: creator.id,
    name: creator.name,
    photo: creator.profile_image ? `${API_URL}${creator.profile_image}` : null,
    categories: creator.roles
      ? creator.roles
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean)
      : [],
    socials,
  };
};

// ── Social config ─────────────────────────────────────────────────────────────
const SOCIAL_CONFIG = [
  { key: "instagram", icon: <IGIcon /> },
  { key: "tiktok", icon: <TikTokIcon /> },
  { key: "x", icon: <XIcon /> },
];

// ── TalentCard ─────────────────────────────────────────────────────────────────
function TalentCard({ talent, index }) {
  const [imgError, setImgError] = useState(false);
  const showFallback = !talent.photo || imgError;

  return (
    <div className="tc-card" style={{ animationDelay: `${index * 60}ms` }}>
      {/* Foto */}
      <div className="tc-photo-wrap">
        {showFallback ? (
          <div className="tc-photo-fallback">
            <span>{talent.name?.[0]?.toUpperCase() || "?"}</span>
          </div>
        ) : (
          <img
            src={talent.photo}
            alt={talent.name}
            className="tc-photo"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Info */}
      <div className="tc-body">
        <h3 className="tc-name">{talent.name}</h3>

        {/* Socials */}
        {Object.keys(talent.socials).length > 0 && (
          <div className="tc-socials">
            {SOCIAL_CONFIG.filter((s) => talent.socials[s.key]).map((s) => {
              const count = formatFollowers(talent.socials[s.key].followers);
              if (!count) return null;
              return (
                <a
                  key={s.key}
                  href={talent.socials[s.key].url}
                  target="_blank"
                  rel="noreferrer"
                  className="tc-social-item"
                >
                  <span className="tc-social-icon">{s.icon}</span>
                  <span className="tc-social-count">{count}</span>
                </a>
              );
            })}
          </div>
        )}

        {/* Categories */}
        {talent.categories.length > 0 && (
          <div className="tc-cats">
            {talent.categories.map((c) => (
              <span key={c} className="tc-cat">
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="tc-card tc-skeleton">
      <div className="tc-photo-wrap skel-photo" />
      <div className="tc-body">
        <div
          className="skel-line"
          style={{ width: "65%", height: 13, marginBottom: 10 }}
        />
        <div
          className="skel-line"
          style={{ width: "45%", height: 11, marginBottom: 8 }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          <div className="skel-line" style={{ width: 40, height: 18 }} />
          <div className="skel-line" style={{ width: 40, height: 18 }} />
        </div>
      </div>
    </div>
  );
}

// ── CreatorPlusSection ──────────────────────────────────────────────────────────────
export default function CreatorPlusSection() {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/creators`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const mapped = Array.isArray(data) ? data.map(mapCreatorToTalent) : [];
        setTalents(mapped);
      })
      .catch((err) => {
        console.error("Gagal fetch creators:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        .ts-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #fff;
          padding: 48px 1rem 72px;
          max-width: 1060px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .ts-title {
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0a0a0a;
          text-align: center;
          margin: 0 0 32px;
        }

        /* ── Error ── */
        .ts-error {
          text-align: center;
          padding: 3rem 1rem;
          color: #ef4444;
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* ── Grid ── */
        .ts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 768px) {
          .ts-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
        }
        @media (max-width: 480px) {
          .ts-grid { grid-template-columns: 1fr; }
        }

        /* ── Card ── */
        .tc-card {
          border: 1.5px solid #e8e8e8;
          border-radius: 14px;
          overflow: hidden;
          background: #fff;
          transition: box-shadow 0.25s, transform 0.25s;
          animation: tcFadeIn 0.35s ease both;
        }
        @keyframes tcFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tc-card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.10);
          transform: translateY(-3px);
        }

        /* ── Photo ── */
        .tc-photo-wrap {
          width: 100%;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          background: #f0f0f0;
        }
        .tc-photo {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
          transition: transform 0.4s ease;
        }
        .tc-card:hover .tc-photo { transform: scale(1.04); }
        .tc-photo-fallback {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, #1a2744, #4f7cff);
          display: flex; align-items: center; justify-content: center;
        }
        .tc-photo-fallback span {
          font-size: 3rem; font-weight: 800; color: #fff;
        }

        /* ── Body ── */
        .tc-body {
          padding: 14px 14px 16px;
        }

        .tc-name {
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #0a0a0a;
          margin: 0 0 8px;
          line-height: 1.25;
        }

        /* ── Socials ── */
        .tc-socials {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 9px;
        }
        .tc-social-item {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          text-decoration: none;
          color: #0a0a0a;
          transition: opacity 0.15s;
        }
        .tc-social-item:hover { opacity: 0.45; }
        .tc-social-icon { display: flex; align-items: center; }
        .tc-social-count {
          font-size: 0.72rem;
          font-weight: 700;
          color: #0a0a0a;
        }

        /* ── Categories ── */
        .tc-cats {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 2px;
        }
        .tc-cat {
          font-size: 0.67rem;
          font-weight: 500;
          color: #555;
          background: #f2f2f2;
          border-radius: 4px;
          padding: 2px 7px;
        }

        /* ── Skeleton ── */
        .tc-skeleton { pointer-events: none; }
        .skel-photo {
          aspect-ratio: 3 / 4;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        .skel-line {
          border-radius: 6px;
          display: block;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <section
        id="creatorPlus"
        className="ts-root"
        style={{ scrollMarginTop: "80px" }}
      >
        <h2 className="ts-title">Creator+</h2>

        {error ? (
          <p className="ts-error">Gagal memuat data talent: {error}</p>
        ) : (
          <div className="ts-grid">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : talents.map((t, i) => (
                  <TalentCard key={t.id} talent={t} index={i} />
                ))}
          </div>
        )}
      </section>
    </>
  );
}
